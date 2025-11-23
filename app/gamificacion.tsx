import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { RIMAC_COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { ChevronLeft, Star, Zap, Trophy } from 'lucide-react-native';

const LOGROS_DATA = [
  {
    id: 1,
    titulo: '¡Bienvenida!',
    descripcion: 'Completa tu primer triaje de síntomas',
    icono: '🎯',
    obtenido: true,
    fecha: '15 Oct 2024',
    puntos: 50,
  },
  {
    id: 2,
    titulo: 'Asidua',
    descripcion: 'Completa 5 citas en el año',
    icono: '📅',
    obtenido: true,
    fecha: '2 Nov 2024',
    puntos: 100,
    progreso: 5,
    meta: 5,
  },
  {
    id: 3,
    titulo: 'Médica Responsable',
    descripcion: 'Toma todos tus medicamentos a tiempo (7 días)',
    icono: '💊',
    obtenido: true,
    fecha: '10 Nov 2024',
    puntos: 75,
    progreso: 7,
    meta: 7,
  },
  {
    id: 4,
    titulo: 'Experta en Salud',
    descripcion: 'Completa 10 consultas de IA',
    icono: '🧠',
    obtenido: false,
    puntos: 150,
    progreso: 7,
    meta: 10,
  },
  {
    id: 5,
    titulo: 'Comprometida',
    descripcion: 'Mantén 30 días sin faltar a citas',
    icono: '⭐',
    obtenido: false,
    puntos: 200,
    progreso: 15,
    meta: 30,
  },
  {
    id: 6,
    titulo: 'Campeona de Bienestar',
    descripcion: 'Alcanza índice de bienestar de 90+',
    icono: '🏆',
    obtenido: false,
    puntos: 250,
    progreso: 85,
    meta: 90,
  },
];

export default function GamificacionScreen() {
  const router = useRouter();

  const totalPuntosObtenidos = LOGROS_DATA.filter(l => l.obtenido).reduce((sum, l) => sum + l.puntos, 0);
  const logrosObtenidos = LOGROS_DATA.filter(l => l.obtenido).length;

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
        <Text style={styles.title}>Mis Logros</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* ESTADÍSTICAS GENERALES */}
        <View style={styles.statsGrid}>
          {/* Logros Obtenidos */}
          <View style={styles.statCard}>
            <Trophy size={28} color={RIMAC_COLORS.primary} />
            <Text style={styles.statValue}>{logrosObtenidos}</Text>
            <Text style={styles.statLabel}>Logros</Text>
          </View>

          {/* Puntos Totales */}
          <View style={styles.statCard}>
            <Zap size={28} color={RIMAC_COLORS.primary} />
            <Text style={styles.statValue}>{totalPuntosObtenidos}</Text>
            <Text style={styles.statLabel}>Puntos</Text>
          </View>

          {/* Nivel */}
          <View style={styles.statCard}>
            <Star size={28} color={RIMAC_COLORS.primary} />
            <Text style={styles.statValue}>Oro</Text>
            <Text style={styles.statLabel}>Nivel</Text>
          </View>
        </View>

        {/* LOGROS OBTENIDOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ Logros Obtenidos</Text>
          {LOGROS_DATA.filter(l => l.obtenido).map((logro) => (
            <View key={logro.id} style={styles.logroCard}>
              <View style={styles.logroLeft}>
                <Text style={styles.logroIcon}>{logro.icono}</Text>
                <View style={styles.logroInfo}>
                  <Text style={styles.logroTitulo}>{logro.titulo}</Text>
                  <Text style={styles.logroDescripcion}>{logro.descripcion}</Text>
                  <Text style={styles.logroFecha}>📅 {logro.fecha}</Text>
                </View>
              </View>
              <View style={styles.logroPuntos}>
                <Text style={styles.puntosBadge}>+{logro.puntos}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* PRÓXIMOS LOGROS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 En Progreso</Text>
          {LOGROS_DATA.filter(l => !l.obtenido).map((logro) => (
            <View key={logro.id} style={styles.proximoLogroCard}>
              <View style={styles.logroLeft}>
                <Text style={styles.logroIcon}>{logro.icono}</Text>
                <View style={styles.logroInfo}>
                  <Text style={styles.logroTitulo}>{logro.titulo}</Text>
                  <Text style={styles.logroDescripcion}>{logro.descripcion}</Text>
                  
                  {/* Progress Bar */}
                  <View style={styles.progressContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: `${(logro.progreso / logro.meta) * 100}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {logro.progreso} / {logro.meta}
                  </Text>
                </View>
              </View>
              <View style={styles.logroPuntos}>
                <Text style={styles.puntosFuturos}>+{logro.puntos}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* INFO ADICIONAL */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>💡 Sobre los Logros</Text>
            <Text style={styles.infoText}>
              Desbloquea logros completando acciones de salud.{'\n'}
              Cada logro te otorga puntos que puedes canjear por beneficios y descuentos.
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
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: RIMAC_COLORS.primary,
    marginVertical: SPACING.sm,
  },
  statLabel: {
    fontSize: 11,
    color: RIMAC_COLORS.gray[600],
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
    marginBottom: SPACING.lg,
  },
  logroCard: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  proximoLogroCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logroLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: SPACING.lg,
    alignItems: 'flex-start',
  },
  logroIcon: {
    fontSize: 32,
  },
  logroInfo: {
    flex: 1,
  },
  logroTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  logroDescripcion: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[600],
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  logroFecha: {
    fontSize: 11,
    color: RIMAC_COLORS.gray[500],
    fontWeight: '500',
  },
  progressContainer: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 3,
    marginBottom: SPACING.xs,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  logroPuntos: {
    alignItems: 'center',
  },
  puntosBadge: {
    fontSize: 13,
    fontWeight: '800',
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  puntosFuturos: {
    fontSize: 13,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.7)',
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
