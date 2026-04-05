import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './app/router.tsx'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SettingsProvider } from './provider/SettingsProvider.tsx'
import AppThemeProvider from './provider/AppThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <SettingsProvider>
        <AppThemeProvider>
          <AppRouter />
        </AppThemeProvider>
      </SettingsProvider>
    </LocalizationProvider>
  </StrictMode>,
)
