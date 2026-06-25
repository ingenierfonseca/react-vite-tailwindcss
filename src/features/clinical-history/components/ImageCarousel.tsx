import { useState, useEffect, useCallback, useRef } from "react"
import { X, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { ConfirmDialog } from "@/components/alert-modal/ConfirmDialog"
import type { ClinicalFile } from "@/models/clinicalFile.type"
import { ASSETS_URLS } from "@/config/constants"

interface ImageCarouselProps {
  images: ClinicalFile[]
  initialIndex: number
  onClose: () => void
  onDelete: (fileId: number) => void
}

function getImageUrl(image: ClinicalFile): string {
  return `${ASSETS_URLS.clinicalImages.replace("id", image.customerId.toString())}${image.url}`
}

export default function ImageCarousel({ images, initialIndex, onClose, onDelete }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const current = images[currentIndex]

  const resetZoom = useCallback(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index)
    resetZoom()
  }, [resetZoom])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          goTo(currentIndex > 0 ? currentIndex - 1 : images.length - 1)
          break
        case "ArrowRight":
          goTo(currentIndex < images.length - 1 ? currentIndex + 1 : 0)
          break
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, images.length, onClose, goTo])

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  useEffect(() => {
    resetZoom()
  }, [currentIndex, resetZoom])

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.25 : 0.25
    setScale(s => {
      const next = Math.max(1, Math.min(5, s + delta))
      return next
    })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }

  const handleMouseUp = () => setIsDragging(false)

  const handleDoubleClick = () => {
    if (scale > 1) {
      resetZoom()
    }
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-200 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 select-none"
      onWheel={handleWheel}
    >
      {/* Toolbar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-5 h-16 bg-linear-to-b from-black/40 to-transparent">
        <span className="text-sm text-white/50 font-mono tracking-widest">
          {String(currentIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>

        <div className="flex items-center gap-2">
          <ConfirmDialog
            trigger={
              <button className="size-9 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-red-400/25 hover:text-red-300 transition-all">
                <Trash2 className="size-4" />
              </button>
            }
            title="Eliminar imagen"
            description="¿Estás seguro de eliminar esta imagen? Esta acción no se puede deshacer."
            textConfirmButton="Sí, eliminar"
            onConfirm={() => onDelete(current.id)}
          />

          <button
            onClick={onClose}
            className="size-9 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* Navigation — left/right click zones */}
      <button
        onClick={() => goTo(currentIndex > 0 ? currentIndex - 1 : images.length - 1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 size-14 flex items-center justify-start pl-5 text-white/30 hover:text-white/70 transition-colors"
        aria-label="Anterior"
      >
        <ChevronLeft className="size-7" />
      </button>

      <button
        onClick={() => goTo(currentIndex < images.length - 1 ? currentIndex + 1 : 0)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 size-14 flex items-center justify-end pr-5 text-white/30 hover:text-white/70 transition-colors"
        aria-label="Siguiente"
      >
        <ChevronRight className="size-7" />
      </button>

      {/* Main image area */}
      <div
        className="absolute inset-0 flex items-center justify-center pt-16 pb-20"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        style={{ cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
      >
        <img
          src={getImageUrl(current)}
          alt={current.description || "Imagen de evolución"}
          className="max-w-[85%] max-h-[75vh] object-contain transition-transform duration-150 ease-out pointer-events-none"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          }}
          draggable={false}
        />
      </div>

      {/* Thumbnail filmstrip */}
      <div className="absolute bottom-0 inset-x-0 z-20 flex justify-center pb-4 pt-8 bg-linear-to-t from-black/50 to-transparent">
        <div className="flex gap-3 px-5 py-2 overflow-x-auto max-w-full scrollbar-thin">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goTo(index)}
              className={`shrink-0 size-12 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex
                  ? "border-white scale-110 shadow-[0_0_16px_rgba(255,255,255,0.35)]"
                  : "border-white/20 opacity-50 hover:opacity-90 hover:border-white/50"
              }`}
            >
              <img
                src={getImageUrl(image)}
                alt=""
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
