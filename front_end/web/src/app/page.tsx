"use client";
import * as React from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import database from "@/data/database.json";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => setIsMounted(true), []);
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

  const popularApplets = database.applets.filter(applet => applet.is_popular);

  const getServiceColor = (serviceName: string) => {
    const service = database.services.find(s => s.name === serviceName);
    return service ? service.service_color : "black";
  };

  const featuredServices = database.services.slice(0, 11);

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
        </Box>
      </Container>

      {/* Popular Applets Section */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            sx={{
              color: 'black',
              fontWeight: 600,
              mb: 1
            }}
          >
            Get started with any Applet
          </Typography>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(2, 1fr)'
            },
            gap: 3,
            mt: 5,
            maxWidth: '900px',
            mx: 'auto'
          }}>
            {popularApplets.map((applet, index) => (
              <Card
                key={index}
                sx={{
                  height: '100%',
                  border: '1px solid',
                  borderColor: '#e0e0e0',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'black',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardActionArea sx={{ height: '100%', p: 3 }}>
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AutoFixHighIcon sx={{ color: getServiceColor(applet.trigger_service), mr: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'black' }}>
                        {applet.title}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="#666666" sx={{ mb: 3 }}>
                      {applet.description}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={applet.trigger_service}
                          size="small"
                          sx={{
                            bgcolor: '#f5f5f5',
                            color: 'black',
                            fontWeight: 500
                          }}
                        />
                        <Chip
                          label={applet.action_service}
                          size="small"
                          sx={{
                            bgcolor: '#f5f5f5',
                            color: 'black',
                            fontWeight: 500
                          }}
                        />
                      </Box>
                      <Typography variant="caption" color="#666666" sx={{ fontWeight: 600 }}>
                        {applet.users} users
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: 8 }}>
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
            ... or choose from {database.services.length}+ services
          </Typography>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(3, 1fr)',
              sm: 'repeat(4, 1fr)',
              md: 'repeat(6, 1fr)'
            },
            gap: 3,
            mb: 5
          }}>
            {featuredServices.map((service, index) => (
              <Card
                key={index}
                sx={{
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: '#e0e0e0',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'black',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-2px)'
                  }
                }}
                onClick={() => handleServiceClick(service.id)}
              >
                <CardActionArea>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <CardMedia
                      component="img"
                      height="40"
                      image={`/assets/${service.image}`}
                      alt={service.name}
                      sx={{
                        objectFit: 'contain',
                        mb: 1,
                        maxWidth: '40px',
                        mx: 'auto'
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'black',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    >
                      {service.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
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
      <Box sx={{ bgcolor: '#f8f9fa', py: 8 }}>
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
