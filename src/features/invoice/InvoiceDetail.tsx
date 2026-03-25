import InvoiceHeader from "./components/InvoiceHeader";
 
const headers = [
    "Descripcion",
    "Cantidad",
    "Precio Unitario",
    "IVA",
    "Descuento",
    "Total"
]

const invoiceItem = [
    "Limpieza Dental",
    10,
    1500.00,
    "16%",
    "0%",
    17400
]
export default function InvoiceDetail() {
    return (
        <div className="bg-white">
            <InvoiceHeader />
            <div className="w-full h-0.5 bg-slate-200 mt-3 mb-3" />
            <div className="flex flex-col px-4 py-3">
                <p className="font-bold text-md">Detalle de la Factura</p>
                <div className="flex mt-2">
                    <div className="flex-1 flex-col">
                        <div className="w-full flex flex-1 p-2 gap-2 bg-slate-200 text-black/50">
                            {headers.map((header, index) => {
                                return <span className={`${index === 0 ? 'flex-2' : 'flex-1'} px-2 text-sm`}>{header}</span>
                            })}
                        </div>
                        <div className="w-full flex  p-2 gap-2 border border-slate-200">
                            {invoiceItem.map((item, index) => {
                                return <span className={`${index === 0 ? 'flex-2' : 'flex-1'} px-2 text-sm`}>{item}</span>
                            })}
                        </div>
                    </div>
                    <div className="w-70 border border-slate-200 bg-slate-100 ml-2 text-sm">
                        <div className="border-b-2 border-slate-200 flex justify-between p-2"><span>SubTotal</span><span>$15,000.00</span></div>
                        <div className="border-b-2 border-slate-200 flex justify-between p-2"><span>IVA (15%)</span><span>$2,400.00</span></div>
                        <div className="flex justify-between p-2"><span>Total</span><span className="font-bold">$17,400.00</span></div>
                    </div>
                </div>
                <div className="right-0">
                    <button className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95">Cancelar</button>
                    <button>Guardar Factura</button>
                </div>
            </div>
        </div>
    )
}