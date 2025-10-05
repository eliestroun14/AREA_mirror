"use client"

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { apiService } from '@/services/api'

export default function CreatePage() {
  const router = useRouter()
  const hasCreatedZap = useRef(false)

  useEffect(() => {
    const createZapAndRedirect = async () => {
      if (hasCreatedZap.current) {
        console.log('Zap creation already in progress')
        return
      }

      hasCreatedZap.current = true

      try {
        console.log('Creating new zap...')
        const newZap = await apiService.createZap()
        console.log('Zap created with ID:', newZap.id)
        router.push(`/create/${newZap.id}`)
      } catch (error) {
        console.error('Failed to create zap:', error)
        hasCreatedZap.current = false
      }
    }

    createZapAndRedirect()
  }, [router])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        bgcolor: 'white'
      }}
    >
      <CircularProgress size={60} sx={{ mb: 3 }} />
      <Typography variant="h5" color="text.primary" gutterBottom>
        Creating your new applet...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Please wait a moment
      </Typography>
    </Box>
  )
}
