"use client"
import { useState } from 'react'
import Link from 'next/link'
import Card from '@/components/Card'
import InputField from '@/components/InputField'
import MyButton from '@/components/Button'
import Typography from '@mui/material/Typography'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    console.log("Login avec:", { email, password })
    // API
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
