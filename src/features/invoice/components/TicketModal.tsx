import { X } from "lucide-react";

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  textBtnConfirm: string,
  clickBtnConfirm: () => void;
}

export default function TickectModal({ title, textBtnConfirm, isOpen, onClose, clickBtnConfirm }: TicketModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* 1. Overlay (Fondo oscuro con desenfoque) */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose} 
      />

      {/* 2. Contenedor del Modal */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl dark:border dark:border-slate-700/50 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-6 bg-primary dark:bg-slate-900 dark:border-b dark:border-slate-800">
          <h3 className="text-xl font-bold text-white">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <TicketFactura />

        {/* Pie del Modal (Opcional) */}
        <div className="flex justify-end gap-3 p-6 bg-slate-50 dark:bg-slate-800/50">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={clickBtnConfirm}
            className="px-6 py-2 text-sm font-semibold text-white hover:text-white/70 bg-primary hover:bg-primary/70 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            {textBtnConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}

const TicketFactura = () => {
  return (
    <div className="w-[80mm] p-4 bg-white text-black font-mono text-[12px] leading-tight">
      {/* Encabezado */}
      <div className="text-center mb-4">
        <h1 className="text-[16px] font-bold uppercase">Nombre de la Empresa</h1>
        <p>NIT: 123456789-0</p>
        <p>Calle Falsa 123, Ciudad</p>
        <p>Tel: (123) 456-7890</p>
      </div>

      {/* Información de la Factura */}
      <div className="border-t border-dashed border-black pt-2 mb-2">
        <p>Factura: #000125</p>
        <p>Fecha: 22/04/2026 16:20</p>
        <p>Cajero: Administrador</p>
      </div>

      {/* Tabla de Productos */}
      <div className="border-t border-dashed border-black pt-2">
        <div className="flex justify-between font-bold border-b border-dashed border-black mb-1">
          <span className="w-1/2">Descripción</span>
          <span className="w-1/6 text-center">Cant</span>
          <span className="w-1/3 text-right">Total</span>
        </div>
        
        {/* Ítems de ejemplo */}
        <div className="flex justify-between my-1">
          <span className="w-1/2">Paracetamol 500mg</span>
          <span className="w-1/6 text-center">2</span>
          <span className="w-1/3 text-right">$10.00</span>
        </div>
        <div className="flex justify-between my-1">
          <span className="w-1/2">Alcohol Etílico 1L</span>
          <span className="w-1/6 text-center">1</span>
          <span className="w-1/3 text-right">$5.50</span>
        </div>
      </div>

      {/* Totales */}
      <div className="border-t border-dashed border-black mt-2 pt-2">
        <div className="flex justify-between font-bold text-[14px]">
          <span>TOTAL:</span>
          <span>$15.50</span>
        </div>
        <div className="flex justify-between text-[11px] mt-1">
          <span>Efectivo:</span>
          <span>$20.00</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span>Cambio:</span>
          <span>$4.50</span>
        </div>
      </div>

      {/* Pie de página (Legal) */}
      <div className="text-center mt-6">
        <p className="italic text-[10px]">¡Gracias por su compra!</p>
        <p className="text-[9px] mt-2">
          Resolución DIAN No. 123456 <br />
          Rango 0001 al 5000 - Vigencia 12 meses
        </p>
        <div className="mt-4 border-t border-dashed border-black pt-2">
          <p className="text-[10px]">Visítanos en: www.tuempresa.com</p>
        </div>
      </div>
    </div>
  );
};