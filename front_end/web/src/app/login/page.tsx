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
      const res = await fetch('http://localhost:8080/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.status === 401) {
        alert(data.message || 'Invalid credentials.');
      } else if (res.ok) {
        login(data.access_token);
        alert('Login successful!');
        router.push('/');
      } else {
        alert(data.message || 'Login error.');
      }
    } catch {
      alert('Network or server error.');
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
