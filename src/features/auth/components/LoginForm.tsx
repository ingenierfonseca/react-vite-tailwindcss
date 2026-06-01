import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  userName: z
    .string()
    .min(1, "El nombre de usuario es requerido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const handleFormSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await onSubmit(values);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Error al iniciar sesión. Verifica tus credenciales.";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5" noValidate>
      {serverError && (
        <div className="flex items-start gap-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 p-3 text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="userName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Nombre de usuario
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            id="userName"
            type="text"
            autoComplete="username"
            placeholder="nombre de usuario"
            {...register("userName")}
            className={cn(
              "w-full rounded-xl border bg-white/80 dark:bg-slate-800/80 pl-10 pr-4 py-2.5 text-sm",
              "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500",
              "border-slate-200 dark:border-slate-700",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
              "transition-all duration-200",
              errors.userName && "border-red-300 dark:border-red-800 focus:ring-red-300 focus:border-red-400"
            )}
          />
        </div>
        {errors.userName && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.userName.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Ingresa tu contraseña"
            {...register("password")}
            className={cn(
              "w-full rounded-xl border bg-white/80 dark:bg-slate-800/80 pl-10 pr-10 py-2.5 text-sm",
              "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500",
              "border-slate-200 dark:border-slate-700",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
              "transition-all duration-200",
              errors.password && "border-red-300 dark:border-red-800 focus:ring-red-300 focus:border-red-400"
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full rounded-xl py-2.5 text-sm font-semibold text-white",
          "bg-primary hover:bg-primary/90 active:bg-primary/80",
          "shadow-lg shadow-primary/20 dark:shadow-primary/10",
          "transition-all duration-200",
          "disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none",
          "flex items-center justify-center gap-2"
        )}
      >
        {isLoading && <Loader2 className="size-4 animate-spin" />}
        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </button>

      <div className="text-center">
        <button
          type="button"
          className="text-xs text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </form>
  );
}
