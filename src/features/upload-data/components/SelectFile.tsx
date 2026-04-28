import { useState, useRef } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface SelectFileProps {
    onFileSelect: (file: File) => void
}

export default function SelectFile({onFileSelect}: SelectFileProps) {
    const [fileName, setFileName] = useState<string>("");
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            onFileSelect(file); 
        }
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.csv'))) {
            setFileName(file.name);
            onFileSelect(file)
        }
    };

    const resetFile = (e: React.MouseEvent) => {
        e.stopPropagation(); // Evita que se abra el selector al borrar
        setFileName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
                relative flex flex-col items-center mt-2 p-8 rounded-xl border-2 border-dashed transition-all duration-200
                ${isDragging
                    ? "border-blue-500 bg-blue-50 dark:bg-slate-800 scale-[1.02]"
                    : "border-slate-300 dark:border-slate-700 dark:bg-slate-900 hover:border-slate-400"}
                ${fileName ? "border-green-500/50 bg-green-50/10" : ""}
                cursor-pointer
            `}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".xlsx, .csv"
            />

            {!fileName ? (
                <>
                    <Upload className={`${isDragging ? "text-blue-500" : "text-slate-400"} transition-colors`} size={48} />
                    <p className="mt-4 font-bold text-slate-700 dark:text-slate-200 text-center">
                        Arrastra tu archivo aquí
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        o haz click para seleccionar
                    </p>
                </>
            ) : (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <div className="bg-green-500/20 p-3 rounded-full mb-2">
                        <FileText className="text-green-500" size={32} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-green-600 dark:text-green-400 text-md font-bold dark:font-normal">
                            {fileName}
                        </span>
                        <button
                            onClick={resetFile}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full text-red-500 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Archivo listo para procesar</p>
                </div>
            )}

            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Formatos: .xlsx, .csv
            </p>
        </div>
    );
}