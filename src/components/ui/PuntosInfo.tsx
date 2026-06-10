import { useState } from 'react';
import {
  Box,
  Dialog,
  Typography,
  Button,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CloseIcon from '@mui/icons-material/Close';

const rules = [
  { icon: '🏆', label: 'Marcador exacto', points: 10 },
  { icon: '⚽', label: 'Diferencia de goles correcta', points: 5 },
  { icon: '✅', label: 'Resultado correcto', points: 3 },
  { icon: '❌', label: 'Resultado incorrecto', points: 0 },
];

interface Props {
  variant?: 'card' | 'icon';
}

export default function PuntosInfo({ variant = 'card' }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {variant === 'card' ? (
        <Box
          onClick={() => setOpen(true)}
          sx={{
            bgcolor: 'rgba(11,18,32,0.3)',
            borderRadius: 3,
            p: 2,
            mb: 2.5,
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(4px)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': { bgcolor: 'rgba(11,18,32,0.45)', borderColor: 'rgba(255,255,255,0.25)' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <EmojiEventsIcon sx={{ color: '#F59E0B', fontSize: 24 }} />
            <Box>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
                Sistema de puntos
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
                Aprende cómo sumar más puntos en tu quiniela
              </Typography>
            </Box>
          </Box>
          <Button size="small" variant="outlined" onClick={(e) => { e.stopPropagation(); setOpen(true); }} sx={{ mt: 1, color: '#0D5BFF', borderColor: '#0D5BFF', fontWeight: 700, fontSize: '0.7rem', borderRadius: 2, '&:hover': { borderColor: '#0D5BFF', bgcolor: 'rgba(13,91,255,0.1)' } }}>
            Ver reglas
          </Button>
        </Box>
      ) : (
        <Box
          onClick={() => setOpen(true)}
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, px: 1.25, py: 0.5, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
        >
          <EmojiEventsIcon sx={{ color: '#F59E0B', fontSize: 14 }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', fontWeight: 600 }}>
            Puntos
          </Typography>
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'rgba(11,18,32,0.92)',
              backdropFilter: 'blur(16px)',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            },
          },
        }}
      >
        <Box sx={{ position: 'relative', p: 3 }}>
          <Box
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: 12, top: 12, color: 'rgba(255,255,255,0.3)', cursor: 'pointer', '&:hover': { color: '#fff' } }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <EmojiEventsIcon sx={{ color: '#F59E0B', fontSize: 32 }} />
            <Typography sx={{ fontWeight: 800, color: '#fff', fontSize: '1.2rem' }}>
              Sistema de puntos
            </Typography>
          </Box>

          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', mb: 2.5, lineHeight: 1.5 }}>
            Entre más exacto sea tu pronóstico, más puntos obtendrás.
          </Typography>

          {rules.map((r) => (
            <Box
              key={r.points}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                py: 1.5,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                '&:last-child': { borderBottom: 'none' },
              }}
            >
              <Typography sx={{ fontSize: '1.5rem' }}>{r.icon}</Typography>
              <Typography sx={{ flex: 1, color: '#fff', fontWeight: 500, fontSize: '0.85rem' }}>
                {r.label}
              </Typography>
              <Typography sx={{ fontWeight: 800, color: r.points > 0 ? '#00B86B' : 'rgba(255,255,255,0.25)', fontSize: '1rem', minWidth: 32, textAlign: 'right' }}>
                {r.points > 0 ? `+${r.points}` : r.points}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.55rem', textTransform: 'uppercase', fontWeight: 600 }}>
                pts
              </Typography>
            </Box>
          ))}

          <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem', mt: 2, textAlign: 'center' }}>
            Los puntos se calculan automáticamente al finalizar cada partido.
          </Typography>
        </Box>
      </Dialog>
    </>
  );
}
