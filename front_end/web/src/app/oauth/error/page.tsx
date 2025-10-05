'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

export default function OAuthErrorPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/explore');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            background: 'white',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <ErrorIcon
              sx={{
                fontSize: 80,
                color: 'error.main',
                animation: 'shake 0.5s ease-out',
                '@keyframes shake': {
                  '0%, 100%': {
                    transform: 'translateX(0)',
                  },
                  '25%': {
                    transform: 'translateX(-10px)',
                  },
                  '75%': {
                    transform: 'translateX(10px)',
                  },
                },
              }}
            />
          </Box>

          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              mb: 2,
            }}
          >
            Sign In Failed
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            There was an error connecting your account. Please try again later.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleGoBack}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #e04a5f 0%, #df84ea 100%)',
              },
            }}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
