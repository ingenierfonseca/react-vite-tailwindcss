import { X } from "lucide-react";

interface InvoicePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  textBtnConfirm: string,
  clickBtnConfirm: () => void;
}

export default function InvoicePrintModal({ title, textBtnConfirm, isOpen, onClose, clickBtnConfirm }: InvoicePrintModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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

        <FacturaCarta />

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

const FacturaCarta = () => {
  return (
    <div className="w-[210mm] min-h-[297mm] p-[20mm] bg-white text-slate-800 shadow-lg mx-auto font-sans">
      {/* Encabezado con Branding */}
      <div className="flex justify-between items-start border-b-2 border-blue-600 pb-8">
        <div>
          <div className="text-3xl font-bold text-blue-600 uppercase tracking-tighter">TuEmpresa S.A.</div>
          <p className="text-sm text-slate-500">Soluciones Médicas y Tecnológicas</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-light text-slate-400 uppercase">Factura</h2>
          <p className="font-semibold text-lg">#FAC-2026-001</p>
          <p className="text-sm">Fecha: 22 de Abril, 2026</p>
        </div>
      </div>

      {/* Información de Contacto (2 Columnas) */}
      <div className="grid grid-cols-2 gap-12 my-10">
        <div>
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">De:</h3>
          <p className="font-bold">Clinical Suite Nova</p>
          <p className="text-sm text-slate-600">Av. Principal Edificio 4, Suite 101</p>
          <p className="text-sm text-slate-600">contacto@clinicalsuite.com</p>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Para:</h3>
          <p className="font-bold">Nombre del Cliente / Paciente</p>
          <p className="text-sm text-slate-600">ID: 000-000000-0000X</p>
          <p className="text-sm text-slate-600">Dirección del Cliente, Ciudad</p>
        </div>
      </div>

      {/* Tabla de Productos */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-widest">
            <th className="py-3 px-4 border-b">Descripción</th>
            <th className="py-3 px-4 border-b text-center">Cant.</th>
            <th className="py-3 px-4 border-b text-right">Precio</th>
            <th className="py-3 px-4 border-b text-right">Total</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          <tr className="border-b border-slate-100">
            <td className="py-4 px-4 font-medium text-slate-700">Tratamiento de Odontología General</td>
            <td className="py-4 px-4 text-center text-slate-500">1</td>
            <td className="py-4 px-4 text-right text-slate-500">$120.00</td>
            <td className="py-4 px-4 text-right font-semibold">$120.00</td>
          </tr>
          {/* Más filas aquí... */}
        </tbody>
      </table>

      {/* Resumen de Totales */}
      <div className="flex justify-end mt-10">
        <div className="w-1/3">
          <div className="flex justify-between py-2 text-sm text-slate-600">
            <span>Subtotal</span>
            <span>$120.00</span>
          </div>
          <div className="flex justify-between py-2 text-sm text-slate-600 border-b border-slate-100">
            <span>Impuestos (15%)</span>
            <span>$18.00</span>
          </div>
          <div className="flex justify-between py-3 text-lg font-bold text-blue-600">
            <span>Total</span>
            <span>$138.00</span>
          </div>
        </div>
      </div>

      {/* Notas y Pie */}
      <div className="mt-20 pt-10 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed text-center">
        <p>Esta factura es un documento oficial. Favor realizar el pago antes de 15 días.</p>
        <p>Transferencias a Cuenta No. 123-456-789 - Banco Nacional.</p>
      </div>
    </div>
  );
};