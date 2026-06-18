import { useQuery } from '@tanstack/react-query';
import { EliminatoriasService } from '@/api/generated';

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
