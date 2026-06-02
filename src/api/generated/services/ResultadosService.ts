/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActualizarResultadoRequest } from '../models/ActualizarResultadoRequest';
import type { PartidoDTO } from '../models/PartidoDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ResultadosService {
    /**
     * Actualizar resultado de partido (Admin)
     * @param id
     * @param requestBody
     * @returns PartidoDTO OK
     * @throws ApiError
     */
    public static actualizarResultado(
        id: number,
        requestBody: ActualizarResultadoRequest,
    ): CancelablePromise<PartidoDTO> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/resultados/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Finalizar partido y calcular puntos (Admin)
     * @param id
     * @returns PartidoDTO OK
     * @throws ApiError
     */
    public static finalizarPartido(
        id: number,
    ): CancelablePromise<PartidoDTO> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/resultados/{id}/finalizar',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Obtener partidos pendientes
     * @returns PartidoDTO OK
     * @throws ApiError
     */
    public static getPartidosPendientes(): CancelablePromise<Array<PartidoDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/resultados/pendientes',
        });
    }
    /**
     * Obtener todos los partidos
     * @returns PartidoDTO OK
     * @throws ApiError
     */
    public static getPartidos1(): CancelablePromise<Array<PartidoDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/resultados/partidos',
        });
    }
    /**
     * Obtener partidos en vivo
     * @returns any OK
     * @throws ApiError
     */
    public static getPartidosEnVivo(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/resultados/en-vivo',
        });
    }
    /**
     * Debug endpoint
     * @returns any OK
     * @throws ApiError
     */
    public static debug(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/resultados/debug',
        });
    }
    /**
     * Obtener partidos con resultados
     * @returns PartidoDTO OK
     * @throws ApiError
     */
    public static getPartidosConResultados(): CancelablePromise<Array<PartidoDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/resultados/completados',
        });
    }
}
