export const OPERATIONS_ENDPOINTS = {
  APPOINTMENT: "/appointment/",
  CUSTOMERS: "/customers/",
  CUSTOMER_DASHBOARD: "/customers/dashboard",
  CUSTOMER_BULK_IMPORT: "/customers/bulk-import",
  CUSTOMER_AVATAR: (id: number) => `/customers/${id}/upload-avatar`,
  CUSTOMER_RISK_DASHBOARD: (id: number) => `/customers/${id}/risk-dashboard`,
  CUSTOMER_NEXT_APPOINTMENT: (id: number) => `/customers/${id}/next-appointment`,
  INVOICE: "/invoice/",
  PAYMENT: "/payment/",
  PAYMENTTERM: "/paymentterm/",
} as const;
