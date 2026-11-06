import { createContext } from "react";
import type { TerminologyContextType } from "../types/terminology.types";

export const TerminologyContext =
    createContext<TerminologyContextType | null>(null);