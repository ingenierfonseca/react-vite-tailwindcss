import { Plus } from "lucide-react";
import { cn, theme } from "../../utils/theme";
import InvoiceHeader from "./components/InvoiceHeader";
import { useNavigate } from "react-router";
import { useInvoiceDetail } from "./invoice.hooks";
import { formatNumber } from "../../utils/utils";
import TextEditApp from "../../components/commons/TextEditApp";
import NumberInputApp from "../../components/commons/NumberInputApp";
 
const headers = [
    "Descripcion",
    "Cantidad",
    "Precio Unitario",
    "IVA",
    "Descuento",
    "Total"
]
export default function InvoiceDetail() {
    const navigate = useNavigate();
    const { invoice, handleAddItem, onChangeItem } = useInvoiceDetail()

    return (
        <div className="bg-white">
            <InvoiceHeader invoice={invoice} />
            <div className="w-full h-0.5 bg-slate-200 mt-3 mb-3" />
            <div className="flex flex-col px-4 py-3">
                <p className="font-bold text-md">Detalle de la Factura</p>
                <div className="flex mt-2">
                    <div className="flex-1 flex-col">
                        <div className="w-full flex flex-1 p-2 gap-2 bg-slate-200 text-black/50">
                            {headers.map((header, index) => {
                                return <span key={header} className={`${index === 0 ? 'flex-2' : 'flex-1'} px-2 text-sm`}>{header}</span>
                            })}
                        </div>
                        {invoice && invoice!.items.map((item, index) => {
                            return(
                                <div key={item.id} className="w-full flex  p-2 gap-2 border border-slate-200">
                                    <TextEditApp value={item.description} style="flex-2 px-2 text-sm" onChange={(val) => onChangeItem(index, "description", val)} />
                                    <NumberInputApp value={item.quantity} className="flex-1 px-2 text-sm" min={1} onChange={(val) => onChangeItem(index, "quantity", val)} />
                                    <NumberInputApp value={item.unitPrice} className="flex-1 px-2 text-sm" min={1} onChange={(val) => onChangeItem(index, "unitPrice", val)} />
                                    <NumberInputApp value={item.tax} className="flex-1 px-2 text-sm" min={1} onChange={(val) => onChangeItem(index, "tax", val)} />
                                    <NumberInputApp value={item.discount} className="flex-1 px-2 text-sm" min={1} onChange={(val) => onChangeItem(index, "discount", val)} />
                                    <span className={`flex-1 px-2 text-sm`}>{formatNumber(item.lineTotal)}</span>
                                </div>
                            )
                        })}
                        <button onClick={handleAddItem}
                            className={`mt-2 flex ${cn(theme.button.base)} bg-slate-200`}>
                            <Plus />
                            Agregar Linea
                        </button>
                    </div>
                    <div className="w-70 h-fit border border-slate-200 bg-slate-100 ml-2 text-sm">
                        <div className="border-b-2 border-slate-200 flex justify-between p-2"><span>SubTotal</span><span>{invoice !== null ? formatNumber(invoice?.subTotal) : "0.00"}</span></div>
                        <div className="border-b-2 border-slate-200 flex justify-between p-2"><span>IVA (15%)</span><span>{invoice !== null ? formatNumber(invoice?.taxTotal) : "0.00"}</span></div>
                        <div className="flex justify-between p-2"><span>Total</span><span className="font-bold">{invoice !== null ? formatNumber(invoice?.total) : "0.00"}</span></div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end px-4 py-3 gap-1">
                <button className={`${cn(theme.button.base)}`}
                    onClick={() => navigate(`/invoice`)}>Cancelar</button>
                <button className={`${cn(theme.button.base)} ${cn(theme.button.variant.primary)}`}>Guardar Factura</button>
            </div>
        </div>
    )
}