"use client"
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import database from '@/data/database.json'

interface Service {
  name: string
  image: string
  actionType: string
}

export default function ServicePage() {
  const params = useParams()
  const serviceName = decodeURIComponent(params.name as string)
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const foundService = database.services.find(
      (item) => item.name.toLowerCase() === serviceName.toLowerCase()
    )
    setService(foundService || null)
    setLoading(false)
  }, [serviceName])

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ p: 4, bgcolor: "#FFFFFF", minHeight: "calc(100vh - 64px)" }}>
          <Typography variant="h4" align="center" color="primary.main">
            Loading...
          </Typography>
        </Box>
      </Container>
    )
  }

  if (!service) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ p: 4, bgcolor: "#FFFFFF", minHeight: "calc(100vh - 64px)" }}>
          <Typography variant="h4" align="center" color="primary.main" gutterBottom>
            Service not found
          </Typography>
          <Typography variant="body1" align="center" color="black">
            The service &quot;{serviceName}&quot; does not exist in our database.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              sx={{ bgcolor: 'primary.main' }}
              href="/create/applets"
            >
              Back to services
            </Button>
          </Box>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 4, bgcolor: "#FFFFFF", minHeight: "calc(100vh - 64px)" }}>
        <Typography variant="h3" align="center" color="primary.main" gutterBottom>
          {service.name}
        </Typography>

        <Card
          sx={{
            maxWidth: 600,
            mx: 'auto',
            mt: 4,
            boxShadow: '0 8px 32px rgba(255, 105, 0, 0.15)',
            borderRadius: 3
          }}
        >
          <CardMedia
            component="img"
            height="200"
            image={`/assets/${service.image}`}
            alt={service.name}
            sx={{ objectFit: 'contain', p: 2 }}
          />
          <CardContent sx={{ textAlign: 'center', pb: 4 }}>
            <Typography variant="h4" color="primary.main" gutterBottom>
              {service.name}
            </Typography>
            <Chip
              label={service.actionType}
              sx={{
                bgcolor: 'rgba(255, 105, 0, 0.1)',
                color: 'primary.main',
                fontWeight: 600,
                mb: 3
              }}
            />

            <Typography variant="body1" color="text.secondary" paragraph>
              Use {service.name} to automate your tasks.
              Available action: {service.actionType.toLowerCase()}.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                sx={{ bgcolor: 'primary.main' }}
                size="large"
                href={`/triggers/${encodeURIComponent(service.name)}`}
              >
                View triggers
              </Button>
              <Button
                variant="outlined"
                sx={{ color: 'primary.main', borderColor: 'primary.main' }}
                size="large"
              >
                Configure applet
              </Button>
              <Button
                variant="outlined"
                sx={{ color: 'primary.main', borderColor: 'primary.main' }}
                href="/create/applets"
              >
                Back to services
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" color="primary.main" gutterBottom align="center">
            How to use this service
          </Typography>
          <Card sx={{ mt: 3, p: 3 }}>
            <Typography variant="h6" color="primary.main" gutterBottom>
              Available action: {service.actionType}
            </Typography>
            <Typography variant="body1" paragraph>
              This service allows you to automate the &quot;{service.actionType}&quot; action
              via your {service.name} account.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connect your {service.name} account to start creating automated applets
              and save time in your daily tasks.
            </Typography>
          </Card>
        </Box>
      </Box>
    </Container>
  )
}
