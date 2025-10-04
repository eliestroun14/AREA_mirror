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

interface TriggerField {
  name: string
  type: 'text' | 'select' | 'number' | 'date' | 'time'
  label: string
  options?: string[]
  required: boolean
}

interface TriggerData {
  id: number
  name: string
  description: string
  trigger_type: string
  fields: string[]
  variables: string[]
  polling_interval?: number
}

interface Service {
  id: number
  name: string
  service_color: string
}

export default function TriggerFieldsPage() {
  const params = useParams()
  const router = useRouter()
  const serviceName = decodeURIComponent(params.service as string)
  const triggerName = decodeURIComponent(params.trigger as string)
  
  const [trigger, setTrigger] = useState<TriggerData | null>(null)
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})

  const handleBackClick = () => {
    router.push(`/create/triggers/${encodeURIComponent(serviceName)}`)
  }

  const handleCreateTrigger = () => {
    console.log('Trigger configuration:', formData)
    const searchParams = new URLSearchParams({
      service: serviceName,
      trigger: triggerName,
      triggerData: JSON.stringify(formData)
    })
    router.push(`/create?${searchParams.toString()}`)
  }

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const generateTriggerFields = (trigger: TriggerData): TriggerField[] => {
    const fields: TriggerField[] = []
    
    if (trigger.name.includes('year') || trigger.trigger_type === 'Schedule') {
      fields.push(
        {
          name: 'month',
          type: 'select',
          label: 'Month',
          options: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ],
          required: true
        },
        {
          name: 'day',
          type: 'select',
          label: 'Day',
          options: Array.from({length: 31}, (_, i) => String(i + 1).padStart(2, '0')),
          required: true
        },
        {
          name: 'hour',
          type: 'select',
          label: 'Hour',
          options: [
            '01 AM', '02 AM', '03 AM', '04 AM', '05 AM', '06 AM',
            '07 AM', '08 AM', '09 AM', '10 AM', '11 AM', '12 PM',
            '01 PM', '02 PM', '03 PM', '04 PM', '05 PM', '06 PM',
            '07 PM', '08 PM', '09 PM', '10 PM', '11 PM', '12 AM'
          ],
          required: true
        },
        {
          name: 'minutes',
          type: 'select',
          label: 'Minutes',
          options: Array.from({length: 60}, (_, i) => String(i).padStart(2, '0') + ' Minutes'),
          required: true
        }
      )
    }
    
    trigger.fields.forEach(field => {
      switch(field) {
        case 'from':
          fields.push({
            name: 'from_email',
            type: 'text',
            label: 'From Email',
            required: false
          })
          break
        case 'subject':
          fields.push({
            name: 'subject_contains',
            type: 'text',
            label: 'Subject Contains',
            required: false
          })
          break
        case 'body_preview':
          fields.push({
            name: 'body_contains',
            type: 'text',
            label: 'Body Contains',
            required: false
          })
          break
        default:
          fields.push({
            name: field,
            type: 'text',
            label: field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' '),
            required: false
          })
      }
    })

    return fields
  }

  useEffect(() => {
    const fetchTriggerData = async () => {
      try {
        setLoading(true)
        setError(null)

        const { default: database } = await import('@/data/database.json')
        const foundService = database.services.find(s => s.name === serviceName)
        
        if (!foundService) {
          throw new Error(`Service "${serviceName}" not found`)
        }
        
        setService(foundService)
        
        const foundTrigger = foundService.triggers?.find(t => t.name === triggerName)
        if (!foundTrigger) {
          throw new Error(`Trigger "${triggerName}" not found`)
        }
        
        setTrigger(foundTrigger)
        
        if (foundTrigger.name.includes('year') || foundTrigger.trigger_type === 'Schedule') {
          setFormData({
            month: 'October',
            day: '04',
            hour: '01 PM',
            minutes: '00 Minutes'
          })
        }
        
      } catch (err) {
        console.error('Error fetching trigger data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTriggerData()
  }, [serviceName, triggerName])

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: service?.service_color || '#FF8A00',
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
          bgcolor: service?.service_color || '#FF8A00',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4
        }}
      >
        <Typography variant="h4" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
          Trigger not found
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
          {error}
        </Typography>
        <Button
          onClick={handleBackClick}
          variant="contained"
          sx={{ bgcolor: 'white', color: service?.service_color || '#FF8A00' }}
        >
          Go Back
        </Button>
      </Box>
    )
  }

  const serviceColor = service.service_color
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

        {/* Create Trigger Button */}
        <Button
          onClick={handleCreateTrigger}
          variant="contained"
          size="large"
          fullWidth
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
            }
          }}
        >
          Create trigger
        </Button>
      </Container>
    </Box>
  )
}
