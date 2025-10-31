"use client"
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@/theme'
import ResponsiveAppBar from '@/components/AppBar'
import RouteGuard from '@/components/RouteGuard'
import { AuthProvider } from '@/context/AuthContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <RouteGuard>
              <ResponsiveAppBar />
              {children}
            </RouteGuard>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
