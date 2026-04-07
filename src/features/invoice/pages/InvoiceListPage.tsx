import { useNavigate } from "react-router";
import PageComponent from "../../../components/commons/PageComponent";
import { PaginatedAutocomplete } from "../../../components/commons/PaginatedAutocomplete";
import { CustomerService } from "../../../services/customer/customer.service";
import DashboardCard from "../../../components/dashboard/DashboardCard";
import AvatarInfo from "../../../components/commons/AvatarInfo";
import { Receipt } from "lucide-react";
import { useState } from "react";
import PatientBillInfo from "../components/PatientBillInfo";
import { useCustomerInvoice } from "../hooks/customerInvoice.hook";
import { formatNumber } from "../../../utils/number.util";
import type { CustomerInvoiceDTO } from "../../../services/invoice/customerinvoice.dto.type";

/*const headers = [
    '#',
    'invoice number',
    'patient name',
    'subtotal',
    'tax',
    'total',
    'date',
    'status',
    'action'
]*/

export default function Invoice() {
    const { data, customer, setCustomer } = useCustomerInvoice()
    const [isOpenTransitionRight, setIsOpenTransitionRight] = useState(false)
    const [isOpenProfileBillInfo, setIsOpenProfileBillInfo] = useState(false)
    const navigate = useNavigate();

    function openProfileBillInfo(value: boolean) {
        setIsOpenTransitionRight(value)
        setIsOpenProfileBillInfo(value)
    }


    return (
        <PageComponent
            title="Facturas"
            description="Administra la información de tus facturas"
            textButton="Agregar Nueva Factura"
            onclick={() => navigate(`/invoice/0`)}
        >
            <div className="flex gap-8">
                <DashboardCard stat={{
                    title: "Total Facturas Pendientes",
                    value: "12",
                    bgColor: "bg-primary/20",
                    iconColor: "text-primary",
                    textColor: "text-blue-500",
                    color: "from-blue-400 to-blue-600",
                    icon: Receipt
                }} />
                <DashboardCard stat={{
                    title: "Total Facturas Pagadas",
                    value: "80",
                    bgColor: "bg-primary/20",
                    iconColor: "text-primary",
                    textColor: "text-emerald-500",
                    color: "from-emerald-400 to-emerald-600",
                    icon: Receipt
                }} />
            </div>
            <div className="mt-4 bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
                <PaginatedAutocomplete
                    label="Paciente"
                    value={0}
                    onChange={(value) => alert(value)
                        //updateField("customerId", value)
                    }
                    fetchData={() => CustomerService.getAllCustomers({ page: 1, search: '' })}
                    getValue={(item) => item.id}
                    getLabel={(item) => `${item.firstName.trim()} ${item.lastName.trim()}`}
                />
            </div>

            {data && data.data && data?.data.map((customer) => (
                <div key={customer!.id} className="flex flex-col text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md bg-white my-3 py-2 dark:bg-slate-800">
                    <div className="flex w-full px-4">
                        <AvatarInfo
                            avatar={customer!.avatar}
                            name={customer!.fullName}
                            description={`Ultimo Pago: ${customer!.lastPayment ? customer!.lastPayment : 'No ha realizado pagos'}`}
                            onClick={() => {
                                setCustomer(customer)
                                openProfileBillInfo(true)
                            }}
                        />
                        <div className="ml-auto">
                            <p className={`text-4xl font-semibold ${getColorByPendingCount(customer!)}`}>
                                {customer?.currencyId ? customer.currencyId : 'C$'}{formatNumber(customer!.balance)}
                            </p>
                            <p className="text-lg text-slate-600 dark:text-slate-400">Saldo Pendiente</p>
                        </div>
                    </div>
                    <div className="flex w-full px-4">
                        <div className="flex gap-2">
                            {customer!.countPaid !== 0 &&
                                <p className="text-sm text-emerald-500 font-semibold bg-emerald-500/20 rounded-2xl py-1 px-2">{customer!.countPaid} Pagadas</p>
                            }
                            {customer!.countPending !== 0 &&
                                <p className="text-sm text-amber-500 font-semibold bg-amber-500/20 rounded-2xl py-1 px-2">{customer!.countPending} Pendientes</p>
                            }
                            {customer!.countOverdue !== 0 &&
                                <p className="text-sm text-rose-500 font-semibold bg-rose-500/20 rounded-2xl py-1 px-2">{customer!.countOverdue} Vencidas</p>
                            }
                        </div>
                    </div>
                </div>
            ))}

            <div
                className={`fixed top-0 right-0 h-full w-7/12 bg-white dark:bg-slate-800 shadow-2xl z-50 
                            transform transition-transform duration-500 ease-in-out ${isOpenTransitionRight ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {isOpenProfileBillInfo && <PatientBillInfo customer={customer} setIsOpen={openProfileBillInfo} />}
            </div>
        </PageComponent>
    )
}

function getColorByPendingCount(customer: CustomerInvoiceDTO) {
    if (customer.countOverdue !== 0) {
        return "text-rose-500";
    } else if (customer.countPending !== 0) {
        return "text-amber-500";
    } //else if (customer.countPaid !== 0) {
        //return "text-emerald-500";
    //}
    return "text-emerald-500";
}

{/*<>
            <PageList headers={headers} data={data} setIsModalOpen={()=> navigate(`/invoice/0`)} />
            
            <Modal isOpen={isModalOpen}
                onClose={() => navigate(`/invoice/0`)}
                title="Información de la Factura"
                textBtnConfirm="Guardar"
                clickBtnConfirm={()=> saveInvoice}>
                <div className="space-y-4">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Completa los datos de la factura
                    </p>
                    <div className="flex gap-8">
                        <div className="flex flex-col flex-1">
                            <p className="font-bold p-1">Seleccione un paciente</p>
                            <select className={`${cn(theme.dropdown.content)} ${cn(theme.dropdown.item)}`}>
                                <option value="1">Marlon Fonseca</option>
                            </select>
                        </div>
                        <div className="flex flex-col flex-1">
                            <p className="font-bold p-1">Seleccione un tratamiento</p>
                            <select className={`${cn(theme.dropdown.content)} ${cn(theme.dropdown.item)}`}>
                                <option value="1">Extraccion</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-8">
                        <div className="flex-1">
                            <p>SubTotal</p>
                            <input
                                type="text"
                                placeholder="Nombre del paciente"
                                className="w-full p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex-1">
                            <p>Tax</p>
                            <input
                                type="text"
                                placeholder="Nombre del paciente"
                                className="w-full p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </>*/}