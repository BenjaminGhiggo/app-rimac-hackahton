# 🎨 Component Showcase - RIMAC Mobile App

## 📱 Componentes Visuales

### 1. OptimizedButton

**Variantes disponibles:**

#### Primary (Principal)
```
┌─────────────────────┐
│   🔴 Comprar SOAT   │  ← Rojo RIMAC (#C60C30)
└─────────────────────┘
```

```tsx
<OptimizedButton 
  title="Comprar SOAT"
  onPress={handleBuy}
  variant="primary"
  size="lg"
/>
```

#### Secondary
```
┌─────────────────────┐
│  🔴 Más Información │  ← Rojo degradado
└─────────────────────┘
```

```tsx
<OptimizedButton 
  title="Más Información"
  variant="secondary"
/>
```

#### Outline (Solo borde)
```
┌─────────────────────┐
│   Conocer Más       │  ← Borde rojo
└─────────────────────┘
```

```tsx
<OptimizedButton 
  title="Conocer Más"
  variant="outline"
/>
```

#### Ghost (Transparente)
```
   Cancelar              ← Solo texto
```

```tsx
<OptimizedButton 
  title="Cancelar"
  variant="ghost"
/>
```

### Tamaños

```
┌──────────┐
│ Pequeño  │  size="sm"
└──────────┘

┌───────────────┐
│    Mediano    │  size="md" (default)
└───────────────┘

┌──────────────────────┐
│      Grande          │  size="lg"
└──────────────────────┘
```

---

## 🎴 OptimizedCard

### Glass Morphism
```
╔══════════════════════════╗
║ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ║  ← Efecto vidrio
║ ║ 📊 Índice Bienestar ║ ║     con blur
║ ║ 85 / 100           ║ ║
║ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ║
╚══════════════════════════╝
```

```tsx
<OptimizedCard variant="glass">
  <Text>Contenido con efecto vidrio</Text>
</OptimizedCard>
```

### Solid (Blanca)
```
┌──────────────────────────┐
│ 📱 Información Personal  │  ← Tarjeta blanca
│ Nombre: Juan Pérez       │     con sombra
│ Email: juan@rimac.com    │
└──────────────────────────┘
```

```tsx
<OptimizedCard variant="solid">
  <Text>Contenido sólido</Text>
</OptimizedCard>
```

### Outline (Con borde)
```
┌──────────────────────────┐
│ ✓ ¿Qué cubre tu SOAT?    │  ← Con borde
│ • Fallecimiento          │     gris
│ • Gastos médicos         │
└──────────────────────────┘
```

```tsx
<OptimizedCard variant="outline">
  <Text>Contenido con borde</Text>
</OptimizedCard>
```

---

## 📋 OptimizedHeader

### Con Botón Atrás

```
╔════════════════════════════╗
║ ◀ Mi Perfil                ║  ← Rojo RIMAC
║   Gestiona tu información  ║     Con subtítulo
╚════════════════════════════╝
```

```tsx
<OptimizedHeader 
  title="Mi Perfil"
  subtitle="Gestiona tu información"
  showBackButton={true}
/>
```

### Con Acción Derecha

```
╔════════════════════════════╗
║ ◀ Citas Médicas      ⋯⋯⋯ ║  ← Menú a la derecha
║   Próximas eventos         ║
╚════════════════════════════╝
```

```tsx
<OptimizedHeader 
  title="Citas Médicas"
  subtitle="Próximas eventos"
  rightAction={{
    icon: <MoreVertical />,
    onPress: handleMenu
  }}
/>
```

---

## 🎯 Pantalla Completa - Ejemplo

### Compra de SOAT

```
╔══════════════════════════════════════════╗
║  RIMAC SALUD                        ◀    ║
║  Hola Brigitte 👋                        ║
║  Compra tu SOAT desde S/ 35              ║
╚══════════════════════════════════════════╝

┌──────────────────────────────────────────┐
│  🎯 ACCIONES RÁPIDAS                     │
├──────────────────────────────────────────┤
│  ┌────────────────────────────────────┐  │
│  │ 🚨 EMERGENCIA                      │  │
│  │ Activar alerta RIMAC               │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 🏥 TRIAJE DE SÍNTOMAS              │  │
│  │ Evaluar síntomas                   │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  📋 PLANES DISPONIBLES                   │
├──────────────────────────────────────────┤
│  ☐ SOAT Digital - S/ 35   ← Básico       │
│  ☑ SOAT Vial - S/ 75      ← Con asist.   │
│  ☐ SOAT Plus - S/ 175     ← Completo     │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ ┌──────────────────────────────────────┐ │
│ │  CONTINUAR CON LA COMPRA      [►]   │ │
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │  CONOCER MÁS                        │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

---

## 🎨 Sistema de Colores en Acción

### Header (Gradiente Rojo)
```
╔════════════════════════════╗
║ 🔴 #C60C30  →  #A00824    ║  ← Gradiente rojo
║  (Claro)        (Oscuro)  ║
╚════════════════════════════╝
```

### Botones
```
┌──────────────┐
│ PRIMARY      │  #C60C30 → #E63946
├──────────────┤
│ SUCCESS      │  #10B981 (Verde)
├──────────────┤
│ WARNING      │  #F59E0B (Naranja)
├──────────────┤
│ ERROR        │  #EF4444 (Rojo)
├──────────────┤
│ INFO         │  #3B82F6 (Azul)
└──────────────┘
```

---

## 📐 Sistema de Espaciado

### Tamaños
```
xs   │ 4px      (gaps pequeños)
sm   │ 8px      (padding pequeño)
md   │ 12px     (espaciado normal)
lg   │ 16px     (espaciado principal)
xl   │ 20px     (espaciado grande)
2xl  │ 24px     (espaciado extra)
3xl  │ 32px     (grandes áreas)
4xl  │ 40px     (muy grandes)
5xl  │ 48px     (máximo)
```

### Bordes Redondeados
```
sm   │ 8px       (slight)
md   │ 12px      (medium)
lg   │ 16px      (default)
xl   │ 20px      (large)
2xl  │ 24px      (extra)
full │ 9999px    (circular)
```

---

## 🔄 Estados de Componentes

### Button Estados

```
NORMAL (Idle)
├──────────────────┐
│ Comprar SOAT     │
└──────────────────┘

PRESSED (Active)
├──────────────────┐
│ Comprar SOAT     │  ← Opacidad 0.7
└──────────────────┘

LOADING
├──────────────────┐
│      ⟳           │  ← Spinner
└──────────────────┘

DISABLED
├──────────────────┐
│ Comprar SOAT     │  ← Opacidad 0.5
└──────────────────┘
```

---

## 📱 Responsive Design

### Pantalla Pequeña (320px)
```
┌──────────────────┐
│ RIMAC SALUD  ◀  │
│ Hola 👋          │
├──────────────────┤
│ [Botón Ancho]    │
│ [Botón Ancho]    │
├──────────────────┤
│ [Card]           │
│ [Card]           │
└──────────────────┘
```

### Pantalla Mediana (375px) - DEFAULT
```
┌────────────────────────┐
│ RIMAC SALUD        ◀   │
│ Hola Brigitte 👋       │
├────────────────────────┤
│ [    Botón Grande   ]  │
│ [    Botón Grande   ]  │
├────────────────────────┤
│ [      Card        ]   │
│ [      Card        ]   │
└────────────────────────┘
```

### Pantalla Grande (428px)
```
┌──────────────────────────────┐
│ RIMAC SALUD            ◀     │
│ Hola Brigitte 👋             │
├──────────────────────────────┤
│ [    Botón Muy Grande    ]   │
│ [    Botón Muy Grande    ]   │
├──────────────────────────────┤
│ [  Card Grande  ] [Card 2 ]  │
│ [  Card Grande  ] [Card 2 ]  │
└──────────────────────────────┘
```

---

## 💡 Ejemplos de Uso

### Crear Pantalla Completa

```tsx
import { OptimizedHeader, OptimizedCard, OptimizedButton } from '@/components';
import { RIMAC_COLORS, SPACING } from '@/theme';
import { ScrollView, View } from 'react-native';

export default function BenefitsScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: RIMAC_COLORS.gray[50] }}>
      <OptimizedHeader 
        title="Beneficios"
        subtitle="Qué incluye tu plan"
      />
      
      <View style={{ padding: SPACING.lg }}>
        <OptimizedCard variant="solid">
          {/* Contenido */}
        </OptimizedCard>
        
        <OptimizedButton 
          title="Contratar Ahora"
          onPress={handlePress}
          variant="primary"
          size="lg"
          style={{ marginTop: SPACING.lg }}
        />
      </View>
    </ScrollView>
  );
}
```

### Usar Colores RIMAC

```tsx
import { RIMAC_COLORS, SPACING } from '@/theme';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: RIMAC_COLORS.white,
    padding: SPACING.lg,
  },
  title: {
    color: RIMAC_COLORS.primary,  // Rojo RIMAC
    fontSize: 20,
    fontWeight: 'bold',
  },
  success: {
    color: RIMAC_COLORS.success,  // Verde
  },
});
```

---

## 🎯 Checklist de Componentes

- [x] Button optimizado
- [x] Card versátil
- [x] Header profesional
- [x] Colores RIMAC
- [x] Sistema de espaciado
- [x] Responsive design
- [x] Estados visuales
- [x] Memoización
- [x] Documentación
- [x] Ejemplos

**Estatus:** ✅ Producción Ready

---

Last Updated: 2025-11-23

