/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CrearPronosticoRequest } from '../models/CrearPronosticoRequest';
import type { CrearPronosticosBatchRequest } from '../models/CrearPronosticosBatchRequest';
import type { CrearPronosticosBatchResponse } from '../models/CrearPronosticosBatchResponse';
import type { MisPronosticosDTO } from '../models/MisPronosticosDTO';
import type { PronosticoDTO } from '../models/PronosticoDTO';
import type { PronosticosPorPartidoDTO } from '../models/PronosticosPorPartidoDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PronSticosService {
    /**
     * Crear o actualizar un pronÃ³stico
     * @param requestBody
     * @returns PronosticoDTO OK
     * @throws ApiError
     */
    public static crearPronostico(
        requestBody: CrearPronosticoRequest,
    ): CancelablePromise<PronosticoDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/pronosticos',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Guardar mÃºltiples pronÃ³sticos a la vez
     * @param requestBody
     * @returns CrearPronosticosBatchResponse OK
     * @throws ApiError
     */
    public static guardarPronosticosBatch(
        requestBody: CrearPronosticosBatchRequest,
    ): CancelablePromise<CrearPronosticosBatchResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/pronosticos/batch',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Ver mis pronÃ³sticos en una quiniela
     * @param quinielaId
     * @returns MisPronosticosDTO OK
     * @throws ApiError
     */
    public static getMisPronosticos(
        quinielaId: number,
    ): CancelablePromise<MisPronosticosDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pronosticos/quiniela/{quinielaId}',
            path: {
                'quinielaId': quinielaId,
            },
        });
    }
    /**
     * Ver todos los pronÃ³sticos de un partido
     * Solo disponible despuÃ©s de que el partido comience
     * @param quinielaId
     * @param partidoId
     * @returns PronosticosPorPartidoDTO OK
     * @throws ApiError
     */
    public static getPronosticosPorPartido(
        quinielaId: number,
        partidoId: number,
    ): CancelablePromise<PronosticosPorPartidoDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pronosticos/quiniela/{quinielaId}/partido/{partidoId}',
            path: {
                'quinielaId': quinielaId,
                'partidoId': partidoId,
            },
        });
    }
    /**
     * Ver todos mis pronÃ³sticos
     * @param quinielaId
     * @returns MisPronosticosDTO OK
     * @throws ApiError
     */
    public static getMisPronosticos1(
        quinielaId?: number,
    ): CancelablePromise<MisPronosticosDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pronosticos/mis-pronosticos',
            query: {
                'quinielaId': quinielaId,
            },
        });
    }
}
