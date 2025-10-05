"use client"
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import GoogleIcon from '@mui/icons-material/Google'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      console.log('Attempting login to:', `${API_BASE_URL}/auth/sign-in`);
      console.log('Login data:', { email, password: '***' });
      
      const res = await fetch(`${API_BASE_URL}/auth/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      
      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      console.log('Response headers:', res.headers);
      
      if (!res.ok) {
        console.error('Response not ok, trying to get error details...');
        try {
          const errorData = await res.text();
          console.error('Error response:', errorData);
          
          let parsedError;
          try {
            parsedError = JSON.parse(errorData);
          } catch {
            parsedError = { message: errorData };
          }
          
          if (res.status === 401) {
            alert(parsedError.message || 'Invalid credentials.');
          } else {
            alert(parsedError.message || `Server error: ${res.status}`);
          }
          return;
        } catch (textError) {
          console.error('Could not read error response:', textError);
          alert(`Server error: ${res.status} - Could not read response`);
          return;
        }
      }
      
      const data = await res.json();
      console.log('Response data:', data);
      
      if (data.session_token) {
        console.log('Token received:', data.session_token?.substring(0, 10) + '...');
        login(data.session_token);
        alert('Login successful!');
        router.push('/explore');
      } else {
        console.error('No session_token in response');
        alert('Login error: No token received');
      }
    } catch (error) {
      console.error(' Login error details:', error);
      
      const err = error as Error;
      console.error(' Error name:', err.name);
      console.error(' Error message:', err.message);
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        alert('Cannot connect to server. Please check if the backend is running on port 3000.');
      } else {
        alert(`Network or server error: ${err.message}`);
      }
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        {/* Logo Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Box
            component="img"
            src="/assets/AreaLogo-Photoroom.png"
            alt="AREA Logo"
            sx={{
              height: 60,
              width: 60,
              mb: 2,
              filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15))'
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'black',
            }}
          >
            AREA
          </Typography>
        </Box>

        {/* Login Form */}
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 400,
            p: 4,
            borderRadius: 3,
            border: '1px solid #e0e0e0',
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              color: 'black',
              fontWeight: 600,
              mb: 4
            }}
          >
            Log in
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Email Field */}
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'black',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'black',
                },
              }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'black',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'black',
                },
              }}
            />

            {/* Login Button */}
            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              sx={{
                py: 1.5,
                borderRadius: 2,
                backgroundColor: 'black',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#333333',
                },
              }}
            >
              Log in
            </Button>

            {/* Divider */}
            <Box sx={{ my: 2 }}>
              <Divider sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                or
              </Divider>
            </Box>

            {/* Social Login Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: '#e0e0e0',
                  color: 'black',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: 'black',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                Continue with Google
              </Button>
            </Box>

            {/* Sign Up Link */}
            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 3, color: '#666666' }}
            >
              New to AREA?{' '}
              <Link
                href="/signup"
                style={{
                  color: 'black',
                  textDecoration: 'none',
                  fontWeight: 500
                }}
              >
                Sign up here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
