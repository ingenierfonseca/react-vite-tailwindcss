import type { ReactNode } from "react";
import { authModule } from "@/app/composition/auth";
import { AuthProvider as FeatureAuthProvider } from "@/features/auth/presentation/AuthProvider";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <FeatureAuthProvider auth={authModule}>{children}</FeatureAuthProvider>;
}
