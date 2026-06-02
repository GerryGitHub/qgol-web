import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Typography, CircularProgress, Box } from '@mui/material';
import { useAuthStore } from '@/store/authStore';
import { SnackbarProvider } from '@/components/SnackbarProvider';
import PublicLayout from '@/layouts/PublicLayout';
import MainLayout from '@/layouts/MainLayout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import VerifyOtp from '@/pages/VerifyOtp';
import Dashboard from '@/pages/Dashboard';
import QuinielaDetail from '@/pages/QuinielaDetail';
import Ranking from '@/pages/Ranking';
import Pronosticos from '@/pages/Pronosticos';
import Grupos from '@/pages/Grupos';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <SnackbarProvider />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/verify-otp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />
        </Route>

        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="quiniela/:id" element={<QuinielaDetail />} />
          <Route path="quiniela/:id/ranking" element={<Ranking />} />
          <Route path="quiniela/:id/pronosticos" element={<Pronosticos />} />
          <Route path="grupos" element={<Grupos />} />
          <Route path="resultados" element={<Typography variant="h4" sx={{ fontWeight: 700 }}>Resultados</Typography>} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
