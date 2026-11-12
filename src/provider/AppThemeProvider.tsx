import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useSettings } from '../hooks/useSettings'
import { useMediaQuery } from '@mui/system';
import type {} from '@mui/x-date-pickers/themeAugmentation';


export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const { settings } = useSettings()
    // 1. Detecta automáticamente si el sistema está en modo oscuro
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const mode = prefersDarkMode ? 'dark' : 'light';
    const inputBackground = mode === 'dark' ? '#1e293b' : '#f8fafc';
    const disabledInputBackground = mode === 'dark' ? '#252f3f' : '#f1f5f9';
    const borderColor = settings.branding.borderColor || (mode === 'dark' ? '#444' : '#ccc');
    const borderHoverColor = settings.branding.borderHover || '#666';
    const primaryColor = settings.branding.primaryColor || '#90caf9';

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
                            backgroundColor: inputBackground,
                            '& fieldset': {
                             borderColor,
                            },
                            '&:hover fieldset': {
                             borderColor: borderHoverColor,
                            },
                            '&.Mui-focused fieldset': {
                             borderColor: primaryColor,
                            },
                        },
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        backgroundColor: inputBackground,

                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor,
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: borderHoverColor,
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: primaryColor,
                        },

                        '&.Mui-disabled': {
                            backgroundColor: disabledInputBackground,
                        },
                    },
                },
            },
            MuiPickersTextField: {
                styleOverrides: {
                    root: {
                        width: '100%',
                    },
                },
            },
            MuiPickersOutlinedInput: {
                styleOverrides: {
                    root: {
                        backgroundColor: inputBackground,
                        '&:hover .MuiPickersOutlinedInput-notchedOutline': {
                            borderColor: borderHoverColor,
                        },
                        '&.MuiPickersInputBase-focused:not(.MuiPickersInputBase-error) .MuiPickersOutlinedInput-notchedOutline': {
                            borderColor: primaryColor,
                        },
                        '&.MuiPickersInputBase-disabled': {
                            backgroundColor: disabledInputBackground,
                        },
                        '&.MuiPickersInputBase-disabled .MuiPickersOutlinedInput-notchedOutline': {
                            borderColor,
                        },
                    },
                    notchedOutline: {
                        borderColor,
                    },
                },
            },
        },
    })

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
