"use client"
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import { apiService } from '@/services/api'
import { ZapDTO } from '@/types/api'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function MyAppletsPage() {
  const [zaps, setZaps] = useState<ZapDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const { token, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const fetchZaps = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const userZaps = await apiService.getAllZaps(token)
        setZaps(userZaps)
      } catch (err) {
        console.error('Error fetching zaps:', err)
        setError('Impossible de charger vos applets')
      } finally {
        setLoading(false)
      }
    }

    fetchZaps()
  }, [token])

  const handleToggleZap = async (zapId: number, currentStatus: boolean) => {
    if (!token) return

    try {
      const updatedZap = await apiService.toggleZap(zapId, !currentStatus, token)
      setZaps(zaps.map(zap => zap.id === zapId ? updatedZap : zap))
    } catch (err) {
      console.error('Error toggling zap:', err)
      setError('Impossible de changer le statut de l\'applet')
    }
  }

  const handleDeleteZap = async (zapId: number) => {
    if (!token) return
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet applet ?')) return

    try {
      await apiService.deleteZap(zapId)
      setZaps(zaps.filter(zap => zap.id !== zapId))
    } catch (err) {
      console.error('Error deleting zap:', err)
      setError('Impossible de supprimer l\'applet')
    }
  }

  const handleEditZap = (zapId: number) => {
    router.push(`/create/${zapId}`)
  }

  if (!isMounted) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 4, bgcolor: "#FFFFFF", minHeight: "calc(100vh - 64px)" }}>
        <Alert severity="warning">
          Vous devez être connecté pour voir vos applets
        </Alert>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box
        sx={{
          p: 4,
          bgcolor: "#FFFFFF",
          minHeight: "calc(100vh - 64px)",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "#FFFFFF",
        minHeight: "calc(100vh - 64px)",
        overflow: "auto"
      }}
    >
      <Typography variant="h3" align="center" color="primary.main" gutterBottom>
        Mes Applets
      </Typography>
      <Typography variant="body1" align="center" color="black" sx={{ mb: 4 }}>
        Gérez et visualisez tous vos applets personnalisés.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {zaps.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Vous n&apos;avez pas encore d&apos;applets
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => router.push('/create')}
          >
            Créer mon premier applet
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 3
          }}
        >
          {zaps.map((zap) => (
            <Card
              key={zap.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                    {zap.name}
                  </Typography>
                  <Chip
                    label={zap.is_active ? "Actif" : "Inactif"}
                    color={zap.is_active ? "success" : "default"}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {zap.description}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Créé le {new Date(zap.created_at).toLocaleDateString('fr-FR')}
                </Typography>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={zap.is_active}
                      onChange={() => handleToggleZap(zap.id, zap.is_active)}
                      color="primary"
                    />
                  }
                  label=""
                />
                
                <Box>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEditZap(zap.id)}
                    title="Modifier"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteZap(zap.id)}
                    title="Supprimer"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  )
}