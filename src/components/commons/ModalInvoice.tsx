import { X } from 'lucide-react';

interface ModalInvoiceProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function ModalInvoice({ title, isOpen, onClose, children }: ModalInvoiceProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* 1. Overlay (Fondo oscuro con desenfoque) */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* 2. Contenedor del Modal */}
            <div className="relative w-3xl bg-white dark:bg-slate-900 rounded shadow-2xl dark:border dark:border-slate-700/50 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Cabecera */}
                <div className="flex items-center justify-between pt-12 pb-1 px-6 bg-primary dark:bg-slate-900 dark:border-b dark:border-slate-800">
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
                {/* Cuerpo del Modal */}
                <div className="h-screen">

                    {children}
                </div>
            </div>
        </div>
    );
}