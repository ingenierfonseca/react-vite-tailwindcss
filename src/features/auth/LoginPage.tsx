import { useEffect } from "react";
import { useNavigate } from "react-router";
import { BriefcaseMedical } from "lucide-react";
import { useAuth } from "@/provider/AuthProvider";
import { LoginForm } from "./components/LoginForm";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (values: { userName: string; password: string }) => {
    await login(values);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] bg-size[20px_20px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,black_20%,transparent_70%)]" />

      {/* Card */}
      <div className="relative w-full max-w-md">
        {/* Gradient top bar */}
        <div className="h-1.5 w-full rounded-t-2xl bg-linear-to-r from-primary via-primary/70 to-transparent" />

        <div className="rounded-b-2xl rounded-tr-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl shadow-primary/5 dark:shadow-primary/10 px-8 py-10 sm:px-10">
          {/* Logo */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary/70 shadow-lg shadow-primary/20 dark:shadow-primary/10 ring-1 ring-primary/10">
              <BriefcaseMedical className="size-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              Clinical<span className="text-primary">SuiteNova</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Inicia sesión para continuar
            </p>
          </div>

          {/* Form */}
          <LoginForm onSubmit={handleLogin} />
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-600">
          &copy; {new Date().getFullYear()} ClinicalSuiteNova. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
