# 🎨 Sistema de Diseño RIMAC

## Colores Corporativos

La aplicación utiliza la paleta de colores oficial de **RIMAC Seguros**.

### Colores Principales

- **Rojo RIMAC (Primary)**: `#C60C30` - Color corporativo principal
- **Rojo Claro (Primary Light)**: `#E63946` - Variante para hover/estados
- **Rojo Oscuro (Primary Dark)**: `#A00824` - Variante para contraste
- **Blanco**: `#FFFFFF` - Fondo y texto en contraste

### Colores de Estado

- **Éxito**: `#10B981` (Verde)
- **Advertencia**: `#F59E0B` (Amarillo/Naranja)
- **Error**: `#EF4444` (Rojo)
- **Info**: `#3B82F6` (Azul)

### Escala de Grises

```
gray-50:  #F9FAFB
gray-100: #F3F4F6
gray-200: #E5E7EB
gray-300: #D1D5DB
gray-400: #9CA3AF
gray-500: #6B7280
gray-600: #4B5563
gray-700: #374151
gray-800: #1F2937
gray-900: #111827
```

## Componentes

### Button

Componente de botón personalizado con múltiples variantes.

```tsx
import { Button } from '@/components';

<Button 
  title="Comprar SOAT"
  onPress={() => {}}
  variant="primary"
  size="lg"
/>
```

**Variantes:**
- `primary` - Fondo rojo RIMAC con gradiente
- `secondary` - Variante secundaria con gradiente
- `outline` - Borde rojo sin relleno
- `ghost` - Solo texto

**Tamaños:**
- `sm` - Pequeño
- `md` - Mediano (por defecto)
- `lg` - Grande

### Card

Componente de tarjeta versátil.

```tsx
import { Card } from '@/components';

<Card variant="glass">
  {/* Contenido */}
</Card>
```

**Variantes:**
- `glass` - Efecto vidrio esmerilado con blur
- `solid` - Tarjeta sólida blanca con sombra
- `outline` - Tarjeta con borde

### Header

Encabezado rojo RIMAC con navegación.

```tsx
import { Header } from '@/components';

<Header 
  title="Mi Perfil"
  subtitle="Gestiona tu información"
  showBackButton={true}
/>
```

## Sistema de Espaciado

```
xs:   4px
sm:   8px
md:   12px
lg:   16px
xl:   20px
2xl:  24px
3xl:  32px
4xl:  40px
5xl:  48px
```

## Bordes Redondeados

```
sm:   8px
md:   12px
lg:   16px
xl:   20px
2xl:  24px
full: 9999px (circular)
```

## Tipografía

### Tamaños

```
xs:   12px
sm:   14px
base: 16px
lg:   18px
xl:   20px
2xl:  24px
3xl:  30px
4xl:  36px
```

### Pesos

```
thin:       100
extralight: 200
light:      300
normal:     400
medium:     500
semibold:   600
bold:       700
extrabold:  800
black:      900
```

## Patrones de Diseño

### Gradientes

**Gradiente Rojo RIMAC:**
```tsx
colors={[RIMAC_COLORS.primary, RIMAC_COLORS.primaryDark]}
```

**Gradiente Secundario:**
```tsx
colors={[RIMAC_COLORS.primaryLight, RIMAC_COLORS.primary]}
```

## Importaciones

```tsx
import { RIMAC_COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '@/theme';
import { Button, Card, Header } from '@/components';
```

## Referencia: Sitio Web RIMAC

Este sistema de diseño imita la identidad visual de:
https://www.rimac.com/comprar/soat-digital

Características principales:
- Colores rojo y blanco corporativos
- Interfaz limpia y profesional
- Acceso rápido a servicios
- Información clara de coberturas
- Llamadas a acción prominentes

