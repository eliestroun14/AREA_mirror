"use client"
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

interface Props {
  title: string
  imageUrl: string
}

export default function HomeCard({ title, imageUrl }: Props) {
  return (
    <Card sx={{ minWidth: 250, m: 2 }}>
      <CardMedia
        component="img"
        height="140"
        image={imageUrl}
        alt={title}
      />
      <CardContent>
        <Typography variant="h6" align="center">
          {title}
        </Typography>
      </CardContent>
    </Card>
  )
}
