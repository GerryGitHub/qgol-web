import { OpenAPI } from './generated';

OpenAPI.BASE = (import.meta.env.VITE_API_URL as string) || 'https://api.gjapps.com';
OpenAPI.TOKEN = async () => localStorage.getItem('token') || '';

export function configureApi() {}
