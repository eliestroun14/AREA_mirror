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
    const foundService = database.find(
      (item) => item.name.toLowerCase() === serviceName.toLowerCase()
    )
    setService(foundService || null)
    setLoading(false)
  }, [serviceName])

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ p: 4, bgcolor: "#f5ffff", minHeight: "calc(100vh - 64px)" }}>
          <Typography variant="h4" align="center" color="#005acd">
            Chargement...
          </Typography>
        </Box>
      </Container>
    )
  }

  if (!service) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ p: 4, bgcolor: "#f5ffff", minHeight: "calc(100vh - 64px)" }}>
          <Typography variant="h4" align="center" color="#005acd" gutterBottom>
            Service non trouvé
          </Typography>
          <Typography variant="body1" align="center" color="black">
            Le service "{serviceName}" n'existe pas dans notre base de données.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              sx={{ bgcolor: '#005acd' }}
              href="/create/applets"
            >
              Retour aux services
            </Button>
          </Box>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 4, bgcolor: "#f5ffff", minHeight: "calc(100vh - 64px)" }}>
        <Typography variant="h3" align="center" color="#005acd" gutterBottom>
          {service.name}
        </Typography>

        <Card
          sx={{
            maxWidth: 600,
            mx: 'auto',
            mt: 4,
            boxShadow: '0 8px 32px rgba(0, 90, 205, 0.15)',
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
            <Typography variant="h4" color="#005acd" gutterBottom>
              {service.name}
            </Typography>
            <Chip
              label={service.actionType}
              sx={{
                bgcolor: 'rgba(0, 90, 205, 0.1)',
                color: '#005acd',
                fontWeight: 600,
                mb: 3
              }}
            />

            <Typography variant="body1" color="text.secondary" paragraph>
              Utilisez {service.name} pour automatiser vos tâches.
              Action disponible : {service.actionType.toLowerCase()}.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                sx={{ bgcolor: '#005acd' }}
                size="large"
              >
                Configurer l'applet
              </Button>
              <Button
                variant="outlined"
                sx={{ color: '#005acd', borderColor: '#005acd' }}
                href="/create/applets"
              >
                Retour aux services
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" color="#005acd" gutterBottom align="center">
            Comment utiliser ce service
          </Typography>
          <Card sx={{ mt: 3, p: 3 }}>
            <Typography variant="h6" color="#005acd" gutterBottom>
              Action disponible : {service.actionType}
            </Typography>
            <Typography variant="body1" paragraph>
              Ce service vous permet d'automatiser l'action "{service.actionType}"
              via votre compte {service.name}.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connectez votre compte {service.name} pour commencer à créer des applets
              automatisés et gagner du temps dans vos tâches quotidiennes.
            </Typography>
          </Card>
        </Box>
      </Box>
    </Container>
  )
}
