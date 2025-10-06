"use client"
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import { apiService } from '@/services/api'
import { ServiceDTO, ActionDTO, TriggerDTO } from '@/types/api'
import { ServiceImage } from '@/components/ServiceImage'

export default function ServicePage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.id as string
  const [service, setService] = useState<ServiceDTO | null>(null)
  const [actions, setActions] = useState<ActionDTO[]>([])
  const [triggers, setTriggers] = useState<TriggerDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleBackClick = () => {
    router.push('/explore')
  }

  const getActionColor = (baseColor: string): string => {
    if (baseColor.startsWith('#')) {
      const r = parseInt(baseColor.slice(1, 3), 16)
      const g = parseInt(baseColor.slice(3, 5), 16)
      const b = parseInt(baseColor.slice(5, 7), 16)
      const factor = 0.7
      return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`
    }
    return '#ff6900'
  }

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const serviceData = await apiService.getServiceById(parseInt(serviceId))
        if (!serviceData) {
          setError('Service not found')
          return
        }
        
        setService(serviceData)
        
        const [actionsData, triggersData] = await Promise.all([
          apiService.getActionsByService(serviceData.id.toString()),
          apiService.getTriggersByService(serviceData.id.toString())
        ])
        
        setActions(actionsData)
        setTriggers(triggersData)
      } catch (err) {
        console.error('Error fetching service data:', err)
        setError('Failed to load service data')
      } finally {
        setLoading(false)
      }
    }

    fetchServiceData()
  }, [serviceId])

  if (loading) {
    return (
      <Box sx={{ 
        bgcolor: "#4285f4",
        minHeight: "100vh",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress sx={{ color: 'white' }} size={60} />
      </Box>
    )
  }

  if (error || !service) {
    return (
      <Box sx={{ 
        bgcolor: "#4285f4",
        minHeight: "100vh",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4
      }}>
        <Typography variant="h4" align="center" color="white" gutterBottom>
          {error || 'Service not found'}
        </Typography>
        <Typography variant="body1" align="center" color="white" sx={{ mb: 4 }}>
          The service with ID &quot;{serviceId}&quot; could not be loaded.
        </Typography>
        <Button 
          variant="contained" 
          sx={{ 
            bgcolor: 'white', 
            color: '#4285f4',
            '&:hover': { bgcolor: '#f0f0f0' }
          }}
          onClick={handleBackClick}
        >
          Back to Explore
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Header Section - Couleur du service */}
      <Box sx={{ 
        bgcolor: service.services_color,
        color: "white",
        py: 6,
        px: 3,
        textAlign: 'center'
      }}>
        <Button
          sx={{ 
            position: 'absolute',
            top: 80,
            left: 20,
            color: 'white',
            border: '1px solid white',
            borderRadius: '25px',
            px: 3
          }}
          onClick={handleBackClick}
        >
          Back
        </Button>

        {/* Service Icon */}
        <Box sx={{ 
          width: 120, 
          height: 120, 
          mx: 'auto', 
          mb: 3,
          borderRadius: '50%',
          overflow: 'hidden',
          bgcolor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ServiceImage
            service={{
              name: service.name,
              icon_url: service.icon_url,
              services_color: service.services_color
            }}
            height={120}
          />
        </Box>

        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
          Automate your {service.name} integrations
        </Typography>
        
        <Typography variant="h6" sx={{ maxWidth: 600, mx: 'auto', mb: 4, opacity: 0.9, color: 'white' }}>
          AREA allows you to automate your {service.name} workflow, enabling you to track issues,
          pull requests, and repositories automatically. Connect {service.name} with other services to
          streamline your development process and enhance productivity.
        </Typography>

      </Box>

      {/* Content Section */}
      <Box sx={{ bgcolor: "#f8f9fa" }}>
        <Container maxWidth="lg">
          <Box sx={{ pt: 4, pb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
              Popular {service.name} workflows & automations
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
              {/* Triggers Section */}
              <Box sx={{ flex: 1 }}>
                <Card sx={{ 
                  height: '100%',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  borderRadius: 3
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <FlashOnIcon sx={{ color: service.services_color || '#4285f4', mr: 1, fontSize: '2rem' }} />
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Available Triggers
                      </Typography>
                    </Box>
                    
                    {triggers.length > 0 ? (
                      <List>
                        {triggers.map((trigger, index) => (
                          <div key={trigger.id}>
                            <ListItem sx={{ py: 2 }}>
                              <ListItemIcon>
                                <FlashOnIcon sx={{ color: service.services_color || '#4285f4' }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={trigger.name}
                                secondary={trigger.description}
                                primaryTypographyProps={{ fontWeight: 'medium' }}
                              />
                            </ListItem>
                            {index < triggers.length - 1 && <Divider />}
                          </div>
                        ))}
                      </List>
                    ) : (
                      <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        No triggers available for this service yet.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>

              {/* Actions Section */}
              <Box sx={{ flex: 1 }}>
                <Card sx={{ 
                  height: '100%',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  borderRadius: 3
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <PlayArrowIcon sx={{ color: getActionColor(service.services_color), mr: 1, fontSize: '2rem' }} />
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Available Actions
                      </Typography>
                    </Box>
                    
                    {actions.length > 0 ? (
                      <List>
                        {actions.map((action, index) => (
                          <div key={action.id}>
                            <ListItem sx={{ py: 2 }}>
                              <ListItemIcon>
                                <PlayArrowIcon sx={{ color: getActionColor(service.services_color) }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={action.name}
                                secondary={action.description}
                                primaryTypographyProps={{ fontWeight: 'medium' }}
                              />
                            </ListItem>
                            {index < actions.length - 1 && <Divider />}
                          </div>
                        ))}
                      </List>
                    ) : (
                      <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        No actions available for this service yet.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
