"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
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
        setServices(backendServices);
        
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

  const handleServiceClick = (serviceName: string) => {
    router.push(`/services/${encodeURIComponent(serviceName)}`);
  };

  const handleRetry = () => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const backendServices = await apiService.getAllServices();
        setServices(backendServices);
        
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
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}
        >
          {filteredServices.map((service) => (
            <Box
              key={service.id}
              sx={{
                width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
                maxWidth: 345
              }}
            >
              <Card sx={{ 
                maxWidth: 345, 
                mx: "auto", 
                height: '100%',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-2px)',
                  borderColor: 'black'
                },
                transition: 'all 0.3s ease'
              }}>
                <CardActionArea onClick={() => handleServiceClick(service.name)}>
                  <ServiceImage 
                    service={{
                      name: service.name,
                      icon_url: service.icon_url,
                      services_color: service.services_color
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" align="center" color="black">
                      {service.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
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
