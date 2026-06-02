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
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useQuinielas, useCrearQuiniela, useUnirseQuiniela } from '@/hooks/useQuinielas';
import type { QuinielaResumenDTO } from '@/types';
import { ApiError } from '@/api/generated';
import { useSnackbarStore } from '@/store/snackbarStore';
import SectionHeader from '@/components/ui/SectionHeader';
import EmptyState from '@/components/ui/EmptyState';
import LoadingScreen from '@/components/ui/LoadingScreen';

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.body?.message) return error.body.message;
  if (error instanceof Error) return error.message;
  return 'Error';
}

function QuinielaCard({ quiniela }: { quiniela: QuinielaResumenDTO }) {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate(`/quiniela/${quiniela.id}`)}
      sx={{
        bgcolor: '#334155',
        borderRadius: 4,
        p: 2.5,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.3)' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
          {quiniela.nombre}
        </Typography>
        <ChevronRightIcon sx={{ color: '#64748B', fontSize: 24, flexShrink: 0 }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" sx={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '0.8rem' }}>
          {quiniela.codigoInvitacion}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#22C55E' }}>
          {quiniela.puntosTotales} pts
        </Typography>
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
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
    <Box sx={{ pb: 8 }}>
      <SectionHeader
        title="Mis Quinielas"
        subtitle={quinielas ? `${quinielas.length} quiniela${quinielas.length !== 1 ? 's' : ''}` : undefined}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<ContentPasteIcon />} onClick={() => setUnirseOpen(true)}>
              Unirse
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCrearOpen(true)}>
              Crear
            </Button>
          </Box>
        }
      />

      {isLoading && <LoadingScreen />}

      {isError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
          No pudimos cargar tus quinielas. Intenta de nuevo.
        </Alert>
      )}

      {quinielas && quinielas.length === 0 && (
        <EmptyState
          icon={<EmojiEventsIcon />}
          title="Crea tu primera quiniela"
          description="Invita amigos y compite durante el Mundial 2026"
          action={{ label: 'Crear Quiniela', onClick: () => setCrearOpen(true) }}
        />
      )}

      {quinielas && quinielas.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {quinielas.map((q) => (
            <QuinielaCard key={q.id} quiniela={q} />
          ))}
        </Box>
      )}

      <Fab
        color="primary"
        onClick={() => setCrearOpen(true)}
        sx={{
          position: 'fixed',
          bottom: { xs: 88, md: 24 },
          right: 24,
          width: 56,
          height: 56,
          boxShadow: '0 4px 14px rgba(34, 197, 94, 0.35)',
        }}
      >
        <AddIcon />
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
            <Button onClick={() => { setCrearOpen(false); setNewNombre(''); setNuevoCodigo(''); }} sx={{ color: '#94A3B8' }}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={!newNombre || !nuevoCodigo || crearQuiniela.isPending}>
              {crearQuiniela.isPending ? 'Creando...' : 'Crear'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={unirseOpen} onClose={() => setUnirseOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#fff' }}>Unirse a Quiniela</DialogTitle>
        <Box component="form" onSubmit={(e: React.FormEvent) => { e.preventDefault(); unirseQuiniela.mutate({ codigoInvitacion: codigo }, { onSuccess: () => { setUnirseOpen(false); setCodigo(''); showSnackbar('Te has unido a la quiniela', 'success'); } }); }}>
          <DialogContent>
            {unirseQuiniela.isError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{getErrorMessage(unirseQuiniela.error)}</Alert>
            )}
            <TextField fullWidth label="Código de invitación" placeholder="Ingresa el código" value={codigo} onChange={(e) => setCodigo(e.target.value)} required autoFocus />
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setUnirseOpen(false)} sx={{ color: '#94A3B8' }}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={!codigo || unirseQuiniela.isPending}>
              {unirseQuiniela.isPending ? 'Uniendo...' : 'Unirse'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
