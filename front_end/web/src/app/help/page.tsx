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
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { useRouter } from 'next/navigation'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import BoltIcon from '@mui/icons-material/Bolt'
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact'
import SettingsIcon from '@mui/icons-material/Settings'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}))

const steps = [
  'Click on create an applet',
  'Choose a trigger',
  'Connect to services (if necessary/not already done)',
  'Choose an action',
  'Connect to services (if necessary/not already done)',
  'Configure your action',
  'Repeat for additional actions (optional)',
  'Test and activate your applet'
]

export default function HelpPage() {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

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
      {/* Bouton Retour */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{
            color: 'primary.main',
            borderColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
            }
          }}
        >
          Back
        </Button>
      </Box>

      <Typography variant="h3" align="center" color="primary.main" gutterBottom>
        How to create AREA Applets
      </Typography>
      
      <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Automate your daily tasks by connecting your favorite services
      </Typography>

      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body2">
          An <strong>Applet</strong> (or &quot;Zap&quot;) is an automated workflow that connects two or more applications. 
          It works on the principle &quot;IF this THEN that&quot;: when something happens in one application (trigger), 
          an action is automatically executed in another application.
        </Typography>
      </Alert>

      {/* Étapes principales */}
      <StyledCard>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BoltIcon color="primary" />
            Applet creation steps
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
            Choose a trigger
          </Typography>
          
          <Typography variant="body1" paragraph>
            The trigger is the event that will launch your applet. It&apos;s the &quot;IF&quot; of your automation.
          </Typography>

          <Typography variant="h6" gutterBottom>Types of triggers:</Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Polling triggers" 
                secondary="AREA periodically checks if there is new content (e.g: new emails)"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Webhook triggers" 
                secondary="The service instantly sends a notification to AREA when something happens"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Scheduled triggers" 
                secondary="Trigger at regular intervals (every 5 minutes, every day, etc.)"
              />
            </ListItem>
          </List>
        </CardContent>
      </StyledCard>

      {/* Configure actions */}
      <StyledCard>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon color="primary" />
            Configure actions
          </Typography>
          
          <Typography variant="body1" paragraph>
            Actions are what will happen when your trigger activates. It&apos;s the &quot;THEN&quot; of your automation.
          </Typography>

          <Typography variant="h6" gutterBottom>Action configuration:</Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Select the destination service" 
                secondary="Choose which service the action will execute in"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Configure the parameters" 
                secondary="Fill in the required fields (recipient, message, etc.)"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Use variables" 
                secondary="Integrate data from the trigger into your action (sender name, message content, etc.)"
              />
            </ListItem>
          </List>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Tip:</strong> You can add multiple actions to the same trigger. 
              They will execute sequentially.
            </Typography>
          </Alert>
        </CardContent>
      </StyledCard>

      {/* Tips and best practices */}
      <StyledCard>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary">
            💡 Tips and best practices
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <WarningIcon color="warning" />
              </ListItemIcon>
              <ListItemText 
                primary="Beware of infinite loops" 
                secondary="Avoid creating applets that trigger each other"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Test with real data" 
                secondary="Use real data to test your applets"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Monitor API limits" 
                secondary="Some services have request limits per hour/day"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Give descriptive names" 
                secondary="Name your applets clearly to find them easily"
              />
            </ListItem>
          </List>
        </CardContent>
      </StyledCard>

      <Divider sx={{ my: 4 }} />
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Need additional help?
        </Typography>
        <Typography variant="body1" color="text.secondary">
          If you have specific questions or encounter problems, 
          feel free to contact us at{' '}
          <strong>manech.dubreil@epitech.eu</strong>
        </Typography>
      </Box>
    </Box>
  )
}
