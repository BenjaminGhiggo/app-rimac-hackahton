# 📱 Mejores Prácticas para Mobile - React Native

## ✅ Uso de Componentes Optimizados

### SIEMPRE usa componentes `Optimized*`

```tsx
// ✅ CORRECTO - Optimizado para mobile
import { OptimizedButton, OptimizedCard } from '@/components';

<OptimizedButton title="Continuar" onPress={handlePress} />
<OptimizedCard>{children}</OptimizedCard>

// ❌ EVITAR - No optimizado
import { Button, Card } from '@/components';
```

## 🎯 Patrones de Optimización

### 1. Memoización de Componentes

```tsx
import React from 'react';

// ✅ Envuelve en React.memo para evitar re-renders
const MyComponent = React.memo(({ title }) => (
  <Text>{title}</Text>
));

export default MyComponent;
```

### 2. useCallback para Funciones

```tsx
import { useCallback } from 'react';

export default function Screen() {
  // ✅ Usa useCallback para funciones que pases como props
  const handlePress = useCallback(() => {
    console.log('Presionado');
  }, []);

  return <OptimizedButton onPress={handlePress} />;
}
```

### 3. useMemo para Objetos Grandes

```tsx
import { useMemo } from 'react';

export default function Screen() {
  // ✅ Usa useMemo para objetos que no cambian frecuentemente
  const modules = useMemo(
    () => [
      { id: 1, title: 'Módulo 1' },
      { id: 2, title: 'Módulo 2' },
    ],
    []
  );

  return <FlatList data={modules} />;
}
```

### 4. FlatList en lugar de ScrollView + map()

```tsx
import { FlatList } from 'react-native';

// ❌ NO HACER - Renderiza todo de una vez
<ScrollView>
  {items.map((item) => <Item key={item.id} {...item} />)}
</ScrollView>

// ✅ HACER - Virtualiza automáticamente
<FlatList
  data={items}
  renderItem={({ item }) => <Item {...item} />}
  keyExtractor={(item) => item.id}
/>
```

### 5. Network Optimization

```tsx
import { useNetworkOptimized } from '@/hooks/useNetworkOptimized';

export default function Screen() {
  const { fetchWithCache, clearCache } = useNetworkOptimized();

  useEffect(() => {
    // ✅ Caché automático de 5 minutos
    fetchWithCache('/api/datos')
      .then(setData)
      .catch(console.error);
  }, []);

  return <View>{/* ... */}</View>;
}
```

## 📦 Estructura de Archivos Optimizada

```
app/
├── (tabs)/
│   └── index.optimized.tsx    # Versión optimizada
├── components/
│   ├── OptimizedButton.tsx    # ✅ Usar estos
│   ├── OptimizedCard.tsx
│   ├── OptimizedHeader.tsx
│   └── Button.tsx             # ❌ Evitar estos
├── hooks/
│   └── useNetworkOptimized.ts
└── utils/
    └── mobileOptimizations.ts
```

## 🚀 Performance Tips

### 1. Reducir Tamaño de Bundle

```bash
# Verificar tamaño
npm run build:web

# Usar dynamic imports
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### 2. Deshabilitar Telemetría Expo

```bash
# Ya está en package.json
EXPO_NO_TELEMETRY=1 npm run dev
```

### 3. Image Optimization

```tsx
import { Image } from 'react-native';

// ✅ CORRECTO
<Image
  source={require('./image.png')}
  style={{ width: 200, height: 200 }}
  fadeDuration={0}
/>

// Especificar dimensiones siempre
```

### 4. Evitar Inline Functions

```tsx
// ❌ NO HACER
<OptimizedButton onPress={() => setActive(!active)} />

// ✅ HACER
const handleToggle = useCallback(() => {
  setActive((prev) => !prev);
}, []);

<OptimizedButton onPress={handleToggle} />
```

## ⚡ Métricas Esperadas

Después de optimizar, deberías ver:

- **Bundle Size**: < 5MB
- **First Paint**: < 2s
- **Memory**: < 150MB
- **FPS**: 60 FPS en navegación

## 📋 Checklist para Nuevas Pantallas

- [ ] Usar `React.memo()` en componentes puros
- [ ] `useCallback` para funciones que pasan a props
- [ ] `useMemo` para objetos complejos
- [ ] `FlatList` en lugar de ScrollView + map
- [ ] Componentes `Optimized*`
- [ ] Caché de peticiones de red
- [ ] `numberOfLines` en textos largos
- [ ] `removeClippedSubviews` en ScrollView

## 🔧 Debugging Performance

```tsx
import { performance } from 'react-native';

// Medir tiempo de renderizado
console.time('render-time');
// ... código ...
console.timeEnd('render-time');
```

## 📚 Recursos

- [React Native Performance](https://reactnative.dev/docs/performance)
- [Optimizing Flat List](https://reactnative.dev/docs/optimizing-flatlist-configuration)
- [Memory Management](https://reactnative.dev/docs/memory-management)

