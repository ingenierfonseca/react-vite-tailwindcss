import { genderWord, type Gender } from "@/utils/grammar";
import { pluralize } from "@/utils/pluralize";
import React from "react";

interface EmptyDataProps {
    icon: React.ReactElement<{ className?: string }>,
    label: string,
    gender: Gender,
    canCreate: boolean,
    click: () => void;
}

export default function EmptyData({icon, label, gender, canCreate, click}: EmptyDataProps) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
          {React.cloneElement(icon, {
                className: "mx-auto mb-3 size-8 text-primary"
            })}
          <p className="font-semibold">No hay {pluralize(label)} {genderWord("registrad", gender)}</p>
          {canCreate && <button type="button" onClick={click} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Crear {label}</button>}
        </div>
    )
}