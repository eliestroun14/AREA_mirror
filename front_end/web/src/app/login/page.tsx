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
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  const router = useRouter()
  const { login } = useAuth()
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const handleLogin = async () => {
    try {
      const loginUrl = `${API_BASE_URL}/auth/sign-in`;
      
      console.log('🔑 Attempting login...');
      console.log('📍 API URL:', loginUrl);
      console.log('📧 Email:', email);
      console.log('🌐 Environment:', process.env.NODE_ENV);
      
      // Vérification basique des champs
      if (!email || !password) {
        alert('Veuillez remplir tous les champs');
        return;
      }
      
      const res = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      
      console.log('📊 Response status:', res.status);
      console.log('✅ Response ok:', res.ok);
      console.log('📋 Response headers:', Object.fromEntries(res.headers.entries()));
      
      if (!res.ok) {
        console.error('❌ Response not ok, analyzing error...');
        console.log('🔧 API seems unavailable, checking for development mode...');
        
        // Mode développement : simuler la connexion si l'API n'est pas disponible
        // Déclenchement plus large pour le mode dev (erreurs serveur, endpoints non trouvés, etc.)
        if (res.status === 404 || res.status >= 500 || res.status === 502 || res.status === 503) {
          console.warn('🧪 API not available (status: ' + res.status + '), enabling development mode');
          
          // Simuler une connexion réussie avec un token factice
          const mockToken = `dev_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          console.log('🎭 Mock token generated:', mockToken.substring(0, 20) + '...');
          
          login(mockToken);
          alert('🧪 Mode développement : Connexion simulée réussie!\n\nAPI backend non disponible (status: ' + res.status + '), utilisation d\'un token factice.\n\nVous pouvez maintenant naviguer dans l\'application.');
          router.push('/explore');
          return;
        }
        
        // Gestion détaillée des erreurs par code de statut pour les vraies erreurs API
        let errorMessage = 'Une erreur est survenue';
        
        try {
          const errorData = await res.text();
          console.error('📄 Error response body:', errorData);
          
          let parsedError;
          try {
            parsedError = JSON.parse(errorData);
            console.error('📝 Parsed error:', parsedError);
          } catch {
            parsedError = { message: errorData };
          }
          
          switch (res.status) {
            case 400:
              errorMessage = parsedError.message || 'Données de connexion invalides';
              break;
            case 401:
              errorMessage = parsedError.message || 'Email ou mot de passe incorrect';
              break;
            case 403:
              errorMessage = 'Accès refusé. Compte peut-être désactivé.';
              break;
            case 404:
              errorMessage = 'Service de connexion non trouvé. Vérifiez que le serveur est démarré.';
              break;
            case 500:
              errorMessage = 'Erreur serveur interne. Veuillez réessayer plus tard.';
              break;
            case 502:
            case 503:
            case 504:
              errorMessage = 'Serveur temporairement indisponible. Veuillez réessayer.';
              break;
            default:
              errorMessage = parsedError.message || `Erreur serveur (${res.status})`;
          }
          
        } catch (textError) {
          console.error('💥 Could not read error response:', textError);
          errorMessage = `Erreur serveur (${res.status}) - Impossible de lire la réponse`;
        }
        
        console.error('🚨 Final error message:', errorMessage);
        alert(errorMessage);
        return;
      }
      
      const data = await res.json();
      console.log('✅ Login successful! Response data:', data);
      
      if (data.session_token) {
        console.log('🎫 Token received:', data.session_token?.substring(0, 10) + '...');
        login(data.session_token);
        alert('Connexion réussie !');
        router.push('/explore');
      } else {
        console.error('❌ No session_token in response:', data);
        alert('Erreur de connexion: Token non reçu du serveur');
      }
      
    } catch (error) {
      console.error('💥 Login error details:', error);
      
      const err = error as Error;
      console.error('🏷️ Error name:', err.name);
      console.error('💬 Error message:', err.message);
      console.error('📚 Error stack:', err.stack);
      
      // Mode développement en cas d'erreur réseau ou de connexion
      if (err.name === 'TypeError' && (err.message.includes('fetch') || err.message.includes('Failed to fetch'))) {
        console.warn('🧪 Network error detected, enabling development mode');
        
        // Simuler une connexion réussie
        const mockToken = `dev_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log('🎭 Mock token generated for network error:', mockToken.substring(0, 20) + '...');
        
        login(mockToken);
        alert('🧪 Mode développement activé!\n\nImpossible de contacter le serveur.\nConnexion simulée avec un token factice.\n\nVous pouvez maintenant naviguer dans l\'application.');
        router.push('/explore');
        return;
      }
      
      // Pour toute autre erreur de connexion, proposer le mode développement
      if (err.name === 'TypeError' || err.message.includes('NetworkError') || err.message.includes('ERR_')) {
        console.warn('🧪 Connection error detected, offering development mode');
        
        const shouldUseDev = window.confirm(
          '❌ Erreur de connexion au serveur\n\n' +
          'Voulez-vous activer le mode développement ?\n' +
          '(Simulation locale sans serveur backend)'
        );
        
        if (shouldUseDev) {
          const mockToken = `dev_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          console.log('🎭 User chose dev mode, mock token:', mockToken.substring(0, 20) + '...');
          
          login(mockToken);
          alert('🧪 Mode développement activé!\nConnexion simulée réussie.');
          router.push('/explore');
          return;
        }
      }
      
      let userMessage = 'Une erreur de connexion est survenue';
      
      if (err.name === 'TypeError') {
        if (err.message.includes('NetworkError')) {
          userMessage = 'Erreur réseau. Vérifiez votre connexion internet.';
        }
      } else if (err.name === 'AbortError') {
        userMessage = 'La requête a été interrompue. Veuillez réessayer.';
      } else if (err.message.includes('CORS')) {
        userMessage = 'Problème de configuration serveur (CORS). Contactez l&apos;administrateur.';
      }
      
      console.error('🚨 User will see:', userMessage);
      alert(userMessage);
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
            
            {/* Mode Développement */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => {
                  const mockToken = `dev_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                  console.log('🧪 Manual dev mode activation:', mockToken.substring(0, 20) + '...');
                  login(mockToken);
                  alert('🧪 Mode développement activé manuellement!\nConnexion simulée réussie.');
                  router.push('/explore');
                }}
                sx={{ 
                  color: '#666666', 
                  borderColor: '#ddd',
                  fontSize: '0.75rem',
                  px: 2,
                  py: 0.5,
                  '&:hover': {
                    borderColor: '#999',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                🧪 Mode Développement (Sans Backend)
              </Button>
            </Box>
            
            {/* Section Debug */}
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="text" 
                size="small" 
                onClick={() => setShowDebugInfo(!showDebugInfo)}
                sx={{ color: '#666666', fontSize: '0.8rem' }}
              >
                {showDebugInfo ? 'Masquer' : 'Afficher'} les infos de debug
              </Button>
              
              {showDebugInfo && (
                <Box sx={{ 
                  mt: 2, 
                  p: 2, 
                  bgcolor: '#f5f5f5', 
                  borderRadius: 1,
                  fontSize: '0.8rem',
                  color: '#666666'
                }}>
                  <Typography variant="caption" display="block">
                    <strong>URL API:</strong> {API_BASE_URL}
                  </Typography>
                  <Typography variant="caption" display="block">
                    <strong>Endpoint Login:</strong> {API_BASE_URL}/auth/sign-in
                  </Typography>
                  <Typography variant="caption" display="block">
                    <strong>Environnement:</strong> {process.env.NODE_ENV || 'development'}
                  </Typography>
                  <Typography variant="caption" display="block">
                    <strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent.slice(0, 50) + '...' : 'N/A'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
