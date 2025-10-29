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
import { ServiceDTO, TriggerDTO, ConnectionDTO } from '@/types/api'
import { useAuth } from '@/context/AuthContext'

interface TriggerField {
  name: string
  type: 'text' | 'select' | 'number' | 'date' | 'time'
  label: string
  options?: string[]
  required: boolean
  placeholder?: string
  defaultValue?: string
  order: number
}

export default function TriggerFieldsPage() {
  const params = useParams()
  const router = useRouter()
  const { token } = useAuth()
  const zapId = params.id as string
  const serviceId = params.serviceId as string
  const triggerId = params.triggerId as string

  const [trigger, setTrigger] = useState<TriggerDTO | null>(null)
  const [service, setService] = useState<ServiceDTO | null>(null)
  const [connections, setConnections] = useState<ConnectionDTO[]>([])
  const [selectedConnection, setSelectedConnection] = useState<number | ''>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})

  useEffect(() => {
    console.log('Setting up postMessage listener...');

    const handleMessage = (event: MessageEvent) => {
      console.log('Message received:', event.data);
      console.log('Message origin:', event.origin);

      const allowedOrigins = [
        'http://localhost:3001',
        'http://localhost:8081',
        'https://manech.va.sauver.le.monde.area.projects.epitech.bzh',
        window.location.origin
      ];

      if (!allowedOrigins.includes(event.origin)) {
        console.warn('Message from unauthorized origin:', event.origin);
        return;
      }

      if (event.data?.type === 'oauth_success') {
        console.log('OAuth success detected, reloading page...');
        window.location.reload();
      }
    };

    window.addEventListener('message', handleMessage);
    console.log('PostMessage listener ready');

    return () => {
      console.log('Removing postMessage listener...');
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleOAuth2Connect = async () => {
    if (!service || !token) {
      console.error('No service or token found');
      alert('No authentication token found. Please login again.');
      return;
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiBaseUrl}/oauth2/encrypt-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          platform: 'web',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to encrypt token');
      }
      
      const { encryptedToken } = await response.json();
      
      // Map service names to their correct OAuth2 slugs
      const getServiceSlug = (serviceName: string): string => {
        const slugMap: Record<string, string> = {
          'Microsoft Teams': 'teams',
          'Discord': 'discord',
          'Gmail': 'gmail',
          'Github': 'github',
          'Google': 'google',
          'Deezer': 'deezer',
          'Spotify': 'spotify'
        };
        return slugMap[serviceName] || serviceName.toLowerCase().replace(/\s+/g, '-');
      };
      
      const oauth2Slug = getServiceSlug(service.name);
      const oauthUrl = `${apiBaseUrl}/oauth2/${oauth2Slug}?token=${encodeURIComponent(encryptedToken)}`;
      
      console.log('Opening OAuth URL');
      
      const oauthWindow = window.open(
        oauthUrl,
        'oauth_window',
        'width=600,height=700,left=100,top=100'
      );
      
      if (!oauthWindow) {
        alert('Please allow popups for this site to connect your account.');
        return;
      }
      
      console.log('OAuth window opened');
      
    } catch (error) {
      console.error('Error initiating OAuth:', error);
      alert('Failed to initiate OAuth connection. Please try again.');
    }
  };

  const handleBackClick = () => {
    router.push(`/create/${zapId}/triggers/${serviceId}`)
  }

  const handleCreateTrigger = async () => {
    // Only require connection if trigger type is not SCHEDULE
    if (trigger?.trigger_type !== 'SCHEDULE' && !selectedConnection) {
      setError('Please select a connection')
      return
    }

    if (!token) {
      setError('No authentication token found. Please login again.')
      return
    }
    
    try {
      setSubmitting(true)
      setError(null)
      
      console.log('Creating trigger with:', {
        zapId,
        triggerId,
        connectionId: selectedConnection,
        payload: formData
      })
      
      // Call API to create the trigger
      // For SCHEDULE triggers, use a dummy connection ID or handle it differently
      await apiService.createZapTrigger(
        Number(zapId),
        Number(triggerId),
        trigger?.trigger_type === 'SCHEDULE' ? (selectedConnection as number || 0) : selectedConnection as number,
        formData,
        token
      )
      
      console.log('Trigger created successfully')
      
      // Redirect to the zap page after successful creation (without URL params)
      router.push(`/create/${zapId}`)
      
    } catch (err) {
      console.error('Failed to create trigger:', err)
      setError(err instanceof Error ? err.message : 'Failed to create trigger. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const generateTriggerFields = (trigger: TriggerDTO): TriggerField[] => {
    const fields: TriggerField[] = []
    
    // Parse fields from the trigger (it's a JSON object from the API)
    const triggerFieldsObj = trigger.fields as Record<string, unknown>
    
    // Iterate through each field in the trigger.fields object
    Object.entries(triggerFieldsObj).forEach(([fieldKey, fieldValue]) => {
      // fieldValue should be an object with properties like type, label, required, options, etc.
      const fieldConfig = fieldValue as Record<string, unknown>
      
      // Check if the field is active (default to true if not specified)
      const isActive = fieldConfig.is_active !== false
      
      // Skip inactive fields
      if (!isActive) {
        return
      }
      
      // Extract field configuration with all the new properties
      const fieldType = (fieldConfig.type as string)?.toLowerCase() || 'string'
      const fieldName = (fieldConfig.field_name as string) || fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1).replace(/_/g, ' ')
      const fieldRequired = (fieldConfig.required as boolean) || false
      const fieldPlaceholder = (fieldConfig.placeholder as string) || ''
      const fieldDefaultValue = (fieldConfig.default_value as string) || ''
      const fieldOrder = (fieldConfig.field_order as number) || 999
      const selectOptions = Array.isArray(fieldConfig.select_options) && fieldConfig.select_options.length > 0 
        ? fieldConfig.select_options as string[] 
        : undefined
      
      // Map API type to input type
      let inputType: 'text' | 'select' | 'number' | 'date' | 'time' = 'text'
      if (fieldType === 'select' || selectOptions) {
        inputType = 'select'
      } else if (fieldType === 'number') {
        inputType = 'number'
      } else if (fieldType === 'date') {
        inputType = 'date'
      } else if (fieldType === 'time') {
        inputType = 'time'
      }
      
      fields.push({
        name: fieldKey,
        type: inputType,
        label: fieldName,
        options: selectOptions,
        required: fieldRequired,
        placeholder: fieldPlaceholder,
        defaultValue: fieldDefaultValue,
        order: fieldOrder
      })
    })
    
    // Sort fields by order
    fields.sort((a, b) => a.order - b.order)

    return fields
  }

  useEffect(() => {
    const fetchTriggerData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch service data FIRST to get the color
        const serviceData = await apiService.getServiceById(Number(serviceId))
        setService(serviceData)

        // Check if user is authenticated
        if (!token) {
          throw new Error('You must be logged in to access this page')
        }
        
        // Fetch specific trigger data using apiService FIRST
        const triggerData = await apiService.getTriggerByService(serviceId, triggerId)
        
        if (!triggerData) {
          throw new Error('Trigger not found')
        }
        
        setTrigger(triggerData)
        
        // Fetch user connections for this service (skip for SCHEDULE triggers)
        try {
          const connectionsData = await apiService.getConnectionsByService(Number(serviceId), token)
          setConnections(connectionsData.connections)
          
          // Auto-select if there's only one connection
          if (connectionsData.connections.length === 1) {
            setSelectedConnection(connectionsData.connections[0].id)
          }
        } catch (connError) {
          console.error('Error fetching connections:', connError)
          // Only show error if it's not a SCHEDULE trigger
          if (triggerData?.trigger_type !== 'SCHEDULE') {
            setError('You need to connect your account to this service first')
            setLoading(false)
            return
          }
          // For SCHEDULE triggers, continue without connections
          setConnections([])
        }
        
        // Initialize form data with default values
        const triggerFieldsObj = triggerData.fields as Record<string, unknown>
        const initialFormData: Record<string, string> = {}
        
        Object.entries(triggerFieldsObj).forEach(([fieldKey, fieldValue]) => {
          const fieldConfig = fieldValue as Record<string, unknown>
          const defaultValue = fieldConfig.default_value as string
          if (defaultValue) {
            initialFormData[fieldKey] = defaultValue
          }
        })
        
        setFormData(initialFormData)
        
      } catch (err) {
        console.error('Error fetching trigger data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (serviceId && triggerId) {
      fetchTriggerData()
    }
  }, [serviceId, triggerId, token])

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

  if (error || !trigger || !service) {
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
          {error?.includes('connect your account') ? 'Connect your account' : 'Trigger not found'}
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', mb: 4, textAlign: 'center', maxWidth: 600 }}>
          {error}
        </Typography>
        
        {error?.includes('connect your account') && service ? (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={handleOAuth2Connect}
              variant="contained"
              size="large"
              sx={{ 
                bgcolor: 'white', 
                color: service?.services_color || '#1976d2',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)'
                }
              }}
            >
              Connect to {service.name}
            </Button>
            <Button
              onClick={handleBackClick}
              variant="outlined"
              size="large"
              sx={{ 
                borderColor: 'white',
                color: 'white',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Go Back
            </Button>
          </Box>
        ) : (
          <Button
            onClick={handleBackClick}
            variant="contained"
            sx={{ bgcolor: 'white', color: service?.services_color || '#1976d2' }}
          >
            Go Back
          </Button>
        )}
      </Box>
    )
  }

  const serviceColor = service.services_color
  const triggerFields = generateTriggerFields(trigger)

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
        Complete trigger fields
      </Typography>

      {/* Trigger Icon and Description */}
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
          {trigger.name}
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
          {trigger.description}
        </Typography>
      </Box>

      {/* Form Fields */}
      <Container maxWidth="sm">
        {/* Connection Selection - Only shown if trigger type is not SCHEDULE */}
        {trigger.trigger_type !== 'SCHEDULE' && (
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
                You need to connect your {service.name} account to use this trigger.
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
        )}

        {triggerFields.length > 0 && (
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
              {triggerFields.map((field) => (
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
                  ) : (
                    <TextField
                      label={field.label}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      required={field.required}
                      type={field.type}
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
              ))}
            </Box>
          </Box>
        )}

        {/* Create Trigger Button */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Button
          onClick={handleCreateTrigger}
          variant="contained"
          size="large"
          fullWidth
          disabled={(trigger.trigger_type !== 'SCHEDULE' && (!selectedConnection || connections.length === 0)) || submitting}
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
              Creating trigger...
            </>
          ) : (
            'Create trigger'
          )}
        </Button>
      </Container>
    </Box>
  )
}
