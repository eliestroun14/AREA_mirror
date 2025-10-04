"use client"
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import database from '@/data/database.json'

export default function TriggersPage() {
  const params = useParams()
  const router = useRouter()
  const serviceName = decodeURIComponent(params.service as string)

  const handleBackClick = () => {
    router.push('/create')
  }

  const handleTriggerClick = (triggerName: string) => {
    // Pour l'instant, on redirige vers la page principale
    // Plus tard, on pourra créer une page de configuration du trigger
    router.push('/')
  }

  // Couleur du service sélectionné
  const serviceColors = [
    '#FF8A00', '#4A4A4A', '#1877F2', '#4285F4', '#FF6600',
    '#1DB954', '#333333', '#1DA1F2', '#000000', '#FF0000'
  ]

  const serviceIndex = database.services.findIndex(s => s.name === serviceName)
  const serviceColor = serviceColors[serviceIndex % serviceColors.length] || '#333333'

  // Triggers factices pour le service sélectionné
  const triggers = [
    { id: 1, name: "New post by you", description: "This Trigger fires every time you post a new photo on Instagram." },
    { id: 2, name: "New post by anyone", description: "This Trigger fires every time anyone posts a new photo with a specific hashtag." },
    { id: 3, name: "New video by you", description: "This Trigger fires every time you post a new video." },
    { id: 4, name: "New follower", description: "This Trigger fires every time you get a new follower." },
    { id: 5, name: "New like on your post", description: "This Trigger fires every time someone likes your photo." },
    { id: 6, name: "New comment", description: "This Trigger fires every time someone comments on your photo." }
  ]

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          py: 4,
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackClick}
            sx={{
              color: 'black',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              borderRadius: 6,
              px: 3,
              py: 1,
              border: '2px solid black',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Back
          </Button>
          
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              color: 'black',
              fontSize: { xs: '1.5rem', md: '2.5rem' },
              textAlign: 'center'
            }}
          >
            Choose a trigger
          </Typography>
          
          <Button
            sx={{
              minWidth: 44,
              height: 44,
              borderRadius: '50%',
              color: 'black',
              border: '2px solid black',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <HelpOutlineIcon />
          </Button>
        </Box>

        {/* Service Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              bgcolor: serviceColor,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 3
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                color: 'white',
                fontWeight: 700 
              }}
            >
              {serviceName.charAt(0)}
            </Typography>
          </Box>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600, 
              color: 'black'
            }}
          >
            {serviceName}
          </Typography>
        </Box>

        {/* Triggers List */}
        <Box
          sx={{
            maxWidth: 800,
            mx: 'auto'
          }}
        >
          {triggers.map((trigger) => (
            <Card
              key={trigger.id}
              sx={{
                mb: 2,
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e0e0e0',
                '&:hover': {
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <CardActionArea
                onClick={() => handleTriggerClick(trigger.name)}
                sx={{
                  p: 3,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start'
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: serviceColor,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 3,
                    flexShrink: 0
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'white',
                      fontWeight: 700 
                    }}
                  >
                    {serviceName.charAt(0)}
                  </Typography>
                </Box>
                
                <CardContent sx={{ p: 0, flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'black',
                      fontWeight: 600,
                      mb: 1
                    }}
                  >
                    {trigger.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666666',
                      lineHeight: 1.5
                    }}
                  >
                    {trigger.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  )
}
