import { useState } from "react";
import * as XLSX from 'xlsx';
import { validatePhoneNumber } from "../../../utils/number.util";
import { validateEmail } from "../../../utils/email.util";
import { CustomerService } from "../../../services/customer/customer.service";
import type { CustomerExcelRow } from "../../../models/customerExcelRow.type";
import type { CustomerImportDto } from "@/services/customer/customer.type";

interface ErrorResume {
    ok: number
    error: number
    duplicated: number
}

export const useImportPatientHook = () => {
    const [stepActive, setStepActive] = useState(1)
    const [fileName, setFileName] = useState("")
    const [previewData, setPreviewData] = useState<CustomerExcelRow[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorResume, setErrorResume] = useState<ErrorResume>({
        ok: 0,
        error: 0,
        duplicated: 0
    })
    const [currentItems, setCurrentItems] = useState<CustomerExcelRow[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0)
    const itemsPerPage = 15;

    const handleFileUpload = (file: File) => {
        if (!file) return;

        setFileName(file.name)

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

                const jsonData = XLSX.utils.sheet_to_json<CustomerExcelRow>(worksheet, {
                    defval: "",
                });

                const indexOfLastItem = currentPage * itemsPerPage;
                const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                const currentItems = jsonData.slice(indexOfFirstItem, indexOfLastItem);
                const totalPages = Math.ceil(jsonData.length / itemsPerPage);
                setCurrentItems(currentItems)
                setTotalPages(totalPages)
                setPreviewData(jsonData);
                setStepActive(2)
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
        }

        const llavesDuplicadas = previewData
            .map(p => `${p.DNI?.trim()}`.toLowerCase())
            .filter((llave, index, array) =>
                llave !== "|" && array.indexOf(llave) !== index
            );

        setIsProcessing(true);
        const updatedData = previewData.map((row) => {
            const newRow = { ...row, Error: '' };
            let isDuplicated = false

            if (!newRow.DNI || newRow.DNI.trim().length < 2)
                newRow.Error = 'Nombre es obligatorio y muy corto'

            if (llavesDuplicadas.includes(newRow.DNI.toLowerCase()))
                isDuplicated = true

            if (!newRow.Nombre || newRow.Nombre.trim().length < 2)
                newRow.Error = 'Nombre es obligatorio y muy corto'

            if (!newRow.Apellido || newRow.Apellido.trim().length < 2)
                newRow.Error = 'Apellido es obligatorio y muy corto'

            if (newRow.Telefono && !validatePhoneNumber(newRow.Telefono))
                newRow.Error += ' | Telefono inválido'

            if (newRow.Email && !validateEmail(newRow.Email))
                newRow.Error += ' | Email inválido'

            newRow.Estado = 'valido'
            if (isDuplicated) {
                newErrorResume.duplicated++
                newRow.Estado = 'duplicado'
            } if (newRow.Error) {
                newErrorResume.error++
                newRow.Estado = 'invalido'
            } else newErrorResume.ok++

            return newRow;
        });

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = updatedData.slice(indexOfFirstItem, indexOfLastItem);
        setCurrentItems(currentItems)
        setPreviewData(updatedData)
        setErrorResume(newErrorResume)
        setIsProcessing(false);
        setStepActive(3)
    };

    const handleChangePage = (page: number) => {
        setCurrentPage(page)
        const indexOfLastItem = page * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = previewData.slice(indexOfFirstItem, indexOfLastItem);
        setCurrentItems(currentItems)
    }

    const importData = async (): Promise<boolean> => {
        let success = false
        try {
            await CustomerService.bulkImport(mapExcelToDto(previewData));
            success = true;
        } catch (err: any) {
            //const errorMessage = err.response?.data?.message || "Error al crear el paciente";
            //setError(errorMessage);
            throw err;
        } finally {
            //setLoading(false);
            return success;
        }
    }

const mapExcelToDto = (excelRows: CustomerExcelRow[]): CustomerImportDto[] => {
    return excelRows
        .filter(row => !row.Error && row.Estado !== 'Invalido') 
        .map(row => ({
            DNI: row.DNI,
            firstName: row.Nombre,
            lastName: row.Apellido,
            phone: row.Telefono?.trim() || undefined, 
            email: row.Email?.trim() || undefined,
        }));
};

    const resetData = () => {
        setCurrentItems([])
        setPreviewData([])
        setErrorResume({ok: 0, error: 0, duplicated: 0})
        setIsProcessing(false);
        setStepActive(1)
    }

    return {
        stepActive,
        fileName,
        isProcessing,
        previewData,
        errorResume,
        currentItems,
        currentPage,
        totalPages,
        handleChangePage,
        setStepActive,
        handleFileUpload,
        validateData,
        importData,
        resetData
    }
}