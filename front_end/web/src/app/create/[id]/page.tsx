"use client"

import { Suspense } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { apiService } from '@/services/api'

function CreateZapPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const zapId = Number(params.id)
  
  const [selectedTrigger, setSelectedTrigger] = useState<{
    serviceId: number
    serviceName: string
    trigger: string
    data: Record<string, unknown>
  } | null>(null)
  const [selectedAction, setSelectedAction] = useState<{
    serviceId: number
    serviceName: string
    action: string
    data: Record<string, unknown>
  } | null>(null)

  useEffect(() => {
    const serviceId = searchParams.get('serviceId')
    const serviceName = searchParams.get('serviceName')
    const trigger = searchParams.get('trigger')
    const triggerData = searchParams.get('triggerData')
    
    const actionServiceId = searchParams.get('action_serviceId')
    const actionServiceName = searchParams.get('action_serviceName')
    const actionName = searchParams.get('action_name')
    const actionConfig = searchParams.get('action_config')
    
    if (serviceId && serviceName && trigger) {
      setSelectedTrigger({
        serviceId: Number(serviceId),
        serviceName,
        trigger,
        data: triggerData ? JSON.parse(triggerData) : {}
      })
    }

    if (actionServiceId && actionServiceName && actionName) {
      setSelectedAction({
        serviceId: Number(actionServiceId),
        serviceName: actionServiceName,
        action: actionName,
        data: actionConfig ? JSON.parse(actionConfig) : {}
      })
    }
  }, [searchParams])

  const handleHelpClick = () => {
    router.push('/help')
  }

  const handleCancelClick = () => {
    if (zapId) {
      console.log('Cancel clicked: Deleting zap', zapId)
      apiService.deleteZap(zapId).catch(err => console.error('Failed to delete zap:', err))
    }
    router.push('/explore')
  }

  const handleIfThisClick = () => {
    if (!zapId) {
      console.error('No zap ID available')
      return
    }

    console.log('If This clicked: Navigating to /create subpage, keeping zap', zapId)

    if (selectedTrigger) {
      router.push(`/create/${zapId}/triggers/${selectedTrigger.serviceId}/${encodeURIComponent(selectedTrigger.trigger)}`)
    } else {
      router.push(`/create/${zapId}/applets`)
    }
  }

  const handleThenThatClick = () => {
    if (!zapId) {
      console.error('No zap ID available')
      return
    }

    if (selectedTrigger) {
      // Mark that we're navigating to a /create subpage
      console.log('Then That clicked: Navigating to /create/actions, keeping zap', zapId)
      
      router.push(`/create/${zapId}/actions`)
    }
  }

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "white",
        minHeight: "calc(100vh - 64px)",
        overflow: "auto",
        position: "relative"
      }}
    >
      {/* Bouton Cancel en haut à gauche */}
      <Button
        onClick={handleCancelClick}
        variant="outlined"
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          color: 'black',
          borderColor: 'black',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            borderColor: 'black'
          }
        }}
      >
        Cancel
      </Button>

      {/* Icône d'aide en haut à droite */}
      <IconButton
        onClick={handleHelpClick}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          p: 1,
          color: 'black',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <Box
          component="img"
          src="/assets/point_d_interrogation.png"
          alt="Aide"
          sx={{
            width: 32,
            height: 32,
            cursor: 'pointer'
          }}
        />
      </IconButton>

      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6, mt: 8 }}>
        <Typography variant="h3" color="black" gutterBottom sx={{ fontWeight: 'bold' }}>
          Create
        </Typography>
      </Box>

      {/* If This Then That Interface */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          maxWidth: 600,
          mx: 'auto'
        }}
      >
        {/* If This Block */}
        <Box
          onClick={handleIfThisClick}
          sx={{
            width: '100%',
            height: 120,
            bgcolor: selectedTrigger ? '#4CAF50' : 'black',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 4,
            cursor: 'pointer',
            position: 'relative',
            '&:hover': {
              bgcolor: selectedTrigger ? 'rgba(76, 175, 80, 0.9)' : 'rgba(0, 0, 0, 0.9)',
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease'
            }
          }}
        >
          {selectedTrigger ? (
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 1
                }}
              >
                {selectedTrigger.serviceName}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem'
                }}
              >
                {selectedTrigger.trigger}
              </Typography>
            </Box>
          ) : (
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              If This
            </Typography>
          )}
          
          <Button
            variant="contained"
            sx={{
              bgcolor: 'white',
              color: selectedTrigger ? '#4CAF50' : 'black',
              fontWeight: 'bold',
              px: 3,
              py: 1,
              borderRadius: 6,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
          >
            {selectedTrigger ? 'Edit' : 'Add'}
          </Button>
        </Box>

        {/* Connector Line */}
        <Box
          sx={{
            width: 4,
            height: 60,
            bgcolor: 'text.secondary',
            borderRadius: 2,
            opacity: 0.3
          }}
        />

        {/* Then That Block */}
        <Box
          onClick={handleThenThatClick}
          sx={{
            width: '100%',
            height: 120,
            bgcolor: selectedTrigger ? (selectedAction ? '#FF9800' : 'rgba(0, 0, 0, 0.7)') : 'rgba(0, 0, 0, 0.3)',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: selectedTrigger && !selectedAction ? 'space-between' : 'center',
            px: 4,
            cursor: selectedTrigger ? 'pointer' : 'not-allowed',
            '&:hover': selectedTrigger ? {
              bgcolor: selectedAction ? 'rgba(255, 152, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)',
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease'
            } : {}
          }}
        >
          {selectedAction ? (
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 1
                }}
              >
                {selectedAction.serviceName}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem'
                }}
              >
                {selectedAction.action}
              </Typography>
            </Box>
          ) : (
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: { xs: '2rem', md: '3rem' },
                opacity: selectedTrigger ? 1 : 0.6
              }}
            >
              Then That
            </Typography>
          )}
          
          {selectedTrigger && !selectedAction && (
            <Button
              variant="contained"
              sx={{
                bgcolor: 'white',
                color: 'black',
                fontWeight: 'bold',
                px: 3,
                py: 1,
                borderRadius: 6,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)'
                }
              }}
            >
              Add
            </Button>
          )}
          
          {selectedAction && (
            <Button
              variant="contained"
              sx={{
                bgcolor: 'white',
                color: '#FF9800',
                fontWeight: 'bold',
                px: 3,
                py: 1,
                borderRadius: 6,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)'
                }
              }}
            >
              Edit
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default function CreateZapPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateZapPageContent />
    </Suspense>
  )
}