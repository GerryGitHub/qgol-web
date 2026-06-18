import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useEliminatoriasPreview, useEliminatoriasStatus, useCrearEliminatorias } from '@/hooks/useEliminatorias';
import { useAuthStore } from '@/store/authStore';
import { useSnackbarStore } from '@/store/snackbarStore';
import LoadingScreen from '@/components/ui/LoadingScreen';
import FlagIcon from '@/components/ui/FlagIcon';

const rondaLabels: Record<string, string> = {
  R32: 'Dieciseisavos', R16: 'Octavos', QF: 'Cuartos',
  SF: 'Semifinales', '3RD': 'Tercer Lugar', FINAL: 'Final',
};

const rondaColors: Record<string, string> = {
  R32: '#4A90D9', R16: '#50C878', QF: '#F5A623',
  SF: '#9B59B6', '3RD': '#E74C3C', FINAL: '#F1C40F',
};

function BracketMatch({ codigo, equipoLocal, equipoVisitante, resuelto }: { codigo: string; equipoLocal: string | null; equipoVisitante: string | null; resuelto: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.75, opacity: resuelto ? 1 : 0.45 }}>
      <Typography sx={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, minWidth: 28, textAlign: 'right', fontFamily: 'monospace' }}>
        {codigo}
      </Typography>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end', minWidth: 0 }}>
        {equipoLocal ? (
          <>
            <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.7rem', textAlign: 'right', wordBreak: 'break-word' }}>{equipoLocal}</Typography>
            <FlagIcon country={equipoLocal} size={12} />
          </>
        ) : (
          <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontStyle: 'italic' }}>Por definir</Typography>
        )}
      </Box>
      <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem', mx: 0.5 }}>vs</Typography>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-start', minWidth: 0 }}>
        {equipoVisitante ? (
          <>
            <FlagIcon country={equipoVisitante} size={12} />
            <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.7rem', textAlign: 'left', wordBreak: 'break-word' }}>{equipoVisitante}</Typography>
          </>
        ) : (
          <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontStyle: 'italic' }}>Por definir</Typography>
        )}
      </Box>
    </Box>
  );
}

export default function Eliminatorias() {
  const navigate = useNavigate();
  const showSnackbar = useSnackbarStore((s) => s.show);
  const usuario = useAuthStore((s) => s.usuario);
  const isAdmin = usuario?.rol === 'ADMIN';

  const { data: preview, isLoading: loadingPreview } = useEliminatoriasPreview();
  const { data: status } = useEliminatoriasStatus();
  const crearEliminatorias = useCrearEliminatorias();

  const [confirmOpen, setConfirmOpen] = useState(false);

  if (loadingPreview) return <LoadingScreen />;

  const rondaOrder = ['R32', 'R16', 'QF', 'SF', '3RD', 'FINAL'];
  const rondasDisponibles = rondaOrder.filter((r) => preview?.rondas[r] && preview.rondas[r].length > 0);

  const handleCrear = () => {
    const quinielaGruposId = status?.quinielaGrupos;
    if (!quinielaGruposId) {
      showSnackbar('No hay quiniela de grupos activa para cerrar', 'error');
      return;
    }
    const rondaActual = status?.rondaActual || 'R32';
    const nombreQuiniela = `Eliminatorias - ${rondaLabels[rondaActual] || rondaActual}`;

    crearEliminatorias.mutate({ nombreQuiniela, quinielaGruposId }, {
      onSuccess: (data) => {
        setConfirmOpen(false);
        showSnackbar(`Quiniela "${data.nombre}" creada con ${data.partidosCreados} partidos`, 'success');
        navigate(`/quiniela/${data.quinielaId}`);
      },
      onError: () => {
        showSnackbar('Error al crear eliminatorias', 'error');
      },
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <EmojiEventsIcon sx={{ color: '#F1C40F', fontSize: 28 }} />
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', fontSize: '1.3rem', letterSpacing: '-0.5px', flex: 1 }}>
          Eliminatorias
        </Typography>
        {isAdmin && status && !status.rondaActual && status.quinielaGrupos && (
          <Button
            variant="contained"
            size="small"
            startIcon={<AutoAwesomeIcon />}
            onClick={() => setConfirmOpen(true)}
            sx={{ fontWeight: 700, fontSize: '0.7rem', py: 0.75, px: 1.5 }}
          >
            Generar Eliminatorias
          </Button>
        )}
      </Box>

      {preview?.gruposActivos && (
        <Box sx={{ bgcolor: 'rgba(13,91,255,0.08)', borderRadius: 2, p: 1.5, mb: 2.5, border: '1px solid rgba(13,91,255,0.2)' }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 600, textAlign: 'center' }}>
            Así quedarían las eliminatorias si hoy terminara la fase de grupos
          </Typography>
        </Box>
      )}

      {rondasDisponibles.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
            Los cruces se mostrarán cuando haya resultados en la fase de grupos
          </Typography>
        </Box>
      )}

      {rondasDisponibles.map((ronda) => {
        const partidos = preview?.rondas[ronda] ?? [];
        const resueltos = partidos.filter((p) => p.resuelto).length;
        return (
          <Box key={ronda} sx={{ mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip label={rondaLabels[ronda] || ronda} size="small"
                sx={{ fontWeight: 700, fontSize: '0.65rem', bgcolor: `${rondaColors[ronda]}20`, color: rondaColors[ronda], border: `1px solid ${rondaColors[ronda]}40` }} />
              <Typography sx={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                {resueltos}/{partidos.length} definidos
              </Typography>
            </Box>
            <Box sx={{ bgcolor: 'rgba(11,18,32,0.3)', borderRadius: 3, p: 1.5, border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }}>
              {[...partidos].sort((a, b) => a.orden - b.orden).map((p) => (
                <BracketMatch key={p.codigo} {...p} />
              ))}
            </Box>
          </Box>
        );
      })}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#fff' }}>Generar Eliminatorias</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Se cerrará la quiniela de grupos y se creará una nueva quiniela con los partidos de la siguiente ronda.
            </Alert>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
              Ronda a generar: <strong>{rondaLabels[status?.rondaActual || 'R32'] || status?.rondaActual || 'R32'}</strong>
            </Typography>
            {crearEliminatorias.isError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {(crearEliminatorias.error as any)?.body?.message || 'Error al crear eliminatorias'}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', pb: 2, px: 3 }}>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined" sx={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.2)' }}>
            Cancelar
          </Button>
          <Button onClick={handleCrear} variant="contained" disabled={crearEliminatorias.isPending}>
            {crearEliminatorias.isPending ? 'Generando...' : 'Generar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
