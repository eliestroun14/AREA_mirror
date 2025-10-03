"use client"
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function HelpPage() {
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
        If you need help understending how to use AREA send an email to manech.dubreil@epitech.eu.
      </Typography>
    </Box>
  )
}
