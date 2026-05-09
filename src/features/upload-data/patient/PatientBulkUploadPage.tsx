import PageComponent from "../../../components/commons/PageComponent";
import StepComponent from "../components/StepComponent";
import { ArrowRight, Check, Download, File, Grid, Info } from "lucide-react";
import type { Header } from "../../../models/header.type";
import { useImportPatientHook } from "./useImportPatient.hook";
import { ASSETS_URLS } from "../../../config/constants";
import ErrorCard from "../components/ErrorCard";
import { getStatusBadge } from "../components/StatusBadge";
import PaginatedFoot from "../../../components/pagination-data/PaginatedFoot";
import SelectFile from "../components/SelectFile";

const headers: Header[] = [
  {
    header: 'Nombre',
    className: 'flex-1'
  },
  {
    header: 'Apellido',
    className: 'flex-1'
  },
  {
    header: 'Edad',
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
    handleChangePage,
    handleFileUpload,
    validateData,
    importData
  } = useImportPatientHook()

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
          
          <SelectFile onFileSelect={handleFileUpload} />
          
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
                <div className="flex-1 font-semibold">{patient.Nombre}</div>
                <div className="flex-1">{patient.Apellido}</div>
                <div className="flex-1">{patient.Edad}</div>
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
          {errorResume.ok > 0 && <button className="flex gap-2 ml-auto bg-primary rounded-lg text-white p-2.5"
            onClick={importData}>
            Finalizar Importación
            <ArrowRight />
          </button>}

          {errorResume.ok === 0 && <div>
            <p className="text-red-500 font-semibold">No hay datos validos para procesar</p>
          </div>}
        </div>
      </div>}
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