"use client"
import Box from '@mui/material/Box'

interface Props {
  children: React.ReactNode
}

export default function Card({ children }: Props) {
  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 400,
        margin: "auto",
        mt: 10,
        bgcolor: 'background.paper'
      }}
    >
      {children}
    </Box>
  )
}
