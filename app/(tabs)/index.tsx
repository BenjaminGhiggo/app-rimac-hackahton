import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { apiService } from '../../services/api';
import { USUARIO_ACTUAL } from '../../config/usuario';
import { RIMAC_COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import { ChevronRight, Heart, TrendingUp, Clock, MapPin, FileText, AlertCircle } from 'lucide-react-native';

// Datos de usuario para demo
const USER_DATA = {
  nombre: 'Marisol',
  apellido: 'Herrera Bruno',
  edad: 47,
  puntos: 2850,
  proximaCita: {
    especialista: 'Dr. Rafael Montoya',
    especialidad: 'Cardiología',
    fecha: '28 de noviembre',
    hora: '14:30',
    clinica: 'Clínica Privada RIMAC',
  },
  cuidador: {
    nombre: 'Brigitte Chavez Herrera',
    relacion: 'Hija',
    activo: true,
  },
  indiceBienestar: 85,
  medicamentosActivos: 2,
};

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bienestar, setBienestar] = useState<any>(null);
  const [citas, setCitas] = useState<any[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = useCallback(async () => {
    try {
      const [bienestarData, citasData] = await Promise.all([
        apiService.obtenerBienestar(USUARIO_ACTUAL),
        apiService.obtenerCitas(USUARIO_ACTUAL),
      ]);

      setBienestar(bienestarData);
      setCitas((citasData as any)?.citas || []);
    } catch (error) {
      console.warn('⚠️ No se pudieron cargar todos los datos. Usando demostración.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getIndiceColor = useCallback((indice: number) => {
    if (indice >= 70) return '#10B981';
    if (indice >= 50) return '#F59E0B';
    return '#EF4444';
  }, []);

  const getIndiceLabel = useCallback((indice: number) => {
    if (indice >= 80) return 'Excelente';
    if (indice >= 60) return 'Bueno';
    if (indice >= 40) return 'Normal';
    return 'Requiere atención';
  }, []);

  return (
    <LinearGradient
      colors={[RIMAC_COLORS.primary, RIMAC_COLORS.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* APP NAME - Logo y Nombre */}
        <View style={styles.appHeader}>
          <Text style={styles.appLogo}>🏥</Text>
          <Text style={styles.appName}>RIMAC Salud AI</Text>
          <Text style={styles.appTagline}>Asistente médico inteligente</Text>
        </View>

        {/* HEADER - Bienvenida personalizada */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, {USER_DATA.nombre} 👋</Text>
          <Text style={styles.tagline}>Tu asistente de salud integral</Text>
        </View>

        {/* CARD PRINCIPAL - Triaje de Síntomas (CTA) */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.triageCard}
            onPress={() => router.push('/triaje' as any)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.triageContent}
            >
              <View style={styles.triageHeader}>
                <View style={styles.triageIconContainer}>
                  <Text style={styles.triageIcon}>🏥</Text>
                </View>
                <View style={styles.triageTextContainer}>
                  <Text style={styles.triageTitle}>Evalúa tus Síntomas</Text>
                  <Text style={styles.triageSubtitle}>
                    Triaje inteligente con IA médica
                  </Text>
                </View>
              </View>
              <View style={styles.triageFeatures}>
                <Text style={styles.triageFeature}>
                  ✓ Análisis de síntomas en tiempo real
                </Text>
                <Text style={styles.triageFeature}>
                  ✓ Recomendación de especialidad
                </Text>
                <Text style={styles.triageFeature}>
                  ✓ Nivel de urgencia evaluado
                </Text>
              </View>
              <View style={styles.triageFooter}>
                <Text style={styles.triageAction}>Iniciar evaluación →</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* RIMAC POINTS - Destacado */}
        <View style={styles.section}>
          <View style={styles.pointsCard}>
            <View style={styles.pointsHeader}>
              <View>
                <Text style={styles.pointsLabel}>🏆 RIMAC POINTS</Text>
                <Text style={styles.pointsValue}>{USER_DATA.puntos.toLocaleString()}</Text>
              </View>
              <View style={styles.pointsBadge}>
                <Text style={styles.pointsBadgeText}>Oro</Text>
              </View>
            </View>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsText}>
                💰 15% descuento en servicios médicos
              </Text>
              <Text style={styles.pointsText}>
                📅 Vigente hasta diciembre 2025
              </Text>
            </View>
          </View>
        </View>

        {/* PRÓXIMA CITA - Urgente */}
        {citas.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Tu Próxima Cita</Text>
            
            <TouchableOpacity 
              style={styles.citaCard}
              onPress={() => router.push('/citas' as any)}
              activeOpacity={0.8}
            >
              <View style={styles.citaLeft}>
                <View style={styles.citaBadge}>
                  <Text style={styles.citaBadgeText}>{citas[0]?.especialidad}</Text>
                </View>
                <Text style={styles.citaDoctor}>{citas[0]?.doctor}</Text>
                <Text style={styles.citaDate}>{citas[0]?.fecha}</Text>
              </View>
              <View style={styles.citaRight}>
                <Text style={styles.citaTime}>🕐 {citas[0]?.hora}</Text>
                <ChevronRight size={24} color={RIMAC_COLORS.white} />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* RESUMEN DE SALUD */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❤️ Resumen de Salud</Text>
          
          <View style={styles.healthGrid}>
            {/* Índice de Bienestar */}
            <TouchableOpacity 
              style={styles.healthCard}
              onPress={() => router.push('/bienestar' as any)}
              activeOpacity={0.8}
            >
              <View style={styles.healthCardContent}>
                <Text style={styles.healthIcon}>📊</Text>
                <Text style={styles.healthLabel}>Bienestar</Text>
                <Text 
                  style={[
                    styles.healthValue,
                    { color: getIndiceColor(USER_DATA.indiceBienestar) }
                  ]}
                >
                  {USER_DATA.indiceBienestar}
                </Text>
                <Text style={styles.healthStatus}>
                  {getIndiceLabel(USER_DATA.indiceBienestar)}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Medicamentos */}
            <TouchableOpacity 
              style={styles.healthCard}
              onPress={() => router.push('/tratamientos' as any)}
              activeOpacity={0.8}
            >
              <View style={styles.healthCardContent}>
                <Text style={styles.healthIcon}>💊</Text>
                <Text style={styles.healthLabel}>Medicamentos</Text>
                <Text style={styles.healthValue}>
                  {USER_DATA.medicamentosActivos}
                </Text>
                <Text style={styles.healthStatus}>Activos</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* INFORMACIÓN DEL CUIDADOR */}
        {USER_DATA.cuidador.activo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👨‍👩‍👧 Tu Cuidador</Text>
            
            <View style={styles.cuidadorCard}>
              <View style={styles.cuidadorInfo}>
                <View style={styles.cuidadorAvatar}>
                  <Text style={styles.cuidadorLetter}>
                    {USER_DATA.cuidador.nombre.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.cuidadorName}>{USER_DATA.cuidador.nombre}</Text>
                  <Text style={styles.cuidadorRelation}>
                    {USER_DATA.cuidador.relacion}
                  </Text>
                  <Text style={styles.cuidadorStatus}>
                    ✓ Recibe notificaciones de citas
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* RESUMEN MÉDICO PARA COMPARTIR */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📄 Resumen para Médico</Text>
          
          <TouchableOpacity 
            style={styles.summaryCard}
            activeOpacity={0.8}
          >
            <View style={styles.summaryContent}>
              <FileText size={24} color={RIMAC_COLORS.primary} />
              <View style={styles.summaryText}>
                <Text style={styles.summaryTitle}>Generar Resumen</Text>
                <Text style={styles.summarySub}>
                  Historial médico para llevar a consulta
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* CLÍNICAS CERCANAS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏥 Clínicas Cercanas</Text>
          
          <View style={styles.clinicsContainer}>
            <TouchableOpacity style={styles.clinicCard} activeOpacity={0.8}>
              <Text style={styles.clinicIcon}>🏥</Text>
              <Text style={styles.clinicName}>Clínica Privada</Text>
              <Text style={styles.clinicDistance}>2.3 km</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clinicCard} activeOpacity={0.8}>
              <Text style={styles.clinicIcon}>🏥</Text>
              <Text style={styles.clinicName}>Hospital General</Text>
              <Text style={styles.clinicDistance}>5.1 km</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ACCESO RÁPIDO A MÓDULOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Acceso Rápido</Text>
          
          {/* Primera fila */}
          <View style={styles.modulesRow}>
            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => router.push('/citas' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.moduleIcon}>📅</Text>
              <Text style={styles.moduleTitle}>Agendar Cita</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => router.push('/beneficios' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.moduleIcon}>🎁</Text>
              <Text style={styles.moduleTitle}>Beneficios</Text>
            </TouchableOpacity>
          </View>

          {/* Segunda fila */}
          <View style={styles.modulesRow}>
            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => router.push('/gamificacion' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.moduleIcon}>🏆</Text>
              <Text style={styles.moduleTitle}>Logros</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => router.push('/(tabs)/settings' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.moduleIcon}>⚙️</Text>
              <Text style={styles.moduleTitle}>Configuración</Text>
            </TouchableOpacity>
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
  container: {
    flex: 1,
  },

  /* APP HEADER */
  appHeader: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 50,
    paddingBottom: SPACING.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  appLogo: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: RIMAC_COLORS.white,
    marginBottom: SPACING.xs,
    letterSpacing: -0.5,
    fontStyle: 'italic',
    fontFamily: 'System',
  },
  appTagline: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontFamily: 'System',
  },

  /* HEADER */
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: RIMAC_COLORS.white,
    marginBottom: SPACING.sm,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },

  /* SECTION */
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
    marginBottom: SPACING.md,
  },

  /* TRIAJE CARD - Principal CTA */
  triageCard: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  triageContent: {
    padding: SPACING.lg,
  },
  triageHeader: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  triageIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triageIcon: {
    fontSize: 32,
  },
  triageTextContainer: {
    flex: 1,
  },
  triageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
    marginBottom: SPACING.xs,
  },
  triageSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  triageFeatures: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  triageFeature: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  triageFooter: {
    alignItems: 'center',
  },
  triageAction: {
    fontSize: 14,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
  },

  /* POINTS CARD */
  pointsCard: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: RIMAC_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  pointsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[600],
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: '800',
    color: RIMAC_COLORS.primary,
  },
  pointsBadge: {
    backgroundColor: '#FFD700',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  pointsBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: RIMAC_COLORS.primary,
  },
  pointsInfo: {
    borderTopWidth: 1,
    borderTopColor: RIMAC_COLORS.gray[200],
    paddingTop: SPACING.lg,
  },
  pointsText: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[700],
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },

  /* CITA CARD */
  citaCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  citaLeft: {
    flex: 1,
  },
  citaRight: {
    alignItems: 'flex-end',
    gap: SPACING.sm,
  },
  citaBadge: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.sm,
    alignSelf: 'flex-start',
  },
  citaBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: RIMAC_COLORS.primary,
  },
  citaDoctor: {
    fontSize: 15,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
    marginBottom: SPACING.xs,
  },
  citaDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  citaTime: {
    fontSize: 13,
    fontWeight: '600',
    color: RIMAC_COLORS.white,
  },

  /* HEALTH GRID */
  healthGrid: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  healthCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  healthCardContent: {
    alignItems: 'center',
    width: '100%',
  },
  healthIcon: {
    fontSize: 32,
    marginBottom: SPACING.md,
  },
  healthLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: SPACING.sm,
  },
  healthValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  healthStatus: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },

  /* CUIDADOR CARD */
  cuidadorCard: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: RIMAC_COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cuidadorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  cuidadorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: RIMAC_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cuidadorLetter: {
    fontSize: 20,
    fontWeight: '800',
    color: RIMAC_COLORS.white,
  },
  cuidadorName: {
    fontSize: 14,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  cuidadorRelation: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[600],
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  cuidadorStatus: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },

  /* SUMMARY CARD */
  summaryCard: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: RIMAC_COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  summaryText: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  summarySub: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[600],
    fontWeight: '500',
  },

  /* CLINICS */
  clinicsContainer: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  clinicCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  clinicIcon: {
    fontSize: 32,
    marginBottom: SPACING.md,
  },
  clinicName: {
    fontSize: 12,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  clinicDistance: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },

  /* MODULES GRID */
  modulesRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  moduleCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minHeight: 140,
    shadowColor: RIMAC_COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  moduleIcon: {
    fontSize: 40,
    marginBottom: SPACING.lg,
  },
  moduleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
    textAlign: 'center',
    lineHeight: 18,
  },
});
