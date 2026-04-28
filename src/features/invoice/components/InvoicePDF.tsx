import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

interface InvoiceItem {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
}

interface FacturaProps {
  clienteNombre: string;
  clienteId: string;
  items: InvoiceItem[];
  numeroFactura: string;
}

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
  brandName: {
    fontSize: 24,
    color: '#2563eb',
    fontWeight: 'bold' as const,
  },
  infoSection: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  infoColumn: {
    flex: 1,
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
  colDesc: { width: '60%' },
  colCant: { width: '10%', textAlign: 'center' },
  colTotal: { width: '30%', textAlign: 'right' },
  totalBox: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#2563eb',
  }
});

const InvoicePDF: React.FC<FacturaProps> = ({ clienteNombre, clienteId, items, numeroFactura }) => {
  const calcularTotal = () => items.reduce((acc, item) => acc + (item.cantidad * item.precioUnitario), 0);

  return (
    <Document title={`Factura-${numeroFactura}`}>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>Clinical Suite</Text>
            <Text>Software de Gestión Médica</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={{ fontSize: 14 }}>FACTURA ELECTRÓNICA</Text>
            <Text style={{ fontWeight: 'bold' }}>#{numeroFactura}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoColumn}>
            <Text style={{ color: '#94a3b8', fontSize: 8 }}>CLIENTE:</Text>
            <Text style={{ fontWeight: 'bold' }}>{clienteNombre}</Text>
            <Text>ID/DNI: {clienteId}</Text>
          </View>
        </View>

        {/* Tabla con TypeScript */}
        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>Descripción</Text>
          <Text style={styles.colCant}>Cant.</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>

        {items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.colDesc}>{item.descripcion}</Text>
            <Text style={styles.colCant}>{item.cantidad}</Text>
            <Text style={styles.colTotal}>
              ${(item.cantidad * item.precioUnitario).toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={styles.totalBox}>
          <Text style={styles.totalText}>TOTAL: ${calcularTotal().toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  )
}

export default InvoicePDF;