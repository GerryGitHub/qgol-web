import type { SlotOrigenDTO } from './SlotOrigenDTO';
export type BracketSlotPreviewDTO = {
    codigo: string;
    ronda: string;
    orden: number;
    equipoLocal: string | null;
    equipoVisitante: string | null;
    localSlot: SlotOrigenDTO | null;
    visitanteSlot: SlotOrigenDTO | null;
    resuelto: boolean;
};
