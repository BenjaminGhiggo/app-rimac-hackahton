import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Lock, Globe, HelpCircle, LogOut, Settings, ChevronRight, Smartphone, Eye } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { RIMAC_COLORS } from '../../theme/colors';

export default function SettingsScreen() {
  const router = useRouter();

  const settingsOptions = [
    {
      icon: Bell,
      label: 'Notificaciones',
      description: 'Configura alertas y recordatorios',
      route: '/settings/notificaciones',
    },
    {
      icon: Lock,
      label: 'Privacidad y Seguridad',
      description: 'Protege tu información personal',
      route: '/settings/privacidad',
    },
    {
      icon: Globe,
      label: 'Idioma',
      description: 'Cambia el idioma de la app',
      route: '/settings/idioma',
    },
    {
      icon: Eye,
      label: 'Accesibilidad',
      description: 'Ajustes de visualización',
      route: '/settings/ayuda',
    },
    {
      icon: Smartphone,
      label: 'Sobre RIMAC Salud AI',
      description: 'Versión 1.0.0 • Información legal',
      route: '/settings/ayuda',
    },
  ];

  const handleOptionPress = (route: string) => {
    router.push(route as any);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[RIMAC_COLORS.white, '#F9FAFB']}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Ajustes</Text>
                <Text style={styles.subtitle}>Configura tu experiencia en RIMAC Salud AI</Text>
              </View>
              <View style={styles.headerIcon}>
                <Settings size={28} color={RIMAC_COLORS.primary} strokeWidth={1.5} />
              </View>
            </View>
          </View>

          {/* Settings Options */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Preferencias</Text>
            </View>
            <View style={styles.optionsContainer}>
              {settingsOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionCard,
                    index === settingsOptions.length - 1 && styles.lastCard,
                  ]}
                  onPress={() => handleOptionPress(option.route)}
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
                        <option.icon
                          size={22}
                          color={RIMAC_COLORS.primary}
                          strokeWidth={1.5}
                        />
                      </View>
                      <View style={styles.optionTextContainer}>
                        <Text style={styles.optionLabel}>{option.label}</Text>
                        <Text style={styles.optionDescription}>
                          {option.description}
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
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Account Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cuenta</Text>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={styles.logoutContent}>
                <View
                  style={[
                    styles.logoutIconContainer,
                    { backgroundColor: '#EF4444' + '15' },
                  ]}
                >
                  <LogOut size={22} color="#EF4444" strokeWidth={1.5} />
                </View>
                <View style={styles.logoutTextContainer}>
                  <Text style={styles.logoutLabel}>Cerrar Sesión</Text>
                  <Text style={styles.logoutDescription}>
                    Sal de tu cuenta de forma segura
                  </Text>
                </View>
              </View>
              <ChevronRight
                size={22}
                color={RIMAC_COLORS.gray[400]}
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          </View>

          {/* Footer Info */}
          <View style={styles.footerContainer}>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>RIMAC Salud AI v1.0.0</Text>
            </View>
            <Text style={styles.footerText}>
              Plataforma de salud inteligente {'\n'}
              Con orientación médica por IA
            </Text>
            <View style={styles.footerLinks}>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Términos y Condiciones</Text>
              </TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Privacidad</Text>
              </TouchableOpacity>
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
    paddingVertical: 24,
    backgroundColor: RIMAC_COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: RIMAC_COLORS.gray[100],
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: RIMAC_COLORS.primary,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: RIMAC_COLORS.gray[600],
    fontWeight: '400',
    lineHeight: 20,
  },
  headerIcon: {
    marginLeft: 16,
    padding: 12,
    backgroundColor: RIMAC_COLORS.primary + '08',
    borderRadius: 12,
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
    color: RIMAC_COLORS.gray[700],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  /* Options Container */
  optionsContainer: {
    gap: 10,
  },
  optionCard: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: RIMAC_COLORS.gray[200],
    overflow: 'hidden',
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
  optionLabel: {
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

  /* Divider */
  divider: {
    height: 1,
    backgroundColor: RIMAC_COLORS.gray[100],
    marginHorizontal: 20,
    marginVertical: 8,
  },

  /* Logout Section */
  logoutButton: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EF4444' + '20',
    overflow: 'hidden',
  },
  logoutContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  logoutIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  logoutTextContainer: {
    flex: 1,
  },
  logoutLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 2,
  },
  logoutDescription: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[500],
    fontWeight: '400',
    lineHeight: 16,
  },

  /* Footer */
  footerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginTop: 16,
  },
  versionBadge: {
    backgroundColor: RIMAC_COLORS.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
    color: RIMAC_COLORS.primary,
    letterSpacing: 0.3,
  },
  footerText: {
    fontSize: 13,
    color: RIMAC_COLORS.gray[600],
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 14,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },
  footerLink: {
    fontSize: 12,
    color: RIMAC_COLORS.primary,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  footerDot: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[400],
    fontWeight: '300',
  },
});
