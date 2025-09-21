"use client"
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@/theme'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline /> {}
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
