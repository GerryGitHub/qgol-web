import { useQuery } from '@tanstack/react-query';
import { ResultadosService } from '@/api/generated';

export function useResultados() {
  return useQuery({
    queryKey: ['resultados'],
    queryFn: () => ResultadosService.getPartidosConResultados(),
  });
}
