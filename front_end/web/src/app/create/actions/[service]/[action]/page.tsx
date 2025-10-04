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
import Paper from '@mui/material/Paper'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CircularProgress from '@mui/material/CircularProgress'

interface ActionField {
  name: string
  label: string
  type: string
  required: boolean
  placeholder?: string
  options?: string[]
  default?: string
}

interface Action {
  id: number
  name: string
  description: string
  fields: ActionField[]
}

interface Service {
  id: number
  name: string
  service_color: string
  actions: Action[]
}

export default function ActionConfigPage() {
  const params = useParams()
  const router = useRouter()
  const serviceName = params.service as string
  const actionId = params.action as string
  
  const [service, setService] = useState<Service | null>(null)
  const [action, setAction] = useState<Action | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleBackClick = () => {
    router.push(`/create/actions/${serviceName}`)
  }

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleCreateAction = () => {
    // Validation basique
    if (action) {
      const missingFields = action.fields
        .filter(field => field.required && !formData[field.name])
        .map(field => field.label)

      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`)
        return
      }
    }

    // Retourner vers la page create avec l'action configurée
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('action_service', service?.name || '')
    searchParams.set('action_name', action?.name || '')
    searchParams.set('action_config', JSON.stringify(formData))
    router.push(`/create?${searchParams.toString()}`)
  }

  useEffect(() => {
    const fetchActionDetails = async () => {
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
          const foundAction = foundService.actions?.find(
            a => a.id.toString() === actionId
          )
          
          if (foundAction) {
            setAction(foundAction as Action)
            // Initialiser formData avec les valeurs par défaut
            const initialData: Record<string, string> = {}
            foundAction.fields?.forEach((field: ActionField) => {
              if (field.default) {
                initialData[field.name] = field.default
              }
            })
            setFormData(initialData)
          } else {
            setError('Action not found')
          }
        } else {
          setError('Service not found')
        }
        
      } catch (err) {
        console.error('Error fetching action details:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchActionDetails()
  }, [serviceName, actionId])

  const renderField = (field: ActionField) => {
    const commonProps = {
      fullWidth: true,
      required: field.required,
      sx: { mb: 3 },
      value: formData[field.name] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleFieldChange(field.name, e.target.value)
    }

    switch (field.type) {
      case 'textarea':
        return (
          <TextField
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            multiline
            rows={4}
            {...commonProps}
          />
        )
      
      case 'select':
        return (
          <FormControl key={field.name} fullWidth required={field.required} sx={{ mb: 3 }}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={formData[field.name] || ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              label={field.label}
            >
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      
      case 'email':
        return (
          <TextField
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            type="email"
            {...commonProps}
          />
        )
      
      default:
        return (
          <TextField
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            {...commonProps}
          />
        )
    }
  }

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

  if (error || !service || !action) {
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
          {error || 'Action not found'}
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
      <Container maxWidth="md">
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

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' },
                textAlign: 'center'
              }}
            >
              Complete action fields
            </Typography>
          </Box>

          {/* Service and Action Info */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
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
              variant="h4"
              sx={{
                fontWeight: 600,
                mb: 1
              }}
            >
              {action.name}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                opacity: 0.9,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              {action.description}
            </Typography>
          </Box>

          {/* Configuration Form */}
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            {action.fields && action.fields.length > 0 ? (
              <>
                {action.fields.map((field) => renderField(field))}

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleCreateAction}
                    sx={{
                      bgcolor: service.service_color,
                      color: 'white',
                      px: 6,
                      py: 2,
                      borderRadius: 8,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: service.service_color,
                        opacity: 0.9
                      }
                    }}
                  >
                    Create action
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  No configuration needed
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  This action doesn&apos;t require any additional configuration.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleCreateAction}
                  sx={{
                    bgcolor: service.service_color,
                    color: 'white',
                    px: 6,
                    py: 2,
                    borderRadius: 8,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: service.service_color,
                      opacity: 0.9
                    }
                  }}
                >
                  Create action
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}
