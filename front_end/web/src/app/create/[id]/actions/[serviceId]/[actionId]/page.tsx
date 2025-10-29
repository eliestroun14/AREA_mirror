"use client"

import { useState, useEffect } from 'react'
import StepSourceSelector from '@/components/StepSourceSelector'
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
import Popover from '@mui/material/Popover'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Chip from '@mui/material/Chip'
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
  order: number
}

const generateActionFields = (action: ActionDTO): ActionField[] => {
  const fields: ActionField[] = []
  
  // Parse fields from the action (it's a JSON object from the API)
  const actionFieldsObj = action.fields as Record<string, unknown>
  
  // Iterate through each field in the action.fields object
  Object.entries(actionFieldsObj).forEach(([fieldKey, fieldValue]) => {
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
    let inputType = 'text'
    if (fieldType === 'select' || selectOptions) {
      inputType = 'select'
    } else if (fieldType === 'number') {
      inputType = 'number'
    } else if (fieldType === 'email') {
      inputType = 'email'
    } else if (fieldType === 'textarea') {
      inputType = 'textarea'
    }
    
    fields.push({
      name: fieldKey,
      type: inputType,
      label: fieldName,
      options: selectOptions,
      required: fieldRequired,
      placeholder: fieldPlaceholder,
      default: fieldDefaultValue,
      order: fieldOrder
    })
  })
  
  // Sort fields by order
  fields.sort((a, b) => a.order - b.order)

  return fields
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
  const [selectedFromStepId, setSelectedFromStepId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [triggerStepId, setTriggerStepId] = useState<number | null>(null)
  const [existingActionsCount, setExistingActionsCount] = useState(0)
  const [actionStepId, setActionStepId] = useState<number | null>(null)
  const [triggerVariables, setTriggerVariables] = useState<Record<string, unknown>>({})
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [currentFieldName, setCurrentFieldName] = useState<string>('')

  useEffect(() => {
    console.log('🔊 Setting up postMessage listener...');

    const handleMessage = (event: MessageEvent) => {
      console.log('📨 Message received:', event.data);
      console.log('📍 Message origin:', event.origin);

      const allowedOrigins = [
        'https://manech.va.sauver.le.monde.area.projects.epitech.bzh',
        'http://localhost:8081',
        'http://localhost:8080',
        'http://localhost:3001',
        'http://127.0.0.1:8081',
        window.location.origin
      ];

      if (!allowedOrigins.includes(event.origin)) {
        console.warn('⚠️ Message from unauthorized origin:', event.origin);
        return;
      }

      if (event.data?.type === 'oauth_success') {
        console.log('✅ OAuth success detected, reloading page...');
        window.location.reload();
      }
    };

    window.addEventListener('message', handleMessage);
    console.log('✅ PostMessage listener ready');

    return () => {
      console.log('🔇 Removing postMessage listener...');
      window.removeEventListener('message', handleMessage);
    };
  }, []);

const handleOAuth2Connect = async () => {
    if (!service || !token) {
      console.error('❌ No service or token found');
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
      const oauth2Slug = service.name.toLowerCase();
      const oauthUrl = `${apiBaseUrl}/oauth2/${oauth2Slug}?token=${encodeURIComponent(encryptedToken)}`;
      
      console.log('🔗 Opening OAuth URL');
      
      const oauthWindow = window.open(
        oauthUrl,
        'oauth_window',
        'width=600,height=700,left=100,top=100'
      );
      
      if (!oauthWindow) {
        alert('Please allow popups for this site to connect your account.');
        return;
      }
      
      console.log('✅ OAuth window opened');
      
    } catch (error) {
      console.error('❌ Error initiating OAuth:', error);
      alert('Failed to initiate OAuth connection. Please try again.');
    }
  };

  const handleBackClick = () => {
    router.push(`/create/${zapId}/actions/${serviceId}`)
  }

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleOpenVariablesMenu = (event: React.MouseEvent<HTMLElement>, fieldName: string) => {
    setAnchorEl(event.currentTarget)
    setCurrentFieldName(fieldName)
  }

  const handleCloseVariablesMenu = () => {
    setAnchorEl(null)
    setCurrentFieldName('')
  }

  const handleInsertVariable = (variableName: string) => {
    const currentValue = formData[currentFieldName] || ''
    const newValue = currentValue + `{{${variableName}}}`
    
    setFormData(prev => ({
      ...prev,
      [currentFieldName]: newValue
    }))
    
    handleCloseVariablesMenu()
  }

  const open = Boolean(anchorEl)

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
    const actionFields = generateActionFields(action)
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
        fromStepId: selectedFromStepId ?? triggerStepId,
        stepOrder: existingActionsCount + 1,
        payload: formData
      })
      
      // Call API to create the action
      await apiService.createZapAction(
        Number(zapId),
        action.id,
        selectedConnection as number,
        selectedFromStepId ?? triggerStepId,
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

        // Fetch trigger step to get fromStepId and variables
        try {
          const triggerData = await apiService.getZapTrigger(Number(zapId), token)
          if (triggerData?.step?.id) {
            setTriggerStepId(triggerData.step.id)
            setSelectedFromStepId(triggerData.step.id)
            if (triggerData.trigger?.variables) {
              setTriggerVariables(triggerData.trigger.variables)
            }
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
          // Find the zap step id that corresponds to the current service action id
          const found = actionsData.find(a => a.action?.id === Number(actionId))
          if (found && found.step && found.step.id) {
            setActionStepId(found.step.id)
          } else {
            // If not found, keep null. The StepSourceSelector will not render until we have it.
            setActionStepId(null)
          }
        } catch (actionsError) {
          console.error('Error fetching existing actions:', actionsError)
          // If no actions exist, that's fine - count will be 0
          setExistingActionsCount(0)
        }
        
        // Initialize formData with default values
        const actionFields = generateActionFields(actionData)
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
    const hasVariables = Object.keys(triggerVariables).length > 0
    
    return (
      <Box key={field.name}>
        <FormControl fullWidth>
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
        
        {/* Button to insert variables */}
        {hasVariables && (
          <Button
            onClick={(e) => handleOpenVariablesMenu(e, field.name)}
            size="small"
            variant="outlined"
            sx={{
              mt: 1,
              textTransform: 'none',
              fontSize: '0.875rem',
              borderColor: serviceColor || '#1976d2',
              color: serviceColor || '#1976d2',
              '&:hover': {
                borderColor: serviceColor || '#1976d2',
                bgcolor: `${serviceColor || '#1976d2'}15`
              }
            }}
          >
            + Insert Variable
          </Button>
        )}
      </Box>
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
  const actionFields = generateActionFields(action)

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
          {action?.name}
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
          {action?.description}
        </Typography>
      </Box>

      {/* Step source selector*/}
      {service && (
        <Container maxWidth="sm" sx={{ mb: 3 }}>
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: 3,
              p: 4,
              mb: 3,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: serviceColor }}>
              Source step
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Choose your variable source for this action.
            </Typography>
            <StepSourceSelector
              zapId={Number(zapId)}
              currentStepId={actionStepId ?? null}
              token={token ?? ''}
              onRefresh={() => window.location.reload()}
              onSelectFromStep={(id) => setSelectedFromStepId(id)}
            />
          </Box>
        </Container>
      )}

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
              <Select<number | string>
                value={selectedConnection}
                onChange={(e) => setSelectedConnection((e.target.value as string) === '' ? '' : Number(e.target.value))}
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

        {/* Popover for variable selection */}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleCloseVariablesMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 2, maxWidth: 400 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: serviceColor }}>
              Available Variables from Source step
            </Typography>
            
            {Object.keys(triggerVariables).length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No variables available
              </Typography>
            ) : (
              <List sx={{ p: 0 }}>
                {Object.entries(triggerVariables).map(([variableKey, variableValue]) => {
                  // Handle the structure: { type: "string", name: "Prompt", key: "data.prompt" }
                  const variable = variableValue as Record<string, unknown>
                  const displayName = (variable.name as string) || variableKey
                  const variableName = (variable.name as string) || variableKey
                  const variableType = (variable.type as string) || 'unknown'
                  const variableKeyPath = (variable.key as string) || ''
                  
                  return (
                    <ListItem key={variableKey} disablePadding>
                      <ListItemButton
                        onClick={() => handleInsertVariable(variableName)}
                        sx={{
                          borderRadius: 1,
                          mb: 1,
                          '&:hover': {
                            bgcolor: `${serviceColor}15`
                          }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {displayName}
                              </Typography>
                              <Chip
                                label={variableType}
                                size="small"
                                sx={{
                                  bgcolor: `${serviceColor}15`,
                                  color: serviceColor,
                                  fontSize: '0.7rem',
                                  height: 20
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, fontFamily: 'monospace' }}>
                              {`{{${variableName}}}`}
                              {variableKeyPath && (
                                <Typography component="span" variant="caption" color="text.disabled" sx={{ ml: 1 }}>
                                  ({variableKeyPath})
                                </Typography>
                              )}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  )
                })}
              </List>
            )}
          </Box>
        </Popover>

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
