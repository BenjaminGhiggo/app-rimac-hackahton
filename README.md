# 🏥 RIMAC Hackathon - App Móvil

Aplicación móvil de salud desarrollada con React Native y Expo para el hackathon de RIMAC Seguros.

## 🎯 Descripción

Esta es una aplicación móvil integral de servicios de salud que integra:
- Sistema de triaje de síntomas
- Gestión de citas médicas
- Seguimiento de tratamientos
- Índice de bienestar
- Gamificación y beneficios
- Soporte de emergencias

## 🎨 Diseño Visual

La aplicación utiliza la **identidad visual de RIMAC Seguros** con:
- ✅ Colores corporativos: Rojo (`#C60C30`) y Blanco
- ✅ Componentes personalizados (Button, Card, Header)
- ✅ Sistema de diseño consistente
- ✅ Interfaz moderna y profesional

📖 [Ver Sistema de Diseño Completo](./DESIGN_SYSTEM.md)

## 🚀 Características

- ✅ Navegación con Expo Router
- ✅ Interfaz moderna con Lucide Icons
- ✅ Integración con Supabase
- ✅ Soporte multiplataforma (iOS, Android, Web)
- ✅ TypeScript estricto
- ✅ Sistema de temas personalizable
- ✅ Componentes reutilizables

## 📦 Instalación

```bash
npm install
```

## 🏃 Desarrollo

```bash
npm run dev
```

Luego abre el código QR en **Expo Go** desde tu teléfono.

## 📁 Estructura del Proyecto

```
app/                    # Pantallas y rutas (Expo Router)
├── (tabs)/             # Navegación de pestañas
├── settings/           # Submenu de configuración
└── [otras pantallas]

components/             # Componentes reutilizables
├── Button.tsx          # Botón personalizado
├── Card.tsx            # Tarjeta versátil
└── Header.tsx          # Encabezado

theme/                  # Sistema de diseño
├── colors.ts           # Paleta de colores RIMAC
├── typography.ts       # Tipografía
└── spacing.ts          # Espaciado y bordes

services/               # Servicios API
config/                 # Configuración global
hooks/                  # Custom React hooks
utils/                  # Funciones auxiliares
```

## 🔧 Scripts

```bash
npm run dev         # Iniciar desarrollo
npm run dev:tunnel  # Desarrollo con túnel (remoto)
npm run build:web   # Compilar para web
npm run lint        # Linting
npm run typecheck   # Verificar tipos TypeScript
```

## 🎨 Componentes Disponibles

### Button
```tsx
<Button 
  title="Comprar SOAT"
  onPress={handlePress}
  variant="primary"
  size="lg"
/>
```

### Card
```tsx
<Card variant="glass">
  {/* Contenido */}
</Card>
```

### Header
```tsx
<Header 
  title="Mi Perfil"
  subtitle="Gestiona tu información"
/>
```

## 📱 Optimización Mobile

Esta aplicación está **totalmente optimizada para dispositivos móviles**:

✅ **Performance**
- React.memo para evitar re-renders
- useCallback/useMemo para optimización
- FlatList virtualizado para listas
- Network caching automático

✅ **Bundle**
- Hermes JS engine habilitado
- Dynamic imports
- Tree shaking

✅ **UX Mobile**
- Diseño responsive
- Toques táctiles optimizados
- Orientación portrait
- Safe area respetada

📖 [Ver Guía de Optimización Mobile](./MOBILE_OPTIMIZATION.md)
📖 [Ver Mejores Prácticas](./MOBILE_BEST_PRACTICES.md)

## 🎯 Componentes Optimizados

Usa SIEMPRE los componentes `Optimized*`:

```tsx
import { OptimizedButton, OptimizedCard, OptimizedHeader } from '@/components';
```

## 📚 Recursos

- [Documentación de Expo](https://docs.expo.dev)
- [React Native](https://reactnative.dev)
- [Sistema de Diseño](./DESIGN_SYSTEM.md)
- [Optimización Mobile](./MOBILE_OPTIMIZATION.md)
- [Mejores Prácticas](./MOBILE_BEST_PRACTICES.md)
- [RIMAC Seguros](https://www.rimac.com)

## 👨‍💻 Desarrollado para

RIMAC Hackathon - Conectando salud e innovación

---

**Última actualización**: Optimizado para React Native Mobile
