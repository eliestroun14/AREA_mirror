import React from 'react';
import { Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import { ServiceDTO } from '@/types/api';

interface ServiceCardProps {
  service: ServiceDTO;
  onClick: (serviceId: number) => void;
}

const getServiceColor = (service: ServiceDTO): string => {
  if (service.services_color) {
    return service.services_color;
  }
  
  const colorMap: { [key: string]: string } = {
    'Google': '#4285F4',
    'Gmail': '#EA4335',
    'YouTube': '#FF0000',
    'Spotify': '#1DB954',
    'Discord': '#5865F2',
    'GitHub': '#24292e',
    'Facebook': '#1877F2',
    'Telegram': '#0088cc',
    'Deezer': '#FF6600',
    'RSS Feed': '#FF6600',
    'Webhooks': '#00B4D8',
    'Android Device': '#32DE84',
    'Google Calendar': '#4285F4',
    'Google Sheets': '#0F9D58',
    'Blogger': '#FF5722'
  };
  
  return colorMap[service.name] || '#6B73FF';
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  const serviceColor = getServiceColor(service);
  
  return (
    <Card
      sx={{
        cursor: 'pointer',
        height: '130px',
        minWidth: '150px',
        borderRadius: 3,
        border: 'none',
        backgroundColor: serviceColor,
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
          '& .service-name': {
            fontWeight: 700
          }
        }
      }}
      onClick={() => onClick(service.id)}
    >
      <CardActionArea sx={{ height: '100%' }}>
        <CardContent sx={{ 
          textAlign: 'center', 
          p: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white'
        }}>
          {service.icon_url ? (
            <Box
              component="img"
              src={service.icon_url}
              alt={service.name}
              sx={{
                width: 32,
                height: 32,
                mb: 1,
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)', // Rend l'icône blanche
              }}
            />
          ) : (
            <Box 
              sx={{
                width: 32,
                height: 32,
                mb: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'white'
              }}
            >
              {service.name.charAt(0).toUpperCase()}
            </Box>
          )}
          <Typography
            variant="caption"
            className="service-name"
            sx={{
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem',
              textAlign: 'center',
              lineHeight: 1.3,
              transition: 'all 0.3s ease',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {service.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ServiceCard;
