"use client"
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/Card'
import InputField from '@/components/InputField'
import MyButton from '@/components/Button'
import Typography from '@mui/material/Typography'

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
    <Card>
      <Typography variant="h4" gutterBottom align="center">
        Connexion
      </Typography>
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
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Pas encore de compte ? <Link href="/signup">Inscrivez-vous</Link>
      </Typography>
    </Card>
  )
}
