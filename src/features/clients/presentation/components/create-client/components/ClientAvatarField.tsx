import type { Client } from "@/features/clients/domain/client";
import type { ClientLabels } from "@/features/clients/presentation/types";
import { useRef } from "react";

interface Props {
    imageSrc?: string;
    client: Client;
    labels: ClientLabels;
    onImageChange: (file: File | null) => void;
}

export const ClientAvatarField = ({
    imageSrc,
    client,
    labels,
    onImageChange
}: Props) => {

    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-1 flex-col items-center min-w-50">

            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full cursor-pointer"
            >
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={`${client.firstName} ${client.lastName}`}
                        className="h-60 w-full rounded-lg object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center bg-slate-50 border-2 border-dashed border-secondary/60 p-5 py-22">
                        <div className="h-10 w-10 bg-primary"
                            style={{
                            maskImage: "url('/src/assets/icons/upload.png')",
                            maskRepeat: "no-repeat",
                            maskPosition: "center",
                            maskSize: "contain",
                            WebkitMaskImage: "url('/src/assets/icons/upload.png')",
                            WebkitMaskRepeat: "no-repeat",
                            WebkitMaskPosition: "center",
                            WebkitMaskSize: "contain",
                        }} />
                        <span className="text-sm font-semibold text-black dark:text-white">{labels.drop_your_image_here}</span>
                        <span className="text-xs">{labels.image_information}</span>
                    </div>
                )}
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => onImageChange(event.target.files?.[0] ?? null)}
            />

        </div>
    );
};
