import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { useQuinielas, useCrearQuiniela, useUnirseQuiniela } from '@/hooks/useQuinielas';
import type { QuinielaResumenDTO } from '@/types';

function QuinielaCard({ quiniela }: { quiniela: QuinielaResumenDTO }) {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        transition: 'transform 0.2s, border-color 0.2s',
        '&:hover': { transform: 'translateY(-2px)', borderColor: 'primary.main' },
      }}
    >
      <CardActionArea onClick={() => navigate(`/quiniela/${quiniela.id}`)}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {quiniela.nombre}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {quiniela.puntosTotales} pts
          </Typography>
        </CardContent>
      </CardActionArea>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Mis Quinielas
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ContentPasteIcon />}
            onClick={() => setUnirseOpen(true)}
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
          Error al cargar quinielas
        </Alert>
      )}

      {quinielas && quinielas.length === 0 && (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <GroupIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              No tienes quinielas
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Crea una nueva quiniela o únete a una existente
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button variant="outlined" startIcon={<ContentPasteIcon />} onClick={() => setUnirseOpen(true)}>
                Unirse a una
              </Button>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCrearOpen(true)}>
                Crear
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

      {/* Crear Dialog */}
      <Dialog
        open={crearOpen}
        onClose={() => setCrearOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { bgcolor: '#12122a' } } }}
      >
        <DialogTitle>Crear Quiniela</DialogTitle>
        <Box component="form" onSubmit={(e: React.FormEvent) => { e.preventDefault(); crearQuiniela.mutate({ nombre: newNombre, codigoInvitacion: '' }, { onSuccess: () => { setCrearOpen(false); setNewNombre(''); } }); }}>
          <DialogContent>
            {crearQuiniela.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>Error al crear quiniela</Alert>
            )}
            <TextField
              fullWidth
              label="Nombre de la quiniela"
              value={newNombre}
              onChange={(e) => setNewNombre(e.target.value)}
              required
              autoFocus
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setCrearOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={!newNombre || crearQuiniela.isPending}>
              {crearQuiniela.isPending ? 'Creando...' : 'Crear'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Unirse Dialog */}
      <Dialog
        open={unirseOpen}
        onClose={() => setUnirseOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { bgcolor: '#12122a' } } }}
      >
        <DialogTitle>Unirse a Quiniela</DialogTitle>
        <Box component="form" onSubmit={(e: React.FormEvent) => { e.preventDefault(); unirseQuiniela.mutate({ codigoInvitacion: codigo }, { onSuccess: () => { setUnirseOpen(false); setCodigo(''); } }); }}>
          <DialogContent>
            {unirseQuiniela.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>Código inválido</Alert>
            )}
            <TextField
              fullWidth
              label="Código de invitación"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
              autoFocus
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setUnirseOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={!codigo || unirseQuiniela.isPending}>
              {unirseQuiniela.isPending ? 'Uniendo...' : 'Unirse'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
