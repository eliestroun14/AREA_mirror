"use client"
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import BoltIcon from '@mui/icons-material/Bolt'
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact'
import SettingsIcon from '@mui/icons-material/Settings'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}))

const steps = [
  'Clicker sur créer un applet',
  'Choisir un déclencheur',
  'Se connecter aux services (si nécessaire/pas encore fait)',
  'Choisir une action',
  'Se connecter aux services (si nécessaire/pas encore fait)',
  'Configurer son action',
  'Repeter pour des actions supplémentaires (optionnel)',
  'Tester et activer votre applet'
]

export default function HelpPage() {
  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "#FFFFFF",
        minHeight: "calc(100vh - 64px)",
        overflow: "auto",
        maxWidth: 1200,
        margin: '0 auto'
      }}
    >
      <Typography variant="h3" align="center" color="primary.main" gutterBottom>
        Comment créer des Applets AREA
      </Typography>
      
      <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Automatisez vos tâches quotidiennes en connectant vos services préférés
      </Typography>

      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body2">
          Un <strong>Applet</strong> (ou &quot;Zap&quot;) est un workflow automatisé qui connecte deux ou plusieurs applications. 
          Il fonctionne sur le principe &quot;SI ceci ALORS cela&quot; : quand quelque chose se passe dans une application (déclencheur), 
          une action est automatiquement exécutée dans une autre application.
        </Typography>
      </Alert>

      {/* Étapes principales */}
      <StyledCard>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BoltIcon color="primary" />
            Étapes de création d&apos;un Applet
          </Typography>
          
          <List sx={{ mt: 2 }}>
            {steps.map((label, index) => (
              <ListItem 
                key={`${index}-${label}`}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  py: 1.5,
                  px: 0
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    {index + 1}
                  </Box>
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                    {label}
                  </Typography>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </StyledCard>

      {/* Choisir un déclencheur */}
      <StyledCard>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PlayCircleOutlineIcon color="primary" />
            Choisir un déclencheur (Trigger)
          </Typography>
          
          <Typography variant="body1" paragraph>
            Le déclencheur est l&apos;événement qui va lancer votre applet. C&apos;est le &quot;SI&quot; de votre automation.
          </Typography>

          <Typography variant="h6" gutterBottom>Types de déclencheurs :</Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Déclencheurs de polling" 
                secondary="AREA vérifie périodiquement s&apos;il y a du nouveau contenu (ex: nouveaux emails)"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Déclencheurs webhook" 
                secondary="Le service envoie instantanément une notification à AREA quand quelque chose se passe"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Déclencheurs programmés" 
                secondary="Se déclenchent à des intervalles réguliers (toutes les 5 minutes, chaque jour, etc.)"
              />
            </ListItem>
          </List>
        </CardContent>
      </StyledCard>

      {/* Configurer les actions */}
      <StyledCard>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon color="primary" />
            Configurer les actions
          </Typography>
          
          <Typography variant="body1" paragraph>
            Les actions sont ce qui va se passer quand votre déclencheur s&apos;active. C&apos;est le &quot;ALORS&quot; de votre automation.
          </Typography>

          <Typography variant="h6" gutterBottom>Configuration des actions :</Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Sélectionnez le service de destination" 
                secondary="Choisissez dans quel service l'action va s'exécuter"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Configurez les paramètres" 
                secondary="Remplissez les champs requis (destinataire, message, etc.)"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Utilisez les variables" 
                secondary="Intégrez des données du déclencheur dans votre action (nom de l&apos;expéditeur, contenu du message, etc.)"
              />
            </ListItem>
          </List>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Astuce :</strong> Vous pouvez ajouter plusieurs actions à un même déclencheur. 
              Elles s&apos;exécuteront séquentiellement.
            </Typography>
          </Alert>
        </CardContent>
      </StyledCard>

      {/* Conseils et bonnes pratiques */}
      <StyledCard>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary">
            💡 Conseils et bonnes pratiques
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <WarningIcon color="warning" />
              </ListItemIcon>
              <ListItemText 
                primary="Attention aux boucles infinies" 
                secondary="Évitez de créer des applets qui se déclenchent mutuellement"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Testez avec des données réelles" 
                secondary="Utilisez de vraies données pour tester vos applets"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Surveillez les limites d'API" 
                secondary="Certains services ont des limites de requêtes par heure/jour"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Donnez des noms descriptifs" 
                secondary="Nommez vos applets de manière claire pour les retrouver facilement"
              />
            </ListItem>
          </List>
        </CardContent>
      </StyledCard>

      <Divider sx={{ my: 4 }} />
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Besoin d&apos;aide supplémentaire ?
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Si vous avez des questions spécifiques ou rencontrez des problèmes, 
          n&apos;hésitez pas à nous contacter à{' '}
          <strong>manech.dubreil@epitech.eu</strong>
        </Typography>
      </Box>
    </Box>
  )
}
