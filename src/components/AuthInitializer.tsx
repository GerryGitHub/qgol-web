import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function AuthInitializer() {
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('usuario');
    if (token && stored) {
      try {
        const usuario = JSON.parse(stored);
        const refreshToken = localStorage.getItem('refreshToken') || '';
        setAuth(usuario, token, refreshToken);
      } catch {
        localStorage.removeItem('usuario');
      }
    }
  }, [setAuth]);

  return null;
}
