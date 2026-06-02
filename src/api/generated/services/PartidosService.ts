/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActualizarPartidoRequest } from '../models/ActualizarPartidoRequest';
import type { PartidoDTO } from '../models/PartidoDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PartidosService {
    /**
     * Obtener detalle de un partido
     * @param id
     * @returns PartidoDTO OK
     * @throws ApiError
     */
    public static getPartidoDetalle(
        id: number,
    ): CancelablePromise<PartidoDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/partidos/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Actualizar marcador de un partido (Admin)
     * @param id
     * @param requestBody
     * @returns PartidoDTO OK
     * @throws ApiError
     */
    public static actualizarPartido(
        id: number,
        requestBody: ActualizarPartidoRequest,
    ): CancelablePromise<PartidoDTO> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/partidos/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Listar todos los partidos
     * Filtrar por ?fecha= o ?fase=grupos
     * @param fecha
     * @param fase
     * @returns PartidoDTO OK
     * @throws ApiError
     */
    public static getPartidos(
        fecha?: string,
        fase?: string,
    ): CancelablePromise<Array<PartidoDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/partidos',
            query: {
                'fecha': fecha,
                'fase': fase,
            },
        });
    }
}
