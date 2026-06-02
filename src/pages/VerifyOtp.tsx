import { useState, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Button,
} from '@mui/material';
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
    <Card sx={{ width: '100%', maxWidth: 420 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', mb: 1 }}>
          Verifica tu cuenta
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mb: 3 }}>
          Ingresa el código de 6 dígitos enviado a{' '}
          <Typography component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
            {email}
          </Typography>
        </Typography>

        {verifyOtp.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {verifyOtp.error instanceof Error ? verifyOtp.error.message : 'Código inválido'}
          </Alert>
        )}
        {verifyOtp.isSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
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
                bgcolor: '#0f0f25',
                border: '2px solid',
                borderColor: digit ? 'primary.main' : '#1e293b',
                borderRadius: 2,
                color: 'text.primary',
                outline: 'none',
                caretColor: 'primary.main',
                '&:focus': { borderColor: 'primary.main' },
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
          sx={{ color: 'text.secondary' }}
        >
          {resendOtp.isPending ? 'Enviando...' : 'Reenviar código'}
        </Button>
      </CardContent>
    </Card>
  );
}
