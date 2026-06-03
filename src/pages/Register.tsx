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
import { useRegister } from '@/hooks/useAuth';
import { ApiError } from '@/api/generated';

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.body?.message) return error.body.message;
  if (error instanceof Error) return error.message;
  return 'Error al registrarse';
}

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    register.mutate(
      { nombre, email, password },
      { onSuccess: () => navigate(`/verify-otp?email=${encodeURIComponent(email)}`) },
    );
  };

  const passwordsDontMatch = !!confirmPassword && password !== confirmPassword;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            component="img"
            src="/logo/qgol.png"
            alt="QGol"
            sx={{ width: 72, height: 72, mx: 'auto', mb: 1.5, objectFit: 'contain' }}
          />
          <Typography variant="h2" sx={{ fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
            QGol
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', mt: 0.25 }}>
            Crea tu cuenta
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'rgba(11, 18, 32, 0.95)', borderRadius: 4, p: 3, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}>
          {register.isError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2, bgcolor: 'rgba(255,77,77,0.1)', color: '#FF4D4D', '& .MuiAlert-icon': { color: '#FF4D4D' } }}>
              {getErrorMessage(register.error)}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" sx={{ mb: 2 }} />
            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              sx={{ mb: 2 }}
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
            <TextField
              fullWidth
              label="Confirmar contraseña"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={passwordsDontMatch}
              helperText={passwordsDontMatch ? 'Las contraseñas no coinciden' : ''}
              sx={{ mb: 3 }}
            />
            <Button type="submit" variant="contained" fullWidth size="large" disabled={register.isPending || passwordsDontMatch} sx={{ minHeight: 52, fontSize: '1rem' }}>
              {register.isPending ? 'Registrando...' : 'Registrarse'}
            </Button>
          </Box>

          <Typography sx={{ textAlign: 'center', mt: 3, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            ¿Ya tienes cuenta?{' '}
            <Link component={RouterLink} to="/login" sx={{ color: '#0D5BFF', fontWeight: 700, textDecoration: 'none' }}>
              Inicia Sesión
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
