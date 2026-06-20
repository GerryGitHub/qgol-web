import { useQuery } from '@tanstack/react-query';
import { GruposService } from '@/api/generated';

export function useGrupos() {
  return useQuery({
    queryKey: ['grupos'],
    queryFn: () => GruposService.getAllGrupos(),
  });
}
