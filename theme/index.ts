/**
 * Exportar todos los temas y estilos
 */

export { default as RIMAC_COLORS } from './colors';
export { default as TYPOGRAPHY } from './typography';
export { SPACING, BORDER_RADIUS } from './spacing';

import RIMAC_COLORS from './colors';
import TYPOGRAPHY from './typography';
import { SPACING, BORDER_RADIUS } from './spacing';

export const THEME = {
  colors: RIMAC_COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
};

export default THEME;

