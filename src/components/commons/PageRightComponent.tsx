interface PageRightComponentProps {
    title: string,
    onClick: () => void
    children: React.ReactNode
}

export default function PageRightComponent({ title, onClick, children }: PageRightComponentProps) {
    return (
        <div className="w-full/2 h-screen py-5 px-4 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex">
                <p className="text-2xl font-semibold text-black dark:text-white">{title}</p>
                <button 
                    onClick={onClick}
                    className="text-slate-500 hover:text-red-500 text-2xl ml-auto"
                    >
                    &times;
                </button>
            </div>
            {children}
        </div>
    )
}