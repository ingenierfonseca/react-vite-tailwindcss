import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './app/router.tsx'
import { SettingsProvider } from './provider/SettingsProvider.tsx'
import AppThemeProvider from './provider/AppThemeProvider.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './provider/QueryClientProvider.tsx'
import { AuthProvider } from './provider/AuthProvider.tsx'
import { LanguageProvider, LanguageRuntimeProvider } from '@/core/i18n/LanguageProvider'
import "@/core/i18n"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <SettingsProvider>
        <AppThemeProvider>
          <QueryClientProvider client={queryClient}>
            <LanguageRuntimeProvider>
              <AuthProvider>
                <AppRouter />
              </AuthProvider>
            </LanguageRuntimeProvider>
          </QueryClientProvider>
        </AppThemeProvider>
      </SettingsProvider>
    </LanguageProvider>
  </StrictMode>,
)
