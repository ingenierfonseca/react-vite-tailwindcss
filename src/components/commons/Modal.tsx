import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  textBtnConfirm: string,
  clickBtnConfirm: () => void;
}

export default function Modal({ title, textBtnConfirm, isOpen, onClose, children, clickBtnConfirm }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* 1. Overlay (Fondo oscuro con desenfoque) */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose} 
      />

      {/* 2. Contenedor del Modal */}
      <div className="relative w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6">
          {children}
        </div>

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