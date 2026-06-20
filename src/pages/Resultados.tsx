import { Box, Typography } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import FlagIcon from '@/components/ui/FlagIcon';
import { useResultados } from '@/hooks/useResultados';
import LoadingScreen from '@/components/ui/LoadingScreen';
import EmptyState from '@/components/ui/EmptyState';

function formatFecha(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatHora(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

export default function Resultados() {
  const { data: partidos, isLoading, isError } = useResultados();

  if (isLoading) return <LoadingScreen />;

  if (isError) {
    return <EmptyState icon={<BarChartIcon />} title="Error al cargar resultados" description="No pudimos cargar los resultados. Intenta de nuevo." />;
  }

  if (!partidos || partidos.length === 0) {
    return <EmptyState icon={<BarChartIcon />} title="No hay resultados disponibles" description="Los resultados se publicarán cuando los partidos finalicen." />;
  }

  return (
    <Box>
      <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', fontSize: '1.5rem', mb: 2.5, letterSpacing: '-0.5px' }}>
        Resultados
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1 }}>
        {partidos.map((p) => (
          <Box key={p.id} sx={{ bgcolor: 'rgba(11, 18, 32, 0.3)', borderRadius: 1.5, p: 1, border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(4px)', textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.25, mb: 0.25, flexWrap: 'wrap' }}>
              <FlagIcon country={p.equipoLocal} size={10} />
              <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.6rem', wordBreak: 'break-word' }}>{p.equipoLocal}</Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '0.85rem', color: '#0D5BFF', mx: 0.25 }}>
                {p.golesLocalReal ?? '?'}—{p.golesVisitanteReal ?? '?'}
              </Typography>
              <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.6rem', wordBreak: 'break-word' }}>{p.equipoVisitante}</Typography>
              <FlagIcon country={p.equipoVisitante} size={10} />
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.5rem', mb: 0.25 }}>
              {formatFecha(p.fechaHora)} — {formatHora(p.fechaHora)}
            </Typography>
            <Typography sx={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.25)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, display: 'inline', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 0.5, px: 0.5, py: 0.1 }}>
              Finalizado
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
