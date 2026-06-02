/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminQuinielaDTO } from './AdminQuinielaDTO';
export type AdminUserDetailDTO = {
    id: number;
    nombre: string;
    email: string;
    verificado: boolean;
    fechaRegistro?: string;
    cantidadQuinielas: number;
    quinielas: Array<AdminQuinielaDTO>;
};

