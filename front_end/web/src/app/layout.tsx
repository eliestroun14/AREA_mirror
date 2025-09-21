"use client"
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@/theme'
import ResponsiveAppBar from '@/components/AppBar'
import { AuthProvider } from '@/context/AuthContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <ResponsiveAppBar />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
