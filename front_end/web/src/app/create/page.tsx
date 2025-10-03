"use client"
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { useRouter } from 'next/navigation'

export default function CreatePage() {
  const router = useRouter()

  const handleHelpClick = () => {
    router.push('/help')
  }

  const handleCancelClick = () => {
    router.push('/explore')
  }

  const handleCreateAppletClick = () => {
    router.push('/create/applets')
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
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
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

      <Typography variant="h3" align="center" color="black" gutterBottom>
        Create
      </Typography>
      <Typography variant="body1" align="center" color="black" sx={{ mb: 4 }}>
        Create your personalized applets here.
      </Typography>

      {/* Button to create an applet */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleCreateAppletClick}
          sx={{
            bgcolor: 'black',
            color: 'white',
            px: 6,
            py: 2,
            fontSize: '1.2rem',
            fontWeight: 600,
            borderRadius: 2,
            '&:hover': {
              bgcolor: '#333333'
            }
          }}
        >
          Create a new applet
        </Button>
      </Box>
    </Box>
  )
}
