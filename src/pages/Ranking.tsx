import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Alert,
  Avatar,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarsIcon from '@mui/icons-material/Stars';
import { useLeaderboard, useQuinielaDetalle } from '@/hooks/useQuinielas';
import { useAuthStore } from '@/store/authStore';
import type { LeaderboardEntryDTO } from '@/api/generated';
import LoadingScreen from '@/components/ui/LoadingScreen';
import EmptyState from '@/components/ui/EmptyState';

const medalColors = ['#F59E0B', '#94A3B8', '#CD7F32'];

function RankBadge({ posicion }: { posicion: number }) {
  if (posicion <= 3) {
    return <EmojiEventsIcon sx={{ color: medalColors[posicion - 1], fontSize: 28 }} />;
  }
  return (
    <Typography sx={{ width: 28, textAlign: 'center', fontWeight: 700, color: '#64748B', fontSize: '0.85rem' }}>
      {posicion}
    </Typography>
  );
}

function LeaderboardRow({ entry, isCurrentUser }: { entry: LeaderboardEntryDTO; isCurrentUser: boolean }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        bgcolor: isCurrentUser ? 'rgba(59, 130, 246, 0.08)' : '#334155',
        borderRadius: 3,
        p: 2,
        border: isCurrentUser ? '1.5px solid' : 'none',
        borderColor: isCurrentUser ? '#3B82F6' : 'transparent',
      }}
    >
      <RankBadge posicion={entry.posicion} />

      <Avatar sx={{ width: 40, height: 40, bgcolor: isCurrentUser ? '#3B82F6' : '#22C55E', fontSize: '0.85rem' }}>
        {entry.usuario.nombre.charAt(0).toUpperCase()}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography sx={{ fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
            {entry.usuario.nombre}
          </Typography>
          {isCurrentUser && <StarsIcon sx={{ fontSize: 16, color: '#3B82F6' }} />}
        </Box>
      </Box>

      <Box sx={{ textAlign: 'right' }}>
        <Typography sx={{ fontWeight: 800, color: '#22C55E', fontSize: '1.1rem', lineHeight: 1 }}>
          {entry.puntosTotales}
        </Typography>
        <Typography sx={{ color: '#64748B', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1 }}>
          {entry.aciertos} hit
        </Typography>
      </Box>
    </Box>
  );
}

export default function Ranking() {
  const { id } = useParams<{ id: string }>();
  const quinielaId = Number(id);
  const navigate = useNavigate();
  const { data: leaderboard, isLoading, isError } = useLeaderboard(quinielaId);
  const { data: quiniela } = useQuinielaDetalle(quinielaId);
  const currentUser = useAuthStore((s) => s.usuario);

  if (isLoading) return <LoadingScreen />;

  if (isError || !leaderboard) {
    return <Alert severity="error" sx={{ borderRadius: 3 }}>Error al cargar el ranking</Alert>;
  }

  const entries = [...leaderboard].sort((a, b) => a.posicion - b.posicion);

  return (
    <Box sx={{ pb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: '#94A3B8' }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h2" sx={{ color: '#fff' }}>Ranking</Typography>
          {quiniela && (
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>{quiniela.nombre}</Typography>
          )}
        </Box>
      </Box>

      {entries.length === 0 ? (
        <EmptyState
          icon={<EmojiEventsIcon />}
          title="Sin participantes"
          description="Comparte el código de invitación para que se unan"
        />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {entries.map((entry) => (
            <LeaderboardRow
              key={entry.usuario.id}
              entry={entry}
              isCurrentUser={entry.usuario.id === currentUser?.id}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
