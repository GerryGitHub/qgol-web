import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Box,
  Typography,
  Card,
  CardContent,
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

const estadoColor: Record<string, 'default' | 'primary' | 'success' | 'error' | 'warning'> = {
  PENDIENTE: 'default',
  POR_COMENZAR: 'primary',
  EN_CURSO: 'success',
  FINALIZADO: 'error',
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

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<FormValues>({ defaultValues });

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
      onSuccess: () => {
        showSnackbar('Pronósticos guardados', 'success');
      },
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
    return <Alert severity="error">Error al cargar la quiniela</Alert>;
  }

  if (partidos.length === 0) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'text.secondary' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Pronósticos</Typography>
        </Box>
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>No hay partidos disponibles</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Todos los partidos han finalizado.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: 'text.secondary' }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Pronósticos</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {quiniela.nombre}
          </Typography>
        </Box>
      </Box>

      {guardarPronosticos.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>{getErrorMessage(guardarPronosticos.error)}</Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
          {fields.map((field, index) => {
            const partido = partidos[index];
            return (
              <Card key={field.id} sx={{ '&:hover': { borderColor: 'primary.main' } }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {formatFecha(partido.fechaHora)}
                    </Typography>
                    <Chip
                      label={estadoLabel[partido.estado] || partido.estado}
                      color={estadoColor[partido.estado] || 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ flex: 1, textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{partido.equipoLocal}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TextField
                        type="number"
                        slotProps={{
                          htmlInput: {
                            min: 0,
                            max: 99,
                            sx: { textAlign: 'center', width: 40, p: '6px 4px', fontWeight: 700, fontSize: '1rem' },
                          },
                        }}
                        variant="outlined"
                        size="small"
                        disabled={guardarPronosticos.isPending}
                        {...register(`pronosticos.${index}.golesLocalPredicho`, {
                          valueAsNumber: true,
                          min: 0,
                        })}
                      />
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>vs</Typography>
                      <TextField
                        type="number"
                        slotProps={{
                          htmlInput: {
                            min: 0,
                            max: 99,
                            sx: { textAlign: 'center', width: 40, p: '6px 4px', fontWeight: 700, fontSize: '1rem' },
                          },
                        }}
                        variant="outlined"
                        size="small"
                        disabled={guardarPronosticos.isPending}
                        {...register(`pronosticos.${index}.golesVisitantePredicho`, {
                          valueAsNumber: true,
                          min: 0,
                        })}
                      />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{partido.equipoVisitante}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={!isDirty || guardarPronosticos.isPending}
          sx={{ py: 1.5, fontWeight: 700 }}
        >
          {guardarPronosticos.isPending ? 'Guardando...' : 'Guardar Pronósticos'}
        </Button>
      </Box>
    </Box>
  );
}
