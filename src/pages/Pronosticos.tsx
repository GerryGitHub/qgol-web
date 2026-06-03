import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Box,
  Typography,
  Button,
  Alert,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { useQuinielas, useQuinielaDetalle, useMisPronosticos, useGuardarPronosticos } from '@/hooks/useQuinielas';
import { useSnackbarStore } from '@/store/snackbarStore';
import { ApiError } from '@/api/generated';
import type { CrearPronosticosBatchRequest, PronosticoItemRequest } from '@/types';
import FlagIcon from '@/components/ui/FlagIcon';
import LoadingScreen from '@/components/ui/LoadingScreen';
import EmptyState from '@/components/ui/EmptyState';

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

function EstadoChip({ estado }: { estado: string }) {
  const color = estado === 'FINALIZADO' ? 'rgba(255,255,255,0.3)' : estado === 'EN_CURSO' ? '#FF4D4D' : '#00B86B';
  const label = estado === 'FINALIZADO' ? 'Finalizado' : estado === 'EN_CURSO' ? 'En vivo' : 'Próximo';
  return (
    <Typography sx={{ fontSize: '0.55rem', color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, border: `1px solid ${color}20`, borderRadius: 1, px: 1, py: 0.25 }}>
      {label}
    </Typography>
  );
}

export default function Pronosticos() {
  const navigate = useNavigate();
  const showSnackbar = useSnackbarStore((s) => s.show);
  const { data: quinielas, isLoading: loadingQuinielas } = useQuinielas();
  const [selectedId, setSelectedId] = useState<number | ''>('');

  const quinielaId = selectedId !== '' ? selectedId : null;
  const { data: quinielaDetalle, isLoading: loadingDetalle } = useQuinielaDetalle(selectedId as number);
  const { data: misPronosticos } = useMisPronosticos(selectedId as number);
  const guardarPronosticos = useGuardarPronosticos();

  const partidos = useMemo(() => (quinielaDetalle?.partidos ?? []).filter(
    (p) => p.estado !== 'FINALIZADO',
  ), [quinielaDetalle]);

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

  const { control, register, handleSubmit, reset, formState: { isDirty } } = useForm<FormValues>({ defaultValues });
  const { fields } = useFieldArray({ control, name: 'pronosticos' });

  useEffect(() => {
    if (defaultValues.pronosticos.length > 0) reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = (data: FormValues) => {
    if (quinielaId === null) return;
    const payload: CrearPronosticosBatchRequest = {
      idQuiniela: quinielaId,
      pronosticos: data.pronosticos.map((p) => ({
        idPartido: p.idPartido,
        golesLocalPredicho: Number(p.golesLocalPredicho),
        golesVisitantePredicho: Number(p.golesVisitantePredicho),
      })),
    };
    guardarPronosticos.mutate(payload, {
      onSuccess: () => showSnackbar('Pronósticos guardados', 'success'),
    });
  };

  return (
    <Box sx={{ pb: 12 }}>
      <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', fontSize: '1.5rem', mb: 0.5, letterSpacing: '-0.5px' }}>
        Pronósticos
      </Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 2.5 }}>
        Selecciona una quiniela para pronosticar
      </Typography>

      {loadingQuinielas && <LoadingScreen />}

      {quinielas && quinielas.length === 0 && (
        <EmptyState icon={<SportsSoccerIcon />} title="Sin quinielas" description="Crea o únete a una quiniela para empezar a pronosticar" action={{ label: 'Ir a Quinielas', onClick: () => navigate('/dashboard') }} />
      )}

      {quinielas && quinielas.length > 0 && (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Quiniela</InputLabel>
          <Select value={selectedId} onChange={(e) => setSelectedId(e.target.value as number)} label="Quiniela">
            {quinielas.map((q) => (
              <MenuItem key={q.id} value={q.id}>{q.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {selectedId !== '' && loadingDetalle && <LoadingScreen />}

      {selectedId !== '' && !loadingDetalle && partidos.length === 0 && (
        <EmptyState icon={<SportsSoccerIcon />} title="No hay partidos pendientes" description="Todos los partidos de esta quiniela han finalizado" />
      )}

      {selectedId !== '' && !loadingDetalle && partidos.length > 0 && (
        <Box>
          {guardarPronosticos.isError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{getErrorMessage(guardarPronosticos.error)}</Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
              {fields.map((field, index) => {
                const partido = partidos[index];
                return (
                  <Box key={field.id} sx={{ bgcolor: 'rgba(11, 18, 32, 0.3)', borderRadius: 3, p: 2, border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <FlagIcon country={partido.equipoLocal} size={20} />
                      <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.75rem', flex: 1, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {partido.equipoLocal}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TextField type="number" slotProps={{ htmlInput: { min: 0, max: 99, sx: { textAlign: 'center', width: 32, p: '6px 2px', fontWeight: 800, fontSize: '0.9rem' } } }} variant="outlined" size="small" disabled={guardarPronosticos.isPending}
                          {...register(`pronosticos.${index}.golesLocalPredicho`, { valueAsNumber: true, min: 0 })} />
                        <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 700, fontSize: '0.7rem' }}>-</Typography>
                        <TextField type="number" slotProps={{ htmlInput: { min: 0, max: 99, sx: { textAlign: 'center', width: 32, p: '6px 2px', fontWeight: 800, fontSize: '0.9rem' } } }} variant="outlined" size="small" disabled={guardarPronosticos.isPending}
                          {...register(`pronosticos.${index}.golesVisitantePredicho`, { valueAsNumber: true, min: 0 })} />
                      </Box>
                      <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.75rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {partido.equipoVisitante}
                      </Typography>
                      <FlagIcon country={partido.equipoVisitante} size={20} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem' }}>
                        {formatFecha(partido.fechaHora)} — {formatHora(partido.fechaHora)}
                      </Typography>
                      <EstadoChip estado={partido.estado} />
                    </Box>
                  </Box>
                );
              })}
            </Box>

            <Box sx={{ position: 'fixed', bottom: { xs: 72, md: 0 }, left: { md: 250 }, right: 0, p: 2, bgcolor: 'rgba(11, 18, 32, 0.9)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(255,255,255,0.1)', zIndex: 10 }}>
              <Box sx={{ maxWidth: { md: 1440 }, mx: 'auto', px: { md: 4 } }}>
                <Button type="submit" variant="contained" fullWidth size="large" disabled={!isDirty || guardarPronosticos.isPending} sx={{ py: 1.5, fontWeight: 700, fontSize: '1rem', minHeight: 52 }}>
                  {guardarPronosticos.isPending ? 'Guardando...' : 'Guardar Pronósticos'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
