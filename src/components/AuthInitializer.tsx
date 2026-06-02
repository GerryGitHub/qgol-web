import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { AutenticaciNService } from '@/api/generated';

export function AuthInitializer() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setLoading = useAuthStore((s) => s.setLoading);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('usuario');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!token || !stored) {
      setLoading(false);
      return;
    }

    try {
      void JSON.parse(stored);
    } catch {
      logout();
      return;
    }

    AutenticaciNService.getPerfil()
      .then((perfil) => {
        setAuth({ id: perfil.id, nombre: perfil.nombre, email: perfil.email, rol: perfil.rol as 'USER' | 'ADMIN', puntosTotales: perfil.puntosTotalesGlobales }, token, refreshToken || '');
      })
      .catch(() => {
        logout();
      });
  }, [setAuth, setLoading, logout]);

  return null;
}
