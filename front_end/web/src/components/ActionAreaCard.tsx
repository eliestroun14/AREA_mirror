import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

interface ActionAreaCardProps {
  image: string;
  title: string;
  link?: string;
}

export default function ActionAreaCard({ image, title, link }: ActionAreaCardProps) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea onClick={() => link && window.open(link, '_blank')}>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
