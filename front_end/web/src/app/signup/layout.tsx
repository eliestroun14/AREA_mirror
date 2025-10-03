"use client"
import { ThemeProvider, CssBaseline, Box } from '@mui/material'
import theme from '@/theme'
import { AuthProvider } from '@/context/AuthContext'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ overflow: 'hidden', height: '100vh' }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <Box
              sx={{
                minHeight: '100vh',
                height: '100vh',
                bgcolor: '#f5ffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                overflow: 'hidden',
              }}
            >
              {children}
            </Box>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
