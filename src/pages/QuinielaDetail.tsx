import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useQuinielaDetalle, useLeaderboard } from '@/hooks/useQuinielas';
import type { PartidoDTO } from '@/api/generated';

const estadoColor: Record<string, 'default' | 'primary' | 'success' | 'error' | 'warning'> = {
  PENDIENTE: 'default',
  POR_COMENZAR: 'primary',
  EN_CURSO: 'success',
  FINALIZADO: 'error',
};

const estadoLabel: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  POR_COMENZAR: 'Por comenzar',
  EN_CURSO: 'En vivo',
  FINALIZADO: 'Finalizado',
};

function PartidoRow({ partido }: { partido: PartidoDTO }) {
  return (
    <TableRow
      sx={{
        '&:last-child td': { borderBottom: 0 },
        bgcolor: partido.estado === 'EN_CURSO' ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
      }}
    >
      <TableCell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {partido.equipoLocal}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {partido.equipoVisitante}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {partido.golesLocalReal ?? '-'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>vs</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {partido.golesVisitanteReal ?? '-'}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Chip
          label={estadoLabel[partido.estado] || partido.estado}
          color={estadoColor[partido.estado] || 'default'}
          size="small"
          variant="outlined"
        />
      </TableCell>
      <TableCell align="center">
        {partido.minutosJugados != null ? (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {partido.minutosJugados}&apos;
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>—</Typography>
        )}
      </TableCell>
    </TableRow>
  );
}

export default function QuinielaDetail() {
  const { id } = useParams<{ id: string }>();
  const quinielaId = Number(id);
  const { data: quiniela, isLoading, isError } = useQuinielaDetalle(quinielaId);
  const { data: leaderboard } = useLeaderboard(quinielaId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !quiniela) {
    return <Alert severity="error">Error al cargar la quiniela</Alert>;
  }

  const sorted = [...(leaderboard || [])].sort((a, b) => b.puntosTotales - a.puntosTotales);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {quiniela.nombre}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Código:{' '}
          <Typography component="span" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>
            {quiniela.codigoInvitacion}
          </Typography>
        </Typography>
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Tabla de Posiciones</Typography>
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={48}></TableCell>
                  <TableCell>Participante</TableCell>
                  <TableCell align="center">Puntos</TableCell>
                  <TableCell align="center">Aciertos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sorted.map((p, i) => (
                  <TableRow key={p.usuario.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell>
                      {i === 0 ? (
                        <EmojiEventsIcon sx={{ color: '#f59e0b' }} />
                      ) : i === 1 ? (
                        <EmojiEventsIcon sx={{ color: '#94a3b8' }} />
                      ) : i === 2 ? (
                        <EmojiEventsIcon sx={{ color: '#b45309' }} />
                      ) : (
                        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', width: 24 }}>
                          {i + 1}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                          {p.usuario.nombre.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.usuario.nombre}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{p.puntosTotales}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={p.aciertos} size="small" color="success" variant="outlined" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Partidos</Typography>
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Partido</TableCell>
                  <TableCell align="center">Marcador</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Minutos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quiniela.partidos.map((p) => (
                  <PartidoRow key={p.id} partido={p} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
