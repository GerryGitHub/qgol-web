export const APP_URL = 'https://qgol.app';

export function shareQuiniela(nombre: string, codigo: string): void {
  const text = `¡Únete a mi quiniela "${nombre}" en QGol!\nUsa el código: ${codigo}\n\n${APP_URL}`;
  if (navigator.share) {
    navigator.share({ title: 'QGol', text });
  } else {
    navigator.clipboard.writeText(text);
  }
}

export function copyCode(codigo: string): void {
  navigator.clipboard.writeText(codigo);
}
