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
import { ServiceDTO, ActionDTO, ConnectionDTO } from '@/types/api'
import { useAuth } from '@/context/AuthContext'

interface ActionField {
  name: string
  type: 'text' | 'select' | 'number' | 'date' | 'time' | 'textarea'
  label: string
  options?: string[]
  required: boolean
  placeholder?: string
  defaultValue?: string
  order: number
}

export default function EditActionPage() {
  const params = useParams()
  const router = useRouter()
  const { token } = useAuth()
  const zapId = params.id as string
  const stepId = params.stepId as string

  const [action, setAction] = useState<ActionDTO | null>(null)
  const [service, setService] = useState<ServiceDTO | null>(null)
  const [connections, setConnections] = useState<ConnectionDTO[]>([])
  const [selectedConnection, setSelectedConnection] = useState<number | ''>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [triggerStepId, setTriggerStepId] = useState<number | null>(null)
  const [actionStepId, setActionStepId] = useState<number | null>(null)
  const [selectedFromStepId, setSelectedFromStepId] = useState<number | null>(null)
  const [triggerVariables, setTriggerVariables] = useState<Record<string, unknown>>({})
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [currentFieldName, setCurrentFieldName] = useState<string>('')

  const handleBackClick = () => {
    router.push(`/create/${zapId}`)
  }

  const handleUpdateAction = async () => {
    if (!selectedConnection) {
      setError('Please select a connection')
      return
    }

    if (!token) {
      setError('No authentication token found. Please login again.')
      return
    }

    if (!action) {
      setError('Action data not loaded')
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      console.log('Updating action with:', {
        zapId,
        stepId,
        actionId: action.id,
        connectionId: selectedConnection,
        payload: formData
      })

      const connection = await apiService.getConnectionById(selectedConnection as number, token)

      if (!connection.account_identifier) {
        throw new Error('Connection does not have an account identifier')
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const response = await fetch(`${apiBaseUrl}/zaps/${zapId}/actions/${stepId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          actionId: action.id,
          accountIdentifier: connection.account_identifier,
          fromStepId: selectedFromStepId ?? triggerStepId ?? null,
          payload: formData
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Update action failed:', response.status, errorText)
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`)
      }

      console.log('✅ Action updated successfully')

      router.push(`/create/${zapId}`)

    } catch (err) {
      console.error('❌ Failed to update action:', err)
      setError(err instanceof Error ? err.message : 'Failed to update action. Please try again.')
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

  const generateActionFields = (action: ActionDTO): ActionField[] => {
    const fields: ActionField[] = []

    const actionFieldsObj = action.fields as Record<string, unknown>

    Object.entries(actionFieldsObj).forEach(([fieldKey, fieldValue]) => {
      const fieldConfig = fieldValue as Record<string, unknown>

      const isActive = fieldConfig.is_active !== false

      if (!isActive) {
        return
      }

      const fieldType = (fieldConfig.type as string)?.toLowerCase() || 'string'
      const fieldName = (fieldConfig.field_name as string) || fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1).replace(/_/g, ' ')
      const fieldRequired = (fieldConfig.required as boolean) || false
      const fieldPlaceholder = (fieldConfig.placeholder as string) || ''
      const fieldDefaultValue = (fieldConfig.default_value as string) || ''
      const rawFieldOrder = (fieldConfig.field_order as unknown)
      const parsedFieldOrder = Number(rawFieldOrder)
      const fieldOrder = Number.isFinite(parsedFieldOrder) ? parsedFieldOrder : 999
      const selectOptions = Array.isArray(fieldConfig.select_options) && fieldConfig.select_options.length > 0
        ? fieldConfig.select_options as string[]
        : undefined

      let inputType: 'text' | 'select' | 'number' | 'date' | 'time' | 'textarea' = 'text'
      if (fieldType === 'select' || selectOptions) {
        inputType = 'select'
      } else if (fieldType === 'number') {
        inputType = 'number'
      } else if (fieldType === 'date') {
        inputType = 'date'
      } else if (fieldType === 'time') {
        inputType = 'time'
      } else if (fieldType === 'textarea' || fieldType === 'email') {
        inputType = 'textarea'
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

    fields.sort((a, b) => a.order - b.order)

    return fields
  }

  useEffect(() => {
    const fetchActionData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          throw new Error('You must be logged in to access this page');
        }

        const existingAction = await apiService.getZapActionById(Number(zapId), Number(stepId), token);

        if (!existingAction) {
          throw new Error('No action found for this zap');
        }

        setService(existingAction.service);

        try {
          const connectionsData = await apiService.getConnectionsByService(existingAction.service.id, token);
          setConnections(connectionsData.connections);

          setSelectedConnection(existingAction.connection.id);
        } catch (connError) {
          console.error('Error fetching connections:', connError);
          // Only require a connection if the action itself requires one
          if ((existingAction.action as Partial<Record<'require_connection', boolean>>).require_connection) {
            setError('You need to connect your account to this service first');
            setLoading(false);
            return;
          }
          // Otherwise, continue without connections
          setConnections([]);
        }

        setAction(existingAction.action);

        if (existingAction.step && existingAction.step.id) {
          setActionStepId(existingAction.step.id);
        }

  const existingFromStepId = existingAction.step?.source_step_id;

        console.log('🔍 Full action data:', {
          stepId: existingAction.step?.id,
          sourceStepId: existingFromStepId,
          stepOrder: existingAction.step?.step_order,
          fullStep: existingAction.step
        });

        if (existingFromStepId !== null && existingFromStepId !== undefined) {
          setSelectedFromStepId(existingFromStepId as number);
          console.log('✅ Set selectedFromStepId to:', existingFromStepId);
        } else {
          console.log('⚠️ No source_step_id found in DB, will use trigger as default');
        }

        setFormData(existingAction.step.payload as Record<string, string>);

        try {
          const triggerData = await apiService.getZapTrigger(Number(zapId), token);
          if (triggerData?.step?.id) {
            setTriggerStepId(triggerData.step.id);
            console.log('✅ Trigger step id:', triggerData.step.id);
          }
        } catch (triggerError) {
          console.error('Error fetching trigger:', triggerError);
        }

      } catch (err) {
        console.error('Error fetching action data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (zapId && stepId) {
      fetchActionData();
    }
  }, [zapId, stepId, token]);

  useEffect(() => {
    const fetchVariablesForSelectedSource = async () => {
      try {
        if (!token) {
          console.log('⏸️ No token, skipping variable fetch');
          return;
        }

        if (!triggerStepId) {
          console.log('⏸️ Trigger step ID not loaded yet, waiting...');
          return;
        }

        if (typeof selectedFromStepId === 'undefined' || selectedFromStepId === null) {
          console.log('⏸️ No source selected yet, clearing variables');
          setTriggerVariables({});
          return;
        }

        console.log('🔄 Loading variables for selected source:', selectedFromStepId);
        console.log('   Trigger step ID:', triggerStepId);

        if (selectedFromStepId === triggerStepId) {
          console.log('   → Loading TRIGGER variables');
          const triggerData = await apiService.getZapTrigger(Number(zapId), token);
          const vars = triggerData?.trigger?.variables || {};
          setTriggerVariables(vars);
          console.log('✅ Loaded trigger variables:', Object.keys(vars).length, 'variables');
        } else {
          console.log('   → Loading ACTION variables from step:', selectedFromStepId);
          const actionData = await apiService.getZapActionById(Number(zapId), selectedFromStepId as number, token);
          const vars = actionData?.action?.variables || {};
          setTriggerVariables(vars);
          console.log('✅ Loaded action variables:', Object.keys(vars).length, 'variables');
        }
      } catch (err) {
        console.error('❌ Error fetching variables for selected source:', err);
        setTriggerVariables({});
      }
    };

    fetchVariablesForSelectedSource();
  }, [selectedFromStepId, triggerStepId, zapId, token]);

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

  if (error || !action || !service) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: service?.services_color || '#ffffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4
        }}
      >
        <Typography variant="h4" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
          {error || 'Action not found'}
        </Typography>
        <Button
          onClick={handleBackClick}
          variant="contained"
          sx={{ bgcolor: 'white', color: service?.services_color || '#ffffffff' }}
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
        Edit action
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
              onSelectFromStep={(id) => setSelectedFromStepId(id)}
            />
          </Box>
        </Container>
      )}

      {/* Form Fields */}
      <Container maxWidth="sm">
        {/* Connection Selection */}
        {action?.require_connection && (
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
            <Alert severity="warning" sx={{ mb: 3 }}>
              No connections available for {service.name}.
            </Alert>
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
              {actionFields.map((field) => {
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
                          borderColor: serviceColor || '#ffffffff',
                          color: serviceColor || '#ffffffff',
                          '&:hover': {
                            borderColor: serviceColor || '#ffffffff',
                            bgcolor: `${serviceColor || '#ffffffff'}15`
                          }
                        }}
                      >
                        + Insert Variable
                      </Button>
                    )}
                  </Box>
                )
              })}
            </Box>
          </Box>
        )}

        {/* Update Action Button */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Button
          onClick={handleUpdateAction}
          variant="contained"
          size="large"
          fullWidth
          disabled={(action?.require_connection && (!selectedConnection || connections.length === 0)) || submitting}
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
              Updating action...
            </>
          ) : (
            'Update action'
          )}
        </Button>

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
      </Container>
    </Box>
  )
}
