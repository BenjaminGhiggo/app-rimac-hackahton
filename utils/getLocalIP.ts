import { Platform } from 'react-native';

/**
 * Obtiene la IP local de la máquina para desarrollo
 * En producción, esto no se usa
 */
// IP configurada manualmente
// Para obtener tu IP: hostname -I (Linux) o ipconfig (Windows)
// IMPORTANTE: Cambia esta IP por la IP de tu máquina si es diferente
const MANUAL_IP = '192.168.18.7';

export function getLocalIP(): string {
  // Para Android Emulator
  if (Platform.OS === 'android') {
    // En el emulador de Android, usa 10.0.2.2 para acceder al localhost de la máquina
    // Si estás usando un dispositivo físico, usa la IP local de tu máquina
    return __DEV__ ? MANUAL_IP : 'api.rimqhali.ai';
  }

  // Para iOS Simulator (solo en Mac)
  if (Platform.OS === 'ios') {
    // En el simulador de iOS, localhost funciona
    // Si estás usando un dispositivo físico, usa la IP local de tu máquina
    return __DEV__ ? MANUAL_IP : 'api.rimqhali.ai';
  }

  // Para web
  return __DEV__ ? 'localhost' : 'api.rimqhali.ai';
}

export const API_BASE_URL = __DEV__
  ? `http://${getLocalIP()}:3000/api`
  : 'https://api.rimqhali.ai/api';

