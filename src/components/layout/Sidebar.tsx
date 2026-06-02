import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SportsSoccer from '@mui/icons-material/SportsSoccer';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { label: 'Quinielas', path: '/dashboard', icon: <EmojiEventsIcon /> },
  { label: 'Pronósticos', path: '/pronosticos', icon: <SportsSoccerIcon /> },
  { label: 'Grupos', path: '/grupos', icon: <GroupsIcon /> },
  { label: 'Perfil', path: '/perfil', icon: <PersonIcon /> },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout } = useAuthStore();

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          px: 3,
          py: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid #334155',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            bgcolor: '#22C55E',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SportsSoccer sx={{ color: '#fff', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', color: '#22C55E', lineHeight: 1.2 }}>
            QGol
          </Typography>
          <Typography sx={{ fontSize: '0.6rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1.5 }}>
            Mundial 2026
          </Typography>
        </Box>
      </Box>

      <List sx={{ flex: 1, px: 1, pt: 2 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={isActive(item.path)}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon
              sx={{
                minWidth: 36,
                color: isActive(item.path) ? '#22C55E' : '#64748B',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: isActive(item.path) ? 700 : 500,
                  fontSize: '0.875rem',
                  color: isActive(item.path) ? '#fff' : '#94A3B8',
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      <Box sx={{ px: 2, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#3B82F6', fontSize: '0.75rem' }}>
            {usuario?.nombre?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {usuario?.nombre}
            </Typography>
            <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>
              {usuario?.email}
            </Typography>
          </Box>
        </Box>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, px: 1.5, py: 1 }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <LogoutIcon sx={{ fontSize: 18, color: '#EF4444' }} />
          </ListItemIcon>
          <ListItemText
            primary="Cerrar Sesión"
            sx={{ '& .MuiListItemText-primary': { fontSize: '0.8rem', fontWeight: 500, color: '#EF4444' } }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}
