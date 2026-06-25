import PageComponent from "../../../components/commons/PageComponent";
import { PaginatedAutocomplete } from "../../../components/pagination-data/PaginatedAutocomplete";
import { CustomerService } from "../../../services/customer/customer.service";
import DashboardCard from "../../../components/dashboard/DashboardCard";
import AvatarInfo from "../../../components/commons/AvatarInfo";
import { Filter, Receipt } from "lucide-react";
import PatientBillInfo from "../components/PatientBillInfo";
import { useCustomerInvoice } from "../hooks/customerInvoice.hook";
import { formatNumber } from "../../../utils/number.util";
import type { CustomerInvoiceDTO } from "../../../services/invoice/customerinvoice.dto.type";
import InvoiceDetail from "../components/InvoiceDetail";
import { formatDateToMMDameDDYYYY } from "../../../utils/date.util";
import type { Invoice } from "../../../services/invoice/invoice.types";
import { ASSETS_URLS } from "../../../config/constants";

export default function Invoice() {
    const { 
        data, 
        dashboardData, 
        customer, 
        setCustomer, 
        loadDataPage,
        search,
        setSearch,
        invoiceId,
        setInvoiceId,
        isOpenTransitionRight,
        isOpenProfileBillInfo,
        isOpenMakeInvoice,
        openProfileBillInfo,
        openMakeInvoice,
        openInvoiceDetail
     } = useCustomerInvoice()

    return (
        <PageComponent
            title="Dashboard de Facturación"
            description="Visión general de las cuentas de pacientes y transacciones"
            showButton={false}
            textButton="Agregar Nueva Factura"
            onclick={() => {
                /*setInvoiceId("0")
                openMakeInvoice(true)*/
            }}>
            <div className="flex gap-2 md:gap-8">
                {dashboardData && dashboardData.map((dashboard, index) => (
                    <DashboardCard
                        key={index}
                        stat={{
                            title: dashboard.title,
                            value: dashboard.value,
                            bgColor: "bg-primary/20",
                            iconColor: "text-primary",
                            textColor: "text-blue-500",
                            color: "from-blue-400 to-blue-600",
                            icon: Receipt
                        }}
                        iconClassName="hidden md:block" />
                ))}
            </div>
            <div className="flex mt-4 gap-2 items-center">
                <PaginatedAutocomplete
                    label="Buscar Paciente"
                    value={search}
                    onChange={(value) => setSearch(data?.data.find(c => c?.id === value)?.fullName || '')}
                    fetchData={CustomerService.get}
                    getValue={(item) => item.id}
                    getLabel={(item) => `${item.firstName.trim()} ${item.lastName.trim()}`}
                />
                <div className="rounded-lg shadow-md p-3.5 border dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center">
                    <Filter className="inline-block mr-2 text-slate-500 dark:text-slate-300 w-4 h-4 sm:w-6 sm:h-6 md:w-6 md:h-6" />
                    <span className="text-sm text-slate-500 dark:text-slate-300">Filtros</span>
                </div>
            </div>

            {data && data.data && data?.data.map((customer) => (
                <div key={customer!.id} className="flex flex-col text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md bg-white my-3 py-2 dark:bg-slate-800 shadow-md active:scale-[0,98] transition-transform">
                    <div className="flex w-full px-4">
                        <AvatarInfo className="min-w-0"
                            avatar={`${ASSETS_URLS.avatars}/${customer!.avatar}`}
                            name={customer!.fullName}
                            title={`Ultimo Pago: ${customer!.lastPayment ? formatDateToMMDameDDYYYY(customer!.lastPayment) : 'Sin registros'}`}
                            onClick={() => {
                                setCustomer(customer)
                                openProfileBillInfo(true)
                            }}
                        />
                        <div className="ml-auto">
                            {/*customer && customer.balances.map((balance, index) => (
                                <p key={index} className={`sm:text-lg md:text-2xl font-semibold ${getColorByPendingCount(customer!)} flex justify-end`}>
                                    {balance.symbol}{formatNumber(balance.amount)}
                                </p>
                            ))*/}
                            {customer && (
                                <p className={`sm:text-lg md:text-2xl font-semibold ${getColorByPendingCount(customer!)} flex justify-end`}>{customer.currency}{formatNumber(customer.balance)}</p>
                            )}
                            <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 flex justify-end whitespace-nowrap truncate">Deuda  Total</p>
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
                className={`fixed top-0 right-0 h-full w-full md:w-7/12 bg-white dark:bg-slate-800 shadow-2xl z-50        
                    transform transition-transform duration-500 ease-in-out 
                    ${isOpenTransitionRight ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {isOpenProfileBillInfo && <PatientBillInfo 
                    customer={customer} 
                    setIsOpen={openProfileBillInfo} 
                    reload={loadDataPage}
                    openInvoiceDetail={openInvoiceDetail} />}

                {isOpenMakeInvoice && <InvoiceDetail idParam={invoiceId} setIsOpen={openMakeInvoice} reload={loadDataPage} />}
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