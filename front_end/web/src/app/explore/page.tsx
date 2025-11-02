"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import { apiService } from '@/services/api';
import { ServiceDTO } from '@/types/api';
import { ServiceImage } from '@/components/ServiceImage';

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
  const backendServices = await apiService.getAllServices();
  setServices(backendServices.filter((s) => Boolean(s.is_active)));
        
      } catch (err) {
        console.error('Failed to fetch services from backend:', err);
        setError(err instanceof Error ? err.message : 'Failed to load services. Please check if the backend is running.');
        setServices([]);
        
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleServiceClick = (serviceId: number) => {
    router.push(`/services/${serviceId}`);
  };

  const handleRetry = () => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
  const backendServices = await apiService.getAllServices();
  setServices(backendServices.filter((s) => Boolean(s.is_active)));
        
      } catch (err) {
        console.error('Failed to fetch services from backend:', err);
        setError(err instanceof Error ? err.message : 'Failed to load services. Please check if the backend is running.');
        setServices([]);
        
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          p: 4,
          bgcolor: "white",
          minHeight: "calc(100vh - 64px)",
          overflow: "auto"
        }}
      >
        <Typography variant="h3" align="center" color="black" gutterBottom>
          Explore all services
        </Typography>
        <Typography variant="body1" align="center" color="#666666" sx={{ mb: 4 }}>
          Discover all our available services to create your personalized applets
        </Typography>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setError(null)}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={handleRetry}
                startIcon={<RefreshIcon />}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Search bar */}
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
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(auto-fit, 220px)',
              sm: 'repeat(auto-fit, 220px)',
              md: 'repeat(auto-fit, 220px)',
              lg: 'repeat(auto-fit, 220px)'
            },
            gap: 3,
            justifyContent: 'center',
            justifyItems: 'center',
            maxWidth: '100%',
            width: '100%',
            mx: 'auto',
            px: { xs: 2, sm: 4, md: 6, lg: 8 },
            mt: 4
          }}
        >
          {filteredServices.map((service) => (
            <Card 
              key={service.id}
              sx={{ 
                height: 220,
                width: 200,
                bgcolor: service.services_color || '#ffffffff',
                color: 'white',
                borderRadius: 3,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                  filter: 'brightness(1.1)'
                }
              }}
              onClick={() => handleServiceClick(service.id)}
            >
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                p: 2,
                '&:last-child': { pb: 2 }
              }}>
                {/* Service Icon */}
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  mb: 2,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <ServiceImage
                    service={{
                      name: service.name,
                      icon_url: service.icon_url,
                      services_color: 'white'
                    }}
                    height={80}
                  />
                </Box>
                
                {/* Service Name */}
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    lineHeight: 1.2,
                    // Prevent long names from enlarging the card: clamp to 2 lines
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {service.name}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {filteredServices.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            {error ? (
              <>
                <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                  Unable to load services
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please make sure the backend server is running and accessible.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleRetry}
                  startIcon={<RefreshIcon />}
                  sx={{ mt: 2 }}
                >
                  Try Again
                </Button>
              </>
            ) : searchTerm ? (
              <Typography variant="h6" color="#666666">
                No service found for &quot;{searchTerm}&quot;
              </Typography>
            ) : (
              <Typography variant="h6" color="#666666">
                No services available
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Container>
  )
}
