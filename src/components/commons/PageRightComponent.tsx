import PageRightHeader from "./PageRightHeader"

interface PageRightComponentProps {
    title: string,
    onClose: () => void
    children: React.ReactNode
}

export default function PageRightComponent({ title, onClose, children }: PageRightComponentProps) {
    return (
        <div className="w-full/2 h-screen pt-5 pb-18 px-6 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <PageRightHeader
                title={title}
                onClose={onClose} />
            {children}
        </div>
    )
}