"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import InputField from '@/components/InputField'
import MyButton from '@/components/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }
    try {
      const res = await fetch('http://localhost:3000/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      });
      const data = await res.json();
      if (res.status === 409) {
        alert(data.message || 'Cet email existe déjà.');
      } else if (res.ok) {
        alert('Inscription réussie !');
        router.push('/login');
      } else {
        alert(data.message || 'Erreur lors de l\'inscription.');
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
        Inscription
      </Typography>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <InputField
          label="Nom"
          value={name}
          onChange={e => setName(e.target.value)}
        />
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
        <InputField
          label="Confirmer le mot de passe"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <MyButton fullWidth onClick={handleSignup}>
          S&apos;inscrire
        </MyButton>
      </Box>
      <Typography variant="body2" align="center" sx={{ mt: 2, color: '#666' }}>
        Déjà un compte ?{' '}
        <Link href="/login" style={{ color: '#005acd', textDecoration: 'underline' }}>
          Connexion
        </Link>
      </Typography>
    </Box>
  )
}
