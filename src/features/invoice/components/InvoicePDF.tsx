import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import type { InvoicePrint } from '../../../models/invoicePrint.type';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '2px solid #2563eb',
    paddingBottom: 20,
    marginBottom: 30,
  },
  brandSection: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  brandInfo: {
    flex: 1,
  },
  brandName: {
    fontSize: 20,
    color: '#2563eb',
    fontWeight: 'bold' as const,
  },
  companyDetail: {
    fontSize: 8,
    color: '#64748b',
    marginTop: 2,
  },
  infoSection: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  infoColumn: {
    flex: 1,
  },
  label: {
    color: '#94a3b8',
    fontSize: 8,
    marginBottom: 2,
  },
  value: {
    fontWeight: 'bold' as const,
    fontSize: 10,
    marginBottom: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    fontWeight: 'bold' as const,
    padding: 8,
    borderBottom: '1px solid #e2e8f0',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1px solid #f1f5f9',
  },
  colDesc: { width: '40%' },
  colCant: { width: '10%', textAlign: 'center' },
  colPrecio: { width: '20%', textAlign: 'right' },
  colTotal: { width: '30%', textAlign: 'right' },
  totalsBox: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalsInner: {
    width: '40%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: '#2563eb',
  },
});

const InvoicePDF: React.FC<InvoicePrint> = ({
  companyName,
  companyAddress,
  companyPhone,
  companyEmail,
  companyNIT,
  companyLogoUrl,
  customerName,
  customerAddress,
  customerPhone,
  customerEmail,
  invoiceNumber,
  date,
  paymentTerm,
  currencySymbol,
  subTotal,
  total,
  items,
}) => {
  return (
    <Document title={`Factura-${invoiceNumber}`}>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandSection}>
            {companyLogoUrl && (
              <Image src={companyLogoUrl} style={{ width: 60, height: 60 }} />
            )}
            <View>
              <Text style={styles.brandName}>{companyName}</Text>
              <Text style={styles.companyDetail}>{companyAddress}</Text>
              <Text style={styles.companyDetail}>{companyPhone} | {companyEmail}</Text>
              <Text style={styles.companyDetail}>NIT: {companyNIT}</Text>
            </View>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>FACTURA ELECTRÓNICA</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 12, marginTop: 4 }}>#{invoiceNumber}</Text>
            <Text style={styles.companyDetail}>Fecha: {date}</Text>
            <Text style={styles.companyDetail}>Término de pago: {paymentTerm}</Text>
            <Text style={styles.companyDetail}>Moneda: {currencySymbol}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoColumn}>
            <Text style={styles.label}>CLIENTE:</Text>
            <Text style={styles.value}>{customerName}</Text>
            <Text style={styles.companyDetail}>{customerAddress}</Text>
            <Text style={styles.companyDetail}>{customerPhone} | {customerEmail}</Text>
          </View>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>Descripción</Text>
          <Text style={styles.colCant}>Cant.</Text>
          <Text style={styles.colPrecio}>P. Unit.</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>

        {items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.colDesc}>{item.description}</Text>
            <Text style={styles.colCant}>{item.quantity}</Text>
            <Text style={styles.colPrecio}>{currencySymbol}{item.unitPrice.toFixed(2)}</Text>
            <Text style={styles.colTotal}>{currencySymbol}{item.lineTotal.toFixed(2)}</Text>
          </View>
        ))}

        <View style={styles.totalsBox}>
          <View style={styles.totalsInner}>
            <View style={styles.totalRow}>
              <Text>Subtotal:</Text>
              <Text>{currencySymbol}{subTotal.toFixed(2)}</Text>
            </View>
            <View style={[styles.totalRow, { marginTop: 4, borderTop: '1px solid #e2e8f0', paddingTop: 4 }]}>
              <Text style={styles.totalText}>Total:</Text>
              <Text style={styles.totalText}>{currencySymbol}{total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default InvoicePDF;