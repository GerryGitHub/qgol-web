import { useState, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Typography,
  Button,
  Alert,
  TextField,
  Tabs,
  Tab,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarsIcon from '@mui/icons-material/Stars';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ShareIcon from '@mui/icons-material/Share';
import { QRCodeCanvas } from 'qrcode.react';
import { useQuinielaDetalle, useMisPronosticos, useGuardarPronosticos, useLeaderboard, usePronosticosDeUsuario } from '@/hooks/useQuinielas';
import { useSnackbarStore } from '@/store/snackbarStore';
import { shareQuiniela, copyCode } from '@/utils/shareUtils';
import { useAuthStore } from '@/store/authStore';
import { ApiError } from '@/api/generated';
import type { CrearPronosticosBatchRequest, PronosticoItemRequest } from '@/types';
import type { LeaderboardEntryDTO, PronosticoDTO } from '@/api/generated';
import FlagIcon from '@/components/ui/FlagIcon';
import LoadingScreen from '@/components/ui/LoadingScreen';
import PuntosInfo from '@/components/ui/PuntosInfo';

interface FormValues {
  pronosticos: Array<{
    idPartido: number;
    golesLocalPredicho: number | '';
    golesVisitantePredicho: number | '';
  }>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.body?.message) return error.body.message;
  if (error instanceof Error) return error.message;
  return 'Error al guardar pronósticos';
}

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

function formatHora(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

const medalEmojis = ['🥇', '🥈', '🥉'];
const medalColors = ['#F59E0B', '#94A3B8', '#CD7F32'];

function PuntosDiff({ current, next }: { current: number; next?: number }) {
  if (next === undefined) return null;
  const diff = current - next;
  if (diff <= 0) return null;
  return (
    <Typography sx={{ color: '#00B86B', fontSize: '0.55rem', fontWeight: 600, mt: 0.25 }}>
      +{diff} pts al {next > 0 ? 'siguiente' : 'último'}
    </Typography>
  );
}

function RankBadge({ posicion }: { posicion: number }) {
  if (posicion <= 3) {
    return <Typography sx={{ fontSize: 24, lineHeight: 1 }}>{medalEmojis[posicion - 1]}</Typography>;
  }
  return (
    <Typography sx={{ width: 28, textAlign: 'center', fontWeight: 700, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
      {posicion}
    </Typography>
  );
}

function LeaderboardRow({ entry, nextEntry, isCurrentUser, onClick }: { entry: LeaderboardEntryDTO; nextEntry?: LeaderboardEntryDTO; isCurrentUser: boolean; onClick: () => void }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex', alignItems: 'center', gap: 2, p: 2, cursor: 'pointer',
        bgcolor: isCurrentUser ? 'rgba(13,91,255,0.08)' : 'rgba(11,18,32,0.3)',
        borderRadius: 3,
        border: isCurrentUser ? '1.5px solid' : '1px solid',
        borderColor: isCurrentUser ? '#0D5BFF' : entry.posicion <= 3 ? medalColors[entry.posicion - 1] : 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(4px)',
        '&:hover': { bgcolor: isCurrentUser ? 'rgba(13,91,255,0.12)' : 'rgba(11,18,32,0.5)' },
      }}
    >
      <RankBadge posicion={entry.posicion} />
      <Avatar sx={{ width: 36, height: 36, bgcolor: '#0D5BFF', fontSize: '0.8rem' }}>
        {entry.usuario.nombre.charAt(0).toUpperCase()}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {entry.usuario.nombre}
          </Typography>
          {isCurrentUser && <StarsIcon sx={{ fontSize: 14, color: '#0D5BFF' }} />}
        </Box>
        {nextEntry && (
          <PuntosDiff current={entry.puntosTotales} next={nextEntry.puntosTotales} />
        )}
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography sx={{ fontWeight: 800, color: '#fff', fontSize: '1rem', lineHeight: 1 }}>
          {entry.puntosTotales}
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: 1 }}>
          {entry.aciertos} hit
        </Typography>
      </Box>
    </Box>
  );
}

function PronosticoCard({ pronostico }: { pronostico: PronosticoDTO }) {
  const p = pronostico.partido;
  const color = p.estado === 'FINALIZADO' ? 'rgba(255,255,255,0.35)' : p.estado === 'EN_CURSO' ? '#FF4D4D' : '#00B86B';
  return (
    <Box sx={{ bgcolor: 'rgba(11,18,32,0.3)', borderRadius: 2, p: 1, border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end', minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.65rem', wordBreak: 'break-word' }}>{p.equipoLocal}</Typography>
          <FlagIcon country={p.equipoLocal} size={12} />
        </Box>
        <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#fff', mx: 0.25, flexShrink: 0 }}>
          {p.golesLocalReal ?? '?'} — {p.golesVisitanteReal ?? '?'}
        </Typography>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-start', minWidth: 0 }}>
          <FlagIcon country={p.equipoVisitante} size={12} />
          <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.65rem', wordBreak: 'break-word' }}>{p.equipoVisitante}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mt: 0.5 }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.55rem' }}>
          Pronóstico: {pronostico.golesLocalPredicho} — {pronostico.golesVisitantePredicho}
        </Typography>
        <Typography sx={{ color, fontWeight: 700, fontSize: '0.65rem' }}>
          {pronostico.puntosObtenidos} pts
        </Typography>
      </Box>
    </Box>
  );
}

function EstadoChip({ estado }: { estado: string }) {
  const color = estado === 'FINALIZADO' ? 'rgba(255,255,255,0.3)' : estado === 'EN_CURSO' ? '#FF4D4D' : '#00B86B';
  const label = estado === 'FINALIZADO' ? 'Finalizado' : estado === 'EN_CURSO' ? 'En vivo' : 'Próximo';
  return (
    <Typography sx={{ fontSize: '0.5rem', color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, border: `1px solid ${color}20`, borderRadius: 1, px: 0.75, py: 0.2 }}>
      {label}
    </Typography>
  );
}

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const fmt = (dt: Date) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  const key = fmt(d);
  if (key === fmt(today)) return 'Hoy';
  if (key === fmt(tomorrow)) return 'Mañana';
  const label = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

interface PartidoPreview {
  id: number;
  equipoLocal: string;
  equipoVisitante: string;
  golesLocalReal?: number;
  golesVisitanteReal?: number;
  fechaHora: string;
  estado: string;
}

export default function QuinielaDetail() {
  const { id } = useParams<{ id: string }>();
  const quinielaId = Number(id);
  const showSnackbar = useSnackbarStore((s) => s.show);
  const currentUser = useAuthStore((s) => s.usuario);
  const [tab, setTab] = useState(0);
  const [qrOpen, setQrOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: quiniela, isLoading } = useQuinielaDetalle(quinielaId);
  const finalized = quiniela?.estado === 'FINALIZADA';
  const currentTab = finalized ? 1 : tab;
  const { data: misPronosticos } = useMisPronosticos(quinielaId);
  const { data: leaderboard } = useLeaderboard(quinielaId);
  const { data: userPronosticos, isLoading: loadingUserPronos } = usePronosticosDeUsuario(quinielaId, selectedUserId);
  const entries = leaderboard ? [...leaderboard].sort((a, b) => a.posicion - b.posicion) : [];
  const selectedUser = selectedUserId ? entries.find((e) => e.usuario.id === selectedUserId) : null;
  const currentUserEntry = entries.find((e) => e.usuario.id === currentUser?.id);
  const guardarPronosticos = useGuardarPronosticos();

  const todosPartidos: PartidoPreview[] = useMemo(
    () => (quiniela?.partidos ?? []).map((p) => ({
      id: p.id,
      equipoLocal: p.equipoLocal,
      equipoVisitante: p.equipoVisitante,
      golesLocalReal: p.golesLocalReal,
      golesVisitanteReal: p.golesVisitanteReal,
      fechaHora: p.fechaHora,
      estado: p.estado,
    })),
    [quiniela]
  );

  const partidosPendientes = useMemo(
    () => todosPartidos
      .filter((p) => p.estado === 'PENDIENTE')
      .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()),
    [todosPartidos]
  );

  const partidosPorDia = useMemo(() => {
    const map = new Map<string, PartidoPreview[]>();
    for (const p of partidosPendientes) {
      const day = p.fechaHora.slice(0, 10);
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(p);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [partidosPendientes]);

  const pronosticoMap = useMemo(() => {
    const map = new Map<number, PronosticoItemRequest>();
    if (misPronosticos?.pronosticos) {
      for (const p of misPronosticos.pronosticos) {
        map.set(p.partido.id, {
          idPartido: p.partido.id,
          golesLocalPredicho: p.golesLocalPredicho,
          golesVisitantePredicho: p.golesVisitantePredicho,
        });
      }
    }
    return map;
  }, [misPronosticos]);

  const defaultValues = useMemo((): FormValues => ({
    pronosticos: partidosPendientes.map((p) => {
      const existing = pronosticoMap.get(p.id);
      return {
        idPartido: p.id,
        golesLocalPredicho: existing?.golesLocalPredicho ?? '',
        golesVisitantePredicho: existing?.golesVisitantePredicho ?? '',
      };
    }),
  }), [partidosPendientes, pronosticoMap]);

  const { register, handleSubmit, reset, watch, formState: { isDirty } } = useForm<FormValues>({ defaultValues });

  const initialRef = useRef(defaultValues);
  initialRef.current = defaultValues;

  const watchedPronosticos = watch('pronosticos');
  const pronosticosCompletados = watchedPronosticos?.filter(
    (p) => typeof p.golesLocalPredicho === 'number' && typeof p.golesVisitantePredicho === 'number'
  ).length ?? 0;

  const totalPendientes = partidosPendientes.length;
  const pendientesPorHacer = totalPendientes - pronosticosCompletados;
  const progreso = totalPendientes > 0 ? Math.round((pronosticosCompletados / totalPendientes) * 100) : 0;

  const onSubmit = (data: FormValues) => {
    const initial = initialRef.current.pronosticos;
    const pronosticosToSave = data.pronosticos
      .reduce<CrearPronosticosBatchRequest['pronosticos']>((acc, p, i) => {
        const init = initial[i];
        if (!init) return acc;
        if (p.golesLocalPredicho === init.golesLocalPredicho && p.golesVisitantePredicho === init.golesVisitantePredicho) return acc;
        acc.push({ idPartido: partidosPendientes[i].id, golesLocalPredicho: Number(p.golesLocalPredicho), golesVisitantePredicho: Number(p.golesVisitantePredicho) });
        return acc;
      }, []);
    if (pronosticosToSave.length === 0) return;
    const payload: CrearPronosticosBatchRequest = {
      idQuiniela: quinielaId,
      pronosticos: pronosticosToSave,
      idParticipacion: quiniela?.participacionId ?? null,
    };
    guardarPronosticos.mutate(payload, {
      onSuccess: () => { reset(data); showSnackbar('Pronósticos guardados', 'success'); },
    });
  };

  if (isLoading) return <LoadingScreen />;

  if (!quiniela) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconButton onClick={() => window.history.back()} sx={{ color: 'rgba(255,255,255,0.6)' }}><ArrowBackIcon /></IconButton>
        <Alert severity="error" sx={{ flex: 1, borderRadius: 2 }}>Error al cargar la quiniela</Alert>
    </Box>
  );
  }

  return (
    <Box sx={{ pb: 12 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => window.history.back()} sx={{ color: 'rgba(255,255,255,0.6)' }}><ArrowBackIcon /></IconButton>
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', fontSize: '1.3rem', letterSpacing: '-0.5px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {quiniela.nombre}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, px: 1.5, py: 0.75, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          onClick={() => { copyCode(quiniela.codigoInvitacion); showSnackbar('Código copiado', 'success'); }}>
          <ContentCopyIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }} />
          <Typography sx={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: 0.5 }}>
            {quiniela.codigoInvitacion}
          </Typography>
        </Box>
        <IconButton onClick={() => setQrOpen(true)} size="small" sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#0D5BFF' } }}>
          <QrCode2Icon sx={{ fontSize: 18 }} />
        </IconButton>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
          {todosPartidos.length} partidos
        </Typography>
      </Box>

      <Dialog open={qrOpen} onClose={() => setQrOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#fff', textAlign: 'center' }}>Invitar a la Quiniela</DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 1 }}>
          <Box sx={{ display: 'inline-flex', bgcolor: '#fff', borderRadius: 3, p: 2, mb: 2 }}>
            <QRCodeCanvas value={quiniela.codigoInvitacion} size={220} />
          </Box>
          <Typography sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#fff', fontSize: '1.1rem', letterSpacing: 2, mb: 0.5 }}>
            {quiniela.codigoInvitacion}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
            Comparte este código con tus amigos
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
          <Button variant="contained" fullWidth startIcon={<ShareIcon />} onClick={() => { shareQuiniela(quiniela.nombre, quiniela.codigoInvitacion); setQrOpen(false); }} sx={{ py: 1.5 }}>
            Compartir código
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Tabs value={currentTab} onChange={(_, v) => setTab(v)} sx={{ flex: 1, '& .MuiTabs-indicator': { bgcolor: '#0D5BFF' } }}>
          {!finalized && <Tab label="Mis Pronósticos" sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-selected': { color: '#fff' } }} />}
          <Tab label="Posiciones" sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-selected': { color: '#fff' } }} />
        </Tabs>
        <PuntosInfo variant="icon" />
      </Box>

      {finalized && quiniela?.ganadorNombre && (
        <Box sx={{ bgcolor: 'rgba(255,215,0,0.1)', borderRadius: 2, p: 2, mb: 2, border: '1px solid rgba(255,215,0,0.3)', textAlign: 'center' }}>
          <EmojiEventsIcon sx={{ fontSize: 36, color: '#FFD700' }} />
          <Typography sx={{ color: '#FFD700', fontWeight: 800, fontSize: '1.1rem', mt: 0.5 }}>
            Ganador: {quiniela.ganadorNombre}
          </Typography>
        </Box>
      )}

      {!finalized && tab === 0 && (
        <Box>
          {guardarPronosticos.isError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{getErrorMessage(guardarPronosticos.error)}</Alert>
          )}

          <Box sx={{ bgcolor: 'rgba(11, 18, 32, 0.3)', borderRadius: 2, p: 1.5, mb: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', fontWeight: 600 }}>
                Pronósticos
              </Typography>
              <Typography sx={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>
                {pronosticosCompletados}/{totalPendientes}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progreso}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.08)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: progreso === 100 ? '#00B86B' : '#0D5BFF',
                  borderRadius: 3,
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.75 }}>
              <Typography sx={{ color: '#00B86B', fontSize: '0.6rem', fontWeight: 600 }}>
                {pronosticosCompletados} completados
              </Typography>
              {pendientesPorHacer > 0 && (
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem' }}>
                  {pendientesPorHacer} pendientes
                </Typography>
              )}
            </Box>
          </Box>

          {partidosPendientes.length === 0 && (
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', py: 4, textAlign: 'center' }}>
              No hay partidos pendientes por pronosticar
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {partidosPorDia.map(([day, partidos]) => {
              const dayIndex = partidosPendientes.indexOf(partidos[0]);

              return (
                <Box key={day} sx={{ mb: 2.5 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, mb: 1.5, ml: 0.5 }}>
                    {formatDayLabel(day)}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {partidos.map((p, i) => {
                      const index = dayIndex + i;

                      return (
                        <Box key={p.id} sx={{ bgcolor: 'rgba(11, 18, 32, 0.3)', borderRadius: 3, p: 2, border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FlagIcon country={p.equipoLocal} size={16} />
                            <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.7rem', textAlign: 'right', minWidth: 0, wordBreak: 'break-word' }}>
                              {p.equipoLocal}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                              <TextField type="number" slotProps={{ htmlInput: { min: 0, max: 99, sx: { textAlign: 'center', width: 26, p: '4px 1px', fontWeight: 800, fontSize: '0.8rem' } } }} variant="outlined" size="small" disabled={guardarPronosticos.isPending}
                                {...register(`pronosticos.${index}.golesLocalPredicho`)} />
                              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 700, fontSize: '0.65rem' }}>-</Typography>
                              <TextField type="number" slotProps={{ htmlInput: { min: 0, max: 99, sx: { textAlign: 'center', width: 26, p: '4px 1px', fontWeight: 800, fontSize: '0.8rem' } } }} variant="outlined" size="small" disabled={guardarPronosticos.isPending}
                                {...register(`pronosticos.${index}.golesVisitantePredicho`)} />
                            </Box>
                            <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.7rem', textAlign: 'left', minWidth: 0, wordBreak: 'break-word' }}>
                              {p.equipoVisitante}
                            </Typography>
                            <FlagIcon country={p.equipoVisitante} size={16} />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.55rem' }}>
                              {formatFecha(p.fechaHora)} — {formatHora(p.fechaHora)}
                            </Typography>
                            <EstadoChip estado={p.estado} />
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              );
            })}

            {partidosPendientes.length > 0 && (
              <Box sx={{ position: 'fixed', bottom: { xs: 72, md: 0 }, left: { md: 250 }, right: 0, p: 2, bgcolor: 'rgba(11, 18, 32, 0.9)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(255,255,255,0.1)', zIndex: 10 }}>
                <Box sx={{ maxWidth: { md: 1440 }, mx: 'auto', px: { md: 4 } }}>
                  <Button type="submit" variant="contained" fullWidth size="large" disabled={!isDirty || guardarPronosticos.isPending} sx={{ py: 1.5, fontWeight: 700, fontSize: '1rem', minHeight: 52 }}>
                    {guardarPronosticos.isPending ? 'Guardando...' : 'Guardar Pronósticos'}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {currentTab === 1 && (
        <Box>
          {currentUserEntry && (
            <Box sx={{ bgcolor: 'rgba(13,91,255,0.1)', borderRadius: 2, p: 1.5, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmojiEventsIcon sx={{ color: '#0D5BFF', fontSize: 20 }} />
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>
                  Tu posición: #{currentUserEntry.posicion}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', ml: 'auto' }}>
                  {currentUserEntry.puntosTotales} pts — {currentUserEntry.aciertos} aciertos
                </Typography>
              </Box>
              {(() => {
                const idx = entries.indexOf(currentUserEntry);
                const next = idx >= 0 && idx < entries.length - 1 ? entries[idx + 1] : undefined;
                const diff = next ? currentUserEntry.puntosTotales - next.puntosTotales : undefined;
                if (diff && diff > 0) {
                  return (
                    <Typography sx={{ color: '#00B86B', fontSize: '0.65rem', fontWeight: 600, mt: 0.75, textAlign: 'center' }}>
                      {diff} pts por delante del siguiente puesto
                    </Typography>
                  );
                }
                return null;
              })()}
            </Box>
          )}

          {entries.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography sx={{ fontSize: 40, mb: 1 }}>⚽</Typography>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>El torneo aún no comienza</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', mt: 0.5 }}>
                Las posiciones se actualizarán cuando los partidos tengan resultados.
              </Typography>
            </Box>
          )}

          {entries.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {entries.map((entry, i) => (
                <LeaderboardRow key={entry.usuario.id} entry={entry} nextEntry={i < entries.length - 1 ? entries[i + 1] : undefined} isCurrentUser={entry.usuario.id === currentUser?.id} onClick={() => setSelectedUserId(entry.usuario.id)} />
              ))}
            </Box>
          )}
        </Box>
      )}

      <Dialog open={!!selectedUserId} onClose={() => setSelectedUserId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 28, height: 28, bgcolor: '#0D5BFF', fontSize: '0.7rem' }}>
            {selectedUser?.usuario.nombre.charAt(0).toUpperCase()}
          </Avatar>
          {selectedUser?.usuario.nombre}
          {selectedUser && (
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', ml: 'auto' }}>
              {selectedUser.puntosTotales} pts
            </Typography>
          )}
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 1.5, sm: 3 } }}>
          {loadingUserPronos && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>Cargando pronósticos...</Typography>
            </Box>
          )}
          {!loadingUserPronos && (!userPronosticos?.pronosticos || userPronosticos.pronosticos.length === 0) && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>Sin pronósticos disponibles</Typography>
            </Box>
          )}
          {!loadingUserPronos && userPronosticos?.pronosticos && userPronosticos.pronosticos.length > 0 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
              {userPronosticos.pronosticos
                .sort((a, b) => new Date(a.partido.fechaHora).getTime() - new Date(b.partido.fechaHora).getTime())
                .map((pr) => <PronosticoCard key={pr.id} pronostico={pr} />)}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setSelectedUserId(null)} variant="outlined" sx={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.2)' }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
