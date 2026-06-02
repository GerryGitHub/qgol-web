import { Outlet, useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Avatar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { label: 'Quinielas', path: '/dashboard', icon: <EmojiEventsIcon /> },
  { label: 'Pronósticos', path: '/pronosticos', icon: <SportsSoccerIcon /> },
  { label: 'Grupos', path: '/grupos', icon: <GroupsIcon /> },
  { label: 'Perfil', path: '/perfil', icon: <PersonIcon /> },
];

const hideNavPaths = new Set(['/login', '/register', '/verify-otp']);

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { usuario } = useAuthStore();

  const currentTab = navItems.findIndex((item) => {
    if (item.path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(item.path);
  });

  const showNav = !hideNavPaths.has(location.pathname);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: showNav ? '72px' : 0 }}>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          bgcolor: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: { xs: 2, md: 3 },
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          component={RouterLink}
          to="/dashboard"
          sx={{
            fontWeight: 900,
            fontSize: '1.35rem',
            color: '#22C55E',
            textDecoration: 'none',
            letterSpacing: '-0.5px',
          }}
        >
          QGol
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              onClick={() => navigate('/perfil')}
              sx={{
                width: 36,
                height: 36,
                fontSize: '0.8rem',
                bgcolor: '#3B82F6',
                cursor: 'pointer',
              }}
            >
              {usuario?.nombre?.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
        )}
      </Box>

      <Box sx={{ maxWidth: 800, mx: 'auto', px: { xs: 2, md: 3 }, pt: 2 }}>
        <Outlet />
      </Box>

      {showNav && (
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
            <BottomNavigationAction
              key={item.path}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      )}
    </Box>
  );
}
