"use client"
import Header from '@/components/Header'
import HomeCard from '@/components/HomeCard'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

export default function HomePage() {
  const cardsData = [
    { title: "Linkedin", imageUrl: "/assets/linkedin.png" },
    { title: "Youtube", imageUrl: "/assets/youtube.jpg" },
  ]

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
      </Box>
    </>
  )
}
