import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Lock, Shield, Eye, Database, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RIMAC_COLORS } from '../../theme/colors';

export default function PrivacidadScreen() {
  const opciones = [
    {
      icon: Shield,
      title: 'Datos de Salud',
      description: 'Cómo se utilizan y protegen tus datos médicos',
    },
    {
      icon: Eye,
      title: 'Visibilidad',
      description: 'Controla quién puede ver tu información',
    },
    {
      icon: Database,
      title: 'Almacenamiento',
      description: 'Gestiona el almacenamiento de tus datos',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[RIMAC_COLORS.white, '#F9FAFB']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.backButton} />
            <Text style={styles.headerTitle}>Privacidad</Text>
            <View style={styles.headerIcon}>
              <Lock size={24} color={RIMAC_COLORS.primary} strokeWidth={1.5} />
            </View>
          </View>
          <Text style={styles.headerSubtitle}>
            Gestiona tu privacidad y seguridad de forma segura
          </Text>
        </View>

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Privacy Options */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Configuración de Privacidad</Text>
            </View>

            {opciones.map((opcion, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionCard,
                  index === opciones.length - 1 && styles.lastCard,
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionLeft}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: RIMAC_COLORS.primary + '15' },
                      ]}
                    >
                      <opcion.icon
                        size={22}
                        color={RIMAC_COLORS.primary}
                        strokeWidth={1.5}
                      />
                    </View>
                    <View style={styles.optionTextContainer}>
                      <Text style={styles.optionTitle}>{opcion.title}</Text>
                      <Text style={styles.optionDescription}>
                        {opcion.description}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight
                    size={22}
                    color={RIMAC_COLORS.gray[400]}
                    strokeWidth={1.5}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Info Card */}
          <View style={styles.section}>
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Shield
                  size={28}
                  color={RIMAC_COLORS.primary}
                  strokeWidth={1.5}
                />
              </View>
              <Text style={styles.infoTitle}>Tu privacidad es nuestra prioridad</Text>
              <Text style={styles.infoText}>
                Todos tus datos de salud están protegidos con encriptación de nivel
                empresarial. Solo tú y tu equipo médico autorizado pueden acceder a
                esta información.
              </Text>
              <View style={styles.securityBadges}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>🔐 Encriptado</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>✓ HIPAA Compliant</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: RIMAC_COLORS.white,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  /* Header */
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: RIMAC_COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: RIMAC_COLORS.gray[100],
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: RIMAC_COLORS.primary,
    flex: 1,
    textAlign: 'center',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: RIMAC_COLORS.primary + '08',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 13,
    color: RIMAC_COLORS.gray[600],
    fontWeight: '400',
    lineHeight: 18,
  },

  /* Sections */
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[900],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  /* Option Cards */
  optionCard: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: RIMAC_COLORS.gray[200],
    overflow: 'hidden',
    marginBottom: 10,
  },
  lastCard: {
    marginBottom: 0,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[900],
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[500],
    fontWeight: '400',
    lineHeight: 16,
  },

  /* Info Card */
  infoCard: {
    backgroundColor: RIMAC_COLORS.primary + '08',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: RIMAC_COLORS.primary + '20',
  },
  infoHeader: {
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: RIMAC_COLORS.primary,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  infoText: {
    fontSize: 13,
    color: RIMAC_COLORS.gray[700],
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 12,
  },
  securityBadges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  badge: {
    backgroundColor: RIMAC_COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: RIMAC_COLORS.primary + '30',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: RIMAC_COLORS.primary,
  },
});

