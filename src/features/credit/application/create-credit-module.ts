import type { CreditRepository } from "../domain/credit.repository";

export function createCreditModule(repository: CreditRepository) {
  return {
    listProducts: repository.listProducts.bind(repository),
    createProduct: repository.createProduct.bind(repository),
    updateProduct: repository.updateProduct.bind(repository),
    listApplications: repository.listApplications.bind(repository),
    createApplication: repository.createApplication.bind(repository),
    decideApplication: repository.decideApplication.bind(repository),
    disburseApplication: repository.disburseApplication.bind(repository),
    listLoans: repository.listLoans.bind(repository),
    getLoan: repository.getLoan.bind(repository),
    registerPayment: repository.registerPayment.bind(repository),
    listPaymentMethods: repository.listPaymentMethods.bind(repository),
    getPortfolioSummary: repository.getPortfolioSummary.bind(repository),
    listCollectionActions: repository.listCollectionActions.bind(repository),
    addCollectionAction: repository.addCollectionAction.bind(repository),
  };
}

export type CreditModule = ReturnType<typeof createCreditModule>;
