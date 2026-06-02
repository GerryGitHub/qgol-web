import { Snackbar, Alert } from '@mui/material';
import { useSnackbarStore } from '@/store/snackbarStore';

export function SnackbarProvider() {
  const { open, message, severity, hide } = useSnackbarStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={hide}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ bottom: { xs: 84, md: 16 } }}
    >
      <Alert onClose={hide} severity={severity} variant="filled" sx={{ width: '100%', borderRadius: 3 }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
