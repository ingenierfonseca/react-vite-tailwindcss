import { useRef, useState, type ChangeEvent } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ClinicalFile } from "@/models/clinicalFile.type"
import { ClinicalFileService } from "@/services/clinical-file/clinicalFile.service"
import { toast } from "react-toastify"
import { Camera, X, Loader2, ImageIcon, ChevronLeft } from "lucide-react"
import { ASSETS_URLS } from "@/config/constants"

const IMAGE_TYPE_OPTIONS = [
    { value: 1, label: "Antes del tratamiento" },
    { value: 2, label: "Foto de evolución" },
    { value: 3, label: "Radiografía" },
] as const

interface TreatmentEvolutionCardProps {
    images: ClinicalFile[]
    customerId?: number
    sessionId?: number
    onImageUploaded?: () => void
}

export default function TreatmentEvolutionCard({ images, customerId, sessionId, onImageUploaded }: TreatmentEvolutionCardProps) {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [description, setDescription] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [selectedTypeId, setSelectedTypeId] = useState(2)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const openDrawer = () => {
        setDrawerOpen(true)
        document.body.style.overflow = "hidden"
    }

    const closeDrawer = () => {
        setDrawerOpen(false)
        setSelectedFile(null)
        setPreviewUrl(null)
        setDescription("")
        setSelectedTypeId(2)
        document.body.style.overflow = ""
    }

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Solo se permiten archivos de imagen")
            return
        }
        setSelectedFile(file)
        setPreviewUrl(URL.createObjectURL(file))
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFileSelect(file)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) handleFileSelect(file)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => setIsDragging(false)

    const handleUpload = async () => {
        if (!selectedFile || !customerId || !sessionId) {
            toast.error("Faltan datos para la carga")
            return
        }

        console.log("loadding true")
        setIsUploading(true)
        try {
            const item: Partial<ClinicalFile> = {
                clinicalSessionId: sessionId,
                customerId,
                typeId: selectedTypeId,
                description: description || new Date().toLocaleDateString("es-ES", {
                    year: "numeric", month: "long", day: "numeric"
                }),
            }
            console.log("item", item)
            await ClinicalFileService.uploadFile(item as ClinicalFile, selectedFile)
            toast.success("Foto subida correctamente")
            closeDrawer()
            onImageUploaded?.()
        } catch (err: unknown) {
            console.log("Error", err)
            const axiosError = err as { response?: { data?: { message?: string } } }
            const msg = axiosError?.response?.data?.message ?? "Error al subir la imagen"
            toast.error(msg)
        } finally {
            setIsUploading(false)
        }
    }

    const empty = images.length === 0

    return (
        <>
            <Card className="flex-[2_1_900px] min-w-0">
                <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-medium dark:text-slate-200">Evolución del tratamiento</h2>
                            {!empty && (
                                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                                    {images.length} foto{images.length !== 1 ? "s" : ""}
                                </span>
                            )}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={openDrawer}
                            className="gap-1.5 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:border-teal-300 dark:hover:border-teal-700 transition-all"
                        >
                            <Camera className="size-3.5" />
                            Subir foto
                        </Button>
                    </div>

                    {empty ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-400 dark:text-slate-600">
                            <ImageIcon className="size-10 opacity-40" />
                            <p className="text-sm">Aún no hay fotos de evolución</p>
                            <p className="text-xs">Presiona "Subir foto" para agregar la primera</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {images.map((image) => (
                                <div key={image.id} className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                    <img
                                        src={`${ASSETS_URLS.clinicalImages.replace("id", image.customerId.toString())}${image.url}`}
                                        alt="evolucion"
                                        className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/50 to-transparent p-2 pt-6">
                                        <p className="text-[11px] text-white/90 font-medium leading-tight">
                                            {image.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-50 transition-all duration-300 ${
                    drawerOpen ? "bg-black/50 backdrop-blur-sm opacity-100" : "bg-transparent pointer-events-none opacity-0"
                }`}
                onClick={closeDrawer}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 transform transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    drawerOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Drawer header */}
                    <div className="flex items-center gap-2 px-5 h-14 border-b border-slate-100 dark:border-slate-800 shrink-0">
                        <button
                            onClick={closeDrawer}
                            className="flex items-center justify-center size-8 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        >
                            <ChevronLeft className="size-4" />
                        </button>
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            Subir foto de evolución
                        </h3>
                    </div>

                    {/* Drawer body */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-5">
                        {/* Drop zone / preview */}
                        {!previewUrl ? (
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative flex flex-col items-center justify-center h-56 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                                    isDragging
                                        ? "border-teal-400 bg-teal-50 dark:bg-teal-950/30"
                                        : "border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:border-teal-300 dark:hover:border-teal-700 hover:bg-teal-50/50 dark:hover:bg-teal-950/20"
                                }`}
                            >
                                <Camera className={`size-10 mb-3 transition-colors ${
                                    isDragging ? "text-teal-500" : "text-slate-300 dark:text-slate-600"
                                }`} />
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    {isDragging ? "Suelta la imagen aquí" : "Seleccionar imagen"}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                    Arrastra o haz clic para buscar
                                </p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleInputChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                    <img
                                        src={previewUrl}
                                        alt="preview"
                                        className="w-full h-64 object-contain bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] bg-size-[16px_16px]"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedFile(null)
                                        setPreviewUrl(null)
                                    }}
                                    className="absolute -top-2 -right-2 flex items-center justify-center size-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 shadow-sm transition-all"
                                >
                                    <X className="size-3.5" />
                                </button>
                                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 truncate px-1">
                                    {selectedFile?.name}
                                </p>
                            </div>
                        )}

                        {/* Image type selector */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Tipo de imagen
                            </label>
                            <select
                                value={selectedTypeId}
                                onChange={(e) => setSelectedTypeId(Number(e.target.value))}
                                disabled={isUploading}
                                className="w-full h-9 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-teal-400 dark:focus:border-teal-600 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 transition-all appearance-none cursor-pointer disabled:opacity-50"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: "right 10px center",
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "20px",
                                }}
                            >
                                {IMAGE_TYPE_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Descripción <span className="text-slate-400 dark:text-slate-600">(opcional)</span>
                            </label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ej: Mes 3 — post-operatorio"
                                className="w-full h-9 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-teal-400 dark:focus:border-teal-600 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 transition-all"
                                disabled={isUploading}
                            />
                        </div>
                    </div>

                    {/* Drawer footer */}
                    <div className="flex items-center gap-3 px-5 h-16 border-t border-slate-100 dark:border-slate-800 shrink-0">
                        <Button
                            variant="outline"
                            onClick={closeDrawer}
                            disabled={isUploading}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!selectedFile || isUploading}
                            className="flex-1 bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white shadow-sm"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Subiendo...
                                </>
                            ) : (
                                <>
                                    <Camera className="size-4" />
                                    Subir foto
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
