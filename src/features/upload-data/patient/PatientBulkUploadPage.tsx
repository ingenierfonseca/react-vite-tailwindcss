import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PageComponent from "../../../components/commons/PageComponent";
import StepComponent from "../components/StepComponent";
import { ArrowRight, Check, Clock, Download, File, Grid, Info, Loader2, XCircle } from "lucide-react";
import type { Header } from "../../../models/header.type";
import { useImportPatientHook } from "./useImportPatient.hook";
import { ASSETS_URLS } from "../../../config/constants";
import ErrorCard from "../components/ErrorCard";
import { getStatusBadge } from "../components/StatusBadge";
import PaginatedFoot from "../../../components/pagination-data/PaginatedFoot";
import SelectFile from "../components/SelectFile";

const headers: Header[] = [
  {
    header: 'Identificación',
    className: 'flex-1'
  },
  {
    header: 'Nombre',
    className: 'flex-1'
  },
  {
    header: 'Apellido',
    className: 'flex-1'
  },
  {
    header: 'Telefono',
    className: 'flex-1'
  },
  {
    header: 'Email',
    className: 'flex-1'
  },
  {
    header: 'Estado',
    className: 'flex-1'
  },
  {
    header: 'Error',
    className: 'flex-1'
  }
]
export default function PatientBulkUploadPage() {
  const {
    stepActive,
    fileName,
    previewData,
    errorResume,
    currentItems,
    currentPage,
    totalPages,
    isImporting,
    importResult,
    handleChangePage,
    handleFileUpload,
    validateData,
    importData,
    resetData,
    clearImportResult
  } = useImportPatientHook()

  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (importResult) setShowSummary(true);
  }, [importResult]);

  useEffect(() => {
    if (isImporting) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isImporting]);

  const handleCloseSummary = () => {
    setShowSummary(false);
    clearImportResult();
  };

  return (
    <PageComponent
      title="Importar Pacientes"
      description="Carga multiples pacientes usando un archivo Excel o CSV"
      textButton="Guia de Importacion"
      onclick={() => {
        alert("Nuevo")
      }}
      secondaryButton={<SecondaryButton className={""} />}>
      <div className="flex mt-5 px-6 py-3 border border-slate-300 dark:border-slate-700 dark:bg-slate-800/50">
        <StepComponent stepActive={stepActive} stepNumber={1} title="Subir archivo" subTitle="Selecciona tu archivo" />
        <StepComponent stepActive={stepActive} stepNumber={2} title="Vista previa" subTitle="Revisa los datos" />
        <StepComponent stepActive={stepActive} stepNumber={3} title="Configurar e Importar" subTitle="Define opciones e importa" />
      </div>

      <div className="mt-4 flex flex-col md:flex-row gap-3">
        <div className="w-full md:max-w-100 shrink-0 p-6 border border-slate-300 h-fit dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-black dark:text-slate-200 font-bold">1. Subir archivo</p>
          <p className="text-xs dark:text-slate-400">Selecciona o arrastra el archivo con los datos de los pacientes</p>
          
          <SelectFile onFileSelect={handleFileUpload} onReset={resetData} />
          
          <div className="flex gap-3 p-2 mt-3 rounded-lg dark:bg-slate-900">
            <div className="flex-1">
              <div className="flex gap-1 items-center dark:text-slate-400">
                <File size={20} /><span className="text-[12px]">Tamaño máximo</span>
              </div>
              <p className="ml-6 text-xs dark:text-slate-400">2 MB</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 dark:text-slate-400">
                <Grid size={20} /><span className="text-[13px]">Formato</span>
              </div>
              <p className="text-[12px] dark:text-slate-400">Excel(.xlsx) o CSV</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 dark:text-slate-400">
                <Info size={20} /><span className="text-[13px]">Codificación</span>
              </div>
              <p className="text-[12px] dark:text-slate-400">UTF-8 recomendado</p>
            </div>
          </div>

          <SecondaryButton className="mt-3 justify-center" />
        </div>

        {stepActive > 1 && <div className="flex-2 flex flex-col gap-3">
          <div className="p-3 border border-slate-300 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex">
              <div>
                <p className="text-black dark:text-slate-200 font-bold">2. Vista del archivo</p>
                <p className="text-xs dark:text-slate-400">Revisar los datos antes de importar</p>
              </div>
              {fileName.length !== 0 && <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-green-400 font-bold dark:font-normal">{fileName}</span>
                <div className="h-fit rounded-full p-0.5 bg-green-400"><Check size={20} /></div>
              </div>}
            </div>

            <div className="flex mt-3 px-2 py-1.5 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700">
              {headers.map((item) => (
                <div key={item.header} className={`${item.className} text-sm text-black font-semibold dark:text-slate-300`}>{item.header}</div>
              ))}
            </div>
            {currentItems.map((patient, index) => (
              <div key={index} className="flex px-2 py-1.5 dark:bg-slate-900 text-sm text-black dark:text-slate-200 border border-slate-100 dark:border-slate-700">
                <div className="flex-1">{patient.DNI}</div>
                <div className="flex-1 font-semibold">{patient.Nombre}</div>
                <div className="flex-1">{patient.Apellido}</div>
                <div className="flex-1">{patient.Telefono}</div>
                <div className="flex-1">{patient.Email}</div>
                <div className="flex-1">{patient.Estado !== undefined ? getStatusBadge(patient.Estado as "valido" | "invalido" | "duplicado") : <div></div>}</div>
                <div className="flex-1 truncate min-w-0">{patient.Error ?? '---'}</div>
              </div>
            ))}
            <PaginatedFoot
              sizeData={previewData.length} 
              totalPages={totalPages} 
              currentPage={currentPage}
              onPageChange={(page) => handleChangePage(page)} />

            {stepActive === 2 && <button onClick={validateData}
              className="ml-auto mt-3 bg-primary text-white rounded-lg p-2.5 cursor-pointer">Validar datos
            </button>}
          </div>
        </div>}
      </div>

      {stepActive > 2 && <div className="mt-3 p-3 border border-slate-300 dark:border-slate-700 dark:bg-slate-800/50">
        <p className="text-black dark:text-slate-200 font-bold">3. Importacion</p>
        <p className="text-black dark:text-slate-200 font-bold">Resumen de validacion</p>
        <p className="text-xs dark:text-slate-400">Total de registros en el archivo: {previewData.length} </p>

        <div className="flex gap-3 mt-3">
          <ErrorCard value={errorResume!.ok}
            status="valido"
            title="Validos"
            description="Listos para importar"
          />

          <ErrorCard value={errorResume!.error}
            status="invalido"
            title="Con errores"
            description="Requieren correccion"
          />

          <ErrorCard value={errorResume!.duplicated}
            status="duplicado"
            title="Duplicados"
            description="Existen varios"
          />
        </div>
        <div className="flex mt-3">
          {errorResume.ok > 0 && <button className="flex gap-2 ml-auto bg-primary rounded-lg text-white p-2.5 cursor-pointer"
            onClick={importData}>
            Finalizar Importación
            <ArrowRight />
          </button>}

          {errorResume.ok === 0 && <div>
            <p className="text-red-500 font-semibold">No hay datos validos para procesar</p>
          </div>}
        </div>
      </div>}

      {isImporting && createPortal(
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex flex-col items-center gap-3 p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Importando pacientes...</p>
          </div>
        </div>,
        document.body
      )}

      {showSummary && importResult && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={handleCloseSummary} />
          <div className="relative w-xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl dark:border dark:border-slate-700/50 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 bg-primary dark:bg-slate-900 dark:border-b dark:border-slate-800">
              <h3 className="text-xl font-bold text-white">Importación Completada</h3>
              <button onClick={handleCloseSummary} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-1 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">{importResult.totalRows}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Total registros</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{importResult.successCount}</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">Importados</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                  <span className="text-2xl font-bold text-red-600 dark:text-red-400">{importResult.errorCount}</span>
                  <span className="text-xs text-red-600 dark:text-red-400">Con errores</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Clock size={16} />
                <span>Tiempo de procesamiento: {importResult.processingTimeSeconds.toFixed(2)}s</span>
              </div>
              {importResult.errors.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Detalle de errores:</p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {importResult.errors.map((err, i) => (
                      <div key={i} className="flex gap-2 p-2 text-xs rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 text-red-700 dark:text-red-400">
                        <XCircle size={14} className="shrink-0 mt-0.5" />
                        <span>{err.errorMessage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end p-6 bg-slate-50 dark:bg-slate-800/50">
              <button onClick={handleCloseSummary}
                className="px-6 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/70 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
                Aceptar
              </button>
            </div>
          </div>
        </div>, document.body
      )}
    </PageComponent>
  );
}

interface SecondaryButton {
  className: string
}
function SecondaryButton({className}: SecondaryButton) {
  return (
    <a className={`${className} hidden md:flex gap-2 min-w-0 py-2.5 items-center rounded-lg border px-3 dark:border-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-800`}
      href={ASSETS_URLS.fileImportPatient}
      download="planpacientes_importaciontilla.xlsx">
      <Download /><p className="truncate">Descargar plantilla</p>
    </a>
  )
}
//<a href="/plantillas/mi-plantilla.xlsx" download="plantilla.xlsx">