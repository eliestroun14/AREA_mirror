"use client";
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { 
  Security as SecurityIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon
} from '@mui/icons-material';

const RouteDebugComponent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  const publicRoutes = [
    '/ (page d\'accueil)',
    '/explore',
    '/login',
    '/signup',
    '/services/[id]'
  ];

  const privateRoutes = [
    '/create/*',
    '/help',
    '/my_applets',
    '/oauth/*'
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1300,
        maxWidth: 400,
        display: { xs: 'none', md: 'block' } // Masquer sur mobile
      }}
    >
      <Card 
        sx={{ 
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <CardContent sx={{ padding: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SecurityIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" component="div">
              Protection des Routes
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              État actuel:
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip 
                label={isAuthenticated ? "CONNECTÉ" : "NON CONNECTÉ"}
                color={isAuthenticated ? "success" : "warning"}
                icon={isAuthenticated ? <LockOpenIcon /> : <LockIcon />}
                size="small"
              />
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Route actuelle:
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 0.5 }}>
              {pathname}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Routes publiques (non connecté):
          </Typography>
          <List dense sx={{ py: 0 }}>
            {publicRoutes.map((route, index) => (
              <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                <ListItemText 
                  primary={route}
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    sx: { fontFamily: 'monospace' }
                  }}
                />
              </ListItem>
            ))}
          </List>
          
          <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>
            Routes privées (connecté):
          </Typography>
          <List dense sx={{ py: 0 }}>
            {privateRoutes.map((route, index) => (
              <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                <ListItemText 
                  primary={route}
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    sx: { fontFamily: 'monospace' }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RouteDebugComponent;
