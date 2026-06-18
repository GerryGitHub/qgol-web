import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EliminatoriasService } from '@/api/generated';
import type { CrearEliminatoriasRequest } from '@/api/generated';

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
