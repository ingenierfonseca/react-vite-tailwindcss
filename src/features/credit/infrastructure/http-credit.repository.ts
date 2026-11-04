import type { AxiosInstance } from "axios";
import type { CreditRepository } from "../domain/credit.repository";
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
} from "../domain/credit.types";

export interface CreditEndpoints {
  CREDIT_PRODUCTS: string;
  CREDIT_PRODUCT: (id: number) => string;
  CREDIT_APPLICATIONS: string;
  CREDIT_APPLICATION_DECISION: (id: number) => string;
  CREDIT_APPLICATION_DISBURSE: (id: number) => string;
  CREDIT_LOANS: string;
  CREDIT_LOAN: (id: number) => string;
  CREDIT_LOAN_PAYMENTS: (id: number) => string;
  CREDIT_LOAN_COLLECTIONS: (id: number) => string;
  CREDIT_PORTFOLIO_SUMMARY: string;
  CREDIT_PAYMENT_METHODS: string;
}

function pageQuery(page: number, pageSize: number, values: Record<string, string | undefined> = {}) {
  const params = new URLSearchParams({ pageNumber: String(page), pageSize: String(pageSize) });
  Object.entries(values).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return params.toString();
}

export function createHttpCreditRepository(http: AxiosInstance, endpoints: CreditEndpoints): CreditRepository {
  return {
    async listProducts(page, pageSize, activeOnly = true) {
      const { data } = await http.get<CreditPage<CreditProduct>>(
        `${endpoints.CREDIT_PRODUCTS}?${pageQuery(page, pageSize, { activeOnly: String(activeOnly) })}`,
      );
      return data;
    },

    async createProduct(request) {
      const { data } = await http.post<CreditProduct>(endpoints.CREDIT_PRODUCTS, request);
      return data;
    },

    async updateProduct(id, request) {
      const { data } = await http.put<CreditProduct>(endpoints.CREDIT_PRODUCT(id), request);
      return data;
    },

    async listApplications(page, pageSize, status) {
      const { data } = await http.get<CreditPage<CreditApplication>>(
        `${endpoints.CREDIT_APPLICATIONS}?${pageQuery(page, pageSize, { status })}`,
      );
      return data;
    },

    async createApplication(request: CreateCreditApplication) {
      const { data } = await http.post<CreditApplication>(endpoints.CREDIT_APPLICATIONS, request);
      return data;
    },

    async decideApplication(id, request: CreditDecision) {
      const { data } = await http.post<CreditApplication>(endpoints.CREDIT_APPLICATION_DECISION(id), request);
      return data;
    },

    async disburseApplication(id) {
      const { data } = await http.post<Loan>(endpoints.CREDIT_APPLICATION_DISBURSE(id));
      return data;
    },

    async listLoans(page, pageSize, status, search) {
      const { data } = await http.get<CreditPage<CreditLoanListItem>>(
        `${endpoints.CREDIT_LOANS}?${pageQuery(page, pageSize, { status, search })}`,
      );
      return data;
    },

    async getLoan(id) {
      const { data } = await http.get<Loan>(endpoints.CREDIT_LOAN(id));
      return data;
    },

    async registerPayment(loanId, request: RegisterLoanPayment) {
      const { data } = await http.post<LoanPayment>(endpoints.CREDIT_LOAN_PAYMENTS(loanId), request);
      return data;
    },

    async listPaymentMethods() {
      const { data } = await http.get<PaymentMethod[]>(endpoints.CREDIT_PAYMENT_METHODS);
      return data;
    },

    async getPortfolioSummary() {
      const { data } = await http.get<CreditPortfolioSummary>(endpoints.CREDIT_PORTFOLIO_SUMMARY);
      return data;
    },

    async listCollectionActions(loanId, page, pageSize) {
      const { data } = await http.get<CreditPage<LoanCollectionAction>>(
        `${endpoints.CREDIT_LOAN_COLLECTIONS(loanId)}?${pageQuery(page, pageSize)}`,
      );
      return data;
    },

    async addCollectionAction(loanId, request: CreateCollectionAction) {
      const { data } = await http.post<LoanCollectionAction>(endpoints.CREDIT_LOAN_COLLECTIONS(loanId), request);
      return data;
    },
  };
}
