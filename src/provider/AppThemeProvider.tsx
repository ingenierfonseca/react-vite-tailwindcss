import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useSettings } from '../hooks/useSettings'
import { useMediaQuery } from '@mui/system';


export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const { settings } = useSettings()
    // 1. Detecta automáticamente si el sistema está en modo oscuro
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const mode = prefersDarkMode ? 'dark' : 'light';

    const theme = createTheme({
        palette: {
            mode: mode,
            primary: {
                main: settings.branding.primaryColor,
                dark: settings.branding.primaryDarkColor,
            },
            secondary: {
                main: settings.branding.secondaryColor,
            },
        },
        components: {
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                             borderColor: settings.branding.borderColor || (mode === 'dark' ? '#444' : '#ccc'),
                            },
                            '&:hover fieldset': {
                             borderColor: settings.branding.borderHover || '#666',
                            },
                            '&.Mui-focused fieldset': {
                             borderColor: settings.branding.primaryColor || '#90caf9',
                            },
                        },
                    },
                },
            },
        },
    })

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
