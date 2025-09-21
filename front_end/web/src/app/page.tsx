"use client"
import HomeCard from '@/components/HomeCard'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
import React from 'react'

export default function HomePage() {
  const cardsData = [
    { title: "Linkedin", imageUrl: "/assets/linkedin.png" },
    { title: "Youtube", imageUrl: "/assets/youtube.jpg" },
  ]
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) return null;

  return (
    <>
      <Box sx={{ p: 4, bgcolor: '#121212', minHeight: '100vh' }}>
        <Typography variant="h3" align="center" color="white" gutterBottom>
          AREA
        </Typography>
        <Grid container justifyContent="center">
          {cardsData.map((card, index) => (
            <HomeCard
              key={index}
              title={card.title}
              imageUrl={card.imageUrl}
            />
          ))}
        </Grid>
        <Button
          color="success"
          variant="contained"
          onClick={() => {
            window.open('http://localhost:3000/connection/spotify', '_blank')
          }}
        >Connect to spotify</Button>
        <Button
          color="error"
          variant="contained"
          onClick={() => {
            window.open('http://localhost:3000/connection/google', '_blank')
          }}
        >Connect to Google</Button>
      </Box>
    </>
  )
}
