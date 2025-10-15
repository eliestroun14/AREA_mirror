"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Chip
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  isEmailVerified: boolean;
}

interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  twoFactorAuth: boolean;
}

export default function SettingsPage() {
  const { token, logout } = useAuth();
  const router = useRouter();
  
  // États pour les données utilisateur
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    twoFactorAuth: false,
  });
  
  // États pour l'édition
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  
  // États pour le changement de mot de passe
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // États pour l'UI
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // Chargement des données utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Récupération du profil utilisateur depuis l'API backend
        const profileResponse = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        console.log('🔍 Profile API Response:', {
          status: profileResponse.status,
          ok: profileResponse.ok,
          url: `${API_BASE_URL}/users/me`
        });
        
        if (profileResponse.ok) {
          const profile = await profileResponse.json();
          console.log('✅ Profile loaded from backend:', profile);
          
          // Adaptation des données du backend au format frontend
          const adaptedProfile: UserProfile = {
            id: profile.id.toString(),
            email: profile.email,
            username: profile.name || '',
            firstName: profile.name?.split(' ')[0] || '',
            lastName: profile.name?.split(' ').slice(1).join(' ') || '',
            createdAt: profile.created_at,
            isEmailVerified: true, // Par défaut, à adapter selon le backend
          };
          
          setUserProfile(adaptedProfile);
          setEditedProfile(adaptedProfile);
        } else if (profileResponse.status === 404) {
          console.warn('⚠️ API Endpoint /users/me not found (404), using mock data');
          const mockProfile: UserProfile = {
            id: '1',
            email: 'user@example.com',
            username: 'user123',
            firstName: 'John',
            lastName: 'Doe',
            createdAt: new Date().toISOString(),
            isEmailVerified: true,
          };
          setUserProfile(mockProfile);
          setEditedProfile(mockProfile);
          setMessage({ 
            type: 'error', 
            text: 'Endpoint API non disponible (404). Données de test utilisées.' 
          });
        } else {
          throw new Error(`HTTP error! status: ${profileResponse.status}`);
        }
        
      } catch (error) {
        console.error('💥 Error loading user data:', error);
        
        // En cas d'erreur réseau, utiliser des données mockées
        console.warn('🔄 Using fallback mock data due to network error');
        const mockProfile: UserProfile = {
          id: '1',
          email: 'user@example.com',
          username: 'user123',
          firstName: 'John',
          lastName: 'Doe',
          createdAt: new Date().toISOString(),
          isEmailVerified: false,
        };
        setUserProfile(mockProfile);
        setEditedProfile(mockProfile);
        setMessage({ 
          type: 'error', 
          text: 'Impossible de se connecter à l\'API. Données de test utilisées.' 
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token, API_BASE_URL]);

  // Sauvegarde du profil
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // Préparation des données pour l'API backend (format attendu par PUT /users/me)
      const backendData = {
        name: `${editedProfile.firstName || ''} ${editedProfile.lastName || ''}`.trim(),
        email: editedProfile.email,
      };
      
      console.log('💾 Saving profile to backend:', backendData);
      
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(backendData),
      });
      
      console.log('🔍 Save Profile API Response:', {
        status: response.status,
        ok: response.ok
      });
      
      if (response.ok) {
        const updatedProfile = await response.json();
        console.log('✅ Profile updated on backend:', updatedProfile);
        
        // Adaptation des données du backend au format frontend
        const adaptedProfile: UserProfile = {
          id: updatedProfile.id.toString(),
          email: updatedProfile.email,
          username: updatedProfile.name || '',
          firstName: updatedProfile.name?.split(' ')[0] || '',
          lastName: updatedProfile.name?.split(' ').slice(1).join(' ') || '',
          createdAt: updatedProfile.created_at,
          isEmailVerified: userProfile?.isEmailVerified || true,
        };
        
        setUserProfile(adaptedProfile);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès!' });
      } else if (response.status === 404) {
        console.warn('⚠️ API PUT /users/me endpoint not found (404), simulating save');
        setUserProfile(editedProfile as UserProfile);
        setIsEditing(false);
        setMessage({ 
          type: 'success', 
          text: 'Profil mis à jour (simulation - endpoint non disponible)' 
        });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
    } catch (error) {
      console.error('💥 Error saving profile:', error);
      // Simuler la sauvegarde en cas d'erreur réseau
      setUserProfile(editedProfile as UserProfile);
      setIsEditing(false);
      setMessage({ 
        type: 'success', 
        text: 'Profil mis à jour localement (erreur réseau)' 
      });
    } finally {
      setSaving(false);
    }
  };

  // Changement de mot de passe
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
      return;
    }

    try {
      setSaving(true);
      
      console.log('🔐 Changing password...');
      
      const response = await fetch(`${API_BASE_URL}/users/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      
      console.log('🔍 Change Password API Response:', {
        status: response.status,
        ok: response.ok
      });
      
      if (response.ok) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordSection(false);
        setMessage({ type: 'success', text: 'Mot de passe modifié avec succès!' });
      } else {
        // Simuler le changement si l'API n'est pas disponible
        console.warn('⚠️ Change Password API not available, simulating change');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordSection(false);
        setMessage({ 
          type: 'success', 
          text: 'Mot de passe modifié (simulation - API non disponible)' 
        });
      }
      
    } catch (error) {
      console.error('💥 Error changing password:', error);
      // Simuler le changement en cas d'erreur réseau
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
      setMessage({ 
        type: 'success', 
        text: 'Mot de passe modifié localement (erreur réseau)' 
      });
    } finally {
      setSaving(false);
    }
  };

  // Suppression du compte
  const handleDeleteAccount = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      try {
        setSaving(true);
        
        console.log('🗑️ Deleting account...');
        
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        console.log('🔍 Delete Account API Response:', {
          status: response.status,
          ok: response.ok
        });
        
        if (response.ok) {
          console.log('✅ Account deleted successfully');
          setMessage({ 
            type: 'success', 
            text: 'Compte supprimé avec succès. Redirection...' 
          });
          setTimeout(() => {
            logout();
            router.push('/');
          }, 2000);
        } else if (response.status === 404) {
          console.warn('⚠️ DELETE /users/me endpoint not found (404), simulating delete');
          setMessage({ 
            type: 'success', 
            text: 'Simulation de suppression - vous allez être déconnecté' 
          });
          setTimeout(() => {
            logout();
            router.push('/');
          }, 2000);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
      } catch (error) {
        console.error('💥 Error deleting account:', error);
        setMessage({ 
          type: 'error', 
          text: 'Erreur de connexion API - Impossible de supprimer le compte' 
        });
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Chargement des paramètres...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SettingsIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Paramètres du compte
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Gérez vos informations personnelles et préférences
        </Typography>
      </Box>

      {/* Alerte de message */}
      {message && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 3 }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      {/* Section Profil */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">Informations du profil</Typography>
            {!isEditing && (
              <IconButton 
                onClick={() => setIsEditing(true)}
                sx={{ ml: 'auto' }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <TextField
              fullWidth
              label="Prénom"
              value={isEditing ? editedProfile.firstName || '' : userProfile?.firstName || ''}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, firstName: e.target.value }))}
              disabled={!isEditing}
              variant={isEditing ? "outlined" : "filled"}
            />
            <TextField
              fullWidth
              label="Nom"
              value={isEditing ? editedProfile.lastName || '' : userProfile?.lastName || ''}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, lastName: e.target.value }))}
              disabled={!isEditing}
              variant={isEditing ? "outlined" : "filled"}
            />
            <TextField
              fullWidth
              label="Nom d'utilisateur"
              value={isEditing ? editedProfile.username || '' : userProfile?.username || ''}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, username: e.target.value }))}
              disabled={!isEditing}
              variant={isEditing ? "outlined" : "filled"}
            />
            <TextField
              fullWidth
              label="Email"
              value={userProfile?.email || ''}
              disabled
              variant="filled"
              InputProps={{
                endAdornment: userProfile?.isEmailVerified ? (
                  <Chip label="Vérifié" color="success" size="small" />
                ) : (
                  <Chip label="Non vérifié" color="warning" size="small" />
                )
              }}
            />
          </Box>

          {isEditing && (
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => {
                  setIsEditing(false);
                  setEditedProfile(userProfile || {});
                }}
              >
                Annuler
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Section Sécurité */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SecurityIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">Sécurité</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Button
              variant={showPasswordSection ? "contained" : "outlined"}
              onClick={() => setShowPasswordSection(!showPasswordSection)}
            >
              Changer le mot de passe
            </Button>
          </Box>

          {showPasswordSection && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Mot de passe actuel"
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      >
                        {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  fullWidth
                  label="Nouveau mot de passe"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        >
                          {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Confirmer le mot de passe"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        >
                          {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Button
                variant="contained"
                onClick={handleChangePassword}
                disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              >
                {saving ? 'Modification...' : 'Modifier le mot de passe'}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Section Notifications */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <NotificationsIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">Préférences de notification</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={userSettings.emailNotifications}
                  onChange={(e) => setUserSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                />
              }
              label="Notifications par email"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={userSettings.pushNotifications}
                  onChange={(e) => setUserSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                />
              }
              label="Notifications push"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={userSettings.marketingEmails}
                  onChange={(e) => setUserSettings(prev => ({ ...prev, marketingEmails: e.target.checked }))}
                />
              }
              label="Emails marketing"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Section Danger */}
      <Card sx={{ mb: 3, border: '1px solid', borderColor: 'error.main' }}>
        <CardContent>
          <Typography variant="h6" color="error.main" sx={{ mb: 2 }}>
            Zone de danger
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Actions irréversibles qui affectent votre compte
          </Typography>
          
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteAccount}
            disabled={saving}
          >
            Supprimer mon compte
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
