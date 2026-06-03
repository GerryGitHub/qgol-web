import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Link,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useLogin } from '@/hooks/useAuth';
import { ApiError } from '@/api/generated';

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.body?.message) return error.body.message;
  if (error instanceof Error) return error.message;
  return 'Error al iniciar sesión';
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { email, password },
      { onSuccess: () => navigate('/dashboard') },
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: 240, sm: 300 },
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0A2E8A 0%, #0D5BFF 50%, #2563EB 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(45deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%),
              linear-gradient(135deg, rgba(255,77,77,0.06) 0%, transparent 100%),
              linear-gradient(0deg, rgba(255,255,255,0.03) 0%, transparent 100%)
            `,
          },
        }}
      >
        <Box
          component="img"
          src="/bg/login-hero.png"
          alt=""
          sx={{
            position: 'absolute',
            right: { xs: -60, sm: -40, md: 0 },
            top: '50%',
            transform: 'translateY(-50%)',
            width: { xs: 260, sm: 340, md: 400 },
            height: 'auto',
            opacity: 0.9,
            pointerEvents: 'none',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1, px: { xs: 3, sm: 6, md: 8 }, maxWidth: 600 }}>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.2rem', sm: '2.8rem' },
              color: '#fff',
              lineHeight: 1.1,
              letterSpacing: '-0.5px',
              textShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            QGol
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: { xs: '0.95rem', sm: '1.1rem' }, mt: 0.5 }}>
            Mundial 2026
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, mt: 2, flexWrap: 'wrap' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Predice</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>•</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Compite</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>•</Typography>
            <Typography sx={{ color: '#FF4D4D', fontWeight: 700, fontSize: '0.85rem' }}>Gana</Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          px: { xs: 2, sm: 4 },
          pb: 4,
          mt: { xs: -3, sm: -4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 440,
            bgcolor: 'rgba(11, 18, 32, 0.95)',
            borderRadius: 4,
            p: { xs: 2.5, sm: 3.5 },
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
          }}
        >
          <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '1.3rem', mb: 0.5 }}>
            ¡Bienvenido!
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', mb: 3 }}>
            Inicia sesión para continuar
          </Typography>

          {login.isError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2, bgcolor: 'rgba(255,77,77,0.1)', color: '#FF4D4D', '& .MuiAlert-icon': { color: '#FF4D4D' } }}>
              {getErrorMessage(login.error)}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              sx={{ mb: 3 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button type="submit" variant="contained" fullWidth size="large" disabled={login.isPending} sx={{ minHeight: 52, fontSize: '1rem' }}>
              {login.isPending ? 'Iniciando...' : 'Iniciar Sesión'}
            </Button>
          </Box>

          <Typography sx={{ textAlign: 'center', mt: 3, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            ¿No tienes cuenta?{' '}
            <Link component={RouterLink} to="/register" sx={{ color: '#0D5BFF', fontWeight: 700, textDecoration: 'none' }}>
              Regístrate
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
