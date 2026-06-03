import { useState, useMemo } from 'react';
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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarsIcon from '@mui/icons-material/Stars';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useQuinielaDetalle, useMisPronosticos, useGuardarPronosticos, useLeaderboard } from '@/hooks/useQuinielas';
import { useSnackbarStore } from '@/store/snackbarStore';
import { useAuthStore } from '@/store/authStore';
import { ApiError } from '@/api/generated';
import type { CrearPronosticosBatchRequest, PronosticoItemRequest } from '@/types';
import type { LeaderboardEntryDTO } from '@/api/generated';
import FlagIcon from '@/components/ui/FlagIcon';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface FormValues {
  pronosticos: PronosticoItemRequest[];
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

const medalColors = ['#F59E0B', '#94A3B8', '#CD7F32'];

function RankBadge({ posicion }: { posicion: number }) {
  if (posicion <= 3) {
    return <EmojiEventsIcon sx={{ color: medalColors[posicion - 1], fontSize: 28 }} />;
  }
  return (
    <Typography sx={{ width: 28, textAlign: 'center', fontWeight: 700, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
      {posicion}
    </Typography>
  );
}

function LeaderboardRow({ entry, isCurrentUser }: { entry: LeaderboardEntryDTO; isCurrentUser: boolean }) {
  return (
    <Box
      sx={{
        display: 'flex', alignItems: 'center', gap: 2, p: 2,
        bgcolor: isCurrentUser ? 'rgba(13,91,255,0.08)' : 'rgba(11,18,32,0.3)',
        borderRadius: 3,
        border: isCurrentUser ? '1.5px solid' : '1px solid',
        borderColor: isCurrentUser ? '#0D5BFF' : entry.posicion <= 3 ? medalColors[entry.posicion - 1] : 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(4px)',
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

function EstadoChip({ estado }: { estado: string }) {
  const color = estado === 'FINALIZADO' ? 'rgba(255,255,255,0.3)' : estado === 'EN_CURSO' ? '#FF4D4D' : '#00B86B';
  const label = estado === 'FINALIZADO' ? 'Finalizado' : estado === 'EN_CURSO' ? 'En vivo' : 'Próximo';
  return (
    <Typography sx={{ fontSize: '0.5rem', color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, border: `1px solid ${color}20`, borderRadius: 1, px: 0.75, py: 0.2 }}>
      {label}
    </Typography>
  );
}

interface GrupoConPartidos {
  grupo: string;
  partidos: Array<{
    id: number;
    equipoLocal: string;
    equipoVisitante: string;
    golesLocalReal?: number;
    golesVisitanteReal?: number;
    fechaHora: string;
    estado: string;
  }>;
}

export default function QuinielaDetail() {
  const { id } = useParams<{ id: string }>();
  const quinielaId = Number(id);
  const showSnackbar = useSnackbarStore((s) => s.show);
  const currentUser = useAuthStore((s) => s.usuario);
  const [tab, setTab] = useState(0);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']));

  const { data: quiniela, isLoading } = useQuinielaDetalle(quinielaId);
  const { data: misPronosticos } = useMisPronosticos(quinielaId);
  const { data: leaderboard } = useLeaderboard(quinielaId);
  const guardarPronosticos = useGuardarPronosticos();

  const partidos = quiniela?.partidos ?? [];

  const grupos: GrupoConPartidos[] = useMemo(() => {
    const map = new Map<string, GrupoConPartidos['partidos']>();
    for (const p of partidos) {
      if (!p.grupo) continue;
      if (!map.has(p.grupo)) map.set(p.grupo, []);
      map.get(p.grupo)!.push({
        id: p.id,
        equipoLocal: p.equipoLocal,
        equipoVisitante: p.equipoVisitante,
        golesLocalReal: p.golesLocalReal,
        golesVisitanteReal: p.golesVisitanteReal,
        fechaHora: p.fechaHora,
        estado: p.estado,
      });
    }
    return Array.from(map.entries())
      .map(([grupo, partidos]) => ({ grupo, partidos }))
      .sort((a, b) => a.grupo.localeCompare(b.grupo));
  }, [partidos]);

  const totalPartidos = partidos.length;

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

  const defaultValues = useMemo(() => ({
    pronosticos: partidos.map((p) => {
      const existing = pronosticoMap.get(p.id);
      return {
        idPartido: p.id,
        golesLocalPredicho: existing?.golesLocalPredicho ?? 0,
        golesVisitantePredicho: existing?.golesVisitantePredicho ?? 0,
      };
    }),
  }), [partidos, pronosticoMap]);

  const { register, handleSubmit, reset, formState: { isDirty, dirtyFields } } = useForm<FormValues>({ defaultValues });

  const dirtyCount = isDirty ? Object.keys(dirtyFields).length : 0;

  const onSubmit = (data: FormValues) => {
    const payload: CrearPronosticosBatchRequest = {
      idQuiniela: quinielaId,
      pronosticos: data.pronosticos.map((p) => ({
        idPartido: p.idPartido,
        golesLocalPredicho: Number(p.golesLocalPredicho),
        golesVisitantePredicho: Number(p.golesVisitantePredicho),
      })),
    };
    guardarPronosticos.mutate(payload, {
      onSuccess: () => { reset(data); showSnackbar('Pronósticos guardados', 'success'); },
    });
  };

  const toggleGroup = (grupo: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(grupo)) next.delete(grupo);
      else next.add(grupo);
      return next;
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

  const entries = leaderboard ? [...leaderboard].sort((a, b) => a.posicion - b.posicion) : [];
  const currentUserEntry = entries.find((e) => e.usuario.id === currentUser?.id);

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
          onClick={() => { navigator.clipboard.writeText(quiniela.codigoInvitacion); showSnackbar('Código copiado', 'success'); }}>
          <ContentCopyIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }} />
          <Typography sx={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: 0.5 }}>
            {quiniela.codigoInvitacion}
          </Typography>
        </Box>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
          {totalPartidos} partidos
        </Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2.5, borderBottom: '1px solid rgba(255,255,255,0.1)', '& .MuiTabs-indicator': { bgcolor: '#0D5BFF' } }}>
        <Tab label="Mis Pronósticos" sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-selected': { color: '#fff' } }} />
        <Tab label="Posiciones" sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-selected': { color: '#fff' } }} />
      </Tabs>

      {tab === 0 && (
        <Box>
          {guardarPronosticos.isError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{getErrorMessage(guardarPronosticos.error)}</Alert>
          )}

          {grupos.length === 0 && (
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', py: 4, textAlign: 'center' }}>
              No hay partidos disponibles
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {grupos.map((g) => (
              <Box key={g.grupo} sx={{ mb: 2 }}>
                <Box
                  onClick={() => toggleGroup(g.grupo)}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', mb: expandedGroups.has(g.grupo) ? 1.5 : 0 }}
                >
                  {expandedGroups.has(g.grupo) ? <KeyboardArrowUpIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} /> : <KeyboardArrowDownIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} />}
                  <Typography sx={{ fontWeight: 800, color: '#0D5BFF', fontSize: '1rem' }}>Grupo {g.grupo}</Typography>
                </Box>

                {expandedGroups.has(g.grupo) && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {g.partidos.map((p) => {
                      const index = partidos.findIndex((pt) => pt.id === p.id);
                      const pronostico = pronosticoMap.get(p.id);
                      const isEditable = p.estado === 'PENDIENTE';

                      return (
                        <Box key={p.id} sx={{ bgcolor: 'rgba(11, 18, 32, 0.3)', borderRadius: 3, p: 2, border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <FlagIcon country={p.equipoLocal} size={18} />
                            <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.75rem', flex: 1, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {p.equipoLocal}
                            </Typography>

                            {isEditable && index >= 0 ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <TextField type="number" slotProps={{ htmlInput: { min: 0, max: 99, sx: { textAlign: 'center', width: 28, p: '4px 1px', fontWeight: 800, fontSize: '0.85rem' } } }} variant="outlined" size="small" disabled={guardarPronosticos.isPending}
                                  {...register(`pronosticos.${index}.golesLocalPredicho`, { valueAsNumber: true, min: 0 })} />
                                <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 700, fontSize: '0.7rem' }}>-</Typography>
                                <TextField type="number" slotProps={{ htmlInput: { min: 0, max: 99, sx: { textAlign: 'center', width: 28, p: '4px 1px', fontWeight: 800, fontSize: '0.85rem' } } }} variant="outlined" size="small" disabled={guardarPronosticos.isPending}
                                  {...register(`pronosticos.${index}.golesVisitantePredicho`, { valueAsNumber: true, min: 0 })} />
                              </Box>
                            ) : (
                              <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: p.estado === 'FINALIZADO' ? '#fff' : 'rgba(255,255,255,0.3)', mx: 1 }}>
                                {p.golesLocalReal ?? '?'} — {p.golesVisitanteReal ?? '?'}
                              </Typography>
                            )}

                            <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.75rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {p.equipoVisitante}
                            </Typography>
                            <FlagIcon country={p.equipoVisitante} size={18} />
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.55rem' }}>
                              {formatFecha(p.fechaHora)} — {formatHora(p.fechaHora)}
                            </Typography>
                            <EstadoChip estado={p.estado} />
                          </Box>

                          {p.estado === 'FINALIZADO' && pronostico && (
                            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem', textAlign: 'center', mt: 0.75 }}>
                              Tu pronóstico: {pronostico.golesLocalPredicho} — {pronostico.golesVisitantePredicho}
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            ))}

            {grupos.length > 0 && (
              <Box sx={{ position: 'fixed', bottom: { xs: 72, md: 0 }, left: { md: 250 }, right: 0, p: 2, bgcolor: 'rgba(11, 18, 32, 0.9)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(255,255,255,0.1)', zIndex: 10 }}>
                <Box sx={{ maxWidth: { md: 1440 }, mx: 'auto', px: { md: 4 } }}>
                  <Button type="submit" variant="contained" fullWidth size="large" disabled={!isDirty || guardarPronosticos.isPending} sx={{ py: 1.5, fontWeight: 700, fontSize: '1rem', minHeight: 52 }}>
                    {guardarPronosticos.isPending ? 'Guardando...' : dirtyCount > 0 ? `Guardar Pronósticos (${dirtyCount})` : 'Guardar Pronósticos'}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {tab === 1 && (
        <Box>
          {currentUserEntry && (
            <Box sx={{ bgcolor: 'rgba(13,91,255,0.1)', borderRadius: 2, p: 1.5, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <EmojiEventsIcon sx={{ color: '#0D5BFF', fontSize: 20 }} />
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>
                Tu posición: #{currentUserEntry.posicion}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', ml: 'auto' }}>
                {currentUserEntry.puntosTotales} pts — {currentUserEntry.aciertos} aciertos
              </Typography>
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
              {entries.map((entry) => (
                <LeaderboardRow key={entry.usuario.id} entry={entry} isCurrentUser={entry.usuario.id === currentUser?.id} />
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
