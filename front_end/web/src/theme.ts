import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000', // Noir principal comme IFTTT
      light: '#333333',
      dark: '#000000',
    },
    secondary: {
      main: '#FF6B35', // Orange accent comme IFTTT
      light: '#FF8A65',
      dark: '#E64A19',
    },
    text: {
      primary: '#000000', // Texte noir
      secondary: '#666666', // Texte gris
    },
    background: {
      default: '#ffffff', // Fond blanc
      paper: '#ffffff', // Cartes blanches
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5', // Gris très clair pour les sections
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif', // Police moderne comme IFTTT
    h1: {
      fontWeight: 700,
      color: '#000000',
    },
    h2: {
      fontWeight: 600,
      color: '#000000',
    },
    h3: {
      fontWeight: 600,
      color: '#000000',
    },
    h4: {
      fontWeight: 600,
      color: '#000000',
    },
    h5: {
      fontWeight: 500,
      color: '#000000',
    },
    h6: {
      fontWeight: 500,
      color: '#000000',
    },
    body1: {
      color: '#333333',
    },
    body2: {
      color: '#666666',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Pas de majuscules automatiques
          borderRadius: 8, // Coins arrondis modernes
          fontWeight: 500,
        },
        contained: {
          backgroundColor: '#000000',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#333333',
          },
        },
        outlined: {
          borderColor: '#e0e0e0',
          color: '#000000',
          '&:hover': {
            borderColor: '#000000',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Ombre subtile
          borderRadius: 12,
          border: '1px solid #f0f0f0',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#bdbdbd',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000',
            },
          },
        },
      },
    },
  },
})

export default theme
