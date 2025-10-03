"use client"
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function CreatePage() {
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
      <Typography variant="body1" align="center" color="black">
        Gérez et visualisez tous vos applets personnalisés.
      </Typography>
    </Box>
  )
}