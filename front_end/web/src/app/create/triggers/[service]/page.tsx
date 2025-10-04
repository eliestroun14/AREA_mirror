"use client"
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import CircularProgress from '@mui/material/CircularProgress'

interface Trigger {
  id: number
  name: string
  description: string
}

interface Service {
  id: number
  name: string
  image: string
  service_color: string
  actionType: string
}

export default function TriggersPage() {
  const params = useParams()
  const router = useRouter()
  const serviceName = decodeURIComponent(params.service as string)
  const [triggers, setTriggers] = useState<Trigger[]>([])
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleBackClick = () => {
    router.push('/create/applets')
  }

  const handleTriggerClick = (triggerName: string) => {
    router.push(`/create/triggers/${encodeURIComponent(serviceName)}/${encodeURIComponent(triggerName)}`)
  }

  useEffect(() => {
    const fetchServiceAndTriggers = async () => {
      try {
        setLoading(true)
        setError(null)

        const servicesResponse = await fetch('http://localhost:8080/services')
        if (!servicesResponse.ok) {
          throw new Error('Failed to fetch services')
        }
        const services = await servicesResponse.json()
        
        const foundService = services.find((s: Service) => s.name === serviceName)
        if (!foundService) {
          throw new Error(`Service "${serviceName}" not found`)
        }
        
        setService(foundService)

        const triggersResponse = await fetch(`http://localhost:8080/services/${foundService.id}/triggers`)
        if (!triggersResponse.ok) {
          throw new Error('Failed to fetch triggers')
        }
        const triggersData = await triggersResponse.json()
        
        setTriggers(triggersData)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        
        try {
          const { default: database } = await import('@/data/database.json')
          const fallbackService = database.services.find(s => s.name === serviceName)
          if (fallbackService) {
            setService(fallbackService)
            setTriggers(fallbackService.triggers || [])
          }
        } catch (fallbackErr) {
          console.error('Fallback failed:', fallbackErr)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchServiceAndTriggers()
  }, [serviceName])

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: '#FF8A00',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress sx={{ color: 'white' }} size={60} />
      </Box>
    )
  }

  if (error && !service) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: '#FF8A00',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4
        }}
      >
        <Typography variant="h4" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
          Service not found
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
          {error}
        </Typography>
        <Button
          onClick={handleBackClick}
          variant="contained"
          sx={{ bgcolor: 'white', color: '#FF8A00' }}
        >
          Go Back
        </Button>
      </Box>
    )
  }

  const serviceColor = service?.service_color || '#FF8A00'

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: serviceColor,
        position: 'relative'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
          pt: 4
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          sx={{
            color: 'white',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            borderRadius: 6,
            px: 3,
            py: 1,
            border: '2px solid white',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Back
        </Button>
        
        <Button
          sx={{
            minWidth: 44,
            height: 44,
            borderRadius: '50%',
            color: 'white',
            border: '2px solid white',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <HelpOutlineIcon />
        </Button>
      </Box>

      <Typography 
        variant="h3" 
        sx={{ 
          fontWeight: 700, 
          color: 'white',
          fontSize: { xs: '2rem', md: '3rem' },
          textAlign: 'center',
          mb: 6
        }}
      >
        Choose a trigger
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
        <Box
          sx={{
            width: 120,
            height: 120,
            bgcolor: 'white',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
          }}
        >
          <Box
            component="div"
            sx={{
              width: 80,
              height: 80,
              bgcolor: serviceColor,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography 
              variant="h3" 
              sx={{ 
                color: 'white',
                fontWeight: 700 
              }}
            >
              {serviceName.charAt(0).toUpperCase()}
            </Typography>
          </Box>
        </Box>
        
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'white',
            mb: 8
          }}
        >
          {serviceName}
        </Typography>
      </Box>

      <Container maxWidth="md">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(300px, 1fr))' },
            gap: 3,
            pb: 6
          }}
        >
          {triggers.map((trigger) => (
            <Card
              key={trigger.id}
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-4px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <CardActionArea
                onClick={() => handleTriggerClick(trigger.name)}
                sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <CardContent sx={{ p: 0, width: '100%' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'black',
                      fontWeight: 600,
                      mb: 2,
                      fontSize: '1.2rem'
                    }}
                  >
                    {trigger.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666666',
                      lineHeight: 1.6,
                      fontSize: '0.95rem'
                    }}
                  >
                    {trigger.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
