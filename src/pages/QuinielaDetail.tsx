import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { useQuinielaDetalle } from '@/hooks/useQuinielas';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function QuinielaDetail() {
  const { id } = useParams<{ id: string }>();
  const quinielaId = Number(id);
  const navigate = useNavigate();
  const { data: quiniela, isLoading, isError } = useQuinielaDetalle(quinielaId);

  if (isLoading) return <LoadingScreen />;

  if (isError || !quiniela) {
    return <Alert severity="error" sx={{ borderRadius: 3 }}>Error al cargar la quiniela</Alert>;
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h1" sx={{ color: '#fff', mb: 0.5 }}>
          {quiniela.nombre}
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          Código:{' '}
          <Typography component="span" sx={{ fontFamily: 'monospace', color: '#22C55E', fontWeight: 600 }}>
            {quiniela.codigoInvitacion}
          </Typography>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          onClick={() => navigate(`/quiniela/${quinielaId}/ranking`)}
          sx={{
            bgcolor: '#334155',
            borderRadius: 4,
            p: 3,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 2.5,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.3)' },
          }}
        >
          <Box sx={{ bgcolor: 'rgba(34, 197, 94, 0.15)', borderRadius: 3, p: 1.5, display: 'flex' }}>
            <EmojiEventsIcon sx={{ color: '#22C55E', fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>Ranking</Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.25 }}>
              {quiniela.participantes.length} participante{quiniela.participantes.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>

        <Box
          onClick={() => navigate(`/quiniela/${quinielaId}/pronosticos`)}
          sx={{
            bgcolor: '#334155',
            borderRadius: 4,
            p: 3,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 2.5,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.3)' },
          }}
        >
          <Box sx={{ bgcolor: 'rgba(59, 130, 246, 0.15)', borderRadius: 3, p: 1.5, display: 'flex' }}>
            <SportsSoccerIcon sx={{ color: '#3B82F6', fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>Pronósticos</Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.25 }}>
              {quiniela.partidos.filter((p) => p.estado !== 'FINALIZADO').length} partidos pendientes
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
        <Button variant="contained" fullWidth startIcon={<EmojiEventsIcon />} onClick={() => navigate(`/quiniela/${quinielaId}/ranking`)} sx={{ py: 1.5 }}>
          Ver Ranking
        </Button>
        <Button variant="outlined" fullWidth startIcon={<SportsSoccerIcon />} onClick={() => navigate(`/quiniela/${quinielaId}/pronosticos`)} sx={{ py: 1.5 }}>
          Pronosticar
        </Button>
      </Box>
    </Box>
  );
}
