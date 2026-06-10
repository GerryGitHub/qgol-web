import { useState, useMemo } from 'react';
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
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ShareIcon from '@mui/icons-material/Share';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuthStore } from '@/store/authStore';
import { useQuinielas, useQuinielaDetalle, useCrearQuiniela, useUnirseQuiniela } from '@/hooks/useQuinielas';
import { shareQuiniela, copyCode } from '@/utils/shareUtils';
import ProximoPartidoCard from '@/components/ui/ProximoPartidoCard';
import type { QuinielaResumenDTO } from '@/types';
import { ApiError } from '@/api/generated';
import { useSnackbarStore } from '@/store/snackbarStore';
import LoadingScreen from '@/components/ui/LoadingScreen';
import QrScanner from '@/components/ui/QrScanner';
import PuntosInfo from '@/components/ui/PuntosInfo';

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.body?.message) return error.body.message;
  if (error instanceof Error) return error.message;
  return 'Error';
}

function QuinielaCard({ quiniela, onShowQR }: { quiniela: QuinielaResumenDTO; onShowQR: (q: QuinielaResumenDTO) => void }) {
  const navigate = useNavigate();
  const showSnackbar = useSnackbarStore((s) => s.show);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyCode(quiniela.codigoInvitacion);
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        <Box
          onClick={handleCopyCode}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1.5, px: 1.25, py: 0.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
        >
          <ContentCopyIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
          <Typography sx={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: 0.5 }}>
            {quiniela.codigoInvitacion}
          </Typography>
        </Box>
        <IconButton
          onClick={(e) => { e.stopPropagation(); onShowQR(quiniela); }}
          size="small"
          sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#0D5BFF' } }}
        >
          <QrCode2Icon sx={{ fontSize: 18 }} />
        </IconButton>
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
  const [unirseMode, setUnirseMode] = useState<'code' | 'scan'>('code');
  const [newNombre, setNewNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [qrQuiniela, setQrQuiniela] = useState<QuinielaResumenDTO | null>(null);

  const firstQuinielaId = quinielas?.[0]?.id;
  const { data: detalle } = useQuinielaDetalle(firstQuinielaId!);

  const proximoPartido = useMemo(() => {
    if (!detalle?.partidos) return null;
    const pendientes = detalle.partidos.filter((p) => p.estado === 'PENDIENTE');
    pendientes.sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());
    return pendientes[0] ?? null;
  }, [detalle]);

  return (
    <Box sx={{ pb: 12 }}>
      {usuario && (
        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', mb: 2 }}>
          Bienvenido, {usuario.nombre}
        </Typography>
      )}

      {proximoPartido && quinielas?.[0] && (
        <ProximoPartidoCard partido={proximoPartido} quinielaId={quinielas[0].id} quinielaNombre={quinielas[0].nombre} />
      )}

      <PuntosInfo variant="card" />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2.5 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
          Mis Quinielas
        </Typography>
      </Box>

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
            <QuinielaCard key={q.id} quiniela={q} onShowQR={setQrQuiniela} />
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

      <Dialog open={crearOpen} onClose={() => { setCrearOpen(false); setNewNombre(''); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#fff' }}>Crear Quiniela</DialogTitle>
        <Box component="form" onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          crearQuiniela.mutate(
            { nombre: newNombre, codigoInvitacion: '' },
            { onSuccess: (data) => { setCrearOpen(false); setNewNombre(''); navigate(`/quiniela/${data.id}`); } },
          );
        }}>
          <DialogContent>
            {crearQuiniela.isError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{getErrorMessage(crearQuiniela.error)}</Alert>
            )}
            <TextField fullWidth label="Nombre" placeholder="Ej: Mundial 2026 Amigos" value={newNombre} onChange={(e) => setNewNombre(e.target.value)} required autoFocus />
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => { setCrearOpen(false); setNewNombre(''); }} sx={{ color: 'rgba(255,255,255,0.5)' }}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={!newNombre || crearQuiniela.isPending}>
              {crearQuiniela.isPending ? 'Creando...' : 'Crear'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={unirseOpen} onClose={() => { setUnirseOpen(false); setUnirseMode('code'); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#fff' }}>Unirse a Quiniela</DialogTitle>
        <ToggleButtonGroup
          value={unirseMode}
          exclusive
          onChange={(_, v) => v && setUnirseMode(v)}
          size="small"
          sx={{ display: 'flex', mx: 3, mb: 1, '& .MuiToggleButton-root': { flex: 1, color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)', '&.Mui-selected': { color: '#0D5BFF', bgcolor: 'rgba(13,91,255,0.1)' } } }}
        >
          <ToggleButton value="code"><ContentPasteIcon sx={{ mr: 0.75, fontSize: 18 }} /> Ingresar código</ToggleButton>
          <ToggleButton value="scan"><QrCodeScannerIcon sx={{ mr: 0.75, fontSize: 18 }} /> Escanear QR</ToggleButton>
        </ToggleButtonGroup>
        {unirseMode === 'code' ? (
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
        ) : (
          <DialogContent>
            {unirseQuiniela.isError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{getErrorMessage(unirseQuiniela.error)}</Alert>
            )}
            <QrScanner
              onScan={(code) => {
                setCodigo(code);
                setUnirseMode('code');
                unirseQuiniela.mutate({ codigoInvitacion: code }, {
                  onSuccess: () => { setUnirseOpen(false); setCodigo(''); showSnackbar('Te has unido a la quiniela', 'success'); },
                });
              }}
              onClose={() => setUnirseMode('code')}
            />
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={!!qrQuiniela} onClose={() => setQrQuiniela(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#fff', textAlign: 'center' }}>Invitar a la Quiniela</DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 1 }}>
          {qrQuiniela && (
            <>
              <Box sx={{ display: 'inline-flex', bgcolor: '#fff', borderRadius: 3, p: 2, mb: 2 }}>
                <QRCodeCanvas value={qrQuiniela.codigoInvitacion} size={220} />
              </Box>
              <Typography sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#fff', fontSize: '1.1rem', letterSpacing: 2, mb: 0.5 }}>
                {qrQuiniela.codigoInvitacion}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                Comparte este código con tus amigos
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<ShareIcon />}
            onClick={() => {
              if (!qrQuiniela) return;
              shareQuiniela(qrQuiniela.nombre, qrQuiniela.codigoInvitacion);
              setQrQuiniela(null);
            }}
            sx={{ py: 1.5 }}
          >
            Compartir código
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
