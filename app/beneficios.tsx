import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { RIMAC_COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { ChevronLeft, CheckCircle2 } from 'lucide-react-native';

const BENEFICIOS_DATA = [
  {
    id: 1,
    titulo: 'Cobertura Integral 24/7',
    descripcion: 'Atención médica disponible las 24 horas del día, todos los días',
    icono: '🏥',
    estado: 'activo',
  },
  {
    id: 2,
    titulo: '15% Descuento en Servicios',
    descripcion: 'Goza de un descuento especial en todos nuestros servicios médicos',
    icono: '💰',
    estado: 'activo',
  },
  {
    id: 3,
    titulo: 'Telemedicina Premium',
    descripcion: 'Consultas virtuales con especialistas sin costo adicional',
    icono: '📱',
    estado: 'activo',
  },
  {
    id: 4,
    titulo: 'Farmacia Red Convenida',
    descripcion: 'Acceso a más de 500 farmacias en todo el país',
    icono: '💊',
    estado: 'activo',
  },
  {
    id: 5,
    titulo: 'Programa de Bienestar',
    descripcion: 'Acceso a programas de prevención y promoción de la salud',
    icono: '🏃',
    estado: 'activo',
  },
  {
    id: 6,
    titulo: 'Cobertura Dental',
    descripcion: 'Servicios odontológicos con especialistas certificados',
    icono: '🦷',
    estado: 'disponible_proximamente',
  },
];

export default function BeneficiosScreen() {
  const router = useRouter();

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return '#10B981';
      case 'disponible_proximamente':
        return '#F59E0B';
      default:
        return RIMAC_COLORS.gray[500];
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'Activo';
      case 'disponible_proximamente':
        return 'Próximamente';
      default:
        return estado;
    }
  };

  return (
    <LinearGradient
      colors={[RIMAC_COLORS.primary, RIMAC_COLORS.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={RIMAC_COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Beneficios</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* INTRODUCCIÓN */}
        <View style={styles.section}>
          <Text style={styles.introText}>
            Disfruta de todos los beneficios que RIMAC Salud AI te ofrece para tu bienestar integral
          </Text>
        </View>

        {/* BENEFICIOS GRID */}
        <View style={styles.beneficiosGrid}>
          {BENEFICIOS_DATA.map((beneficio) => (
            <TouchableOpacity
              key={beneficio.id}
              style={styles.beneficioCard}
              activeOpacity={0.8}
            >
              {/* Icono */}
              <Text style={styles.beneficioIcon}>{beneficio.icono}</Text>

              {/* Estado Badge */}
              <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(beneficio.estado) }]}>
                <Text style={styles.estadoLabel}>{getEstadoLabel(beneficio.estado)}</Text>
              </View>

              {/* Contenido */}
              <Text style={styles.beneficioTitulo}>{beneficio.titulo}</Text>
              <Text style={styles.beneficioDescripcion}>{beneficio.descripcion}</Text>

              {/* Checkmark si está activo */}
              {beneficio.estado === 'activo' && (
                <View style={styles.checkContainer}>
                  <CheckCircle2 size={20} color="#10B981" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* INFO ADICIONAL */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>💡 Cómo Usar Tus Beneficios</Text>
            <Text style={styles.infoText}>
              • Muestra tu carné RIMAC en cualquier centro afiliado{'\n'}
              • Accede a telemedicina desde esta app{'\n'}
              • Acumula puntos en cada transacción{'\n'}
              • Canjea puntos por descuentos especiales
            </Text>
          </View>
        </View>

        <View style={{ height: SPACING['4xl'] }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 50,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButton: {
    padding: SPACING.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
    flex: 1,
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  introText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
  beneficiosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.lg,
    justifyContent: 'space-between',
  },
  beneficioCard: {
    width: '48%',
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  beneficioIcon: {
    fontSize: 36,
    marginBottom: SPACING.sm,
  },
  estadoBadge: {
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    alignSelf: 'flex-start',
    marginBottom: SPACING.sm,
  },
  estadoLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
    textTransform: 'uppercase',
  },
  beneficioTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  beneficioDescripcion: {
    fontSize: 11,
    color: RIMAC_COLORS.gray[600],
    fontWeight: '500',
    lineHeight: 15,
  },
  checkContainer: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
    marginBottom: SPACING.md,
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    lineHeight: 20,
  },
});
