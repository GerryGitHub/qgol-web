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
import GroupsIcon from '@mui/icons-material/Groups';
import TableChartIcon from '@mui/icons-material/TableChart';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { label: 'Quinielas', path: '/dashboard', icon: <EmojiEventsIcon /> },
  { label: 'Grupos', path: '/grupos', icon: <GroupsIcon /> },
  { label: 'Resultados', path: '/resultados', icon: <TableChartIcon /> },
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <Box sx={{ p: 3, pb: 2.5, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="img"
            src="/logo/qgol.png"
            alt="QGol"
            sx={{ width: 38, height: 38, borderRadius: 2, objectFit: 'contain' }}
          />
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', color: '#fff', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
              QGol
            </Typography>
            <Typography sx={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600 }}>
              Mundial 2026
            </Typography>
          </Box>
        </Box>
      </Box>

      <List sx={{ flex: 1, px: 1.5, pt: 2 }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItemButton
              key={item.path}
              selected={active}
              onClick={() => navigate(item.path)}
              sx={{
                position: 'relative',
                mb: 0.5,
                ...(active && {
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '25%',
                    bottom: '25%',
                    width: 3,
                    bgcolor: '#0D5BFF',
                    borderRadius: '0 4px 4px 0',
                  },
                }),
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: active ? '#0D5BFF' : 'rgba(255,255,255,0.4)' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.875rem',
                    color: active ? '#fff' : 'rgba(255,255,255,0.6)',
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ mx: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

      <Box sx={{ px: 2, py: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: '#0D5BFF', fontSize: '0.8rem', boxShadow: '0 2px 8px rgba(13,91,255,0.3)' }}>
            {usuario?.nombre?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {usuario?.nombre}
            </Typography>
            <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {usuario?.email}
            </Typography>
          </Box>
        </Box>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, px: 1.5, py: 1, '&:hover': { bgcolor: 'rgba(255,77,77,0.06)' } }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <LogoutIcon sx={{ fontSize: 18, color: '#FF4D4D' }} />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" sx={{ '& .MuiListItemText-primary': { fontSize: '0.8rem', fontWeight: 500, color: '#FF4D4D' } }} />
        </ListItemButton>
      </Box>
    </Box>
  );
}
