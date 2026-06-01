import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './app/router.tsx'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SettingsProvider } from './provider/SettingsProvider.tsx'
import AppThemeProvider from './provider/AppThemeProvider.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './provider/QueryClientProvider.tsx'
import { AuthProvider } from './provider/AuthProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <SettingsProvider>
        <AppThemeProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <AppRouter />
            </AuthProvider>
          </QueryClientProvider>
        </AppThemeProvider>
      </SettingsProvider>
    </LocalizationProvider>
  </StrictMode>,
)
