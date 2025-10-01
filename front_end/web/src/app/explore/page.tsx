"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Container from '@mui/material/Container';
import database from '@/data/database.json';

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredServices = database.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleServiceClick = (serviceName: string) => {
    router.push(`/services/${encodeURIComponent(serviceName)}`);
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          p: 4,
          bgcolor: "#f5ffff",
          minHeight: "calc(100vh - 64px)",
          overflow: "auto"
        }}
      >
        <Typography variant="h3" align="center" color="#005acd" gutterBottom>
          Explorer tous les services
        </Typography>
        <Typography variant="body1" align="center" color="black" sx={{ mb: 4 }}>
          Découvrez tous nos services disponibles pour créer vos applets personnalisés
        </Typography>

        {/* Barre de recherche */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
          <TextField
            label="Rechercher un service"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: "100%", maxWidth: 400 }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}
        >
          {filteredServices.map((service, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
                maxWidth: 345
              }}
            >
              <Card sx={{ maxWidth: 345, mx: "auto", height: '100%' }}>
                <CardActionArea onClick={() => handleServiceClick(service.name)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={`/assets/${service.image}`}
                    alt={service.name}
                    sx={{ objectFit: 'contain', p: 2 }}
                  />
                  <CardContent>
                    <Typography variant="h6" align="center">
                      {service.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Box>

        {filteredServices.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Aucun service trouvé pour &quot;{searchTerm}&quot;
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  )
}
