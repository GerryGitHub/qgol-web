/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PartidoDTO } from './PartidoDTO';
import type { UsuarioDTO } from './UsuarioDTO';
export type PronosticoDTO = {
    id: number;
    usuario: UsuarioDTO;
    partido: PartidoDTO;
    golesLocalPredicho: number;
    golesVisitantePredicho: number;
    puntosObtenidos: number;
    quinielaId?: number | null;
};

