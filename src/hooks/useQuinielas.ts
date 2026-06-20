import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QuinielasService, PronSticosService } from '@/api/generated';
import type { CrearQuinielaRequest, UnirseQuinielaRequest, CrearPronosticosBatchRequest } from '@/types';

export function useQuinielas() {
  return useQuery({
    queryKey: ['quinielas'],
    queryFn: () => QuinielasService.getQuinielas(),
  });
}

export function useQuinielaDetalle(id: number) {
  return useQuery({
    queryKey: ['quiniela', id],
    queryFn: () => QuinielasService.getQuinielaDetalle(id),
    enabled: !!id,
  });
}

export function useLeaderboard(id: number) {
  return useQuery({
    queryKey: ['quiniela', id, 'leaderboard'],
    queryFn: () => QuinielasService.getLeaderboard(id),
    enabled: !!id,
  });
}

export function useCrearQuiniela() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearQuinielaRequest) => QuinielasService.crearQuiniela(data),
    onSuccess: (data) => {
      qc.setQueryData(['quinielas'], (old: unknown) => {
        if (!Array.isArray(old)) return [data];
        return [...old, { id: data.id, nombre: data.nombre, codigoInvitacion: data.codigoInvitacion, puntosTotales: 0 }];
      });
    },
  });
}

export function useUnirseQuiniela() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UnirseQuinielaRequest) => QuinielasService.unirseQuiniela(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['quinielas'] }),
  });
}

export function usePronosticosDeUsuario(quinielaId: number, usuarioId: number | null) {
  return useQuery({
    queryKey: ['pronosticos', quinielaId, 'usuario', usuarioId],
    queryFn: () => PronSticosService.getPronosticosDeUsuario(quinielaId, usuarioId!),
    enabled: !!quinielaId && !!usuarioId,
  });
}

export function useMisPronosticos(quinielaId: number) {
  return useQuery({
    queryKey: ['pronosticos', quinielaId],
    queryFn: () => PronSticosService.getMisPronosticos(quinielaId),
    enabled: !!quinielaId,
  });
}

export function useGuardarPronosticos() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearPronosticosBatchRequest) => PronSticosService.guardarPronosticosBatch(data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['pronosticos', vars.idQuiniela] });
      qc.invalidateQueries({ queryKey: ['quiniela', vars.idQuiniela] });
    },
  });
}
