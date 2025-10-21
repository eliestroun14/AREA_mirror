"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Avatar,
  Stack,
  IconButton
} from '@mui/material';
import {
  History as HistoryIcon,
  ArrowBack as ArrowBackIcon,
  Link as LinkIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { apiService } from '@/services/api';
import { ActivityDTO } from '@/types/api';

export default function ActivityPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getUserActivities(token);
      setActivities(response.activities);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
      setError('Impossible de charger les activités');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchActivities();
  }, [isAuthenticated, fetchActivities, router]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'connection':
        return <LinkIcon color="primary" />;
      case 'zap_execution':
        return <PlayArrowIcon color="action" />;
      default:
        return <HistoryIcon color="action" />;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
      case 'success':
        return <CheckCircleIcon color="success" fontSize="small" />;
      case 'failed':
      case 'error':
        return <ErrorIcon color="error" fontSize="small" />;
      case 'running':
      case 'in_progress':
        return <ScheduleIcon color="warning" fontSize="small" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
      case 'success':
        return 'success';
      case 'failed':
      case 'error':
        return 'error';
      case 'running':
      case 'in_progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return 'À l\'instant';
    } else if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    } else if (diffInDays < 30) {
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton 
            onClick={() => router.push('/profil')} 
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <HistoryIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Activités récentes
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {activities.length === 0 ? (
          <Box textAlign="center" py={6}>
            <HistoryIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Aucune activité récente
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Créez des connexions et des applets pour voir vos activités ici.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {activities.map((activity, index) => (
              <Card key={index} variant="outlined" sx={{ transition: 'all 0.2s', '&:hover': { boxShadow: 2 } }}>
                <CardContent>
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <Avatar sx={{ bgcolor: 'primary.light', mt: 0.5 }}>
                      {getActivityIcon(activity.type)}
                    </Avatar>
                    
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {activity.title}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          {(() => {
                            const status = activity.meta?.status;
                            if (status && typeof status === 'string') {
                              return getStatusIcon(status);
                            }
                            return null;
                          })()}
                          {(() => {
                            const status = activity.meta?.status;
                            if (status && typeof status === 'string') {
                              return (
                                <Chip 
                                  label={status}
                                  size="small"
                                  color={getStatusColor(status) as 'success' | 'error' | 'warning' | 'default'}
                                  variant="outlined"
                                />
                              );
                            }
                            return null;
                          })()}
                        </Box>
                      </Box>
                      
                      {activity.description && (
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          {activity.description}
                        </Typography>
                      )}
                      
                      <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                        <Typography variant="caption" color="textSecondary">
                          {formatDate(activity.created_at)}
                        </Typography>
                        
                        {activity.meta && (
                          <Box display="flex" gap={1} flexWrap="wrap">
                            {(() => {
                              const serviceName = activity.meta.service_name;
                              if (serviceName && typeof serviceName === 'string') {
                                return (
                                  <Chip 
                                    label={serviceName}
                                    size="small"
                                    variant="outlined"
                                  />
                                );
                              }
                              return null;
                            })()}
                            {(() => {
                              const duration = activity.meta.duration_ms;
                              if (duration && typeof duration === 'number') {
                                return (
                                  <Chip 
                                    label={`${duration}ms`}
                                    size="small"
                                    variant="outlined"
                                  />
                                );
                              }
                              return null;
                            })()}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Paper>
    </Container>
  );
}
