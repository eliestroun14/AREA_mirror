'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function OAuthSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = React.useState(3);

  useEffect(() => {
    // Auto-close window after 3 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Try to close the window (works if opened by window.open)
          window.close();
          // If window.close() doesn't work, redirect to home
          setTimeout(() => {
            router.push('/explore');
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleCloseNow = () => {
    window.close();
    // If window.close() doesn't work, redirect to home
    setTimeout(() => {
      router.push('/explore');
    }, 500);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            <CheckCircleIcon
              sx={{
                fontSize: 80,
                color: 'success.main',
                animation: 'scaleIn 0.5s ease-out',
                '@keyframes scaleIn': {
                  '0%': {
                    transform: 'scale(0)',
                    opacity: 0,
                  },
                  '50%': {
                    transform: 'scale(1.1)',
                  },
                  '100%': {
                    transform: 'scale(1)',
                    opacity: 1,
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
            Sign In Successful!
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Your account has been successfully connected. This window will close automatically in {countdown} seconds.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleCloseNow}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a4193 100%)',
              },
            }}
          >
            Close Now
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
