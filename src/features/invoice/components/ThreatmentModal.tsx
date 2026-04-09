import { toast } from "react-toastify";
import Modal from "../../../components/commons/Modal";
import NumberInputApp from "../../../components/commons/NumberInputApp";
import TextFieldApp from "../../../components/commons/TextFieldApp";
import type { InvoiceItem } from "../../../services/invoice/invoice.types";
import { formatNumber } from "../../../utils/number.util";


interface ThreatmentModalProps {
    invoiceItem: InvoiceItem,
    isModalOpen: boolean,
    setIsModalOpen: (value: boolean) => void,
    onClick: () => void,
    onChangeItem: (field: keyof InvoiceItem, value: any) => void,
}

export default function ThreatmentModal({ invoiceItem, isModalOpen, setIsModalOpen, onClick, onChangeItem }: ThreatmentModalProps) {
    return (
        <Modal isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Información del Tratamiento"
            textBtnConfirm="Agregar"
            clickBtnConfirm={() => {
                if (validateFields(invoiceItem)) {
                    onClick()
                    setIsModalOpen(false)
                }
            }}>
            <div className="space-y-4">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Completa los datos del tratamiento
                </p>
                {invoiceItem && 
                <fieldset className="grid p-2 gap-2 border border-slate-200 dark:border-slate-700">
                    <TextFieldApp label="Tratamiento" value={invoiceItem.description} className="md:flex-2 px-2 text-sm" onChange={(val) => onChangeItem("description", val)} />
                    <NumberInputApp title="Cantidad" value={invoiceItem.quantity} className="md:flex-1 px-2 text-sm" min={1} onChange={(val) => onChangeItem("quantity", val)} />
                    <NumberInputApp title="Precio" value={invoiceItem.unitPrice} className="md:flex-1 px-2 text-sm" min={1} onChange={(val) => onChangeItem("unitPrice", val)} />
                    <NumberInputApp title="Descuento" value={invoiceItem.discount} className="md:flex-1 px-2 text-sm" min={1} onChange={(val) => onChangeItem("discount", val)} />
                    <span className={`flex-1 px-2 text-sm`}>{calculateLineTotal(invoiceItem)}</span>
                </fieldset>
                }
            </div>
        </Modal>
    )
}

const validateFields = (item: InvoiceItem) => {
    const { description, quantity, unitPrice } = item;
    if (!description) {
        toast.error("El campo descripción es requerido");
        return false;
    }
    if (quantity === undefined || quantity <= 0) {
        toast.error("El campo cantidad debe ser mayor a 0");
        return false;
    }
    if (unitPrice === undefined || unitPrice <= 0) {
        toast.error("El campo precio debe ser mayor a 0");
        return false;
    }

    return true;
}

const calculateLineTotal = (item: InvoiceItem) => {
    const { quantity = 0, unitPrice = 0, tax = 0, discount = 0 } = item;
    let total = quantity * unitPrice;
    if (tax) total *= 1 + tax / 100;
    if (discount) total *= 1 - discount / 100;
    return formatNumber(total);
};

/*
<fieldset disabled={loading} key={item.id} className="grid p-2 gap-2 border border-slate-200 dark:border-slate-700">
                    <TextFieldApp label="Tratamiento" value={item.description} className="md:flex-2 px-2 text-sm" onChange={(val) => onChangeItem(index, "description", val)} />
                    <NumberInputApp value={item.quantity} className="md:flex-1 px-2 text-sm" min={1} onChange={(val) => onChangeItem(index, "quantity", val)} />
                    <NumberInputApp value={item.unitPrice} className="md:flex-1 px-2 text-sm" min={1} onChange={(val) => onChangeItem(index, "unitPrice", val)} />
                    <NumberInputApp value={item.discount} className="md:flex-1 px-2 text-sm" min={1} onChange={(val) => onChangeItem(index, "discount", val)} />
                    <span className={`flex-1 px-2 text-sm`}>{calculateLineTotal(item)}</span>
                </fieldset>
 */