import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import { useAuthStore } from '@/store/authStore';

export default function Perfil() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuthStore();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!usuario) return null;

  return (
    <Box>
      <Typography variant="h1" sx={{ color: '#fff', mb: 3 }}>
        Perfil
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: '#3B82F6',
            fontSize: '1.75rem',
            fontWeight: 800,
            mb: 2,
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
          }}
        >
          {usuario.nombre.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>
          {usuario.nombre}
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          {usuario.email}
        </Typography>
      </Box>

      <Box sx={{ bgcolor: '#334155', borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
          <PersonIcon sx={{ color: '#22C55E', fontSize: 24 }} />
          <Box>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.6rem' }}>
              Usuario
            </Typography>
            <Typography sx={{ color: '#fff', fontWeight: 600 }}>
              {usuario.nombre}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: '#475569' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
          <EmailIcon sx={{ color: '#22C55E', fontSize: 24 }} />
          <Box>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.6rem' }}>
              Email
            </Typography>
            <Typography sx={{ color: '#fff', fontWeight: 600 }}>
              {usuario.email}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: '#475569' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
          <Box sx={{ color: '#22C55E', fontSize: 24, fontWeight: 800, width: 24, textAlign: 'center' }}>
            #
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.6rem' }}>
              Puntos Totales
            </Typography>
            <Typography sx={{ color: '#22C55E', fontWeight: 800, fontSize: '1.1rem' }}>
              {usuario.puntosTotales} pts
            </Typography>
          </Box>
        </Box>
      </Box>

      <Button
        variant="outlined"
        fullWidth
        startIcon={<LogoutIcon />}
        onClick={() => setLogoutOpen(true)}
        sx={{ mt: 3, py: 1.5, borderColor: '#EF4444', color: '#EF4444', '&:hover': { borderColor: '#EF4444', bgcolor: 'rgba(239, 68, 68, 0.08)' } }}
      >
        Cerrar Sesión
      </Button>

      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#fff' }}>Cerrar Sesión</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            ¿Estás seguro de que quieres cerrar sesión?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setLogoutOpen(false)} sx={{ color: '#94A3B8' }}>Cancelar</Button>
          <Button onClick={handleLogout} variant="contained" sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' } }}>
            Cerrar Sesión
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
