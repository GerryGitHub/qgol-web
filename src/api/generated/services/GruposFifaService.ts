/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActualizarResultadoRequest } from '../models/ActualizarResultadoRequest';
import type { GrupoDTO } from '../models/GrupoDTO';
import type { PartidoDTO } from '../models/PartidoDTO';
import type { TablaGruposDTO } from '../models/TablaGruposDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GruposFifaService {
    /**
     * Actualizar resultado de un partido
     * @param id
     * @param requestBody
     * @returns PartidoDTO OK
     * @throws ApiError
     */
    public static actualizarResultado1(
        id: number,
        requestBody: ActualizarResultadoRequest,
    ): CancelablePromise<PartidoDTO> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/grupos/partidos/{id}/resultado',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Obtener todos los grupos con tablas de posiciones
     * @returns TablaGruposDTO OK
     * @throws ApiError
     */
    public static getAllGrupos(): CancelablePromise<TablaGruposDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/grupos',
        });
    }
    /**
     * Obtener un grupo especÃ­fico
     * @param nombre
     * @returns GrupoDTO OK
     * @throws ApiError
     */
    public static getGrupo(
        nombre: string,
    ): CancelablePromise<GrupoDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/grupos/{nombre}',
            path: {
                'nombre': nombre,
            },
        });
    }
    /**
     * Obtener todos los partidos
     * @returns PartidoDTO OK
     * @throws ApiError
     */
    public static getPartidos2(): CancelablePromise<Array<PartidoDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/grupos/partidos',
        });
    }
}
