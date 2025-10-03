"use client"
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import database from '@/data/database.json'

interface Trigger {
  id: number
  name: string
  description: string
  trigger_type: string
  polling_interval?: number
  fields: string[]
  variables: string[]
}

interface Service {
  id: number
  name: string
  image: string
  service_color: string
  actionType: string
  triggers: Trigger[]
}

export default function TriggersPage() {
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

  const handleTriggerSelect = (trigger: Trigger) => {
    // TODO: Navigate to action selection page or handle trigger selection
    console.log('Selected trigger:', trigger)
  }

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
        {/* Header avec titre principal */}
        <Typography variant="h3" align="center" color="primary.main" gutterBottom sx={{ mb: 4 }}>
          Choose a trigger
        </Typography>

        {/* Service Info Section */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          mb: 4,
          p: 3,
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 16px rgba(255, 105, 0, 0.1)'
        }}>
          <Avatar
            src={`/assets/${service.image}`}
            alt={service.name}
            sx={{ 
              width: 64, 
              height: 64, 
              mr: 3,
              bgcolor: service.service_color,
              '& img': {
                objectFit: 'contain'
              }
            }}
          />
          <Box>
            <Typography variant="h4" color="primary.main" sx={{ mb: 1 }}>
              {service.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Select a trigger to start your automation
            </Typography>
          </Box>
        </Box>

        {/* Triggers Grid */}
        {service.triggers && service.triggers.length > 0 ? (
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)' 
            },
            gap: 3
          }}>
            {service.triggers.map((trigger) => (
              <Card
                key={trigger.id}
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
                  },
                  border: '1px solid',
                  borderColor: 'rgba(255, 105, 0, 0.1)',
                  borderRadius: 3
                }}
              >
                <CardActionArea
                  onClick={() => handleTriggerSelect(trigger)}
                  sx={{ height: '100%', p: 0 }}
                >
                  <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
                    {/* Trigger Type Badge */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Chip
                        label={trigger.trigger_type}
                        size="small"
                        sx={{
                          bgcolor: trigger.trigger_type === 'Webhook' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                          color: trigger.trigger_type === 'Webhook' ? '#4CAF50' : '#FF9800',
                          fontWeight: 600
                        }}
                      />
                      {trigger.polling_interval && (
                        <Chip
                          label={`${trigger.polling_interval}s`}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            borderColor: service.service_color,
                            color: service.service_color 
                          }}
                        />
                      )}
                    </Box>

                    {/* Trigger Name */}
                    <Typography 
                      variant="h6" 
                      color="primary.main" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600,
                        mb: 1.5,
                        minHeight: '1.5em'
                      }}
                    >
                      {trigger.name}
                    </Typography>

                    {/* Trigger Description */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        flexGrow: 1,
                        mb: 2,
                        lineHeight: 1.5
                      }}
                    >
                      {trigger.description}
                    </Typography>

                    {/* Variables Info */}
                    {trigger.variables && trigger.variables.length > 0 && (
                      <Box sx={{ mt: 'auto' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                          Available variables: {trigger.variables.length}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {trigger.variables.slice(0, 3).map((variable, index) => (
                            <Chip
                              key={index}
                              label={variable}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                fontSize: '0.7rem',
                                height: '20px',
                                borderColor: 'rgba(0, 0, 0, 0.2)',
                                color: 'primary.main'
                              }}
                            />
                          ))}
                          {trigger.variables.length > 3 && (
                            <Chip
                              label={`+${trigger.variables.length - 3}`}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                fontSize: '0.7rem',
                                height: '20px',
                                borderColor: 'rgba(0, 0, 0, 0.2)',
                                color: 'primary.main'
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No triggers available
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              This service does not have any configured triggers yet.
            </Typography>
            <Button
              variant="contained"
              sx={{ bgcolor: 'primary.main' }}
              href="/create/applets"
            >
              Back to services
            </Button>
          </Box>
        )}

        {/* Back Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            sx={{ 
              color: 'primary.main', 
              borderColor: 'primary.main',
              '&:hover': {
                borderColor: '#333333',
                bgcolor: 'rgba(255, 105, 0, 0.04)'
              }
            }}
            href="/create/applets"
          >
            Back to services
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
