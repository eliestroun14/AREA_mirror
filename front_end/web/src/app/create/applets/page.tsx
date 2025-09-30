"use client"
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function CreatePage() {
  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "#f5ffff",
        minHeight: "calc(100vh - 64px)",
        overflow: "auto"
      }}
    >
      <Typography variant="h3" align="center" color="#005acd" gutterBottom>
        Choose a service
      </Typography>
    </Box>
  )
}
