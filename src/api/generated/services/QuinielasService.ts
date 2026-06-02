/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CrearQuinielaRequest } from '../models/CrearQuinielaRequest';
import type { LeaderboardEntryDTO } from '../models/LeaderboardEntryDTO';
import type { QuinielaDetalleDTO } from '../models/QuinielaDetalleDTO';
import type { QuinielaDTO } from '../models/QuinielaDTO';
import type { QuinielaResumenDTO } from '../models/QuinielaResumenDTO';
import type { UnirseQuinielaRequest } from '../models/UnirseQuinielaRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class QuinielasService {
    /**
     * Listar quinielas del usuario
     * @returns QuinielaResumenDTO OK
     * @throws ApiError
     */
    public static getQuinielas(): CancelablePromise<Array<QuinielaResumenDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/quinielas',
        });
    }
    /**
     * Crear nueva quiniela
     * @param requestBody
     * @returns QuinielaDTO OK
     * @throws ApiError
     */
    public static crearQuiniela(
        requestBody: CrearQuinielaRequest,
    ): CancelablePromise<QuinielaDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/quinielas',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Unirse a una quiniela por cÃ³digo de invitaciÃ³n
     * @param requestBody
     * @returns QuinielaDTO OK
     * @throws ApiError
     */
    public static unirseQuiniela(
        requestBody: UnirseQuinielaRequest,
    ): CancelablePromise<QuinielaDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/quinielas/join',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Obtener detalle de una quiniela
     * @param id
     * @returns QuinielaDetalleDTO OK
     * @throws ApiError
     */
    public static getQuinielaDetalle(
        id: number,
    ): CancelablePromise<QuinielaDetalleDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/quinielas/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Obtener tabla de posiciones de una quiniela
     * @param id
     * @returns LeaderboardEntryDTO OK
     * @throws ApiError
     */
    public static getLeaderboard(
        id: number,
    ): CancelablePromise<Array<LeaderboardEntryDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/quinielas/{id}/leaderboard',
            path: {
                'id': id,
            },
        });
    }
}
