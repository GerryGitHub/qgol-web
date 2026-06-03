import { useState, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, Alert, Button } from '@mui/material';
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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            component="img"
            src="/logo/qgol.png"
            alt="QGol"
            sx={{ width: 72, height: 72, mx: 'auto', mb: 1.5, objectFit: 'contain' }}
          />
          <Typography variant="h2" sx={{ fontWeight: 900, color: '#fff' }}>
            Verifica tu cuenta
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', mt: 0.5 }}>
            Código enviado a{' '}
            <Typography component="span" sx={{ color: '#fff', fontWeight: 600 }}>
              {email}
            </Typography>
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'rgba(11, 18, 32, 0.95)', borderRadius: 4, p: 3, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}>
          {verifyOtp.isError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2, bgcolor: 'rgba(255,77,77,0.1)', color: '#FF4D4D', '& .MuiAlert-icon': { color: '#FF4D4D' } }}>
              {verifyOtp.error instanceof Error ? verifyOtp.error.message : 'Código inválido'}
            </Alert>
          )}
          {verifyOtp.isSuccess && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2, bgcolor: 'rgba(0,184,107,0.1)', color: '#00B86B', '& .MuiAlert-icon': { color: '#00B86B' } }}>
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
                  width: 44,
                  height: 52,
                  textAlign: 'center',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  bgcolor: 'rgba(11, 18, 32, 0.3)',
                  border: '2px solid',
                  borderColor: digit ? '#0D5BFF' : 'rgba(255,255,255,0.15)',
                  borderRadius: 2,
                  color: '#fff',
                  outline: 'none',
                  caretColor: '#0D5BFF',
                  '&:focus': { borderColor: '#0D5BFF' },
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
            sx={{ mb: 2, minHeight: 52, fontSize: '1rem' }}
          >
            {verifyOtp.isPending ? 'Verificando...' : 'Verificar'}
          </Button>

          <Button
            variant="text"
            fullWidth
            disabled={resendOtp.isPending}
            onClick={() => resendOtp.mutate({ email })}
            sx={{ color: 'rgba(255,255,255,0.5)' }}
          >
            {resendOtp.isPending ? 'Enviando...' : 'Reenviar código'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
