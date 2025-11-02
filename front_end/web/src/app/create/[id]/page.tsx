"use client"

import { Suspense } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { apiService } from '@/services/api'
import { useAuth } from '@/context/AuthContext'
import CircularProgress from '@mui/material/CircularProgress'

function CreateZapPageContent() {
  const router = useRouter()
  const params = useParams()
  const { token } = useAuth()
  const zapId = Number(params.id)
  
  const [zapName, setZapName] = useState('New Applet')
  const [zapDescription, setZapDescription] = useState('Created from web interface')
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [tempName, setTempName] = useState('')
  const [tempDescription, setTempDescription] = useState('')
  
  const [selectedTrigger, setSelectedTrigger] = useState<{
    triggerId: number
    serviceId: number
    serviceName: string
    serviceColor: string
    trigger: string
    data: Record<string, unknown>
  } | null>(null)
  const [selectedActions, setSelectedActions] = useState<Array<{
    stepId: number
    actionId: number
    serviceId: number
    serviceName: string
    serviceColor: string
    action: string
    data: Record<string, unknown>
  }>>([])
  const [loadingTrigger, setLoadingTrigger] = useState(true)
  const [loadingActions, setLoadingActions] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Charger les informations du zap
  useEffect(() => {
    const fetchZapInfo = async () => {
      if (!token || !zapId) return

      try {
        const zapData = await apiService.getZapById(zapId, token)
        setZapName(zapData.name)
        setZapDescription(zapData.description)
      } catch (error) {
        console.error('Failed to fetch zap info:', error)
      }
    }

    fetchZapInfo()
  }, [zapId, token])

  // Charger le trigger depuis l'API au chargement de la page
  useEffect(() => {
    const fetchTriggerData = async () => {
      if (!token || !zapId) {
        setLoadingTrigger(false)
        return
      }

      try {
        setLoadingTrigger(true)
        const triggerData = await apiService.getZapTrigger(zapId, token)

          if (triggerData) {
          // Only show the trigger if its service is explicitly active
          if (triggerData.service && Boolean(triggerData.service.is_active)) {
            setSelectedTrigger({
              triggerId: triggerData.trigger.id,
              serviceId: triggerData.service.id,
              serviceName: triggerData.service.name,
              serviceColor: triggerData.service.services_color,
              trigger: triggerData.trigger.name,
              data: triggerData.step.payload as Record<string, unknown>
            })
          } else {
            // If the service is inactive, don't set a selected trigger
            setSelectedTrigger(null)
            console.warn('Trigger service is inactive; hiding the trigger in UI')
          }
        }
      } catch (error) {
        console.log('No trigger configured yet:', error)
        // Pas de trigger configuré, c'est normal
      } finally {
        setLoadingTrigger(false)
      }
    }

    fetchTriggerData()
  }, [zapId, token])

  // Charger les actions depuis l'API au chargement de la page
  useEffect(() => {
    const fetchActionsData = async () => {
      if (!token || !zapId) {
        setLoadingActions(false)
        return
      }

      try {
        setLoadingActions(true)
        const actionsData = await apiService.getZapActions(zapId, token)
        
        if (actionsData && actionsData.length > 0) {
          const activeActionsData = actionsData.filter(a => a.service && Boolean(a.service.is_active))

          if (activeActionsData.length > 0) {
            const actions = activeActionsData.map(actionData => ({
              stepId: actionData.step.id,
              actionId: actionData.action.id,
              serviceId: actionData.service.id,
              serviceName: actionData.service.name,
              serviceColor: actionData.service.services_color,
              action: actionData.action.name,
              data: actionData.step.payload as Record<string, unknown>
            }))
            setSelectedActions(actions)
          } else {
            setSelectedActions([])
          }
        } else {
          setSelectedActions([])
        }
      } catch (error) {
        console.log('No actions configured yet:', error)
        // Pas d'actions configurées, c'est normal
      } finally {
        setLoadingActions(false)
      }
    }

    fetchActionsData()
  }, [zapId, token])

  const handleHelpClick = () => {
    router.push('/help')
  }

  const handleCancelClick = () => {
    // Open confirmation dialog instead of deleting immediately
    setConfirmOpen(true)
  }

  const handleCloseConfirm = () => {
    setConfirmOpen(false)
  }

  const handleConfirmDelete = async () => {
    if (!zapId) {
      setConfirmOpen(false)
      router.push('/explore')
      return
    }

    try {
      setDeleting(true)
      await apiService.deleteZap(zapId)
      setConfirmOpen(false)
      router.push('/explore')
    } catch (err) {
      console.error('Failed to delete zap:', err)
      // keep dialog closed and let user continue
      setConfirmOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  const handleEditName = () => {
    setTempName(zapName)
    setIsEditingName(true)
  }

  const handleSaveName = async () => {
    if (tempName.trim() && token) {
      try {
        await apiService.updateZap(zapId, tempName.trim(), undefined, token)
        setZapName(tempName.trim())
        setIsEditingName(false)
      } catch (error) {
        console.error('Failed to update zap name:', error)
      }
    }
  }

  const handleEditDescription = () => {
    setTempDescription(zapDescription)
    setIsEditingDescription(true)
  }

  const handleSaveDescription = async () => {
    if (tempDescription.trim() && token) {
      try {
        await apiService.updateZap(zapId, undefined, tempDescription.trim(), token)
        setZapDescription(tempDescription.trim())
        setIsEditingDescription(false)
      } catch (error) {
        console.error('Failed to update zap description:', error)
      }
    }
  }

  const handleIfThisClick = () => {
    if (!zapId) {
      console.error('No zap ID available')
      return
    }

    console.log('If This clicked: Navigating to /create subpage, keeping zap', zapId)

    if (selectedTrigger) {
      // Si un trigger existe, naviguer vers la page d'édition
      router.push(`/create/${zapId}/triggers/edit`)
    } else {
      // Sinon, naviguer vers la page de sélection des applets
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

      {/* Confirmation dialog for Cancel (delete zap) */}
      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        aria-labelledby="confirm-delete-title"
      >
        <DialogTitle id="confirm-delete-title">Delete applet?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this applet? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} disabled={deleting}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6, mt: 8 }}>
        <Typography variant="h3" color="black" gutterBottom sx={{ fontWeight: 'bold' }}>
          Create
        </Typography>
        
        {/* Zap Name - Editable */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 1,
            mb: 1,
            mt: 3
          }}
        >
          {isEditingName ? (
            <>
              <TextField
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                variant="outlined"
                size="small"
                autoFocus
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    fontSize: '1.5rem',
                    fontWeight: 600
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveName()
                  }
                }}
              />
              <IconButton 
                onClick={handleSaveName}
                color="primary"
                size="small"
              >
                <CheckIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary'
                }}
              >
                {zapName}
              </Typography>
              <IconButton 
                onClick={handleEditName}
                size="small"
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>

        {/* Zap Description - Editable */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 1,
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          {isEditingDescription ? (
            <>
              <TextField
                value={tempDescription}
                onChange={(e) => setTempDescription(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                autoFocus
                multiline
                rows={2}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSaveDescription()
                  }
                }}
              />
              <IconButton 
                onClick={handleSaveDescription}
                color="primary"
                size="small"
              >
                <CheckIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.secondary',
                  fontStyle: 'italic'
                }}
              >
                {zapDescription}
              </Typography>
              <IconButton 
                onClick={handleEditDescription}
                size="small"
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
      </Box>

      {/* If This Then That Interface */}
      {(loadingTrigger || loadingActions) ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
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
            bgcolor: selectedTrigger ? selectedTrigger.serviceColor : 'black',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 4,
            cursor: 'pointer',
            position: 'relative',
            '&:hover': {
              bgcolor: selectedTrigger ? `${selectedTrigger.serviceColor}dd` : 'rgba(0, 0, 0, 0.9)',
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
              color: selectedTrigger ? selectedTrigger.serviceColor : 'black',
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

        {/* Then That Block - First Action or Add */}
        <Box
          onClick={() => {
            if (selectedActions.length > 0) {
              router.push(`/create/${zapId}/actions/edit/${selectedActions[0].stepId}`)
            } else if (selectedTrigger) {
              handleThenThatClick()
            }
          }}
          sx={{
            width: '100%',
            height: 120,
            bgcolor: selectedTrigger ? (selectedActions.length > 0 ? selectedActions[0].serviceColor : 'rgba(0, 0, 0, 0.7)') : 'rgba(0, 0, 0, 0.3)',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 4,
            cursor: selectedTrigger ? 'pointer' : 'not-allowed',
            '&:hover': selectedTrigger ? {
              bgcolor: selectedActions.length > 0 ? `${selectedActions[0].serviceColor}dd` : 'rgba(0, 0, 0, 0.8)',
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease'
            } : {}
          }}
        >
          {selectedActions.length > 0 ? (
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 1
                }}
              >
                {selectedActions[0].serviceName}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem'
                }}
              >
                {selectedActions[0].action}
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
          
          {selectedTrigger && selectedActions.length === 0 && (
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
          
          {selectedActions.length > 0 && (
            <Button
              variant="contained"
              sx={{
                bgcolor: 'white',
                color: selectedActions[0].serviceColor,
                fontWeight: 'bold',
                px: 3,
                py: 1,
                borderRadius: 6,
                pointerEvents: 'none',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)'
                }
              }}
            >
              Edit
            </Button>
          )}
        </Box>

        {/* Additional Actions */}
        {selectedActions.slice(1).map((action) => (
          <Box 
            key={action.stepId}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              gap: 4
            }}
          >
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

            {/* Action Block */}
            <Box
              onClick={() => router.push(`/create/${zapId}/actions/edit/${action.stepId}`)}
              sx={{
                width: '100%',
                height: 120,
                bgcolor: action.serviceColor,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 4,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: `${action.serviceColor}dd`,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease'
                }
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 1
                  }}
                >
                  {action.serviceName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem'
                  }}
                >
                  {action.action}
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'white',
                  color: action.serviceColor,
                  fontWeight: 'bold',
                  px: 3,
                  py: 1,
                  borderRadius: 6,
                  pointerEvents: 'none',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
              >
                Edit
              </Button>
            </Box>
          </Box>
        ))}

        {/* Add Another Action Button */}
        {selectedTrigger && selectedActions.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              gap: 4
            }}
          >
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

            <Button
              onClick={handleThenThatClick}
              variant="outlined"
              fullWidth
              sx={{
                height: 80,
                borderColor: 'rgba(0, 0, 0, 0.3)',
                color: 'text.secondary',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                borderRadius: 3,
                borderStyle: 'dashed',
                borderWidth: 2,
                '&:hover': {
                  borderColor: 'rgba(0, 0, 0, 0.5)',
                  bgcolor: 'rgba(0, 0, 0, 0.02)'
                }
              }}
            >
              + Add Another Action
            </Button>
          </Box>
        )}

        {/* Finish Applet Button */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            gap: 4,
            mt: 6
          }}
        >
          <Button
            onClick={() => {
              if (selectedTrigger && selectedActions.length > 0) {
                console.log('Finishing applet with:', {
                  zapId,
                  trigger: selectedTrigger,
                  actions: selectedActions
                })
                router.push('/my_applets')
              }
            }}
            variant="contained"
            size="large"
            fullWidth
            disabled={!selectedTrigger || selectedActions.length === 0}
            sx={{
              bgcolor: selectedTrigger && selectedActions.length > 0 ? 'black' : 'rgba(0, 0, 0, 0.3)',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.3rem',
              py: 2.5,
              borderRadius: 6,
              textTransform: 'none',
              '&:hover': {
                bgcolor: selectedTrigger && selectedActions.length > 0 ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.3)',
              },
              '&:disabled': {
                bgcolor: 'rgba(0, 0, 0, 0.3)',
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }}
          >
            Finish Applet
          </Button>

          {(!selectedTrigger || selectedActions.length === 0) && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
                fontStyle: 'italic'
              }}
            >
              {!selectedTrigger
                ? 'Please add a trigger to continue'
                : 'Please add at least one action to finish'
              }
            </Typography>
          )}
        </Box>
      </Box>
      )}
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