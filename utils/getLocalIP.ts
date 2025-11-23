import { Platform } from 'react-native';

/**
 * Obtiene la URL base de la API según el entorno
 * En desarrollo: localhost:3000
 * En producción: API remota
 */

// Para desarrollo, usa localhost (funciona en web, Android emulator, iOS simulator)
// Para dispositivos físicos, cambia 'localhost' por tu IP local (ej: 192.168.1.100)
const DEV_HOST = 'localhost';
const PROD_API = 'https://api.rimqhali.ai';

export function getLocalIP(): string {
  // Todas las plataformas en desarrollo usan localhost
  if (__DEV__) {
    return DEV_HOST;
  }
  
  // En producción, usa la API remota
  return PROD_API.replace('https://', '').replace('http://', '');
}

export const API_BASE_URL = __DEV__
  ? `http://${getLocalIP()}:3000`
  : PROD_API;

