import { useState, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Alert,
  Button,
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { useVerifyOtp, useResendOtp } from '@/hooks/useAuth';

export default function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const verifyOtp = useVerifyOtp();
  const resendOtp = useResendOtp();

  const setInputRef = useCallback((el: HTMLInputElement | null, index: number) => {
    inputsRef.current[index] = el;
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const otp = code.join('');
    if (otp.length !== 6) return;
    verifyOtp.mutate(
      { email, code: otp },
      { onSuccess: () => navigate('/login') },
    );
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <SportsSoccerIcon sx={{ fontSize: 48, color: '#22C55E', mb: 1 }} />
        <Typography variant="h3" sx={{ fontWeight: 900, color: '#fff' }}>
          Verifica tu cuenta
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.5 }}>
          Código enviado a{' '}
          <Typography component="span" sx={{ color: '#fff', fontWeight: 600 }}>
            {email}
          </Typography>
        </Typography>
      </Box>

      <Box sx={{ bgcolor: '#1E293B', borderRadius: 4, p: 3 }}>
        {verifyOtp.isError && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {verifyOtp.error instanceof Error ? verifyOtp.error.message : 'Código inválido'}
          </Alert>
        )}
        {verifyOtp.isSuccess && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            ¡Cuenta verificada! Ahora puedes iniciar sesión.
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
          {code.map((digit, index) => (
            <Box
              key={index}
              component="input"
              ref={(el: HTMLInputElement | null) => setInputRef(el, index)}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              sx={{
                width: 48,
                height: 56,
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: 700,
                bgcolor: '#0F172A',
                border: '2px solid',
                borderColor: digit ? '#22C55E' : '#334155',
                borderRadius: 2,
                color: '#fff',
                outline: 'none',
                caretColor: '#22C55E',
                '&:focus': { borderColor: '#22C55E' },
              }}
            />
          ))}
        </Box>

        <Button
          variant="contained"
          fullWidth
          size="large"
          disabled={code.join('').length !== 6 || verifyOtp.isPending}
          onClick={handleSubmit}
          sx={{ mb: 2 }}
        >
          {verifyOtp.isPending ? 'Verificando...' : 'Verificar'}
        </Button>

        <Button
          variant="text"
          fullWidth
          disabled={resendOtp.isPending}
          onClick={() => resendOtp.mutate({ email })}
          sx={{ color: '#94A3B8' }}
        >
          {resendOtp.isPending ? 'Enviando...' : 'Reenviar código'}
        </Button>
      </Box>
    </Box>
  );
}
