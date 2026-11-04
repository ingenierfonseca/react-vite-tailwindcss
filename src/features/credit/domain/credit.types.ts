export interface CreditPage<T> {
  data: T[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface CreditProduct {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  currencyId: number;
  currencyCode: string;
  currencySymbol: string;
  minimumAmount: number;
  maximumAmount: number;
  annualRatePercent: number;
  originationFeePercent: number;
  originationFeeFixed: number;
  minimumTermMonths: number;
  maximumTermMonths: number;
  defaultTermMonths: number;
  installmentFrequencyMonths: number;
  amortizationMethod: "FixedPayment" | "EqualPrincipal" | string;
  isActive: boolean;
  termsVersion: number;
}

export interface SaveCreditProduct {
  code: string;
  name: string;
  description?: string;
  currencyId: number;
  minimumAmount: number;
  maximumAmount: number;
  annualRatePercent: number;
  originationFeePercent: number;
  originationFeeFixed: number;
  minimumTermMonths: number;
  maximumTermMonths: number;
  defaultTermMonths: number;
  installmentFrequencyMonths: number;
  amortizationMethod: "FixedPayment" | "EqualPrincipal";
  isActive: boolean;
}

export interface CreditApplication {
  id: number;
  applicationNumber: string;
  customerId: number;
  customerName: string;
  creditProductId: number;
  productName: string;
  currencyId: number;
  currencyCode: string;
  requestedAmount: number;
  requestedTermMonths: number;
  purpose: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  existingMonthlyDebt: number;
  status: "Submitted" | "UnderReview" | "Approved" | "Rejected" | "Disbursed" | "Cancelled" | string;
  approvedAmount?: number | null;
  approvedTermMonths?: number | null;
  approvedAnnualRatePercent?: number | null;
  decisionReason?: string | null;
  createdAtUtc: string;
  submittedAtUtc?: string | null;
}

export interface CreateCreditApplication {
  customerId: number;
  creditProductId: number;
  requestedAmount: number;
  requestedTermMonths: number;
  purpose: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  existingMonthlyDebt: number;
  consentToDataProcessing: boolean;
  consentVersion: string;
}

export interface CreditDecision {
  approved: boolean;
  approvedAmount?: number | null;
  approvedTermMonths?: number | null;
  approvedAnnualRatePercent?: number | null;
  reason: string;
}

export interface CreditInstallment {
  id: number;
  number: number;
  dueDate: string;
  openingPrincipal: number;
  principalDue: number;
  interestDue: number;
  feesDue: number;
  totalDue: number;
  amountPaid: number;
  balance: number;
  status: string;
}

export interface LoanPayment {
  id: number;
  loanId: number;
  loanNumber: string;
  customerId: number;
  amount: number;
  currencyCode: string;
  paymentMethod: string;
  paidAtUtc: string;
  reference?: string | null;
  principalApplied: number;
  interestApplied: number;
  feesApplied: number;
  outstandingPrincipalAfter: number;
}

export interface LoanLedgerEntry {
  id: number;
  transactionType: string;
  amount: number;
  principalDelta: number;
  outstandingPrincipalAfter: number;
  description: string;
  createdAtUtc: string;
}

export interface Loan {
  id: number;
  loanNumber: string;
  creditApplicationId: number;
  customerId: number;
  customerName: string;
  creditProductId: number;
  productName: string;
  currencyId: number;
  currencyCode: string;
  currencySymbol: string;
  originalPrincipal: number;
  outstandingPrincipal: number;
  annualRatePercent: number;
  originationFee: number;
  termMonths: number;
  installmentFrequencyMonths: number;
  amortizationMethod: string;
  status: string;
  disbursedAtUtc: string;
  nextDueDate?: string | null;
  totalScheduled: number;
  totalPaid: number;
  daysPastDue: number;
  installments: CreditInstallment[];
  payments: LoanPayment[];
  ledgerEntries: LoanLedgerEntry[];
}

export interface CreditLoanListItem {
  id: number;
  loanNumber: string;
  customerId: number;
  customerName: string;
  productName: string;
  currencyCode: string;
  originalPrincipal: number;
  outstandingPrincipal: number;
  overdueAmount: number;
  daysPastDue: number;
  status: string;
  nextDueDate?: string | null;
}

export interface CreditPortfolioCurrencySummary {
  currencyId: number;
  currencyCode: string;
  currencySymbol: string;
  outstandingPrincipal: number;
  overdueAmount: number;
  dueTodayAmount: number;
}

export interface CreditPortfolioSummary {
  activeLoanCount: number;
  overdueLoanCount: number;
  byCurrency: CreditPortfolioCurrencySummary[];
}

export interface PaymentMethod {
  id: number;
  name: string;
  description?: string | null;
}

export interface RegisterLoanPayment {
  amount: number;
  paymentTypeId: number;
  paidAtUtc?: string;
  reference?: string;
  memo?: string;
  idempotencyKey: string;
}

export interface LoanCollectionAction {
  id: number;
  loanId: number;
  actionType: string;
  outcome: string;
  notes?: string | null;
  promiseAmount?: number | null;
  promiseDate?: string | null;
  nextContactAtUtc?: string | null;
  createdBy: string;
  createdAtUtc: string;
}

export interface CreateCollectionAction {
  actionType: "Call" | "Sms" | "Email" | "Visit" | "PromiseToPay" | "Note";
  outcome: string;
  notes?: string;
  promiseAmount?: number;
  promiseDate?: string;
  nextContactAtUtc?: string;
}
