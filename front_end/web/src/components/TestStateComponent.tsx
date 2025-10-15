"use client";
import React from 'react';
import { useGlobalState } from '@/context/GlobalStateContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip,
  Divider,
  Stack,
  Alert
} from '@mui/material';
import { 
  Timeline as TimelineIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';

const TestStateComponent: React.FC = () => {
  const { 
    globalState, 
    updateCounter, 
    updateMessage, 
    toggleActive, 
    resetState,
    getUserStateKey
  } = useGlobalState();
  const { logout } = useAuth();
  const [isMounted, setIsMounted] = React.useState(false);
  
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRandomMessage = () => {
    if (!globalState.userConnected) return;
    const messages = [
      "Message utilisateur connecté",
      "État modifié par l&apos;utilisateur authentifié",
      "Nouveau message depuis session active",
      "Test de mise à jour utilisateur",
      "État global synchronisé pour utilisateur"
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    updateMessage(randomMessage);
  };

  const handleRandomCounter = () => {
    if (!globalState.userConnected) return;
    const randomValue = Math.floor(Math.random() * 1000);
    updateCounter(randomValue);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (date: Date) => {
    if (!isMounted) return '--:--:--';
    return date.toLocaleTimeString();
  };

  if (!isMounted) {
    return null; // Évite l'erreur d'hydratation en ne rendant rien côté serveur
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80,
        right: 16,
        zIndex: 1300,
        minWidth: 300,
        maxWidth: 350,
      }}
    >
      <Card 
        sx={{ 
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <CardContent sx={{ padding: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TimelineIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" component="div">
              État Global - Test
            </Typography>
          </Box>
          
          {/* Statut de connexion */}
          <Alert 
            severity={globalState.userConnected ? "success" : "warning"} 
            sx={{ mb: 2 }}
            icon={globalState.userConnected ? <LoginIcon /> : <LogoutIcon />}
          >
            {globalState.userConnected ? "Utilisateur connecté" : "Utilisateur non connecté"}
          </Alert>
          
          <Divider sx={{ mb: 2 }} />
          
          <Stack spacing={1.5}>
            {globalState.userConnected && (
              <>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    <PersonIcon sx={{ fontSize: 12, mr: 0.5 }} />
                    ID Utilisateur:
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {getUserStateKey()}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    <TimeIcon sx={{ fontSize: 12, mr: 0.5 }} />
                    Temps de connexion:
                  </Typography>
                  <Typography variant="body2">
                    {globalState.loginTime ? formatTime(globalState.loginTime) : 'N/A'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Durée de session:
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                    {formatDuration(globalState.sessionDuration)}
                  </Typography>
                </Box>
              </>
            )}
            
            <Box>
              <Typography variant="caption" color="text.secondary">
                Compteur {globalState.userConnected && globalState.isActive ? "(auto-incrémenté)" : "(inactif)"}:
              </Typography>
              <Typography variant="h4" color={globalState.userConnected ? "primary" : "text.disabled"} sx={{ fontWeight: 'bold' }}>
                {globalState.counter}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="caption" color="text.secondary">
                Message:
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                {globalState.message}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="caption" color="text.secondary">
                État actif:
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip 
                  label={globalState.isActive ? "ACTIF" : "INACTIF"}
                  color={globalState.isActive && globalState.userConnected ? "success" : "default"}
                  icon={globalState.isActive ? <PlayIcon /> : <PauseIcon />}
                  size="small"
                />
              </Box>
            </Box>
            
            <Box>
              <Typography variant="caption" color="text.secondary">
                Dernière mise à jour:
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                {formatTime(globalState.lastUpdated)}
              </Typography>
            </Box>
          </Stack>
          
          <Divider sx={{ my: 2 }} />
          
          <Stack spacing={1}>
            {globalState.userConnected ? (
              <>
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={toggleActive}
                  startIcon={globalState.isActive ? <PauseIcon /> : <PlayIcon />}
                >
                  {globalState.isActive ? "Désactiver" : "Activer"}
                </Button>
                
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={handleRandomMessage}
                >
                  Message aléatoire
                </Button>
                
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={handleRandomCounter}
                >
                  Compteur aléatoire
                </Button>
                
                <Button 
                  size="small" 
                  variant="outlined" 
                  color="warning"
                  onClick={resetState}
                  startIcon={<RefreshIcon />}
                >
                  Reset
                </Button>
                
                <Divider />
                
                <Button 
                  size="small" 
                  variant="outlined" 
                  color="error"
                  onClick={logout}
                  startIcon={<LogoutIcon />}
                >
                  Se déconnecter
                </Button>
              </>
            ) : (
              <Alert severity="info">
                Connectez-vous pour interagir avec l&apos;état global
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TestStateComponent;
