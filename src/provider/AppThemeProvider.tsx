import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useSettings } from '../hooks/useSettings'


export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const { settings } = useSettings()

    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: settings?.primaryColor || '#1976d2',
            },
        },
        components: {
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: settings?.borderColor || '#444',
                            },
                            '&:hover fieldset': {
                                borderColor: settings?.borderHover || '#666',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: settings?.primaryColor || '#90caf9',
                            },
                        },
                    },
                },
            },
        },
    })

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}