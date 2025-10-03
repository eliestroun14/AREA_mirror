"use client"
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import database from "@/data/database.json";

export default function CreatePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredServices = database.services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleServiceClick = (serviceName: string) => {
    router.push(`/services/${encodeURIComponent(serviceName)}`);
  };

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
        Choose a service
      </Typography>

      <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
        <TextField
          label="Search for a service"
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
            <Card sx={{ maxWidth: 345, mx: "auto" }}>
              <CardActionArea onClick={() => handleServiceClick(service.name)}>
                <CardMedia
                  component="img"
                  height="140"
                  image={`/assets/${service.image}`}
                  alt={service.name}
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
    </Box>
  )
}
