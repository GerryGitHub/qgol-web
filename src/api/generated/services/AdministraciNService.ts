/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminActivityDTO } from '../models/AdminActivityDTO';
import type { AdminDashboardDTO } from '../models/AdminDashboardDTO';
import type { AdminQuinielaListDTO } from '../models/AdminQuinielaListDTO';
import type { AdminSystemDTO } from '../models/AdminSystemDTO';
import type { AdminUserDetailDTO } from '../models/AdminUserDetailDTO';
import type { AdminUserListDTO } from '../models/AdminUserListDTO';
import type { EquipoEstadisticasDTO } from '../models/EquipoEstadisticasDTO';
import type { UpdateEstadisticasRequest } from '../models/UpdateEstadisticasRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdministraciNService {
    /**
     * Calcular puntos de un partido
     * Calcula los puntos de todos los pronÃ³sticos asociados a un partido
     * @param partidoId
     * @returns string OK
     * @throws ApiError
     */
    public static calcularPuntos(
        partidoId: number,
    ): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/calculate-scores/{partidoId}',
            path: {
                'partidoId': partidoId,
            },
        });
    }
    /**
     * Lista de usuarios
     * Usuarios registrados con bÃºsqueda y filtro
     * @param search
     * @param verificado
     * @returns AdminUserListDTO OK
     * @throws ApiError
     */
    public static getUsers(
        search?: string,
        verificado?: boolean,
    ): CancelablePromise<Array<AdminUserListDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/users',
            query: {
                'search': search,
                'verificado': verificado,
            },
        });
    }
    /**
     * Detalle de usuario
     * InformaciÃ³n detallada de un usuario y sus quinielas
     * @param id
     * @returns AdminUserDetailDTO OK
     * @throws ApiError
     */
    public static getUserDetail(
        id: number,
    ): CancelablePromise<AdminUserDetailDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Estado del sistema
     * Health check de API, BD y Ãºltima actualizaciÃ³n de partidos
     * @returns AdminSystemDTO OK
     * @throws ApiError
     */
    public static getSystemStatus(): CancelablePromise<AdminSystemDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/system',
        });
    }
    /**
     * Lista de quinielas
     * Quinielas con bÃºsqueda y ordenamiento
     * @param search
     * @param sort
     * @param order
     * @returns AdminQuinielaListDTO OK
     * @throws ApiError
     */
    public static getQuinielas1(
        search?: string,
        sort?: string,
        order?: string,
    ): CancelablePromise<Array<AdminQuinielaListDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/quinielas',
            query: {
                'search': search,
                'sort': sort,
                'order': order,
            },
        });
    }
    /**
     * Dashboard de mÃ©tricas
     * Devuelve conteos de usuarios, quinielas, pronÃ³sticos y partidos en vivo
     * @returns AdminDashboardDTO OK
     * @throws ApiError
     */
    public static getDashboard(): CancelablePromise<AdminDashboardDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/dashboard',
        });
    }
    /**
     * Actividad reciente
     * Ãltimos usuarios, quinielas y partidos (mÃ¡x. 10 cada uno)
     * @returns AdminActivityDTO OK
     * @throws ApiError
     */
    public static getActivity(): CancelablePromise<AdminActivityDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/activity',
        });
    }
    /**
     * EstadÃ­sticas de equipos
     * Lista todos los equipos con ranking FIFA y fair play
     * @returns EquipoEstadisticasDTO OK
     * @throws ApiError
     */
    public static getEquiposEstadisticas(): CancelablePromise<Array<EquipoEstadisticasDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/equipos-estadisticas',
        });
    }
    /**
     * Actualizar estadÃ­sticas
     * Actualiza ranking FIFA y fair play de un equipo
     * @param id
     * @param request
     * @returns EquipoEstadisticasDTO OK
     * @throws ApiError
     */
    public static updateEstadisticas(
        id: number,
        request: UpdateEstadisticasRequest,
    ): CancelablePromise<EquipoEstadisticasDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/equipos/{id}/estadisticas',
            path: {
                'id': id,
            },
            body: request,
        });
    }
}
