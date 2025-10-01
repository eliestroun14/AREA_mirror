"use client";
import * as React from "react";
import { useRouter } from 'next/navigation';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Button from "@mui/material/Button";
import database from "@/data/database.json";

export default function HomePage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);
  const featuredServices = database.slice(0, 4);

  React.useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  const handleServiceClick = (serviceName: string) => {
    router.push(`/services/${encodeURIComponent(serviceName)}`);
  };

  const handleSeeMoreClick = () => {
    router.push('/explore');
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f5ffff", minHeight: "100vh" }}>
      <Typography variant="h3" align="center" color="#005acd" gutterBottom>
        AREA
      </Typography>
      <Typography variant="h6" align="center" color="black" sx={{ mb: 4 }}>
        Découvrez nos services populaires
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'center',
          alignItems: 'flex-start',
          mb: 4
        }}
      >
        {featuredServices.map((service, index) => (
          <Box
            key={index}
            sx={{
              width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' },
              maxWidth: 280
            }}
          >
            <Card sx={{ maxWidth: 280, mx: "auto", height: '100%' }}>
              <CardActionArea onClick={() => handleServiceClick(service.name)}>
                <CardMedia
                  component="img"
                  height="140"
                  image={`/assets/${service.image}`}
                  alt={service.name}
                  sx={{ objectFit: 'contain', p: 1 }}
                />
                <CardContent>
                  <Typography variant="h6" align="center" gutterBottom>
                    {service.name}
                  </Typography>
                  <Typography variant="body2" align="center" color="text.secondary">
                    {service.actionType}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSeeMoreClick}
          sx={{
            bgcolor: '#005acd',
            color: 'white',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            '&:hover': {
              bgcolor: '#003d9a'
            }
          }}
        >
          Voir plus de services
        </Button>
      </Box>
    </Box>
  );
}
