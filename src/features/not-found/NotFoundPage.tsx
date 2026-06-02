import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <h1 className="text-8xl font-bold text-slate-300 dark:text-slate-600">404</h1>
      <p className="text-xl text-slate-500 dark:text-slate-400">Página no encontrada</p>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
      >
        <ArrowLeft size={18} />
        Volver
      </button>
    </div>
  );
}
