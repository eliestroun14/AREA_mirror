"use client"
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'

export default function ActionsPage() {
  const params = useParams()
  const router = useRouter()
  const serviceName = decodeURIComponent(params.name as string)

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 4, bgcolor: "#f5ffff", minHeight: "calc(100vh - 64px)" }}>
        <Typography variant="h3" align="center" color="#005acd" gutterBottom>
          Choose an action
        </Typography>
        
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Select an action for {serviceName}
        </Typography>
        
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            sx={{ color: '#005acd', borderColor: '#005acd' }}
            onClick={() => router.back()}
          >
            Back
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
