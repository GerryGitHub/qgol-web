import { useMutation, useQuery } from '@tanstack/react-query';
import { AutenticaciNService } from '@/api/generated';
import { useAuthStore } from '@/store/authStore';
import type { LoginRequest, RegisterRequest, VerifyRegistrationOtpRequest, ResendVerificationRequest } from '@/types';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (data: LoginRequest) => AutenticaciNService.login(data),
    onSuccess: (data) => {
      setAuth(data.usuario, data.accessToken, data.refreshToken || '');
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => AutenticaciNService.register(data),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (data: VerifyRegistrationOtpRequest) => AutenticaciNService.verifyRegistrationOtp(data),
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (data: ResendVerificationRequest) => AutenticaciNService.resendVerification(data),
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => AutenticaciNService.getPerfil(),
    enabled: !!localStorage.getItem('token'),
    retry: false,
  });
}
