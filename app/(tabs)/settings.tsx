import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Bell, Lock, Globe, HelpCircle, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();

  const settingsOptions = [
    { icon: Bell, label: 'Notificaciones', color: '#FF9500', route: '/settings/notificaciones' },
    { icon: Lock, label: 'Privacidad', color: '#007AFF', route: '/settings/privacidad' },
    { icon: Globe, label: 'Idioma', color: '#34C759', route: '/settings/idioma' },
    { icon: HelpCircle, label: 'Ayuda', color: '#5856D6', route: '/settings/ayuda' },
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
          }
        }
      ]
    );
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2', '#f093fb']} style={styles.gradient}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Ajustes</Text>
          <Text style={styles.subtitle}>Rimqhali.ai</Text>
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
        </View>

        <View style={styles.section}>
          <View style={styles.optionsContainer}>
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionWrapper}
                onPress={() => handleOptionPress(option.route)}
                activeOpacity={0.8}
              >
                <BlurView intensity={80} tint="light" style={styles.glassCard}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
                    style={styles.glassGradient}
                  >
                    <View style={styles.optionLeft}>
                      <View style={[styles.iconContainer, { backgroundColor: `${option.color}30` }]}>
                        <option.icon size={24} color={option.color} />
                      </View>
                      <Text style={styles.optionLabel}>{option.label}</Text>
                    </View>
                    <Text style={styles.arrow}>›</Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.logoutButtonWrapper}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <BlurView intensity={80} tint="light" style={styles.glassCard}>
              <LinearGradient
                colors={['rgba(255, 68, 68, 0.3)', 'rgba(255, 68, 68, 0.1)']}
                style={styles.glassGradient}
              >
                <LogOut size={24} color="#ff4444" />
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        </View>
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
  header: {
    padding: 30,
    paddingTop: 70,
    position: 'relative',
    overflow: 'hidden',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -50,
    right: -50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: 100,
    right: 50,
  },
  section: {
    padding: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  glassCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  glassGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  arrow: {
    fontSize: 28,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '300',
  },
  logoutButtonWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.4)',
  },
  logoutText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    marginLeft: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
