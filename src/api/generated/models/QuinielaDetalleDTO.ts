/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PartidoDTO } from './PartidoDTO';
import type { UsuarioDTO } from './UsuarioDTO';
export type QuinielaDetalleDTO = {
    id: number;
    nombre: string;
    codigoInvitacion: string;
    administrador: UsuarioDTO;
    participantes: Array<UsuarioDTO>;
    partidos: Array<PartidoDTO>;
};

