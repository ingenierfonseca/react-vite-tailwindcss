import type {
  CreateCollectionAction,
  CreateCreditApplication,
  CreditApplication,
  CreditDecision,
  CreditLoanListItem,
  CreditPage,
  CreditPortfolioSummary,
  CreditProduct,
  Loan,
  LoanCollectionAction,
  LoanPayment,
  PaymentMethod,
  RegisterLoanPayment,
  SaveCreditProduct,
} from "./credit.types";

export interface CreditRepository {
  listProducts(page: number, pageSize: number, activeOnly?: boolean): Promise<CreditPage<CreditProduct>>;
  createProduct(request: SaveCreditProduct): Promise<CreditProduct>;
  updateProduct(id: number, request: SaveCreditProduct): Promise<CreditProduct>;
  listApplications(page: number, pageSize: number, status?: string): Promise<CreditPage<CreditApplication>>;
  createApplication(request: CreateCreditApplication): Promise<CreditApplication>;
  decideApplication(id: number, request: CreditDecision): Promise<CreditApplication>;
  disburseApplication(id: number): Promise<Loan>;
  listLoans(page: number, pageSize: number, status?: string, search?: string): Promise<CreditPage<CreditLoanListItem>>;
  getLoan(id: number): Promise<Loan>;
  registerPayment(loanId: number, request: RegisterLoanPayment): Promise<LoanPayment>;
  listPaymentMethods(): Promise<PaymentMethod[]>;
  getPortfolioSummary(): Promise<CreditPortfolioSummary>;
  listCollectionActions(loanId: number, page: number, pageSize: number): Promise<CreditPage<LoanCollectionAction>>;
  addCollectionAction(loanId: number, request: CreateCollectionAction): Promise<LoanCollectionAction>;
}
