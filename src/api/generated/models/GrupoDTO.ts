/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PartidoDTO } from './PartidoDTO';
import type { SeleccionDTO } from './SeleccionDTO';
export type GrupoDTO = {
    id: number;
    nombre: string;
    pais: string;
    selecciones: Array<SeleccionDTO>;
    partidos: Array<PartidoDTO>;
};

