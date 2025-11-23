# 🚀 Guía Rápida - Compilar para Mobile

## 1️⃣ Preparar Ambiente

```bash
# Instalar dependencias
npm install

# Verificar que todo esté OK
npm run typecheck
```

## 2️⃣ Ejecutar en Desarrollo

### Opción A: Expo Go (Recomendado)

```bash
# Iniciar servidor de desarrollo
npm run dev

# Escanear el código QR que aparece:
# - iOS: Abre Expo Go y escanea
# - Android: Abre Expo Go y escanea
```

### Opción B: Emulador Android

```bash
# Requiere: Android Studio con emulador configurado
npm run dev
# En la terminal presiona: 'a'
```

### Opción C: Simulador iOS (solo macOS)

```bash
# Requiere: Xcode instalado
npm run dev
# En la terminal presiona: 'i'
```

## 3️⃣ Compilar para Producción

### Android APK

```bash
# Requiere: EAS CLI
npm install -g eas-cli

# Compilar
eas build --platform android

# Descargar e instalar en dispositivo
```

### iOS

```bash
# Requiere: Apple Developer Account
eas build --platform ios

# Descargar e instalar
```

## 📝 Archivo: Pantalla Principal Optimizada

Ya hay una versión optimizada disponible:
- **Archivo**: `app/(tabs)/index.optimized.tsx`
- **Cambios**: Memoización, lazy loading, virtualización
- **Cuándo usar**: Para máximo rendimiento en mobile

Puedes copiar su contenido a `app/(tabs)/index.tsx` cuando quieras.

## 🔍 Verificar Cambios Realizados

### Componentes Nuevos (Optimizados)
```
✅ components/OptimizedButton.tsx
✅ components/OptimizedCard.tsx
✅ components/OptimizedHeader.tsx
```

### Sistema de Diseño RIMAC
```
✅ theme/colors.ts         - Rojo/Blanco RIMAC
✅ theme/typography.ts     - Tipografía
✅ theme/spacing.ts        - Espaciado
```

### Hooks Optimizados
```
✅ hooks/useNetworkOptimized.ts  - Caché de red
✅ utils/mobileOptimizations.ts  - Utilidades
```

### Documentación
```
✅ DESIGN_SYSTEM.md               - Sistema visual
✅ MOBILE_OPTIMIZATION.md         - Optimizaciones
✅ MOBILE_BEST_PRACTICES.md       - Mejores prácticas
✅ USAGE_EXAMPLE.md               - Ejemplos
```

## 💡 Pruebas Rápidas

### Probar Performance
```tsx
// En tu componente
console.time('render');
// ... código ...
console.timeEnd('render');
```

### Limpiar Caché
```bash
# Limpiar caché Expo
npx expo start --clear

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 🎨 Usar Colores RIMAC

```tsx
import { RIMAC_COLORS } from '@/theme';

// Colores disponibles:
// - primary: #C60C30 (Rojo RIMAC)
// - primaryLight: #E63946
// - primaryDark: #A00824
// - white: #FFFFFF
// - success, warning, error, info
```

## ✨ Usar Componentes Optimizados

```tsx
import { 
  OptimizedButton, 
  OptimizedCard, 
  OptimizedHeader 
} from '@/components';

// Button
<OptimizedButton 
  title="Comprar SOAT"
  onPress={handlePress}
  variant="primary"
  size="lg"
/>

// Card
<OptimizedCard variant="glass">
  {children}
</OptimizedCard>

// Header
<OptimizedHeader 
  title="Mi Perfil"
  subtitle="Información personal"
/>
```

## 🚀 Deploy en Producción

### Android Play Store
```bash
eas build --platform android --auto-submit
```

### iOS App Store
```bash
eas build --platform ios --auto-submit
```

## 🐛 Troubleshooting

### Problema: "No se puede escanear QR"
```bash
# Solución: Usar modo túnel
npm run dev:tunnel
```

### Problema: "Error de dependencias"
```bash
# Solución: Reinstalar
npm install --legacy-peer-deps
```

### Problema: "Versión antigua en caché"
```bash
# Solución: Limpiar todo
npx expo start --clear
```

## 📱 Dispositivos Soportados

- ✅ iOS 12+
- ✅ Android 7+ (API 24+)
- ✅ Web (browser moderno)

## 📞 Necesitas Ayuda?

1. Revisa `MOBILE_BEST_PRACTICES.md`
2. Revisa `DESIGN_SYSTEM.md`
3. Consulta [Expo Docs](https://docs.expo.dev)
4. Consulta [React Native Docs](https://reactnative.dev)

---

**Ready to go? 🎉**
```bash
npm install && npm run dev
```

