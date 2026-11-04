export const CREDIT_ENDPOINTS = {
  CREDIT_PRODUCTS: "/credit/products",
  CREDIT_PRODUCT: (id: number) => `/credit/products/${id}`,
  CREDIT_APPLICATIONS: "/credit/applications",
  CREDIT_APPLICATION_DECISION: (id: number) => `/credit/applications/${id}/decision`,
  CREDIT_APPLICATION_DISBURSE: (id: number) => `/credit/applications/${id}/disburse`,
  CREDIT_LOANS: "/credit/loans",
  CREDIT_LOAN: (id: number) => `/credit/loans/${id}`,
  CREDIT_LOAN_PAYMENTS: (id: number) => `/credit/loans/${id}/payments`,
  CREDIT_LOAN_COLLECTIONS: (id: number) => `/credit/loans/${id}/collections`,
  CREDIT_PORTFOLIO_SUMMARY: "/credit/portfolio/summary",
  CREDIT_PAYMENT_METHODS: "/credit/payment-methods",
} as const;
