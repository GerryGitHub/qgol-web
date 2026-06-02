import { create } from 'zustand';
import type { UsuarioDTO } from '@/api/generated';

interface AuthState {
  usuario: UsuarioDTO | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (usuario: UsuarioDTO, token: string, refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: true,
  setAuth: (usuario, token, refreshToken) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    set({ usuario, token, refreshToken, isAuthenticated: true, isLoading: false });
  },
  setLoading: (loading) => set({ isLoading: loading }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('usuario');
    set({ usuario: null, token: null, refreshToken: null, isAuthenticated: false, isLoading: false });
  },
}));
