import ButtonSaveApp from "@/components/commons/ButtonSaveApp";
import type { ClientLabels } from "@/features/clients/presentation/types";
import { X } from "lucide-react";

interface Props {
    saving: boolean;
    canSave: boolean;
    labels: ClientLabels;
    onCancel: () => void;
    onSubmit: () => void;
}

export const ClientCreateActions = ({
    saving,
    canSave,
    labels,
    onCancel,
    onSubmit
}: Props) => {

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                type="button"
                disabled={saving}
                onClick={onCancel}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-primary font-medium p-2 cursor-pointer hover:bg-slate-100"
            >
                <X />
                {labels.cancel}
            </button>

            <ButtonSaveApp
                className="flex-1"
                label={labels.entity}
                onClick={onSubmit}
                loading={saving}
                disabled={!canSave || saving}
                saveText={labels.save_entity}
                loadingText={labels.saving_entity}
            />

        </div>
    );
};
