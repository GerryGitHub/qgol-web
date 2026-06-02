import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { useGrupos } from '@/hooks/useGrupos';
import type { SeleccionDTO } from '@/api/generated';

const colWidths = { xs: 28, sm: 32, md: 36 };

function sortSelecciones(list: SeleccionDTO[]): SeleccionDTO[] {
  return [...list].sort((a, b) => {
    if (b.puntos !== a.puntos) return b.puntos - a.puntos;
    if (b.diferenciaGoles !== a.diferenciaGoles) return b.diferenciaGoles - a.diferenciaGoles;
    return b.golesAFavor - a.golesAFavor;
  });
}

function GroupTable({ selecciones }: { selecciones: SeleccionDTO[] }) {
  const sorted = useMemo(() => sortSelecciones(selecciones), [selecciones]);

  return (
    <Box sx={{ overflowX: 'auto', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `${colWidths.xs}px 1fr repeat(7, ${colWidths.xs}px) ${colWidths.xs}px`,
          gap: 0,
          bgcolor: 'primary.main',
          px: 1,
          py: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {['#', 'Equipo', 'PJ', 'PG', 'PE', 'PP', 'GF', 'GC', 'DG', 'PTS'].map((h) => (
          <Typography
            key={h}
            variant="caption"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
              textAlign: h === 'Equipo' ? 'left' : 'center',
              lineHeight: 1.2,
            }}
          >
            {h}
          </Typography>
        ))}
      </Box>

      {sorted.map((s, i) => {
        const bgColor = i < 4 ? 'rgba(99, 102, 241, 0.04)' : 'transparent';
        const borderClr = i < sorted.length - 1 ? 'divider' : 'transparent';
        return (
          <Box
            key={s.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: `${colWidths.xs}px 1fr repeat(7, ${colWidths.xs}px) ${colWidths.xs}px`,
              gap: 0,
              px: 1,
              py: 1,
              borderBottom: '1px solid',
              borderColor: borderClr,
              bgcolor: bgColor,
              transition: 'background 0.15s',
              '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.08)' },
            }}
          >
            <Typography variant="caption" sx={{ textAlign: 'center', alignSelf: 'center', color: 'text.secondary', fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              {i + 1}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {s.nombre}
              </Typography>
            </Box>

            {[s.partidosJugados, s.partidosGanados, s.partidosEmpatados, s.partidosPerdidos, s.golesAFavor, s.golesEnContra].map((v) => (
              <Typography key={v} variant="caption" sx={{ textAlign: 'center', alignSelf: 'center', color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                {v}
              </Typography>
            ))}

            <Typography variant="caption" sx={{ textAlign: 'center', alignSelf: 'center', fontWeight: 700, fontSize: { xs: '0.65rem', sm: '0.75rem' }, color: s.diferenciaGoles > 0 ? 'success.main' : s.diferenciaGoles < 0 ? 'error.main' : 'text.secondary' }}>
              {s.diferenciaGoles > 0 ? `+${s.diferenciaGoles}` : s.diferenciaGoles}
            </Typography>

            <Typography variant="body2" sx={{ textAlign: 'center', alignSelf: 'center', fontWeight: 800, fontSize: { xs: '0.75rem', sm: '0.875rem' }, color: 'primary.main' }}>
              {s.puntos}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

export default function Grupos() {
  const { data, isLoading, isError } = useGrupos();
  const [tabIndex, setTabIndex] = useState(0);

  const grupos = useMemo(() => {
    if (!data?.grupos) return [];
    return [...data.grupos].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [data]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return <Alert severity="error">Error al cargar los grupos</Alert>;
  }

  if (grupos.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Grupos FIFA</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>No hay grupos disponibles</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Grupos FIFA
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Tabla de posiciones – Mundial 2026
      </Typography>

      <Paper sx={{ bgcolor: 'transparent', backgroundImage: 'none', mb: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 40,
            '& .MuiTab-root': {
              minHeight: 40,
              py: 1,
              px: 2,
              fontWeight: 700,
              fontSize: '0.8rem',
              textTransform: 'none',
              color: 'text.secondary',
              '&.Mui-selected': { color: 'primary.main' },
            },
            '& .MuiTabs-indicator': { bgcolor: 'primary.main' },
          }}
        >
          {grupos.map((g) => (
            <Tab key={g.nombre} label={`Grupo ${g.nombre}`} />
          ))}
        </Tabs>
      </Paper>

      <GroupTable selecciones={grupos[tabIndex]?.selecciones ?? []} />
    </Box>
  );
}
