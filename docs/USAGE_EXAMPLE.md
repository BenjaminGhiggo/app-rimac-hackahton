# 📚 Ejemplos de Uso - Sistema de Diseño RIMAC

## Importaciones Comunes

```tsx
// Colores y tema
import { RIMAC_COLORS, SPACING, BORDER_RADIUS } from '@/theme';

// Componentes
import { Button, Card, Header } from '@/components';

// React Native
import { View, Text, ScrollView } from 'react-native';
```

## Ejemplo 1: Pantalla de Compra de SOAT

```tsx
import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Header, Card, Button } from '@/components';
import { RIMAC_COLORS, SPACING, BORDER_RADIUS } from '@/theme';

export default function BuySOATScreen() {
  const [selected, setSelected] = useState('digital');

  return (
    <ScrollView style={{ flex: 1, backgroundColor: RIMAC_COLORS.white }}>
      {/* Encabezado rojo RIMAC */}
      <Header 
        title="Comprar SOAT Digital" 
        subtitle="Desde S/ 35 al año"
      />

      {/* Contenedor principal */}
      <View style={styles.container}>
        {/* Tarjeta de información */}
        <Card variant="outline">
          <Text style={styles.cardTitle}>¿Qué cubre tu SOAT?</Text>
          <Text style={styles.cardText}>
            • Fallecimiento: hasta 4 UIT (S/ 21,400)
          </Text>
          <Text style={styles.cardText}>
            • Gastos médicos: hasta 5 UIT (S/ 26,750)
          </Text>
          <Text style={styles.cardText}>
            • Incapacidad: hasta 1 UIT (S/ 5,350)
          </Text>
        </Card>

        {/* Opciones de SOAT */}
        <Text style={styles.label}>Elige tu plan</Text>
        
        {[
          { id: 'digital', name: 'SOAT Digital', price: 'S/ 35', desc: 'Básico' },
          { id: 'vial', name: 'SOAT Vial', price: 'S/ 75', desc: 'Con asistencia' },
          { id: 'plus', name: 'SOAT Plus', price: 'S/ 175', desc: 'Completo' },
        ].map((plan) => (
          <TouchableOpacity 
            key={plan.id}
            onPress={() => setSelected(plan.id)}
            style={[
              styles.planCard,
              selected === plan.id && styles.planCardActive
            ]}
          >
            <View style={styles.planContent}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planDesc}>{plan.desc}</Text>
            </View>
            <Text style={styles.planPrice}>{plan.price}</Text>
          </TouchableOpacity>
        ))}

        {/* Botones de acción */}
        <Button
          title="Continuar con la compra"
          onPress={() => {}}
          variant="primary"
          size="lg"
          style={{ marginTop: SPACING.lg }}
        />

        <Button
          title="Conocer más"
          onPress={() => {}}
          variant="outline"
          size="lg"
          style={{ marginTop: SPACING.md }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: RIMAC_COLORS.primary,
    marginBottom: SPACING.md,
  },
  cardText: {
    fontSize: 14,
    color: RIMAC_COLORS.gray[700],
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[800],
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  planCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: RIMAC_COLORS.gray[200],
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    backgroundColor: RIMAC_COLORS.white,
  },
  planCardActive: {
    borderColor: RIMAC_COLORS.primary,
    backgroundColor: RIMAC_COLORS.white,
  },
  planContent: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[800],
    marginBottom: SPACING.sm,
  },
  planDesc: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[500],
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: RIMAC_COLORS.primary,
  },
});
```

## Ejemplo 2: Pantalla de Perfil

```tsx
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header, Card, Button } from '@/components';
import { RIMAC_COLORS, SPACING } from '@/theme';

export default function ProfileScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: RIMAC_COLORS.gray[50] }}>
      <Header title="Mi Perfil" />

      <View style={styles.container}>
        {/* Información personal */}
        <Card variant="solid">
          <Text style={styles.cardTitle}>Información Personal</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nombre</Text>
            <Text style={styles.value}>Juan Pérez</Text>
          </View>
          <View style={[styles.infoRow, { borderTopWidth: 1, borderTopColor: RIMAC_COLORS.gray[200] }]}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>juan@example.com</Text>
          </View>
        </Card>

        {/* Acciones */}
        <Button
          title="Editar Perfil"
          onPress={() => {}}
          variant="primary"
          size="lg"
        />

        <Button
          title="Cambiar Contraseña"
          onPress={() => {}}
          variant="outline"
          size="lg"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[800],
    marginBottom: SPACING.lg,
  },
  infoRow: {
    paddingVertical: SPACING.md,
  },
  label: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[500],
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  value: {
    fontSize: 14,
    color: RIMAC_COLORS.gray[800],
    fontWeight: '600',
  },
});
```

## Ejemplo 3: Usando Gradientes

```tsx
import { LinearGradient } from 'expo-linear-gradient';
import { RIMAC_COLORS } from '@/theme';

// Fondo rojo RIMAC
<LinearGradient
  colors={[RIMAC_COLORS.primary, RIMAC_COLORS.primaryDark]}
  style={{ flex: 1 }}
>
  {/* Contenido */}
</LinearGradient>
```

## Ejemplo 4: Paleta de Colores

```tsx
import { RIMAC_COLORS } from '@/theme';

// Usar colores en estilos
const styles = StyleSheet.create({
  primaryText: {
    color: RIMAC_COLORS.primary, // Rojo RIMAC
  },
  successMessage: {
    color: RIMAC_COLORS.success, // Verde
  },
  errorMessage: {
    color: RIMAC_COLORS.error, // Rojo error
  },
});
```

## Ejemplo 5: Sistema de Espaciado

```tsx
import { SPACING, BORDER_RADIUS } from '@/theme';

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg, // 16px
    marginBottom: SPACING.md, // 12px
  },
  card: {
    borderRadius: BORDER_RADIUS.xl, // 20px
    padding: SPACING.xl, // 20px
  },
});
```

## Colores Disponibles

| Uso | Color | Valor |
|-----|-------|-------|
| Primario | Rojo RIMAC | `#C60C30` |
| Primario Claro | Rojo Claro | `#E63946` |
| Primario Oscuro | Rojo Oscuro | `#A00824` |
| Éxito | Verde | `#10B981` |
| Advertencia | Naranja | `#F59E0B` |
| Error | Rojo | `#EF4444` |
| Info | Azul | `#3B82F6` |

---

✨ **Tip:** Siempre importa desde `@/theme` y `@/components` para mantener la consistencia visual.

