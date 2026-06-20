/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BracketPreviewDTO } from '../models/BracketPreviewDTO';
import type { CrearEliminatoriasRequest } from '../models/CrearEliminatoriasRequest';
import type { CrearEliminatoriasResponse } from '../models/CrearEliminatoriasResponse';
import type { EliminatoriasStatusDTO } from '../models/EliminatoriasStatusDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EliminatoriasService {
    public static getPreview(): CancelablePromise<BracketPreviewDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/eliminatorias/preview',
        });
    }

    public static getStatus(): CancelablePromise<EliminatoriasStatusDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/eliminatorias/status',
        });
    }

    public static crearEliminatorias(body: CrearEliminatoriasRequest): CancelablePromise<CrearEliminatoriasResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/eliminatorias/crear',
            body,
        });
    }
}
