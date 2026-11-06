import { useContext } from "react";
import { TerminologyContext } from "../context/TerminologyContext";

export function useTerminology() {
    const context = useContext(TerminologyContext);

    if (!context) {
        throw new Error(
            "useTerminology debe utilizarse dentro de TerminologyProvider"
        );
    }

    return context;
}