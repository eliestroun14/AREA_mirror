"use client";
import * as React from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useServices } from '@/hooks/useServices';
import ServiceCard from '@/components/ServiceCard';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DownloadIcon from '@mui/icons-material/Download';
import database from "@/data/database.json";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { services, loading, error } = useServices();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => setIsMounted(true), []);
  
  React.useEffect(() => {
    if (isMounted && isAuthenticated) {
      router.push('/explore');
    }
  }, [isMounted, isAuthenticated, router]);
  
  if (!isMounted) return null;

  const handleStartToday = () => {
    if (isAuthenticated) {
      router.push('/create/applets');
    } else {
      router.push('/signup');
    }
  };

  const handleServiceClick = (serviceId: number) => {
    router.push(`/services/${serviceId}`);
  };

  const handleExploreAll = () => {
    router.push('/explore');
  };

  const handleDownload = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/download/apk`);
      
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'downloaded-file'; // Fallback par défaut
      
      console.log('Content-Disposition header:', contentDisposition);
      
      if (contentDisposition) {
        // Essayer différents patterns de parsing
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      
      console.log('Filename extracted:', filename);
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const popularApplets = database.applets.filter(applet => applet.is_popular);

  const getServiceColor = (serviceName: string) => {
    const service = database.services.find(s => s.name === serviceName);
    return service ? service.service_color : "black";
  };

  const displayServices = loading ? [] : services.filter(service => service.is_active).slice(0, 10);

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box sx={{
          textAlign: 'center',
          py: { xs: 8, md: 12 },
          px: { xs: 2, md: 0 }
        }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 700,
              color: 'black',
              mb: 3,
              lineHeight: 1.1,
              letterSpacing: '-0.02em'
            }}
          >
            Automation for
            <br />
            business and home
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              color: '#666666',
              mb: 5,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.5
            }}
          >
            Save time and get more done
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center'
          }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleStartToday}
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: 'black',
                color: 'white',
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  bgcolor: '#333333',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Start today
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={handleDownload}
              startIcon={<DownloadIcon />}
              sx={{
                color: 'black',
                borderColor: 'black',
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#333333',
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Download mobile app
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Services Section */}
      <Box sx={{ bgcolor: '#f8f9fa',py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            sx={{
              color: 'black',
              fontWeight: 600,
              mb: 5
            }}
          >
            ... or choose from {loading ? '900' : services.length}+ services
          </Typography>

          {error && (
            <Typography 
              color="error" 
              align="center" 
              sx={{ mb: 3 }}
            >
              Error loading services: {error}
            </Typography>
          )}

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(auto-fit, minmax(150px, 1fr))',
              sm: 'repeat(auto-fit, minmax(160px, 1fr))',
              md: 'repeat(auto-fit, minmax(180px, 1fr))',
              lg: 'repeat(auto-fit, minmax(200px, 1fr))'
            },
            gap: 4,
            justifyContent: 'center',
            justifyItems: 'center',
            maxWidth: '100%',
            width: 'fit-content',
            mx: 'auto',
            px: { xs: 2, sm: 4, md: 6, lg: 8 },
            mb: 6
          }}>
            {loading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <Card
                  key={index}
                  sx={{
                    height: '160px',
                    minWidth: '150px',
                    borderRadius: 3,
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <CardContent sx={{ 
                    textAlign: 'center', 
                    p: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Skeleton variant="rectangular" width={40} height={40} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" height={20} />
                  </CardContent>
                </Card>
              ))
            ) : (
              displayServices.map((service, index) => (
                <ServiceCard
                  key={service.id || index}
                  service={service}
                  onClick={handleServiceClick}
                />
              ))
            )}
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={handleExploreAll}
              endIcon={<ArrowForwardIcon />}
              sx={{
                color: 'black',
                borderColor: 'black',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#333333',
                  bgcolor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Explore all
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            sx={{
              color: 'black',
              fontWeight: 600,
              mb: 3
            }}
          >
            Make your automations more powerful
          </Typography>

          <Typography
            variant="body1"
            align="center"
            sx={{
              color: '#666666',
              mb: 6,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Customize and control your integrations with advanced features,
            multiple actions, and the ability to connect multiple accounts per service.
          </Typography>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={handleStartToday}
              sx={{
                bgcolor: 'black',
                color: 'white',
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#333333'
                }
              }}
            >
              Start today
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
