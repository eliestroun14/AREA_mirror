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
import CircularProgress from '@mui/material/CircularProgress'

interface Action {
  id: number
  name: string
  description: string
  fields: ActionField[]
}

interface ActionField {
  name: string
  label: string
  type: string
  required: boolean
  placeholder?: string
  options?: string[]
  default?: string
}

interface Service {
  id: number
  name: string
  service_color: string
  actions: Action[]
}

export default function ServiceActionsPage() {
  const params = useParams()
  const router = useRouter()
  const serviceName = params.service as string
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleBackClick = () => {
    router.push('/create/actions')
  }

  const handleActionClick = (actionId: number) => {
    router.push(`/create/actions/${serviceName}/${actionId}`)
  }

  useEffect(() => {
    const fetchServiceActions = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fallback vers les données locales
        const { default: database } = await import('@/data/database.json')
        const foundService = database.services.find(
          s => s.name.toLowerCase() === serviceName.toLowerCase()
        )
        
        if (foundService) {
          setService(foundService as Service)
        } else {
          setError('Service not found')
        }
        
      } catch (err) {
        console.error('Error fetching service actions:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchServiceActions()
  }, [serviceName])

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: service?.service_color || '#4285F4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress sx={{ color: 'white' }} size={60} />
      </Box>
    )
  }

  if (error || !service) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="h6" color="error">
          {error || 'Service not found'}
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: service.service_color,
        color: 'white'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ position: 'relative', mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBackClick}
              sx={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
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

            <Box sx={{ textAlign: 'center' }}>
              {/* Service Icon */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'white',
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}
              >
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: service.service_color,
                    fontWeight: 700 
                  }}
                >
                  {service.name.charAt(0)}
                </Typography>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '3rem' },
                  mb: 1
                }}
              >
                {service.name}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  opacity: 0.9
                }}
              >
                Choose an action
              </Typography>
            </Box>
          </Box>

          {/* Actions List */}
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {service.actions && service.actions.length > 0 ? (
              service.actions.map((action) => (
                <Card
                  key={action.id}
                  sx={{
                    mb: 3,
                    borderRadius: 4,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    overflow: 'hidden'
                  }}
                >
                  <CardActionArea
                    onClick={() => handleActionClick(action.id)}
                    sx={{ p: 4 }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: 'black',
                          mb: 2
                        }}
                      >
                        {action.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.6
                        }}
                      >
                        {action.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))
            ) : (
              <Card
                sx={{
                  borderRadius: 4,
                  textAlign: 'center',
                  p: 6
                }}
              >
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  No actions available
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This service doesn&apos;t have any configured actions yet.
                </Typography>
              </Card>
            )}

            {/* Suggest New Action Card */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 4,
                border: '2px dashed rgba(255, 255, 255, 0.3)',
                bgcolor: 'transparent',
                boxShadow: 'none'
              }}
            >
              <CardActionArea sx={{ p: 4 }}>
                <CardContent sx={{ p: 0, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        color: 'white',
                        fontWeight: 400
                      }}
                    >
                      +
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: 'white',
                      mb: 1
                    }}
                  >
                    Suggest a new action
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    Don&apos;t see what you&apos;re looking for?
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
