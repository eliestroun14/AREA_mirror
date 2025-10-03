"use client"
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'

export default function CreateTriggersPage() {
  const params = useParams()
  const router = useRouter()
  const serviceName = decodeURIComponent(params.name as string)

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 4, bgcolor: "#FFFFFF", minHeight: "calc(100vh - 64px)" }}>
        <Typography variant="h3" align="center" color="primary.main" gutterBottom>
          Create trigger for {serviceName}
        </Typography>
        
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Configure your trigger settings
        </Typography>
        
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            sx={{ color: 'primary.main', borderColor: 'primary.main' }}
            onClick={() => router.back()}
          >
            Back
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
