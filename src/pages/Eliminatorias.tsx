import { Box, Typography, Chip } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useEliminatoriasPreview } from '@/hooks/useEliminatorias';
import LoadingScreen from '@/components/ui/LoadingScreen';
import FlagIcon from '@/components/ui/FlagIcon';

const rondaLabels: Record<string, string> = {
  R32: 'Dieciseisavos',
  R16: 'Octavos',
  QF: 'Cuartos',
  SF: 'Semifinales',
  '3RD': 'Tercer Lugar',
  FINAL: 'Final',
};

const rondaColors: Record<string, string> = {
  R32: '#4A90D9',
  R16: '#50C878',
  QF: '#F5A623',
  SF: '#9B59B6',
  '3RD': '#E74C3C',
  FINAL: '#F1C40F',
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
  const { data, isLoading } = useEliminatoriasPreview();

  if (isLoading) return <LoadingScreen />;

  const rondaOrder = ['R32', 'R16', 'QF', 'SF', '3RD', 'FINAL'];
  const rondasDisponibles = rondaOrder.filter((r) => data?.rondas[r] && data.rondas[r].length > 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <EmojiEventsIcon sx={{ color: '#F1C40F', fontSize: 28 }} />
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', fontSize: '1.3rem', letterSpacing: '-0.5px' }}>
          Eliminatorias
        </Typography>
      </Box>

      {data?.gruposActivos && (
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
        const partidos = data?.rondas[ronda] ?? [];
        const resueltos = partidos.filter((p) => p.resuelto).length;
        return (
          <Box key={ronda} sx={{ mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip
                label={rondaLabels[ronda] || ronda}
                size="small"
                sx={{ fontWeight: 700, fontSize: '0.65rem', bgcolor: `${rondaColors[ronda]}20`, color: rondaColors[ronda], border: `1px solid ${rondaColors[ronda]}40` }}
              />
              <Typography sx={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                {resueltos}/{partidos.length} definidos
              </Typography>
            </Box>
            <Box sx={{ bgcolor: 'rgba(11,18,32,0.3)', borderRadius: 3, p: 1.5, border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }}>
              {partidos.sort((a, b) => a.orden - b.orden).map((p) => (
                <BracketMatch key={p.codigo} {...p} />
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
