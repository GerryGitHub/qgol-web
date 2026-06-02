import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  TextField,
  IconButton,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useQuinielaDetalle, useMisPronosticos, useGuardarPronosticos } from '@/hooks/useQuinielas';
import { useSnackbarStore } from '@/store/snackbarStore';
import { ApiError } from '@/api/generated';
import type { CrearPronosticosBatchRequest, PronosticoItemRequest } from '@/types';

interface FormValues {
  pronosticos: PronosticoItemRequest[];
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.body?.message) return error.body.message;
  if (error instanceof Error) return error.message;
  return 'Error al guardar pronósticos';
}

function formatFecha(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

const estadoLabel: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  POR_COMENZAR: 'Próximo',
  EN_CURSO: 'En vivo',
  FINALIZADO: 'Finalizado',
};

export default function Pronosticos() {
  const { id } = useParams<{ id: string }>();
  const quinielaId = Number(id);
  const navigate = useNavigate();
  const showSnackbar = useSnackbarStore((s) => s.show);

  const { data: quiniela, isLoading: loadingQuiniela } = useQuinielaDetalle(quinielaId);
  const { data: misPronosticos, isLoading: loadingPronosticos } = useMisPronosticos(quinielaId);
  const guardarPronosticos = useGuardarPronosticos();

  const partidos = useMemo(() => (quiniela?.partidos ?? []).filter(
    (p) => p.estado !== 'FINALIZADO',
  ), [quiniela]);

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

  const isLoading = loadingQuiniela || loadingPronosticos;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!quiniela) {
    return <Alert severity="error" sx={{ borderRadius: 3 }}>Error al cargar la quiniela</Alert>;
  }

  if (partidos.length === 0) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: '#94A3B8' }}><ArrowBackIcon /></IconButton>
          <Typography variant="h2" sx={{ color: '#fff' }}>Pronósticos</Typography>
        </Box>
        <Box sx={{ textAlign: 'center', py: 6, bgcolor: '#334155', borderRadius: 4, p: 4 }}>
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>No hay partidos disponibles</Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', mt: 1 }}>Todos los partidos han finalizado.</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 20 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: '#94A3B8' }}><ArrowBackIcon /></IconButton>
        <Box>
          <Typography variant="h2" sx={{ color: '#fff' }}>Pronósticos</Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>{quiniela.nombre}</Typography>
        </Box>
      </Box>

      {guardarPronosticos.isError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{getErrorMessage(guardarPronosticos.error)}</Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
          {fields.map((field, index) => {
            const partido = partidos[index];
            return (
              <Box key={field.id} sx={{ bgcolor: '#334155', borderRadius: 4, p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                    {formatFecha(partido.fechaHora)}
                  </Typography>
                  <Chip label={estadoLabel[partido.estado] || partido.estado} color="primary" size="small" variant="outlined" sx={{ borderRadius: 2, fontSize: '0.65rem' }} />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flex: 1, textAlign: 'right' }}>
                    <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{partido.equipoLocal}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      type="number"
                      slotProps={{
                        htmlInput: {
                          min: 0, max: 99,
                          sx: { textAlign: 'center', width: 48, p: '10px 6px', fontWeight: 800, fontSize: '1.25rem' },
                        },
                      }}
                      variant="outlined"
                      size="small"
                      disabled={guardarPronosticos.isPending}
                      {...register(`pronosticos.${index}.golesLocalPredicho`, { valueAsNumber: true, min: 0 })}
                    />
                    <Typography sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.85rem' }}>vs</Typography>
                    <TextField
                      type="number"
                      slotProps={{
                        htmlInput: {
                          min: 0, max: 99,
                          sx: { textAlign: 'center', width: 48, p: '10px 6px', fontWeight: 800, fontSize: '1.25rem' },
                        },
                      }}
                      variant="outlined"
                      size="small"
                      disabled={guardarPronosticos.isPending}
                      {...register(`pronosticos.${index}.golesVisitantePredicho`, { valueAsNumber: true, min: 0 })}
                    />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{partido.equipoVisitante}</Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ position: 'fixed', bottom: 72, left: 0, right: 0, p: 2, bgcolor: '#0F172A', borderTop: '1px solid #334155' }}>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={!isDirty || guardarPronosticos.isPending}
              sx={{ py: 1.5, fontWeight: 700, fontSize: '1rem' }}
            >
              {guardarPronosticos.isPending ? 'Guardando...' : 'Guardar Pronósticos'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
