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
import { apiService } from '@/services/api'
import { ServiceDTO, ActionDTO } from '@/types/api'

export default function ServiceActionsPage() {
  const params = useParams()
  const router = useRouter()
  const zapId = params.id as string
  const serviceId = params.serviceId as string
  const [actions, setActions] = useState<ActionDTO[]>([])
  const [service, setService] = useState<ServiceDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleBackClick = () => {
    router.push(`/create/${zapId}/actions`)
  }

  const handleActionClick = (actionId: number) => {
    router.push(`/create/${zapId}/actions/${serviceId}/${actionId}`)
  }

  useEffect(() => {
    const fetchServiceAndActions = async () => {
      try {
        setLoading(true)
        setError(null)

        const serviceData = await apiService.getServiceById(Number(serviceId))
        setService(serviceData)

        const actionsData = await apiService.getActionsByService(serviceId)
        setActions(actionsData)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setService(null)
        setActions([])
      } finally {
        setLoading(false)
      }
    }

    if (serviceId) {
      fetchServiceAndActions()
    }
  }, [serviceId])

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: service?.services_color || '#ffffffff',
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
          bgcolor: '#ffffffff',
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
          sx={{ bgcolor: 'white', color: '#ffffffff' }}
        >
          Go Back
        </Button>
      </Box>
    )
  }

  const serviceColor = service.services_color

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: 'white',
        position: 'relative'
      }}
    >
      {/* Header section with service color */}
      <Box
        sx={{
          bgcolor: serviceColor,
          pb: 6
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
          Choose an action
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            {service.icon_url ? (
              <Box
                component="img"
                src={service.icon_url}
                alt={service.name}
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: 'contain'
                }}
              />
            ) : (
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
                  {service.name.charAt(0).toUpperCase()}
                </Typography>
              </Box>
            )}
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'white'
            }}
          >
            {service.name}
          </Typography>
        </Box>
      </Box>

      {/* Content section with white background */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {actions.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              px: 4
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: '#333',
                fontWeight: 600,
                mb: 2,
                textAlign: 'center'
              }}
            >
              No actions available
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                textAlign: 'center',
                mb: 4
              }}
            >
              This service doesn&apos;t have any actions configured yet.
            </Typography>
            <Button
              onClick={handleBackClick}
              variant="contained"
              sx={{
                bgcolor: serviceColor,
                color: 'white',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                '&:hover': {
                  bgcolor: serviceColor,
                  opacity: 0.9
                }
              }}
            >
              Choose another service
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(3, 1fr)'
                },
                gap: 4,
                width: '100%',
                maxWidth: '1200px'
              }}
            >
              {actions.map((action) => (
                <Card
                  key={action.id}
                  sx={{
                    borderRadius: 4,
                    bgcolor: serviceColor,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '300px',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                      transform: 'translateY(-4px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <CardActionArea
                    onClick={() => handleActionClick(action.id)}
                    sx={{
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start'
                    }}
                  >
                    <CardContent sx={{ p: 0, width: '100%' }}>
                      <Typography
                        variant="h5"
                        sx={{
                          color: 'white',
                          fontWeight: 700,
                          mb: 2,
                          fontSize: { xs: '1.5rem', md: '1.75rem' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          textAlign: 'left'
                        }}
                      >
                        {action.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          lineHeight: 1.5,
                          fontSize: { xs: '1.1rem', md: '1.2rem' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          textAlign: 'left'
                        }}
                      >
                        {action.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  )
}
