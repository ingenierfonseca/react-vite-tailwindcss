interface ShimmerBlockProps {
    className?: string
}
// Un sub-componente reutilizable para el efecto shimmer más robusto
const ShimmerBlock = ({ className }: ShimmerBlockProps) => {
  return (
    <div 
      className={`
        relative 
        overflow-hidden 
        /* Color gris de fondo base */
        bg-slate-200 
        
        /* Configuración del destello usando ::after */
        after:absolute 
        after:inset-0 
        after:-translate-x-full 
        after:animate-shimmer 
        
        /* El degradado del destello (puedes ajustar via-white/80 para más brillo) */
        after:bg-linear-to-r 
        after:from-transparent 
        after:via-white/70 
        after:to-transparent
        
        ${className}
      `}
    />
  );
};

// Componente principal para replicar la imagen original
export const SkeletonLoader = () => {
  return (
    // bg-white y p-6 para que resalte el gris de los bloques
    <div className="p-6 bg-white space-y-6 rounded-lg shadow-sm">
      
      {/* Línea divisoria superior */}
      <div className="border-t border-slate-200 pt-6"></div>

      {/* Bloque superior ancho */}
      <ShimmerBlock className="w-full h-16 rounded-xl" />

      {/* Grid del medio */}
      <div className="grid grid-cols-2 gap-4">
        <ShimmerBlock className="h-24 rounded-xl" />
        <ShimmerBlock className="h-24 rounded-xl" />
      </div>

      {/* Líneas inferiores */}
      <ShimmerBlock className="w-2/5 h-6 rounded-full" />
      <ShimmerBlock className="w-2/5 h-6 rounded-full" />
    </div>
  );
};