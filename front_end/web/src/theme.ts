import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#005acd',
    },
    text: {
      primary: '#000000',
      secondary: '#333333',
    },
    background: {
      default: '#f5ffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
})

export default theme
