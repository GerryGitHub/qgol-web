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
        background: 'linear-gradient(135deg, #0a0a1a 0%, #12122a 50%, #0f0f25 100%)',
        p: 2,
      }}
    >
      <Outlet />
    </Box>
  );
}
