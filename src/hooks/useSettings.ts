import { createContext, useContext } from "react"
import type { Settings } from "../services/settings/settigns.type"

interface SettingsContextType {
    settings: Settings | null
    setSettings: (settings: Settings) => void
    loading: boolean
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const useSettings = () => {
    const context = useContext(SettingsContext)

    if (!context) {
        throw new Error('useSettings debe usarse dentro de SettingsProvider')
    }

    return context
}