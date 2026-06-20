import type { BracketPreviewDTO } from './BracketPreviewDTO';
export type EliminatoriasStatusDTO = {
    faseGruposActiva: boolean;
    quinielaGrupos: number | null;
    rondaActual: string | null;
    bracket: BracketPreviewDTO | null;
};
