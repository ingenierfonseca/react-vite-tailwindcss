import { PaymentService } from "@/services/payment/payment.service";
import type { PaymentBaucherDto } from "@/services/payment/payment.type";
import { PrinterHelper } from "@/utils/printer.util";
import { Receipt, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  id: number;
}

export default function TickectModal({ title, isOpen, onClose, id }: TicketModalProps) {
  const ticketRef = useRef<HTMLDivElement>(null)
  const [baucher, setBaucher] = useState<PaymentBaucherDto>()
  const [loading, setLoading] = useState(false);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      PaymentService.getBaucher(id)
        .then(setBaucher)
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const handlePrint = async () => {
    if (!ticketRef.current) return
    setPrinting(true)
    try {
      await PrinterHelper.print(ticketRef.current.innerHTML, 'ticket')
    } catch (error) {
      console.error('Error al imprimir:', error)
    } finally {
      setPrinting(false)
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* 1. Overlay (Fondo oscuro con desenfoque) */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose} 
      />

      {/* 2. Contenedor del Modal */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl dark:border dark:border-slate-700/50 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-6 bg-primary dark:bg-slate-900 dark:border-b dark:border-slate-800">
          <h3 className="text-xl font-bold text-white">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <LoadingBaucher />
        ) : baucher && (
          <div ref={ticketRef} className="animate-in fade-in duration-500">
            <TicketBaucher baucher={baucher} />
          </div>
        )}

        {/* Pie del Modal (Opcional) */}
        <div className="flex justify-end gap-3 p-6 bg-slate-50 dark:bg-slate-800/50">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handlePrint}
            disabled={printing}
            className="px-6 py-2 text-sm font-semibold text-white hover:text-white/70 bg-primary hover:bg-primary/70 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {printing ? 'Imprimiendo...' : 'Imprimir'}
          </button>
        </div>
      </div>
    </div>
  );
}

const LoadingBaucher = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-5 min-h-75">
    <div className="relative">
      <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
      <div className="relative p-3.5 rounded-2xl bg-primary/10">
        <Receipt className="w-8 h-8 text-primary animate-spin" />
      </div>
    </div>
    <div className="text-center space-y-2">
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
        Generando comprobante
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500">
        Obteniendo datos de pago
      </p>
      <div className="flex justify-center gap-1.5 pt-1">
        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
              style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
              style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
              style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
)

const TicketBaucher = ({ baucher }: { baucher: PaymentBaucherDto }) => {
  return (
    <div className="w-[80mm] p-4 bg-white text-black font-mono text-[12px] leading-tight">
      {/* Encabezado */}
      <div className="text-center mb-4">
        <h1 className="text-[16px] font-bold uppercase">Clinica Dental Melissa</h1>
        <p>NIT: {baucher.companyNIT}</p>
        <p>{baucher.companyAddress}</p>
        <p>Tel: {baucher.companyPhone}</p>
      </div>

      {/* Información de la Factura */}
      <div className="border-t border-dashed border-black pt-2 mb-2">
        <p>Factura: {baucher.invoiceNumber}</p>
        <p>Fecha: {baucher.paymentDate}</p>
        <p>Cajero: Administrador</p>
        <p>Concepto: {baucher.memo}</p>
      </div>

      {/* Tabla de Productos */}
      {baucher.items && baucher.items.length > 0 && 
        <div className="border-t border-dashed border-black pt-2">
          <div className="flex justify-between font-bold border-b border-dashed border-black mb-1">
            <span className="w-1/2">Descripción</span>
            <span className="w-1/6 text-center">Cant</span>
            <span className="w-1/3 text-right">Total</span>
          </div>
          
          {/* Ítems de ejemplo */}
          {baucher.items.map((item, index) => (
            <div key={index} className="flex justify-between my-1">
              <span className="w-1/2">{item.description}</span>
              <span className="w-1/6 text-center">{item.quantity}</span>
              <span className="w-1/3 text-right">${item.lineTotal.toFixed(2)}</span>
            </div>
          ))}
        </div>
      }

      {baucher && baucher.isPartialPayment && 
      <div className="border-t border-dashed border-black mt-2 pt-2">
        <div className="flex justify-between font-bold text-[14px]">
          <span>Saldo inicial:</span>
          <span>${baucher.invoiceTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[11px] mt-1">
          <span>Saldo anterior:</span>
          <span>${baucher.previousBalance.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[11px] mt-1">
          <span>Abono:</span>
          <span>${baucher.amountPaid.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span>Saldo actual:</span>
          <span>${baucher.remainingBalance.toFixed(2)}</span>
        </div>
      </div>
      }

      {/* Totales */}
      {baucher && !baucher.isPartialPayment && 
      <div className="border-t border-dashed border-black mt-2 pt-2">
        <div className="flex justify-between font-bold text-[14px]">
          <span>TOTAL:</span>
          <span>${baucher.invoiceTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[11px] mt-1">
          <span>Efectivo:</span>
          <span>${baucher.amountPaid.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span>Cambio:</span>
          <span>${baucher.remainingBalance.toFixed(2)}</span>
        </div>
      </div>
      }

      {/* Pie de página (Legal) */}
      <div className="text-center mt-6">
        <p className="italic text-[10px]">¡Gracias por su compra!</p>
        {/*<p className="text-[9px] mt-2">
          Resolución DIAN No. 123456 <br />
          Rango 0001 al 5000 - Vigencia 12 meses
        </p>
        <div className="mt-4 border-t border-dashed border-black pt-2">
          <p className="text-[10px]">Visítanos en: www.tuempresa.com</p>
        </div>*/}
      </div>
    </div>
  );
};