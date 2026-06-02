import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarsIcon from '@mui/icons-material/Stars';
import { useLeaderboard, useQuinielaDetalle } from '@/hooks/useQuinielas';
import { useAuthStore } from '@/store/authStore';
import type { LeaderboardEntryDTO } from '@/api/generated';

const medalColors = ['#f59e0b', '#94a3b8', '#cd7f32'];

function PositionBadge({ posicion }: { posicion: number }) {
  if (posicion <= 3) {
    return <EmojiEventsIcon sx={{ color: medalColors[posicion - 1], fontSize: 28 }} />;
  }
  return (
    <Typography
      variant="body2"
      sx={{
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.secondary',
        fontWeight: 600,
        fontSize: '0.8rem',
      }}
    >
      {posicion}
    </Typography>
  );
}

function LeaderboardCard({
  entry,
  isCurrentUser,
}: {
  entry: LeaderboardEntryDTO;
  isCurrentUser: boolean;
}) {
  return (
    <Card
      sx={{
        bgcolor: isCurrentUser ? 'rgba(99, 102, 241, 0.08)' : 'background.paper',
        border: isCurrentUser ? '1px solid' : '1px solid transparent',
        borderColor: isCurrentUser ? 'primary.main' : 'divider',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateX(4px)' },
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <PositionBadge posicion={entry.posicion} />

        <Avatar
          sx={{
            width: 36,
            height: 36,
            fontSize: '0.8rem',
            bgcolor: isCurrentUser ? 'secondary.main' : 'primary.main',
            fontWeight: 700,
          }}
        >
          {entry.usuario.nombre.charAt(0).toUpperCase()}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {entry.usuario.nombre}
            </Typography>
            {isCurrentUser && (
              <StarsIcon sx={{ fontSize: 16, color: 'secondary.main', flexShrink: 0 }} />
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1 }}>
              Pts
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              {entry.puntosTotales}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1 }}>
              Hit
            </Typography>
            <Chip
              label={entry.aciertos}
              size="small"
              color="success"
              variant="outlined"
              sx={{ fontWeight: 700, minWidth: 32 }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function LeaderboardTable({
  entries,
  currentUserId,
}: {
  entries: LeaderboardEntryDTO[];
  currentUserId: number;
}) {
  return (
    <Box sx={{ overflow: 'hidden', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '48px 1fr 64px 80px',
          gap: 0,
          bgcolor: 'rgba(99, 102, 241, 0.08)',
          px: 2,
          py: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>#</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Participante</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textAlign: 'center' }}>Pts</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textAlign: 'center' }}>Aciertos</Typography>
      </Box>
      {entries.map((entry) => {
        const isCurrentUser = entry.usuario.id === currentUserId;
        return (
          <Box
            key={entry.usuario.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '48px 1fr 64px 80px',
              gap: 0,
              px: 2,
              py: 1.25,
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: isCurrentUser ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
              '&:last-child': { borderBottom: 0 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PositionBadge posicion={entry.posicion} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem', bgcolor: isCurrentUser ? 'secondary.main' : 'primary.main', fontWeight: 700 }}>
                {entry.usuario.nombre.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: isCurrentUser ? 700 : 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {entry.usuario.nombre}
              </Typography>
              {isCurrentUser && <StarsIcon sx={{ fontSize: 14, color: 'secondary.main', flexShrink: 0 }} />}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700, textAlign: 'center', alignSelf: 'center' }}>
              {entry.puntosTotales}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Chip label={entry.aciertos} size="small" color="success" variant="outlined" sx={{ fontWeight: 700, minWidth: 32 }} />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

export default function Ranking() {
  const { id } = useParams<{ id: string }>();
  const quinielaId = Number(id);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: leaderboard, isLoading, isError } = useLeaderboard(quinielaId);
  const { data: quiniela } = useQuinielaDetalle(quinielaId);
  const currentUser = useAuthStore((s) => s.usuario);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !leaderboard) {
    return <Alert severity="error">Error al cargar el ranking</Alert>;
  }

  const entries = [...leaderboard].sort((a, b) => a.posicion - b.posicion);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: 'text.secondary' }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Ranking
          </Typography>
          {quiniela && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {quiniela.nombre}
            </Typography>
          )}
        </Box>
      </Box>

      {entries.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <EmojiEventsIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.4, mb: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>Sin participantes</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Comparte el código de invitación para que se unan.
            </Typography>
          </CardContent>
        </Card>
      ) : isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {entries.map((entry) => (
            <LeaderboardCard
              key={entry.usuario.id}
              entry={entry}
              isCurrentUser={entry.usuario.id === currentUser?.id}
            />
          ))}
        </Box>
      ) : (
        <LeaderboardTable entries={entries} currentUserId={currentUser?.id ?? 0} />
      )}
    </Box>
  );
}
