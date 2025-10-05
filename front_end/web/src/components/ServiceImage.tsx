import { useState } from 'react';
import { CardMedia, Box } from '@mui/material';

interface ServiceImageProps {
  service: {
    name: string;
    icon_url: string | null;
    services_color: string;
  };
  height?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export function ServiceImage({ service, height = 140 }: ServiceImageProps) {
  const [imageError, setImageError] = useState(false);

  // Construire l'URL complète de l'image depuis le backend
  const getImageUrl = (iconUrl: string | null): string | null => {
    if (!iconUrl) return null;
    
    // Si l'URL est déjà complète, l'utiliser telle quelle
    if (iconUrl.startsWith('http://') || iconUrl.startsWith('https://')) {
      return iconUrl;
    }
    
    // Si c'est un chemin relatif, construire l'URL complète avec le backend
    if (iconUrl.startsWith('/')) {
      return `${API_BASE_URL}${iconUrl}`;
    }
    
    // Si c'est juste un nom de fichier, supposer qu'il est dans le dossier assets
    return `${API_BASE_URL}/assets/${iconUrl}`;
  };

  const fullImageUrl = getImageUrl(service.icon_url);

  if (!fullImageUrl || imageError) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: service.services_color || '#f5f5f5',
          color: 'white',
          fontSize: '3rem',
          fontWeight: 'bold'
        }}
      >
        {service.name.charAt(0)}
      </Box>
    );
  }

  return (
    <CardMedia
      component="img"
      height={height}
      image={fullImageUrl}
      alt={service.name}
      sx={{ 
        objectFit: 'contain', 
        p: 2,
        backgroundColor: '#f5f5f5'
      }}
      onError={() => setImageError(true)}
    />
  );
}
