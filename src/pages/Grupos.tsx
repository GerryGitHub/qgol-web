import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import { useGrupos } from '@/hooks/useGrupos';
import type { SeleccionDTO } from '@/types';
import LoadingScreen from '@/components/ui/LoadingScreen';
import EmptyState from '@/components/ui/EmptyState';

function sortSelecciones(list: SeleccionDTO[]): SeleccionDTO[] {
  return [...list].sort((a, b) => {
    if (b.puntos !== a.puntos) return b.puntos - a.puntos;
    if (b.diferenciaGoles !== a.diferenciaGoles) return b.diferenciaGoles - a.diferenciaGoles;
    return b.golesAFavor - a.golesAFavor;
  });
}

export default function Grupos() {
  const { data, isLoading, isError } = useGrupos();

  const grupos = useMemo(() => {
    if (!data?.grupos) return [];
    return [...data.grupos].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [data]);

  if (isLoading) return <LoadingScreen />;

  if (isError || !data) {
    return <EmptyState icon={<GroupsIcon />} title="Error al cargar grupos" description="No pudimos cargar los grupos. Intenta de nuevo." />;
  }

  if (grupos.length === 0) {
    return <EmptyState icon={<GroupsIcon />} title="No hay grupos disponibles" description="Los grupos se publicarán próximamente" />;
  }

  return (
    <Box>
      <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', fontSize: '1.5rem', mb: 2.5, letterSpacing: '-0.5px' }}>
        Grupos FIFA
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {grupos.map((g) => {
          const sorted = sortSelecciones(g.selecciones);
          return (
            <Box key={g.nombre} sx={{ bgcolor: 'rgba(11, 18, 32, 0.3)', borderRadius: 3, p: 2.5, border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
              <Typography sx={{ fontWeight: 800, color: '#0D5BFF', fontSize: '1.1rem', mb: 1.5 }}>
                Grupo {g.nombre}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {sorted.map((s) => (
                  <Typography key={s.id} sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', lineHeight: 1.5 }}>
                    {s.nombre} — Pts: {s.puntos}, PJ: {s.partidosJugados}, GF: {s.golesAFavor}, GC: {s.golesEnContra}
                  </Typography>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
