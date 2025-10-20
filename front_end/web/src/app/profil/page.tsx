"use client";
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActionArea,
  Avatar
} from '@mui/material';
import {
  Settings as SettingsIcon,
  History as HistoryIcon,
  Person as PersonIcon
} from '@mui/icons-material';

export default function ProfilPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const profilSections = [
    {
      title: 'Paramètres',
      description: 'Gérer vos informations personnelles et préférences',
      icon: <SettingsIcon sx={{ fontSize: 40 }} />,
      path: '/profil/settings',
      color: '#1976d2'
    },
    {
      title: 'Activités',
      description: 'Voir vos dernières activités et exécutions d\'applets',
      icon: <HistoryIcon sx={{ fontSize: 40 }} />,
      path: '/profil/activity',
      color: '#2e7d32'
    }
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={4}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 56, height: 56 }}>
            <PersonIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Mon Profil
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gérez vos informations et préférences
            </Typography>
          </Box>
        </Box>

        <Box 
          display="grid" 
          gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)' }} 
          gap={3}
        >
          {profilSections.map((section, index) => (
            <Card 
              key={index}
              elevation={1} 
              sx={{ 
                height: '100%',
                transition: 'all 0.2s',
                '&:hover': { 
                  boxShadow: 4,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardActionArea 
                onClick={() => router.push(section.path)}
                sx={{ p: 3, height: '100%' }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: section.color, 
                      width: 80, 
                      height: 80, 
                      mx: 'auto', 
                      mb: 2 
                    }}
                  >
                    {section.icon}
                  </Avatar>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {section.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {section.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Paper>
    </Container>
  );
}
