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
import FacebookIcon from '@mui/icons-material/Facebook'
import AppleIcon from '@mui/icons-material/Apple'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:3000/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.status === 401) {
        alert(data.message || 'Invalid credentials.');
      } else if (res.ok && data.access_token) {
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
              filter: 'drop-shadow(0 2px 8px rgba(0, 90, 205, 0.15))'
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: '#005acd',
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
            border: '1px solid',
            borderColor: 'rgba(0, 90, 205, 0.1)',
            backgroundColor: 'white',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              color: '#005acd',
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
                    borderColor: '#005acd',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#005acd',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#005acd',
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
                    borderColor: '#005acd',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#005acd',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#005acd',
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
                backgroundColor: '#005acd',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#004494',
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
                  borderColor: '#dadce0',
                  color: '#3c4043',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: '#005acd',
                    backgroundColor: 'rgba(0, 90, 205, 0.04)',
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
              sx={{ mt: 3, color: 'text.secondary' }}
            >
              New to AREA?{' '}
              <Link
                href="/signup"
                style={{
                  color: '#005acd',
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
