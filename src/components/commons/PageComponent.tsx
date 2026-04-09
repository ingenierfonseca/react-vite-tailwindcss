import { Bounce, ToastContainer } from "react-toastify"
import AddButtonApp, { FloatingAddButton } from "./AddButtonApp"

interface PageComponentProps {
    title: string,
    description: string,
    textButton: string,
    onclick: () => void,
    children: React.ReactNode
}
export default function PageComponent({ title, description, textButton, onclick, children }: PageComponentProps) {
    return (
        <div className="relative min-h-screen px-4 pt-4 pb-18 z-20 bg-white dark:bg-slate-900">
            <div className="flex">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
                </div>
                <div className="hidden md:block ml-auto">
                    <AddButtonApp onclick={onclick} label={textButton} />
                </div>
            </div>
            {children}
            <FloatingAddButton onclick={onclick} label={textButton} />
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </div>
    )
}