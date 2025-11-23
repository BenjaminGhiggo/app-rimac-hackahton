/**
 * Colores corporativos RIMAC Seguros
 * Paleta de colores basada en la identidad visual de RIMAC
 */

export const RIMAC_COLORS = {
  // Colores principales
  primary: '#C60C30', // Rojo RIMAC (corporativo)
  primaryLight: '#E63946', // Rojo más claro
  primaryDark: '#A00824', // Rojo más oscuro
  
  // Colores neutrales
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Colores de estado
  success: '#10B981', // Verde (para acciones positivas)
  warning: '#F59E0B', // Amarillo/Naranja
  error: '#EF4444', // Rojo para errores
  info: '#3B82F6', // Azul (información)
  warning2: '#FBBF24', // Amarillo alternativo para warnings

  // Colores semitransparentes
  backdrop: 'rgba(0, 0, 0, 0.4)',
  overlay: 'rgba(198, 12, 48, 0.1)', // Rojo RIMAC con transparencia

  // Gradientes
  gradients: {
    primary: ['#C60C30', '#E63946'], // Rojo RIMAC
    secondary: ['#C60C30', '#8B1428'], // Rojo oscuro
    light: ['#FFFFFF', '#F9FAFB'], // Para fondo light
  },
};

export default RIMAC_COLORS;

