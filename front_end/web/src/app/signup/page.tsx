"use client"
import { useState } from 'react'
import Link from 'next/link'
import Card from '@/components/Card'
import InputField from '@/components/InputField'
import MyButton from '@/components/Button'
import Typography from '@mui/material/Typography'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSignup = () => {
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }
    console.log("Signup avec:", { email, password })
    // API
  }

  return (
    <Card>
      <Typography variant="h4" gutterBottom align="center">
        Inscription
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
      <InputField
        label="Confirmer le mot de passe"
        type="password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
      />
      <MyButton fullWidth onClick={handleSignup}>
        S'inscrire
      </MyButton>
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Déjà un compte ? <Link href="/login">Connexion</Link>
      </Typography>
    </Card>
  )
}
