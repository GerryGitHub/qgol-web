import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Alert,
  Paper,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import { useGrupos } from '@/hooks/useGrupos';
import type { SeleccionDTO } from '@/api/generated';
import FlagIcon from '@/components/ui/FlagIcon';
import SectionHeader from '@/components/ui/SectionHeader';
import EmptyState from '@/components/ui/EmptyState';
import LoadingScreen from '@/components/ui/LoadingScreen';

function sortSelecciones(list: SeleccionDTO[]): SeleccionDTO[] {
  return [...list].sort((a, b) => {
    if (b.puntos !== a.puntos) return b.puntos - a.puntos;
    if (b.diferenciaGoles !== a.diferenciaGoles) return b.diferenciaGoles - a.diferenciaGoles;
    return b.golesAFavor - a.golesAFavor;
  });
}

const colW = { xs: 28, sm: 32, md: 36 };

function GroupTable({ selecciones }: { selecciones: SeleccionDTO[] }) {
  const sorted = useMemo(() => sortSelecciones(selecciones), [selecciones]);

  return (
    <Box sx={{ overflowX: 'auto', borderRadius: 3, border: '1px solid #334155' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `${colW.xs}px 1fr repeat(7, ${colW.xs}px) ${colW.xs}px`,
          bgcolor: '#22C55E',
          px: 1.5,
          py: 1.25,
        }}
      >
        {['#', 'Equipo', 'PJ', 'PG', 'PE', 'PP', 'GF', 'GC', 'DG', 'PTS'].map((h) => (
          <Typography
            key={h}
            sx={{
              color: '#fff',
              fontWeight: 800,
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
        const borderClr = i < sorted.length - 1 ? '#334155' : 'transparent';
        const qualifies = i < 4;
        const bgColor = qualifies ? 'rgba(34, 197, 94, 0.04)' : 'transparent';
        return (
          <Box
            key={s.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: `${colW.xs}px 1fr repeat(7, ${colW.xs}px) ${colW.xs}px`,
              px: 1.5,
              py: 1.15,
              borderBottom: '1px solid',
              borderColor: borderClr,
              bgcolor: bgColor,
              position: 'relative',
              '&:hover': { bgcolor: 'rgba(34, 197, 94, 0.07)' },
            }}
          >
            {qualifies && (
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 3,
                  bgcolor: '#22C55E',
                  borderTopLeftRadius: i === 0 ? 3 : 0,
                  borderBottomLeftRadius: i === sorted.length - 1 || i === 3 ? 3 : 0,
                }}
              />
            )}
            <Typography sx={{ textAlign: 'center', alignSelf: 'center', color: '#94A3B8', fontWeight: qualifies ? 700 : 500, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              {i + 1}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, alignSelf: 'center', minWidth: 0 }}>
              <FlagIcon country={s.nombre} size={16} />
              <Typography sx={{ fontWeight: qualifies ? 700 : 500, color: '#fff', fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {s.nombre}
              </Typography>
            </Box>

            {[s.partidosJugados, s.partidosGanados, s.partidosEmpatados, s.partidosPerdidos, s.golesAFavor, s.golesEnContra].map((v) => (
              <Typography key={v} sx={{ textAlign: 'center', alignSelf: 'center', color: '#94A3B8', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                {v}
              </Typography>
            ))}

            <Typography sx={{ textAlign: 'center', alignSelf: 'center', fontWeight: 700, fontSize: { xs: '0.65rem', sm: '0.75rem' }, color: s.diferenciaGoles > 0 ? '#22C55E' : s.diferenciaGoles < 0 ? '#EF4444' : '#94A3B8' }}>
              {s.diferenciaGoles > 0 ? `+${s.diferenciaGoles}` : s.diferenciaGoles}
            </Typography>

            <Typography sx={{ textAlign: 'center', alignSelf: 'center', fontWeight: 800, fontSize: { xs: '0.8rem', sm: '0.9rem' }, color: '#22C55E' }}>
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

  if (isLoading) return <LoadingScreen />;

  if (isError || !data) {
    return <Alert severity="error" sx={{ borderRadius: 3 }}>Error al cargar los grupos</Alert>;
  }

  if (grupos.length === 0) {
    return (
      <Box>
        <SectionHeader title="Grupos FIFA" subtitle="Mundial 2026" />
        <EmptyState
          icon={<GroupsIcon />}
          title="No hay grupos disponibles"
          description="Los grupos se publicarán próximamente"
        />
      </Box>
    );
  }

  return (
    <Box>
      <SectionHeader title="Grupos FIFA" subtitle="Mundial 2026 — Tabla de posiciones" />

      <Paper sx={{ bgcolor: 'transparent', backgroundImage: 'none', mb: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v)}
          variant="scrollable"
          scrollButtons="auto"
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
