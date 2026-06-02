import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

export default function PublicLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0F172A',
        p: 2,
      }}
    >
      <Outlet />
    </Box>
  );
}
