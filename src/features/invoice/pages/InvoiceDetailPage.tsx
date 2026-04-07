import { Plus } from "lucide-react";
import { cn, theme } from "../../../utils/theme";
import InvoiceHeader from "../components/InvoiceHeader";
import { useNavigate } from "react-router";
import NumberInputApp from "../../../components/commons/NumberInputApp";
import { Bounce, ToastContainer } from "react-toastify";
import { useInvoiceDetail } from "../hooks/useInvoiceDetail";
import { formatNumber } from "../../../utils/number.util";
import TextFieldApp from "../../../components/commons/TextFieldApp";
import ButtonSaveApp from "../../../components/commons/ButtonSaveApp";

const headers = [
    "Tratamiento",
    "Cantidad",
    "Precio Unitario",
    "Descuento",
    "Total"
]
export default function InvoiceDetailPage() {
    const navigate = useNavigate();
    const { 
        invoice,
        loading,
        handleAddItem, 
        onChangeItem,
        calculateLineTotal,
        calculateTotal,
        saveInvoice,
        updateField
    } = useInvoiceDetail()

    return (
        <div className="bg-white dark:bg-slate-900">
            <InvoiceHeader 
                invoice={invoice} 
                updateField={updateField} 
                disabled={loading}
            />
            <div className="w-full h-0.5 bg-slate-200 mt-3 mb-3 dark:bg-slate-600" />
            <div className="flex flex-col px-4 py-3">
                <p className="font-bold text-md dark:text-slate-100">Detalle de la Factura</p>
                <div className="flex mt-2">
                    <div className="flex-1 flex-col">
                        <div className="w-full flex flex-1 p-2 gap-2 bg-slate-200 text-black/50 dark:bg-slate-800 dark:text-white">
                            {headers.map((header, index) => {
                                return <span key={header} className={`${index === 0 ? 'flex-2' : 'flex-1'} px-2 text-sm`}>{header}</span>
                            })}
                        </div>
                        {invoice && invoice!.items.map((item, index) => {
                            return (
                                <fieldset disabled={loading} key={item.id} className="w-full flex  p-2 gap-2 border border-slate-200 dark:border-slate-700">
                                    <TextFieldApp label="Tratamiento" value={item.description} className="flex-2 px-2 text-sm" onChange={(val) => onChangeItem(index, "description", val)} />
                                    <NumberInputApp value={item.quantity} className="flex-1 px-2 text-sm" min={1} onChange={(val) => onChangeItem(index, "quantity", val)} />
                                    <NumberInputApp value={item.unitPrice} className="flex-1 px-2 text-sm" min={1} onChange={(val) => onChangeItem(index, "unitPrice", val)} />
                                    {/*<NumberInputApp value={item.tax} className="flex-1 px-2 text-sm" min={1} onChange={(val) => onChangeItem(index, "tax", val)} />*/}
                                    <NumberInputApp value={item.discount} className="flex-1 px-2 text-sm" min={1} onChange={(val) => onChangeItem(index, "discount", val)} />
                                    <span className={`flex-1 px-2 text-sm`}>{calculateLineTotal(item)}</span>
                                </fieldset>
                            )
                        })}
                        <button onClick={handleAddItem}
                            disabled={loading}
                            className={`mt-2 flex disabled:opacity-50 ${cn(theme.button.base)} bg-slate-200 dark:bg-slate-800 dark:border-slate-500 dark:text-white dark:hover:bg-slate-700`}>
                            <Plus />
                            Agregar Linea
                        </button>
                    </div>
                    <div className="w-70 h-fit border border-slate-200 bg-slate-100 ml-2 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                        <div className="border-b-2 border-slate-200 dark:border-slate-600 flex justify-between p-2"><span>SubTotal</span><span>{invoice !== null ? calculateTotal() : "0.00"}</span></div>
                        <div className="border-b-2 border-slate-200 dark:border-slate-600 flex justify-between p-2"><span>IVA (0%)</span><span>{invoice !== null ? formatNumber(invoice?.taxTotal) : "0.00"}</span></div>
                        <div className="flex justify-between p-2"><span>Total</span><span className="font-bold">{invoice !== null ? calculateTotal() : "0.00"}</span></div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end px-4 gap-1 pb-3">
                <button className={`disabled:opacity-50 ${cn(theme.button.base)} h-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700 mt-4`}
                    disabled={loading}
                    onClick={() => navigate(`/invoice`)}>Cancelar</button>
                <ButtonSaveApp label="Factura" onClick={saveInvoice} loading={loading} />
            </div>
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