import { ArrowLeft } from "lucide-react";

interface PageRightHeaderProps {
    title: string;
    onClose: () => void;
}

export default function PageRightHeader({title, onClose}: PageRightHeaderProps) {
    return (
        <div className="flex mb-2">
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="cursor-pointer bg-slate-100 hover:bg-slate-200"
                >
                    <ArrowLeft className=" p-1 text-primary" size={30} />
                </button>
                    
                <div>
                    <p className="font-semibold text-xl text-black dark:text-white">
                        {title}
                    </p>
                </div>
            </div>
        </div>
    )
}