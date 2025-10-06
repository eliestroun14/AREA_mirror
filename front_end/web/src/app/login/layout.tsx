"use client"
import { Box } from '@mui/material'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: '100vh',
        bgcolor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        overflow: 'hidden',
      }}
    >
      {children}
    </Box>
  )
}
