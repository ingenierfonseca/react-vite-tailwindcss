import { ClientsPage, type ClientsPageProps } from "@/features/clients";
import { customerClientModule, customerClientQueries } from "./clients";

type CustomerClientsPageProps = Omit<ClientsPageProps, "module" | "queries">;

export function CustomerClientsPage(props: CustomerClientsPageProps) {
  return (
    <ClientsPage
      {...props}
      module={customerClientModule}
      queries={customerClientQueries}
    />
  );
}
