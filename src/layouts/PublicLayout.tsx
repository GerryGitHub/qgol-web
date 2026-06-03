import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

export default function PublicLayout() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0B1220', p: 0 }}>
      <Outlet />
    </Box>
  );
}
