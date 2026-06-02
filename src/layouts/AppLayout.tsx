import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import Sidebar from '@/components/layout/Sidebar';

const navItems = [
  { label: 'Quinielas', path: '/dashboard', icon: <EmojiEventsIcon /> },
  { label: 'Pronósticos', path: '/pronosticos', icon: <SportsSoccerIcon /> },
  { label: 'Grupos', path: '/grupos', icon: <GroupsIcon /> },
  { label: 'Perfil', path: '/perfil', icon: <PersonIcon /> },
];

const hideNavPaths = new Set(['/login', '/register', '/verify-otp']);

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileDrawer, setMobileDrawer] = useState(false);

  const showNav = !hideNavPaths.has(location.pathname);

  const currentTab = navItems.findIndex((item) => {
    if (item.path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(item.path);
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0F172A', display: 'flex' }}>
      {isDesktop && (
        <Drawer
          variant="permanent"
          sx={{
            width: 250,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: 250, boxSizing: 'border-box' },
          }}
        >
          <Sidebar />
        </Drawer>
      )}

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {!isDesktop && showNav && (
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1100,
              bgcolor: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid #334155',
              px: 2,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <IconButton onClick={() => setMobileDrawer(true)} sx={{ color: '#94A3B8' }}>
              <MenuIcon />
            </IconButton>
            <Typography
              component={RouterLink}
              to="/dashboard"
              sx={{ fontWeight: 900, fontSize: '1.25rem', color: '#22C55E', textDecoration: 'none' }}
            >
              QGol
            </Typography>
            <Box sx={{ width: 40 }} />
          </Box>
        )}

        <Box
          sx={{
            flex: 1,
            width: '100%',
            maxWidth: 1400,
            mx: 'auto',
            px: { xs: 2, md: 4, lg: 6 },
            py: { xs: 2, md: 3 },
            pb: showNav && !isDesktop ? '80px' : 3,
          }}
        >
          <Outlet />
        </Box>

        {!isDesktop && showNav && (
          <BottomNavigation
            value={currentTab >= 0 ? currentTab : 0}
            onChange={(_, newValue) => navigate(navItems[newValue].path)}
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1200,
            }}
          >
            {navItems.map((item) => (
              <BottomNavigationAction key={item.path} label={item.label} icon={item.icon} />
            ))}
          </BottomNavigation>
        )}
      </Box>

      <Drawer
        anchor="left"
        open={mobileDrawer}
        onClose={() => setMobileDrawer(false)}
        sx={{ '& .MuiDrawer-paper': { width: 280 } }}
      >
        <Sidebar />
      </Drawer>
    </Box>
  );
}
