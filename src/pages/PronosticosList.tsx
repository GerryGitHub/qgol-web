import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { useQuinielas } from '@/hooks/useQuinielas';

export default function PronosticosList() {
  const navigate = useNavigate();
  const { data: quinielas, isLoading, isError } = useQuinielas();

  return (
    <Box>
      <Typography variant="h1" sx={{ color: '#fff', mb: 0.5 }}>
        Pronósticos
      </Typography>
      <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
        Selecciona una quiniela para hacer tus pronósticos
      </Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ borderRadius: 3 }}>Error al cargar las quinielas</Alert>
      )}

      {quinielas && quinielas.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6, bgcolor: '#334155', borderRadius: 4, p: 4 }}>
          <SportsSoccerIcon sx={{ fontSize: 48, color: '#64748B', opacity: 0.4, mb: 1 }} />
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>Sin quinielas</Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', mt: 1 }}>Crea o únete a una quiniela primero.</Typography>
        </Box>
      )}

      {quinielas && quinielas.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {quinielas.map((q) => (
            <Box
              key={q.id}
              onClick={() => navigate(`/quiniela/${q.id}/pronosticos`)}
              sx={{
                bgcolor: '#334155',
                borderRadius: 4,
                p: 2.5,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.3)' },
              }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
                  {q.nombre}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.75rem', mt: 0.25 }}>
                  {q.codigoInvitacion}
                </Typography>
              </Box>
              <ChevronRightIcon sx={{ color: '#64748B' }} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
