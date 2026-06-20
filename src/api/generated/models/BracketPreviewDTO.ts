import type { BracketSlotPreviewDTO } from './BracketSlotPreviewDTO';
export type BracketPreviewDTO = {
    rondas: { [key: string]: Array<BracketSlotPreviewDTO> };
    gruposActivos: boolean;
};
