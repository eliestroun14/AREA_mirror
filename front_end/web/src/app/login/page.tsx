"use client"
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import InputField from '@/components/InputField'
import MyButton from '@/components/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

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
        alert(data.message || 'Identifiants invalides.');
      } else if (res.ok && data.access_token) {
        login(data.access_token);
        alert('Connexion réussie !');
        router.push('/');
      } else {
        alert(data.message || 'Erreur lors de la connexion.');
      }
    } catch {
      alert('Erreur réseau ou serveur.');
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        width: '100%',
        maxWidth: 400,
      }}
    >
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Box
          component="img"
          src="/assets/AreaLogo-Photoroom.png"
          alt="AREA Logo"
          sx={{ height: 48, width: 48, mr: 2 }}
        />
        <Typography
          variant="h3"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: '#005acd',
          }}
        >
          AREA
        </Typography>
      </Box>

      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#005acd', fontWeight: 600 }}>
        Connexion
      </Typography>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <InputField
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <InputField
          label="Mot de passe"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <MyButton fullWidth onClick={handleLogin}>
          Se connecter
        </MyButton>
      </Box>
      <Typography variant="body2" align="center" sx={{ mt: 2, color: '#666' }}>
        Pas encore de compte ?{' '}
        <Link href="/signup" style={{ color: '#005acd', textDecoration: 'underline' }}>
          Inscrivez-vous
        </Link>
      </Typography>
    </Box>
  )
}
