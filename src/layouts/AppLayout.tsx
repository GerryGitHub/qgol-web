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
import TableChartIcon from '@mui/icons-material/TableChart';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Sidebar from '@/components/layout/Sidebar';

const navItems = [
  { label: 'Quinielas', path: '/dashboard', icon: <EmojiEventsIcon /> },
  { label: 'Eliminatorias', path: '/eliminatorias', icon: <AccountTreeIcon /> },
  { label: 'Pronósticos', path: '/pronosticos', icon: <SportsSoccerIcon /> },
  { label: 'Grupos', path: '/grupos', icon: <GroupsIcon /> },
  { label: 'Resultados', path: '/resultados', icon: <TableChartIcon /> },
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
    <Box sx={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden', bgcolor: '#0B1220' }}>
      <Box
        component="img"
        src="/bg/cancha.png"
        alt=""
        sx={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', zIndex: 0 }}
      />
      <Box sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.6)', pointerEvents: 'none', zIndex: 1 }} />

      {isDesktop && (
        <Drawer
          variant="permanent"
          sx={{
            width: 250,
            flexShrink: 0,
            position: 'relative',
            zIndex: 2,
            '& .MuiDrawer-paper': {
              width: 250,
              boxSizing: 'border-box',
              bgcolor: 'rgba(11, 18, 32, 0.85)',
              backdropFilter: 'blur(16px)',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <Sidebar />
        </Drawer>
      )}

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', zIndex: 2 }}>
        {!isDesktop && showNav && (
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1100,
              bgcolor: 'rgba(11, 18, 32, 0.9)',
              backdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              px: 2,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <IconButton onClick={() => setMobileDrawer(true)} sx={{ color: 'rgba(255,255,255,0.6)' }}>
              <MenuIcon />
            </IconButton>
            <Typography
              component={RouterLink}
              to="/dashboard"
              sx={{ fontWeight: 900, fontSize: '1.25rem', color: '#fff', textDecoration: 'none', letterSpacing: '-0.5px' }}
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
            maxWidth: 1440,
            mx: 'auto',
            px: { xs: 2, md: 4, lg: 5 },
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
        sx={{ position: 'relative', zIndex: 1300, '& .MuiDrawer-paper': { width: 280 } }}
      >
        <Sidebar />
      </Drawer>
    </Box>
  );
}
