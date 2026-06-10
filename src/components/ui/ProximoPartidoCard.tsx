import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import FlagIcon from '@/components/ui/FlagIcon';
import type { PartidoDTO } from '@/api/generated';

interface Props {
  partido: PartidoDTO;
  quinielaId: number;
  quinielaNombre: string;
}

function calcularCuentaRegresiva(fechaHora: string) {
  const diff = new Date(fechaHora).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    dias: Math.floor(diff / 86400000),
    horas: Math.floor((diff % 86400000) / 3600000),
    minutos: Math.floor((diff % 3600000) / 60000),
    segundos: Math.floor((diff % 60000) / 1000),
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

export default function ProximoPartidoCard({ partido, quinielaId, quinielaNombre }: Props) {
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(() => calcularCuentaRegresiva(partido.fechaHora));

  useEffect(() => {
    setCountdown(calcularCuentaRegresiva(partido.fechaHora));
    const id = setInterval(() => {
      setCountdown(calcularCuentaRegresiva(partido.fechaHora));
    }, 1000);
    return () => clearInterval(id);
  }, [partido.fechaHora]);

  return (
    <Box sx={{ bgcolor: 'rgba(11,18,32,0.3)', borderRadius: 3, p: 2, mb: 2.5, border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <SportsSoccerIcon sx={{ color: '#0D5BFF', fontSize: 18 }} />
        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>
          Próximo partido
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem', ml: 'auto' }}>
          {quinielaNombre}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
          <FlagIcon country={partido.equipoLocal} size={28} />
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.75rem', textAlign: 'center', wordBreak: 'break-word' }}>
            {partido.equipoLocal}
          </Typography>
        </Box>
        <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 900, fontSize: '1.1rem' }}>vs</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
          <FlagIcon country={partido.equipoVisitante} size={28} />
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.75rem', textAlign: 'center', wordBreak: 'break-word' }}>
            {partido.equipoVisitante}
          </Typography>
        </Box>
      </Box>

      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', textAlign: 'center', mb: 1.5 }}>
        {formatDate(partido.fechaHora)} — {formatTime(partido.fechaHora)}
      </Typography>

      {countdown && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
          {[
            { label: 'Días', value: countdown.dias },
            { label: 'Horas', value: countdown.horas },
            { label: 'Min', value: countdown.minutos },
            { label: 'Seg', value: countdown.segundos },
          ].map((item) => (
            <Box key={item.label} sx={{ textAlign: 'center' }}>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', lineHeight: 1 }}>
                {String(item.value).padStart(2, '0')}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.5rem', textTransform: 'uppercase' }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Button
        fullWidth
        variant="contained"
        onClick={() => navigate(`/quiniela/${quinielaId}`)}
        sx={{ py: 1, fontWeight: 700, fontSize: '0.8rem' }}
      >
        Pronosticar ahora
      </Button>
    </Box>
  );
}
