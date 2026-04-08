import Modal from "../../../components/commons/Modal";
import TextFieldApp from "../../../components/commons/TextFieldApp";
import type { InvoiceItem } from "../../../services/invoice/invoice.types";


interface ThreatmentModalProps {
    invoiceItem: InvoiceItem,
    isModalOpen: boolean,
    setIsModalOpen: (value: boolean) => void,
    onClick: () => void,
    //onChangeItem: (index: number, field: keyof InvoiceItem, value: any) => void,
}

export default function ThreatmentModal({ invoiceItem, isModalOpen, setIsModalOpen, onClick }: ThreatmentModalProps) {
    return (
        <Modal isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Información del Tratamiento"
            textBtnConfirm="Guardar"
            clickBtnConfirm={onClick}>
            <div className="space-y-4">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Completa los datos del tratamiento
                </p>
                {invoiceItem && 
                <fieldset className="grid p-2 gap-2 border border-slate-200 dark:border-slate-700">
                    <TextFieldApp label="Tratamiento" value={invoiceItem.description} className="md:flex-2 px-2 text-sm" onChange={() =>{}} />
                </fieldset>
                }
            </div>
        </Modal>
    )
}

/*
<fieldset disabled={loading} key={item.id} className="grid p-2 gap-2 border border-slate-200 dark:border-slate-700">
                    <TextFieldApp label="Tratamiento" value={item.description} className="md:flex-2 px-2 text-sm" onChange={(val) => onChangeItem(index, "description", val)} />
                    <NumberInputApp value={item.quantity} className="md:flex-1 px-2 text-sm" min={1} onChange={(val) => onChangeItem(index, "quantity", val)} />
                    <NumberInputApp value={item.unitPrice} className="md:flex-1 px-2 text-sm" min={1} onChange={(val) => onChangeItem(index, "unitPrice", val)} />
                    <NumberInputApp value={item.discount} className="md:flex-1 px-2 text-sm" min={1} onChange={(val) => onChangeItem(index, "discount", val)} />
                    <span className={`flex-1 px-2 text-sm`}>{calculateLineTotal(item)}</span>
                </fieldset>
 */