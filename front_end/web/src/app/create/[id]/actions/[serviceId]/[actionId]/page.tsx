"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Container from '@mui/material/Container'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { apiService } from '@/services/api'
import { useAuth } from '@/context/AuthContext'
import { ActionDTO, ServiceDTO, ConnectionDTO } from '@/types/api'

interface ActionField {
  name: string
  label: string
  type: string
  required: boolean
  placeholder?: string
  options?: string[]
  default?: string
}

export default function ActionConfigPage() {
  const params = useParams()
  const router = useRouter()
  const { token } = useAuth()
  const zapId = params.id as string
  const serviceId = params.serviceId as string
  const actionId = params.actionId as string
  
  const [service, setService] = useState<ServiceDTO | null>(null)
  const [action, setAction] = useState<ActionDTO | null>(null)
  const [connections, setConnections] = useState<ConnectionDTO[]>([])
  const [selectedConnection, setSelectedConnection] = useState<number | ''>("")
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [triggerStepId, setTriggerStepId] = useState<number | null>(null)
  const [existingActionsCount, setExistingActionsCount] = useState(0)

  const handleOAuth2Connect = () => {
    if (!service) {
      console.error('❌ No service found')
      return
    }
    if (!token) {
      console.error('❌ No token found')
      alert('No authentication token found. Please login again.')
      return
    }
    
    console.log('✅ Service:', service.name)
    console.log('✅ Token (first 20 chars):', token.substring(0, 20) + '...')
    
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    const oauth2Slug = service.name.toLowerCase()
    const oauthUrl = `${apiBaseUrl}/oauth2/${oauth2Slug}?token=${encodeURIComponent(token)}`
    
    console.log('🔗 Opening OAuth URL:', oauthUrl)
    window.open(oauthUrl, '_blank')
  }

  const handleBackClick = () => {
    router.push(`/create/${zapId}/actions/${serviceId}`)
  }

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleCreateAction = async () => {
    if (!action || !service || !token) return

    if (!selectedConnection) {
      setError('Please select a connection')
      return
    }

    if (!triggerStepId) {
      setError('Trigger step not found. Please configure a trigger first.')
      return
    }

    // Validation basique
    const actionFields = Array.isArray(action.fields) ? action.fields as unknown as ActionField[] : []
    const missingFields = actionFields
      .filter(field => field.required && !formData[field.name])
      .map(field => field.label)

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`)
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      
      console.log('Creating action with:', {
        zapId,
        actionId: action.id,
        connectionId: selectedConnection,
        fromStepId: triggerStepId,
        stepOrder: existingActionsCount + 1,
        payload: formData
      })
      
      // Call API to create the action
      await apiService.createZapAction(
        Number(zapId),
        action.id,
        selectedConnection as number,
        triggerStepId,
        existingActionsCount + 1,
        formData,
        token
      )
      
      console.log('✅ Action created successfully')
      
      // Navigate back to main create page
      router.push(`/create/${zapId}`)
    } catch (error) {
      console.error('Failed to create action:', error)
      setError(error instanceof Error ? error.message : 'Failed to create action. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    const fetchActionDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!token) {
          setError('No authentication token found. Please login again.')
          setLoading(false)
          return
        }

        // Fetch service and action details from API
        const serviceData = await apiService.getServiceById(Number(serviceId))
        setService(serviceData)

        const actionData = await apiService.getActionById(Number(serviceId), Number(actionId))
        setAction(actionData)

        // Fetch available connections for this service
        const connectionsData = await apiService.getConnectionsByService(Number(serviceId), token)
        setConnections(connectionsData.connections)

        // Auto-select if there's only one connection
        if (connectionsData.connections.length === 1) {
          setSelectedConnection(connectionsData.connections[0].id)
        }

        // Check if user needs to connect their account
        if (connectionsData.connections.length === 0) {
          setError('You need to connect your account to this service first')
          setLoading(false)
          return
        }

        // Fetch trigger step to get fromStepId
        try {
          const triggerData = await apiService.getZapTrigger(Number(zapId), token)
          if (triggerData?.step?.id) {
            setTriggerStepId(triggerData.step.id)
          } else {
            setError('Please configure a trigger first before adding actions')
            setLoading(false)
            return
          }
        } catch (triggerError) {
          console.error('Error fetching trigger:', triggerError)
          setError('Please configure a trigger first before adding actions')
          setLoading(false)
          return
        }

        // Fetch existing actions to determine stepOrder
        try {
          const actionsData = await apiService.getZapActions(Number(zapId), token)
          setExistingActionsCount(actionsData.length)
        } catch (actionsError) {
          console.error('Error fetching existing actions:', actionsError)
          // If no actions exist, that's fine - count will be 0
          setExistingActionsCount(0)
        }
        
        // Initialize formData with default values
        const actionFields = Array.isArray(actionData.fields) ? actionData.fields as unknown as ActionField[] : []
        const initialData: Record<string, string> = {}
        actionFields.forEach((field: ActionField) => {
          if (field.default) {
            initialData[field.name] = field.default
          }
        })
        setFormData(initialData)
        
      } catch (err) {
        console.error('Error fetching action details:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (serviceId && actionId && zapId && token) {
      fetchActionDetails()
    }
  }, [serviceId, actionId, zapId, token])

  const renderField = (field: ActionField) => {
    return (
      <FormControl key={field.name} fullWidth>
        {field.type === 'select' ? (
          <>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={formData[field.name] || ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              label={field.label}
              required={field.required}
              sx={{
                bgcolor: 'white',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            >
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </>
        ) : field.type === 'textarea' ? (
          <TextField
            label={field.label}
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            multiline
            rows={4}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        ) : (
          <TextField
            label={field.label}
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
            type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : 'text'}
            placeholder={field.placeholder}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        )}
      </FormControl>
    )
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: service?.services_color || '#1976d2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress sx={{ color: 'white' }} size={60} />
      </Box>
    )
  }

  if (error?.includes('connect your') && service) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: service.services_color,
          position: 'relative'
        }}
      >
        {/* Header */}
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

        {/* Title */}
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
          Complete action fields
        </Typography>

        {/* Action Icon and Description */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'white',
              mb: 2,
              textAlign: 'center'
            }}
          >
            {action?.name || 'Action'}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'white',
              textAlign: 'center',
              maxWidth: 600,
              mb: 6
            }}
          >
            {action?.description || error}
          </Typography>
        </Box>

        {/* Connection Required Container */}
        <Container maxWidth="sm">
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: 3,
              p: 4,
              mb: 4,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: service.services_color }}>
              Select Account
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              You need to connect your {service.name} account to use this action.
            </Alert>
            
            <Button
              onClick={handleOAuth2Connect}
              variant="contained"
              size="large"
              fullWidth
              sx={{
                bgcolor: service.services_color,
                color: 'white',
                fontWeight: 600,
                py: 2,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: service.services_color,
                  opacity: 0.9
                }
              }}
            >
              Connect to {service.name}
            </Button>
          </Box>

          {/* Create Action Button - Disabled */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.5)',
              color: 'rgba(0, 0, 0, 0.3)',
              fontWeight: 700,
              fontSize: '1.2rem',
              py: 2,
              borderRadius: 6,
              mb: 4,
              '&:disabled': {
                bgcolor: 'rgba(255, 255, 255, 0.5)',
                color: 'rgba(0, 0, 0, 0.3)'
              }
            }}
          >
            Create action
          </Button>
        </Container>
      </Box>
    )
  }

  if (error || !action || !service) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: service?.services_color || '#1976d2',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4
        }}
      >
        <Typography variant="h4" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
          Action not found
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', mb: 4, textAlign: 'center', maxWidth: 600 }}>
          {error}
        </Typography>
        
        <Button
          onClick={handleBackClick}
          variant="contained"
          sx={{ bgcolor: 'white', color: service?.services_color || '#1976d2' }}
        >
          Go Back
        </Button>
      </Box>
    )
  }

  const serviceColor = service.services_color
  const actionFields = Array.isArray(action.fields) ? action.fields as unknown as ActionField[] : []

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: serviceColor,
        position: 'relative'
      }}
    >
      {/* Header */}
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

      {/* Title */}
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
        Complete action fields
      </Typography>

      {/* Action Icon and Description */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'white',
            mb: 2,
            textAlign: 'center'
          }}
        >
          {action.name}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'white',
            textAlign: 'center',
            maxWidth: 600,
            mb: 6
          }}
        >
          {action.description}
        </Typography>
      </Box>

      {/* Form Fields */}
      <Container maxWidth="sm">
        {/* Connection Selection - Always shown first */}
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 3,
            p: 4,
            mb: 3,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: serviceColor }}>
            Select Account
          </Typography>
          
          {connections.length === 0 ? (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                You need to connect your {service.name} account to use this action.
              </Alert>
              <Button
                onClick={handleOAuth2Connect}
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  bgcolor: serviceColor,
                  color: 'white',
                  fontWeight: 600,
                  py: 2,
                  '&:hover': {
                    bgcolor: serviceColor,
                    opacity: 0.9
                  }
                }}
              >
                Connect to {service.name}
              </Button>
            </Box>
          ) : (
            <FormControl fullWidth required>
              <InputLabel>Account</InputLabel>
              <Select
                value={selectedConnection}
                onChange={(e) => setSelectedConnection(e.target.value as number)}
                label="Account"
                sx={{
                  bgcolor: 'white',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              >
                {connections.map((connection) => (
                  <MenuItem key={connection.id} value={connection.id}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body1">
                        {connection.connection_name || connection.account_identifier || `Connection ${connection.id}`}
                      </Typography>
                      {connection.account_identifier && connection.connection_name && (
                        <Typography variant="caption" color="text.secondary">
                          {connection.account_identifier}
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        {actionFields.length > 0 && (
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: 3,
              p: 4,
              mb: 4,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {actionFields.map((field) => renderField(field))}
            </Box>
          </Box>
        )}

        {/* Create Action Button */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Button
          onClick={handleCreateAction}
          variant="contained"
          size="large"
          fullWidth
          disabled={!selectedConnection || connections.length === 0 || submitting}
          sx={{
            bgcolor: 'white',
            color: serviceColor,
            fontWeight: 700,
            fontSize: '1.2rem',
            py: 2,
            borderRadius: 6,
            mb: 4,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)'
            },
            '&:disabled': {
              bgcolor: 'rgba(255, 255, 255, 0.5)',
              color: 'rgba(0, 0, 0, 0.3)'
            }
          }}
        >
          {submitting ? (
            <>
              <CircularProgress size={24} sx={{ color: serviceColor, mr: 2 }} />
              Creating action...
            </>
          ) : (
            'Create action'
          )}
        </Button>
      </Container>
    </Box>
  )
}
