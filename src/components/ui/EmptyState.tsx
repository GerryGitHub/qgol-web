import { Box, Typography, Button, type SxProps } from '@mui/material';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  sx?: SxProps;
}

export default function EmptyState({ icon, title, description, action, sx }: EmptyStateProps) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 6,
        px: 3,
        bgcolor: '#334155',
        borderRadius: 4,
        ...sx,
      }}
    >
      <Box sx={{ mb: 2, '& .MuiSvgIcon-root': { fontSize: 56, color: '#64748B', opacity: 0.4 } }}>
        {icon}
      </Box>
      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3, maxWidth: 360, mx: 'auto' }}>
          {description}
        </Typography>
      )}
      {action && (
        <Button variant="contained" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Box>
  );
}
