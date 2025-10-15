"use client"
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@/theme'
import ResponsiveAppBar from '@/components/AppBar'
import TestStateComponent from '@/components/TestStateComponent'
import RouteGuard from '@/components/RouteGuard'
import RouteDebugComponent from '@/components/RouteDebugComponent'
import { AuthProvider } from '@/context/AuthContext'
import { GlobalStateProvider } from '@/context/GlobalStateContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <GlobalStateProvider>
              <RouteGuard>
                <ResponsiveAppBar />
                <TestStateComponent />
                <RouteDebugComponent />
                {children}
              </RouteGuard>
            </GlobalStateProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
