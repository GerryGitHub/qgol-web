import { useQuery } from '@tanstack/react-query';
import { GruposFifaService } from '@/api/generated';

export function useGrupos() {
  return useQuery({
    queryKey: ['grupos'],
    queryFn: () => GruposFifaService.getAllGrupos(),
  });
}
