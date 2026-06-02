/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthResponse } from '../models/AuthResponse';
import type { ForgotPasswordRequest } from '../models/ForgotPasswordRequest';
import type { LoginRequest } from '../models/LoginRequest';
import type { MessageResponse } from '../models/MessageResponse';
import type { RefreshTokenRequest } from '../models/RefreshTokenRequest';
import type { RefreshTokenResponse } from '../models/RefreshTokenResponse';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { RegisterResponse } from '../models/RegisterResponse';
import type { ResendVerificationRequest } from '../models/ResendVerificationRequest';
import type { ResetPasswordRequest } from '../models/ResetPasswordRequest';
import type { UsuarioPerfilDTO } from '../models/UsuarioPerfilDTO';
import type { VerifyRegistrationOtpRequest } from '../models/VerifyRegistrationOtpRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AutenticaciNService {
    /**
     * Verificar cuenta con cÃ³digo OTP
     * @param requestBody
     * @returns MessageResponse OK
     * @throws ApiError
     */
    public static verifyRegistrationOtp(
        requestBody: VerifyRegistrationOtpRequest,
    ): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/verify-registration-otp',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Restablecer contraseÃ±a con token
     * @param requestBody
     * @returns MessageResponse OK
     * @throws ApiError
     */
    public static resetPassword(
        requestBody: ResetPasswordRequest,
    ): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/reset-password',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Reenviar correo de verificaciÃ³n
     * @param requestBody
     * @returns MessageResponse OK
     * @throws ApiError
     */
    public static resendVerification(
        requestBody: ResendVerificationRequest,
    ): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/resend-verification',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Registrar nuevo usuario
     * @param requestBody
     * @returns RegisterResponse OK
     * @throws ApiError
     */
    public static register(
        requestBody: RegisterRequest,
    ): CancelablePromise<RegisterResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Renovar access token mediante refresh token
     * @param requestBody
     * @returns RefreshTokenResponse OK
     * @throws ApiError
     */
    public static refresh(
        requestBody: RefreshTokenRequest,
    ): CancelablePromise<RefreshTokenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Iniciar sesiÃ³n
     * @param requestBody
     * @returns AuthResponse OK
     * @throws ApiError
     */
    public static login(
        requestBody: LoginRequest,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Solicitar restablecimiento de contraseÃ±a
     * @param requestBody
     * @returns MessageResponse OK
     * @throws ApiError
     */
    public static forgotPassword(
        requestBody: ForgotPasswordRequest,
    ): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/forgot-password',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Obtener perfil del usuario actual
     * @returns UsuarioPerfilDTO OK
     * @throws ApiError
     */
    public static getPerfil(): CancelablePromise<UsuarioPerfilDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/me',
        });
    }
}
