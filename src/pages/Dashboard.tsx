import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { useQuinielas, useCrearQuiniela, useUnirseQuiniela } from '@/hooks/useQuinielas';
import type { QuinielaResumenDTO } from '@/types';
import { ApiError } from '@/api/generated';

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.body?.message) return error.body.message;
  if (error instanceof Error) return error.message;
  return 'Error';
}

function QuinielaCard({ quiniela }: { quiniela: QuinielaResumenDTO }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(quiniela.codigoInvitacion);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card
      onClick={() => navigate(`/quiniela/${quiniela.id}`)}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: 'primary.main',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)',
        },
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, #6366f1, #f43f5e)',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3, pr: 1 }}>
            {quiniela.nombre}
          </Typography>
          <Chip
            icon={<EmojiEventsIcon sx={{ fontSize: 16 }} />}
            label={`${quiniela.puntosTotales} pts`}
            color="primary"
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600, flexShrink: 0 }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Chip
            icon={<SportsSoccerIcon sx={{ fontSize: 14 }} />}
            label={quiniela.codigoInvitacion}
            size="small"
            variant="filled"
            sx={{
              bgcolor: 'rgba(99, 102, 241, 0.1)',
              color: 'text.secondary',
              fontWeight: 500,
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              '& .MuiChip-icon': { color: 'text.secondary' },
            }}
          />
          <IconButton size="small" onClick={handleCopy} sx={{ color: copied ? 'success.main' : 'text.secondary' }}>
            <ContentCopyIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: quinielas, isLoading, isError } = useQuinielas();
  const crearQuiniela = useCrearQuiniela();
  const unirseQuiniela = useUnirseQuiniela();
  const [crearOpen, setCrearOpen] = useState(false);
  const [unirseOpen, setUnirseOpen] = useState(false);
  const [newNombre, setNewNombre] = useState('');
  const [codigo, setCodigo] = useState('');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Mis Quinielas
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            {quinielas ? `${quinielas.length} quiniela${quinielas.length !== 1 ? 's' : ''}` : 'Cargando...'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ContentPasteIcon />}
            onClick={() => setUnirseOpen(true)}
            sx={{ borderColor: 'divider' }}
          >
            Unirse
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCrearOpen(true)}
          >
            Crear
          </Button>
        </Box>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          No pudimos cargar tus quinielas. Intenta de nuevo.
        </Alert>
      )}

      {quinielas && quinielas.length === 0 && (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <SportsSoccerIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              No tienes quinielas
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 360, mx: 'auto' }}>
              Crea una nueva quiniela o únete a una existente con un código de invitación.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="outlined" startIcon={<ContentPasteIcon />} onClick={() => setUnirseOpen(true)} sx={{ borderColor: 'divider' }}>
                Unirse a una
              </Button>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCrearOpen(true)}>
                Crear Quiniela
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {quinielas && quinielas.length > 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
          {quinielas.map((q) => (
            <QuinielaCard key={q.id} quiniela={q} />
          ))}
        </Box>
      )}

      <Dialog
        open={crearOpen}
        onClose={() => setCrearOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { bgcolor: '#12122a' } } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Crear Quiniela</DialogTitle>
        <Box component="form" onSubmit={(e: React.FormEvent) => { e.preventDefault(); crearQuiniela.mutate({ nombre: newNombre, codigoInvitacion: '' }, { onSuccess: () => { setCrearOpen(false); setNewNombre(''); } }); }}>
          <DialogContent>
            {crearQuiniela.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>{getErrorMessage(crearQuiniela.error)}</Alert>
            )}
            <TextField
              fullWidth
              label="Nombre de la quiniela"
              placeholder="Ej: Mundial 2026 Amigos"
              value={newNombre}
              onChange={(e) => setNewNombre(e.target.value)}
              required
              autoFocus
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setCrearOpen(false)} sx={{ color: 'text.secondary' }}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={!newNombre || crearQuiniela.isPending}>
              {crearQuiniela.isPending ? 'Creando...' : 'Crear'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={unirseOpen}
        onClose={() => setUnirseOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { bgcolor: '#12122a' } } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Unirse a Quiniela</DialogTitle>
        <Box component="form" onSubmit={(e: React.FormEvent) => { e.preventDefault(); unirseQuiniela.mutate({ codigoInvitacion: codigo }, { onSuccess: () => { setUnirseOpen(false); setCodigo(''); } }); }}>
          <DialogContent>
            {unirseQuiniela.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>{getErrorMessage(unirseQuiniela.error)}</Alert>
            )}
            <TextField
              fullWidth
              label="Código de invitación"
              placeholder="Ingresa el código que te compartieron"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
              autoFocus
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setUnirseOpen(false)} sx={{ color: 'text.secondary' }}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={!codigo || unirseQuiniela.isPending}>
              {unirseQuiniela.isPending ? 'Uniendo...' : 'Unirse'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
