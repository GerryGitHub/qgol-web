/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UsuarioDTO } from './UsuarioDTO';
export type QuinielaDTO = {
    id: number;
    nombre: string;
    codigoInvitacion: string;
    administrador: UsuarioDTO;
    participantes: Array<UsuarioDTO>;
    esPublica: boolean;
};

