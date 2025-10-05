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
        Help
      </Typography>
      <Typography variant="body1" align="center" color="black">
        Créez vos applets personnalisés ici.
      </Typography>
    </Box>
  )
}
