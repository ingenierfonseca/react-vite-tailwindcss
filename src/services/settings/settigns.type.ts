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
    bgSidebar: string
    bgSidebarItem: string
    sidebarItemText: string
    sidebarItemTextActive: string
    version: string
}

export function data(): Settings {
    return {
        id: 1,
        appName: "Clinica Fonseca",
        appLogoUrl: "https://res.cloudinary.com/dzj6l8n0v/image/upload/v1700000000/clinica-fonseca/logo.png",
        appFaviconUrl: "https://res.cloudinary.com/dzj6l8n0v/image/upload/v1700000000/clinica-fonseca/favicon.ico",
        primaryColor: "#16236d",
        secondaryColor: "#FBBF24",
        borderColor: "#0e46cb",
        borderHover: "#FBBF24",
        bgSidebar: "#16236d",
        bgSidebarItem: "#556ade",
        sidebarItemText: "#9ca9e1",
        sidebarItemTextActive: "#fff",
        version: "1.0.0"
    }
}