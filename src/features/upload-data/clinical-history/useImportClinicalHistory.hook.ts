import { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import { ClinicalSessionService } from "../../../services/clinical-session/clinicalSession.service";
import { CustomerService } from "../../../services/customer/customer.service";
import type { ClinicalHistoryExcelRow } from "../../../models/clinicalHistoryExcelRow.type";
import type { ClinicalSessionImportDto } from "@/services/clinical-session/clinicalSession.type";
import type { ResponseImportResult } from "@/services/customer/customer.type";

interface ErrorResume {
    ok: number
    error: number
    duplicated: number
}

const isValidDate = (dateStr: string): boolean => {
    if (!dateStr || dateStr.trim().length === 0) return false;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        const parts = dateStr.split(/[/\-]/);
        if (parts.length !== 3) return false;
        const parsed = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        return !isNaN(parsed.getTime());
    }
    return true;
};

export const useImportClinicalHistoryHook = (customerId: number) => {
    const [stepActive, setStepActive] = useState(1);
    const [fileName, setFileName] = useState("");
    const [previewData, setPreviewData] = useState<ClinicalHistoryExcelRow[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importResult, setImportResult] = useState<ResponseImportResult | null>(null);
    const [customerName, setCustomerName] = useState("");
    const [errorResume, setErrorResume] = useState<ErrorResume>({
        ok: 0,
        error: 0,
        duplicated: 0
    });
    const [currentItems, setCurrentItems] = useState<ClinicalHistoryExcelRow[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 15;

    useEffect(() => {
        if (customerId) {
            CustomerService.find(customerId).then((customer) => {
                if (customer) {
                    setCustomerName(`${customer.firstName} ${customer.lastName}`);
                }
            }).catch(() => {});
        }
    }, [customerId]);

    const handleFileUpload = (file: File) => {
        if (!file) return;

        setFileName(file.name);
        setIsProcessing(true);
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                const result = e.target?.result;
                if (!(result instanceof ArrayBuffer)) {
                    throw new Error("El archivo no se pudo leer correctamente");
                }

                const data = new Uint8Array(result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                const jsonData = XLSX.utils.sheet_to_json<ClinicalHistoryExcelRow>(worksheet, {
                    defval: "",
                });

                const indexOfLastItem = currentPage * itemsPerPage;
                const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                const currentItems = jsonData.slice(indexOfFirstItem, indexOfLastItem);
                const totalPages = Math.ceil(jsonData.length / itemsPerPage);
                setCurrentItems(currentItems);
                setTotalPages(totalPages);
                setPreviewData(jsonData);
                setStepActive(2);
            } catch (error) {
                console.error("Error al procesar Excel:", error);
            } finally {
                setIsProcessing(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const validateData = () => {
        const newErrorResume: ErrorResume = {
            ok: 0,
            error: 0,
            duplicated: 0
        };

        const llavesDuplicadas = previewData
            .map(p => `${p.Fecha?.trim()}|${p.MotivoConsulta?.trim()}`.toLowerCase())
            .filter((llave, index, array) =>
                llave !== "|" && array.indexOf(llave) !== index
            );

        setIsProcessing(true);
        const updatedData = previewData.map((row) => {
            const newRow = { ...row, Error: '' };
            let hasError = false;
            let isDuplicated = false;

            if (!newRow.Fecha || newRow.Fecha.trim().length < 2) {
                newRow.Error = 'Fecha es obligatoria';
                hasError = true;
            } else if (!isValidDate(newRow.Fecha)) {
                newRow.Error = 'Formato de fecha inválido';
                hasError = true;
            }

            if (!newRow.MotivoConsulta || newRow.MotivoConsulta.trim().length < 3) {
                newRow.Error += (newRow.Error ? ' | ' : '') + 'Motivo de consulta es obligatorio (min. 3 caracteres)';
                hasError = true;
            }

            const llave = `${newRow.Fecha?.trim()}|${newRow.MotivoConsulta?.trim()}`.toLowerCase();
            if (llavesDuplicadas.includes(llave))
                isDuplicated = true;

            newRow.Estado = 'valido';
            if (isDuplicated) {
                newErrorResume.duplicated++;
                newRow.Estado = 'duplicado';
            } else if (hasError) {
                newErrorResume.error++;
                newRow.Estado = 'invalido';
            } else {
                newErrorResume.ok++;
            }

            return newRow;
        });

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = updatedData.slice(indexOfFirstItem, indexOfLastItem);
        setCurrentItems(currentItems);
        setPreviewData(updatedData);
        setErrorResume(newErrorResume);
        setIsProcessing(false);
        setStepActive(3);
    };

    const handleChangePage = (page: number) => {
        setCurrentPage(page);
        const indexOfLastItem = page * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = previewData.slice(indexOfFirstItem, indexOfLastItem);
        setCurrentItems(currentItems);
    };

    const importData = async () => {
        setIsImporting(true);
        try {
            const payload = mapExcelToDto(previewData);
            const result = await ClinicalSessionService.bulkImport(customerId, payload);
            setImportResult(result);
            if (result.errorCount === 0)
                resetData();
        } catch (err: any) {
            setImportResult({
                totalRows: previewData.length,
                successCount: 0,
                errorCount: 0,
                errors: [{ rowNumber: 0, errorMessage: err.response?.data?.message || "Error al conectar con el servidor" }],
                processingTimeSeconds: 0
            });
        } finally {
            setIsImporting(false);
        }
    };

    const mapExcelToDto = (excelRows: ClinicalHistoryExcelRow[]): ClinicalSessionImportDto[] => {
        return excelRows
            .filter(row => !row.Error && row.Estado === 'valido')
            .map(row => ({
                date: row.Fecha,
                reasonForVisit: row.MotivoConsulta,
                clinicalNotes: row.NotasClinicas || '',
                doctorName: row.Doctor || '',
                specialtyName: row.Especialidad || '',
                consultationTypeName: row.TipoConsulta || '',
            }));
    };

    const clearImportResult = () => {
        setImportResult(null);
    };

    const resetData = () => {
        setCurrentItems([]);
        setPreviewData([]);
        setErrorResume({ ok: 0, error: 0, duplicated: 0 });
        setImportResult(null);
        setIsProcessing(false);
        setStepActive(1);
    };

    return {
        stepActive,
        fileName,
        isProcessing,
        isImporting,
        importResult,
        previewData,
        errorResume,
        currentItems,
        currentPage,
        totalPages,
        customerName,
        handleChangePage,
        handleFileUpload,
        validateData,
        importData,
        resetData,
        clearImportResult,
    };
};
