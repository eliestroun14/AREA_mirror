"use client";
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

// Routes accessibles quand l'utilisateur N'EST PAS connecté
const PUBLIC_ROUTES = [
  '/',
  '/explore',
  '/login',
  '/signup',
  '/services',
  '/client.apk',
  // Pattern pour /services/[id]
];

// Routes accessibles UNIQUEMENT quand l'utilisateur EST connecté
const PRIVATE_ROUTES = [
  '/create',
  '/help',
  '/my_applets',
  '/oauth',
  '/settings',
  '/profil',
  // Tous les sous-chemins de /create/ et /profil/
];

// Fonction pour vérifier si une route correspond à un pattern
const matchesPattern = (pathname: string, patterns: string[]): boolean => {
  return patterns.some(pattern => {
    // Correspondance exacte
    if (pathname === pattern) return true;
    
    // Pattern avec sous-chemins (ex: /services pour /services/123)
    if (pattern === '/services' && pathname.startsWith('/services/')) return true;
    if (pattern === '/create' && pathname.startsWith('/create/')) return true;
    if (pattern === '/oauth' && pathname.startsWith('/oauth/')) return true;
    if (pattern === '/profil' && pathname.startsWith('/profil/')) return true;
    
    return false;
  });
};

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkRoute = () => {
      console.log('RouteGuard - Checking route:', pathname);
      console.log('User authenticated:', isAuthenticated);
      console.log('PUBLIC_ROUTES:', PUBLIC_ROUTES);
      console.log('PRIVATE_ROUTES:', PRIVATE_ROUTES);

      const isPublicRoute = matchesPattern(pathname, PUBLIC_ROUTES);
      const isPrivateRoute = matchesPattern(pathname, PRIVATE_ROUTES);

      console.log('Is public route:', isPublicRoute);
      console.log('Is private route:', isPrivateRoute);

      if (isAuthenticated) {
        // Utilisateur connecté
        if (isPrivateRoute) {
          // Accès autorisé aux routes privées
          console.log('Authenticated user accessing private route - ALLOWED');
          setIsAuthorized(true);
        } else if (isPublicRoute) {
          // Utilisateur connecté tentant d'accéder aux routes publiques
          if (pathname === '/login' || pathname === '/signup') {
            // Rediriger vers explore si déjà connecté
            console.log('Authenticated user accessing login/signup - REDIRECT to /explore');
            router.replace('/explore');
            return;
          } else {
            // Permettre l'accès aux autres routes publiques (/, /explore, /services)
            console.log('Authenticated user accessing public route - ALLOWED');
            setIsAuthorized(true);
          }
        } else {
          // Route non définie - rediriger vers explore
          console.log('Unknown route for authenticated user - REDIRECT to /explore');
          router.replace('/explore');
          return;
        }
      } else {
        // Utilisateur non connecté
        if (isPublicRoute) {
          // Accès autorisé aux routes publiques
          console.log('Unauthenticated user accessing public route - ALLOWED');
          setIsAuthorized(true);
        } else if (isPrivateRoute) {
          // Rediriger vers login si non connecté
          console.log('Unauthenticated user accessing private route - REDIRECT to /login');
          router.replace('/login');
          return;
        } else {
          // Route non définie - rediriger vers home
          console.log('Unknown route for unauthenticated user - REDIRECT to /');
          router.replace('/');
          return;
        }
      }

      setIsLoading(false);
    };

    // Délai pour éviter les flash de redirection
    const timer = setTimeout(checkRoute, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, pathname, router]);

  // État de chargement
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 2
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">
          Vérification des permissions...
        </Typography>
      </Box>
    );
  }

  // Accès autorisé
  if (isAuthorized) {
    return <>{children}</>;
  }

  // État intermédiaire (pendant redirection)
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: 2
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body2" color="text.secondary">
        Redirection en cours...
      </Typography>
    </Box>
  );
};

export default RouteGuard;
