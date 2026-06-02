import { Box, Typography } from '@mui/material';

interface StatBadgeProps {
  label: string;
  value: string | number;
  color?: string;
}

export default function StatBadge({ label, value, color = '#22C55E' }: StatBadgeProps) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.6rem', display: 'block' }}>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 800, color, fontSize: '1.1rem', lineHeight: 1.2 }}>
        {value}
      </Typography>
    </Box>
  );
}
