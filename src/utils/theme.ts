//export default const buttonPage = 'px-3 py-1 rounded-md bg-blue-300 text-black text-sm'
//const dropDownStyle = 'ml-1 mt-2 p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-black font-bold'

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Función auxiliar para combinar clases de Tailwind sin conflictos
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const inputDefault = "w-full px-3 py-2 appearance-none border border-slate-300 bg-white/80"
export const theme = {
  // Estilos para Botones
  button: {
    base: "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
    size: {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
      icon: "p-2.5",
    },
    variant: {
      primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",
      outline: "border border-slate-200 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300",
      ghost: "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
      danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
    }
  },
  buttonPage: 'px-3 py-1 rounded-md bg-blue-300 text-black text-sm',
  dropDownStyle: 'ml-1 mt-2 p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-black font-bold',

  // Estilos para Dropdowns / Menús flotantes (Glassmorphism)
  dropdown: {
    content: `${inputDefault}`,// dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80
    item: "flex cursor-pointer select-none items-center px-3 py-2 text-sm text-black outline-none hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors",
    label: "px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500",
    separator: "my-1 h-px bg-slate-200/50 dark:bg-slate-700/50"
  },
  calendar: {
    content: `${inputDefault}`
  },
  inputtext: {
    content: `${inputDefault}`
  },
  labelform: "font-bold p-1 text-xs text-black"
};