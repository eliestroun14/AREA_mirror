"use client"
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Link from 'next/link'
import Box from '@mui/material/Box'

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          AREA
        </Typography>
        <Box>
          <Button color="inherit" component={Link} href="/login">
            Connexion
          </Button>
          <Button color="inherit" component={Link} href="/signup">
            Inscription
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
