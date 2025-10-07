import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import DownloadIcon from '@mui/icons-material/Download';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

const settings = ['Logout'];

function ResponsiveAppBar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) return null;

  // Pages disponibles selon l'état de connexion
  const availablePages = isAuthenticated 
    ? ['Explore', 'Create', 'My applets']
    : ['Explore'];

  // URL de redirection du logo selon l'état de connexion
  const logoRedirectUrl = isAuthenticated ? '/explore' : '/';

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handlePageNavigation = (page: string) => {
    switch (page) {
      case 'Create':
        router.push('/create');
        break;
      case 'Explore':
        router.push('/explore');
        break;
      case 'My applets':
        router.push('/my_applets');
        break;
      default:
        break;
    }
    handleCloseNavMenu();
  };

  const handleDownload = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/download/apk`);
      
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'downloaded-file'; // Fallback par défaut
      
      console.log('Content-Disposition header:', contentDisposition);
      
      if (contentDisposition) {
        // Essayer différents patterns de parsing
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      
      console.log('Filename extracted:', filename);
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.0)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: { xs: 1, md: 0 },
              justifyContent: { xs: 'center', md: 'flex-start' },
              width: { xs: '100%', md: 'auto' },
              position: { xs: 'absolute', md: 'static' },
              left: { xs: 0, md: 'auto' },
              right: { xs: 0, md: 'auto' },
              top: { xs: 0, md: 'auto' },
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', pointerEvents: 'auto' }}>
              <Box component="img" src="/assets/AreaLogo-Photoroom.png" alt="" sx={{ height: 32, width: 32, mr: 1, }}/>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href={logoRedirectUrl}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(logoRedirectUrl);
                }}
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'black',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                AREA
              </Typography>
            </Box>
          </Box>

          {/* Hamburger responsive */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, position: 'relative', zIndex: 1 }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ ml: 1, color: 'black' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {availablePages.map((page) => (
                <MenuItem key={page} onClick={() => handlePageNavigation(page)}>
                  <Typography sx={{ textAlign: 'center', color: 'black' }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop page names - left, close to logo */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 2, gap: 2, alignItems: 'center' }}>
            {availablePages.map((page) => (
              <Button
                key={page}
                onClick={() => handlePageNavigation(page)}
                sx={{ color: 'black', px: 2, fontWeight: 500, fontSize: '1rem', minWidth: 0 }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Spacer to push auth section to right */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Authenticated menu or login button - always right */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Download button */}
            <Tooltip title="Download mobile app">
              <IconButton
                onClick={handleDownload}
                sx={{
                  color: 'black',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>

            {isAuthenticated ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="User" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={() => {
                      handleCloseUserMenu();
                      if (setting === 'Logout') logout();
                    }}>
                      <Typography sx={{ textAlign: 'center', color: 'black' }}>{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Button 
                href="/login"
                sx={{ 
                  color: 'black',
                  border: '1px solid black',
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
