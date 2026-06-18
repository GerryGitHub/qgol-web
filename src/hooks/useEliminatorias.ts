import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EliminatoriasService, AdministraciNService } from '@/api/generated';
import type { CrearEliminatoriasRequest, UpdateEstadisticasRequest } from '@/api/generated';

export function useEliminatoriasPreview() {
  return useQuery({
    queryKey: ['eliminatorias', 'preview'],
    queryFn: () => EliminatoriasService.getPreview(),
  });
}

export function useEliminatoriasStatus() {
  return useQuery({
    queryKey: ['eliminatorias', 'status'],
    queryFn: () => EliminatoriasService.getStatus(),
  });
}

export function useCrearEliminatorias() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearEliminatoriasRequest) => EliminatoriasService.crearEliminatorias(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['eliminatorias'] });
      qc.invalidateQueries({ queryKey: ['quinielas'] });
    },
  });
}

export function useEquiposEstadisticas() {
  return useQuery({
    queryKey: ['admin', 'equipos-estadisticas'],
    queryFn: () => AdministraciNService.getEquiposEstadisticas(),
  });
}

export function useUpdateEstadisticas() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ equipoId, ...data }: { equipoId: number } & UpdateEstadisticasRequest) =>
      AdministraciNService.updateEstadisticas(equipoId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'equipos-estadisticas'] });
    },
  });
}
