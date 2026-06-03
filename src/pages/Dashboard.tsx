import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useAuthStore } from '@/store/authStore';
import { useQuinielas, useCrearQuiniela, useUnirseQuiniela } from '@/hooks/useQuinielas';
import type { QuinielaResumenDTO } from '@/types';
import { ApiError } from '@/api/generated';
import { useSnackbarStore } from '@/store/snackbarStore';
import LoadingScreen from '@/components/ui/LoadingScreen';

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.body?.message) return error.body.message;
  if (error instanceof Error) return error.message;
  return 'Error';
}

function QuinielaCard({ quiniela }: { quiniela: QuinielaResumenDTO }) {
  const navigate = useNavigate();
  const showSnackbar = useSnackbarStore((s) => s.show);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(quiniela.codigoInvitacion);
    showSnackbar('Código copiado', 'success');
  };

  return (
    <Box
      onClick={() => navigate(`/quiniela/${quiniela.id}`)}
      sx={{
        bgcolor: 'rgba(11, 18, 32, 0.3)',
        borderRadius: 3,
        p: 2.5,
        cursor: 'pointer',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '&:hover': { bgcolor: 'rgba(11, 18, 32, 0.45)', borderColor: 'rgba(255, 255, 255, 0.25)' },
      }}
    >
      <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
        {quiniela.nombre}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
        <Box
          onClick={handleCopyCode}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1.5, px: 1.25, py: 0.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
        >
          <ContentCopyIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
          <Typography sx={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: 0.5 }}>
            {quiniela.codigoInvitacion}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#2563EB', borderRadius: 2, px: 1.5, py: 0.75 }}>
          <Typography sx={{ fontWeight: 800, color: '#fff', fontSize: '0.85rem' }}>{quiniela.puntosTotales}</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>pts</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { usuario } = useAuthStore();
  const { data: quinielas, isLoading, isError } = useQuinielas();
  const crearQuiniela = useCrearQuiniela();
  const unirseQuiniela = useUnirseQuiniela();
  const showSnackbar = useSnackbarStore((s) => s.show);
  const [crearOpen, setCrearOpen] = useState(false);
  const [unirseOpen, setUnirseOpen] = useState(false);
  const [newNombre, setNewNombre] = useState('');
  const [nuevoCodigo, setNuevoCodigo] = useState('');
  const [codigo, setCodigo] = useState('');

  return (
    <Box sx={{ pb: 12 }}>
      {usuario && (
        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', mb: 2 }}>
          Bienvenido, {usuario.nombre}
        </Typography>
      )}

      <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', fontSize: '1.5rem', mb: 2.5, letterSpacing: '-0.5px' }}>
        Mis Quinielas
      </Typography>

      {isLoading && <LoadingScreen />}

      {isError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
          No pudimos cargar tus quinielas. Intenta de nuevo.
        </Alert>
      )}

      {quinielas && quinielas.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <EmojiEventsIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
            No tienes quinielas aún
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', mt: 0.5, mb: 3 }}>
            ¡Crea una o únete para empezar!
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCrearOpen(true)}>
              Crear Quiniela
            </Button>
            <Button variant="outlined" startIcon={<ContentPasteIcon />} onClick={() => setUnirseOpen(true)}>
              Unirse
            </Button>
          </Box>
        </Box>
      )}

      {quinielas && quinielas.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {quinielas.map((q) => (
            <QuinielaCard key={q.id} quiniela={q} />
          ))}
        </Box>
      )}

      <Fab
        color="primary"
        onClick={() => setCrearOpen(true)}
        sx={{ position: 'fixed', bottom: { xs: 88, md: 24 }, right: 24, zIndex: 10 }}
      >
        <AddIcon />
      </Fab>
      <Fab
        onClick={() => setUnirseOpen(true)}
        sx={{ position: 'fixed', bottom: { xs: 152, md: 88 }, right: 24, zIndex: 10, bgcolor: '#00B86B', '&:hover': { bgcolor: '#009B5C' } }}
      >
        <ContentPasteIcon />
      </Fab>

      <Dialog open={crearOpen} onClose={() => { setCrearOpen(false); setNewNombre(''); setNuevoCodigo(''); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#fff' }}>Crear Quiniela</DialogTitle>
        <Box component="form" onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          crearQuiniela.mutate(
            { nombre: newNombre, codigoInvitacion: nuevoCodigo },
            { onSuccess: (data) => { setCrearOpen(false); setNewNombre(''); setNuevoCodigo(''); navigate(`/quiniela/${data.id}`); } },
          );
        }}>
          <DialogContent>
            {crearQuiniela.isError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{getErrorMessage(crearQuiniela.error)}</Alert>
            )}
            <TextField fullWidth label="Nombre" placeholder="Ej: Mundial 2026 Amigos" value={newNombre} onChange={(e) => setNewNombre(e.target.value)} required autoFocus sx={{ mb: 2 }} />
            <TextField fullWidth label="Código de invitación" placeholder="Ej: MUNDIAL2026" helperText="Compártelo con otros participantes" value={nuevoCodigo} onChange={(e) => setNuevoCodigo(e.target.value)} required />
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => { setCrearOpen(false); setNewNombre(''); setNuevoCodigo(''); }} sx={{ color: 'rgba(255,255,255,0.5)' }}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={!newNombre || !nuevoCodigo || crearQuiniela.isPending}>
              {crearQuiniela.isPending ? 'Creando...' : 'Crear'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={unirseOpen} onClose={() => setUnirseOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#fff' }}>Unirse a Quiniela</DialogTitle>
        <Box component="form" onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          unirseQuiniela.mutate({ codigoInvitacion: codigo }, {
            onSuccess: () => { setUnirseOpen(false); setCodigo(''); showSnackbar('Te has unido a la quiniela', 'success'); },
          });
        }}>
          <DialogContent>
            {unirseQuiniela.isError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{getErrorMessage(unirseQuiniela.error)}</Alert>
            )}
            <TextField fullWidth label="Código de invitación" placeholder="Ingresa el código" value={codigo} onChange={(e) => setCodigo(e.target.value)} required autoFocus />
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setUnirseOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={!codigo || unirseQuiniela.isPending}>
              {unirseQuiniela.isPending ? 'Uniendo...' : 'Unirse'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
