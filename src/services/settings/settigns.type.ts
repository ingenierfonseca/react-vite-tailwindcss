import { Settings } from "lucide-react"

export interface Settings {
    id: number
    appName: string
    appLogoUrl: string
    appFaviconUrl: string
    primaryColor: string
    secondaryColor: string
    borderColor: string
    borderHover: string
    version: string
}

export function data(): Settings {
    return {
        id: 1,
        appName: "Clinica Fonseca",
        appLogoUrl: "https://res.cloudinary.com/dzj6l8n0v/image/upload/v1700000000/clinica-fonseca/logo.png",
        appFaviconUrl: "https://res.cloudinary.com/dzj6l8n0v/image/upload/v1700000000/clinica-fonseca/favicon.ico",
        primaryColor: "#ED1818",
        secondaryColor: "#FBBF24",
        borderColor: "#ED1818",
        borderHover: "#FBBF24",
        version: "1.0.0"
    }
}