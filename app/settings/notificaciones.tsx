import { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, SafeAreaView } from 'react-native';
import { Bell, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { RIMAC_COLORS } from '../../theme/colors';

export default function NotificacionesScreen() {
  const router = useRouter();
  const [notificaciones, setNotificaciones] = useState({
    recordatorios: true,
    citas: true,
    emergencias: true,
    bienestar: true,
    tratamientos: true,
    promociones: false,
  });

  const toggleNotificacion = (key: keyof typeof notificaciones) => {
    setNotificaciones((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationOptions = [
    {
      key: 'recordatorios',
      label: 'Recordatorios de medicación',
      description: 'Recibe recordatorios para tomar tus medicamentos',
    },
    {
      key: 'citas',
      label: 'Recordatorios de citas',
      description: 'Notificaciones sobre tus citas médicas',
    },
    {
      key: 'emergencias',
      label: 'Alertas de emergencia',
      description: 'Alertas importantes de emergencia',
    },
    {
      key: 'bienestar',
      label: 'Actualizaciones de bienestar',
      description: 'Actualizaciones sobre tu índice de bienestar',
    },
    {
      key: 'tratamientos',
      label: 'Seguimiento de tratamientos',
      description: 'Notificaciones sobre adherencia a tratamientos',
    },
    {
      key: 'promociones',
      label: 'Promociones y ofertas',
      description: 'Ofertas y promociones de servicios de salud',
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
            <Text style={styles.headerTitle}>Notificaciones</Text>
            <View style={styles.headerIcon}>
              <Bell size={24} color={RIMAC_COLORS.primary} strokeWidth={1.5} />
            </View>
          </View>
          <Text style={styles.headerSubtitle}>
            Gestiona qué notificaciones recibes en tu dispositivo
          </Text>
        </View>

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Important Notifications */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Importante</Text>
              <Text style={styles.sectionDescription}>
                No desactives estas notificaciones
              </Text>
            </View>
            {notificationOptions.slice(0, 3).map((option) => (
              <View key={option.key} style={styles.notificationOption}>
                <View style={styles.optionLeft}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>
                <Switch
                  value={notificaciones[option.key as keyof typeof notificaciones]}
                  onValueChange={() =>
                    toggleNotificacion(option.key as keyof typeof notificaciones)
                  }
                  trackColor={{ false: RIMAC_COLORS.gray[300], true: RIMAC_COLORS.primary }}
                  thumbColor={RIMAC_COLORS.white}
                />
              </View>
            ))}
          </View>

          {/* Optional Notifications */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Opcional</Text>
              <Text style={styles.sectionDescription}>
                Personaliza tu experiencia
              </Text>
            </View>
            {notificationOptions.slice(3).map((option) => (
              <View key={option.key} style={styles.notificationOption}>
                <View style={styles.optionLeft}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>
                <Switch
                  value={notificaciones[option.key as keyof typeof notificaciones]}
                  onValueChange={() =>
                    toggleNotificacion(option.key as keyof typeof notificaciones)
                  }
                  trackColor={{ false: RIMAC_COLORS.gray[300], true: RIMAC_COLORS.primary }}
                  thumbColor={RIMAC_COLORS.white}
                />
              </View>
            ))}
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 Puedes cambiar estas preferencias en cualquier momento desde la
              configuración de tu dispositivo
            </Text>
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
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  sectionDescription: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[500],
    fontWeight: '400',
  },

  /* Notification Options */
  notificationOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: RIMAC_COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: RIMAC_COLORS.gray[100],
  },
  optionLeft: {
    flex: 1,
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[900],
    marginBottom: 3,
  },
  optionDescription: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[500],
    fontWeight: '400',
    lineHeight: 16,
  },

  /* Info Box */
  infoBox: {
    marginHorizontal: 20,
    marginVertical: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: RIMAC_COLORS.primary + '08',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: RIMAC_COLORS.primary,
  },
  infoText: {
    fontSize: 13,
    color: RIMAC_COLORS.gray[700],
    fontWeight: '500',
    lineHeight: 18,
  },
});

