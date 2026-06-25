import { AlertDialog } from "radix-ui";

interface ConfirmAlertProps {
	trigger: React.ReactNode;
	title: string;
	description: string;
	textConfirmButton?: string;
	onConfirm: () => void;
}

export const ConfirmDialog = ({ 
    trigger, 
    title, 
    description, 
    textConfirmButton, 
    onConfirm 
}: ConfirmAlertProps) => (
    <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
            {trigger}
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
            {/* El Overlay ahora actúa como un contenedor Flex para centrar el contenido perfectamente */}
            <AlertDialog.Overlay className="fixed inset-0 z-100 bg-black/50 grid place-items-center p-4 data-[state=open]:animate-overlayShow">
                
                <AlertDialog.Content 
                    className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-100 p-6 shadow-xl focus:outline-none dark:bg-slate-900 data-[state=open]:animate-contentShow"
                >
                    <AlertDialog.Title className="m-0 text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {title}
                    </AlertDialog.Title>
                    
                    <AlertDialog.Description className="mb-6 mt-3 text-sm leading-normal text-slate-600 dark:text-slate-400">
                        {description}
                    </AlertDialog.Description>
                    
                    <div className="flex justify-end gap-3">
                        <AlertDialog.Cancel asChild>
                            <button className="inline-flex h-10 items-center justify-center px-4 text-sm font-medium text-slate-700 focus:outline-none dark:text-slate-300 cursor-pointer select-none">
                                Cancelar
                            </button>
                        </AlertDialog.Cancel>
                        
                        <AlertDialog.Action asChild>
                            <button 
                                className="inline-flex h-10 items-center justify-center rounded-md bg-red-400/30 px-4 text-sm font-medium text-red-700 shadow-sm transition-colors hover:bg-red-400/40 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 cursor-pointer select-none" 
                                onClick={onConfirm}
                            >
                                {textConfirmButton || "Sí, confirmar"}
                            </button>
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>

            </AlertDialog.Overlay>
        </AlertDialog.Portal>
    </AlertDialog.Root>
);

export default ConfirmDialog;