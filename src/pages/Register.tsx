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
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
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
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <SportsSoccerIcon sx={{ fontSize: 48, color: '#22C55E', mb: 1 }} />
        <Typography variant="h3" sx={{ fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
          QGol
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.5 }}>
          Crea tu cuenta
        </Typography>
      </Box>

      <Box sx={{ bgcolor: '#1E293B', borderRadius: 4, p: 3 }}>
        {register.isError && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {getErrorMessage(register.error)}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
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
            autoComplete="new-password"
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
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
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={register.isPending || passwordsDontMatch}
          >
            {register.isPending ? 'Registrando...' : 'Registrarse'}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: '#94A3B8' }}>
          ¿Ya tienes cuenta?{' '}
          <Link component={RouterLink} to="/login" sx={{ color: '#22C55E', fontWeight: 600, textDecoration: 'none' }}>
            Inicia Sesión
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
