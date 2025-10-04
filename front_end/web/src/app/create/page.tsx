"use client"

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreatePage() {
  const router = useRouter()
  const [selectedTrigger, setSelectedTrigger] = useState(false)
  const [selectedAction, setSelectedAction] = useState(false)

  const handleHelpClick = () => {
    router.push('/help')
  }

  const handleCancelClick = () => {
    router.push('/explore')
  }

  const handleIfThisClick = () => {
    router.push('/create/applets')
  }

  const handleThenThatClick = () => {
    if (selectedTrigger) {
      router.push('/create/applets?step=action')
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
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          You're using 1 of 2 Applets
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
            bgcolor: 'black',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 4,
            cursor: 'pointer',
            position: 'relative',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.9)',
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease'
            }
          }}
        >
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
            bgcolor: selectedTrigger ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.3)',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: selectedTrigger ? 'pointer' : 'not-allowed',
            '&:hover': selectedTrigger ? {
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease'
            } : {}
          }}
        >
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
        </Box>
      </Box>
    </Box>
  )
}