import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { apiService } from '../../services/api';
import { USUARIO_ACTUAL } from '../../config/usuario';

export default function HomeScreen() {
  const router = useRouter();
  const [bienestar, setBienestar] = useState<any>(null);
  const [citas, setCitas] = useState<any[]>([]);
  const [tratamientos, setTratamientos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const handleTriaje = async () => {
    try {
      const resultado = await apiService.realizarTriaje({
        usuarioId: USUARIO_ACTUAL,
        sintomas: ['dolor de cabeza', 'fiebre'],
        descripcion: 'Dolor de cabeza desde esta mañana'
      });
      
      Alert.alert(
        'Resultado del Triaje',
        `${resultado.clasificacion.icono} ${resultado.clasificacion.recomendacion}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo realizar el triaje. Verifique que el backend esté corriendo.');
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [bienestarData, citasData, tratamientosData] = await Promise.all([
        apiService.obtenerBienestar(USUARIO_ACTUAL).catch(() => null),
        apiService.obtenerCitas(USUARIO_ACTUAL).catch(() => ({ citas: [] })),
        apiService.obtenerTratamientos(USUARIO_ACTUAL).catch(() => ({ tratamientos: [] })),
      ]);

      setBienestar(bienestarData);
      setCitas((citasData as any)?.citas || []);
      setTratamientos((tratamientosData as any)?.tratamientos || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencia = async () => {
    Alert.alert(
      '¿Activar Emergencia?',
      'Se enviará una alerta a la central RIMAC',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Activar',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.activarEmergencia(
                USUARIO_ACTUAL,
                ['dolor de pecho', 'dificultad para respirar'],
                'Dolor intenso en el pecho'
              );
              Alert.alert('Emergencia Activada', 'La central RIMAC ha sido notificada');
            } catch (error) {
              Alert.alert('Error', 'No se pudo activar la emergencia. Verifique que el backend esté corriendo.');
            }
          }
        }
      ]
    );
  };

  const getIndiceColor = (indice: number) => {
    if (indice >= 70) return '#4caf50';
    if (indice >= 50) return '#ffaa00';
    return '#ff4444';
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.brand}>Rimqhali.ai</Text>
            <Text style={styles.greeting}>Hola Brigitte 👋</Text>
            <Text style={styles.tagline}>Tu asistente de salud inteligente</Text>
          </View>
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={handleEmergencia}
            activeOpacity={0.8}
          >
            <BlurView intensity={80} tint="light" style={styles.glassCard}>
              <LinearGradient
                colors={['rgba(255, 68, 68, 0.3)', 'rgba(255, 68, 68, 0.1)']}
                style={styles.glassGradient}
              >
                <Text style={styles.actionIcon}>🚨</Text>
                <Text style={styles.actionTitle}>Emergencia</Text>
                <Text style={styles.actionSubtitle}>Activar alerta RIMAC</Text>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={handleTriaje}
            activeOpacity={0.8}
          >
            <BlurView intensity={80} tint="light" style={styles.glassCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.glassGradient}
              >
                <Text style={styles.actionIcon}>🏥</Text>
                <Text style={styles.actionTitle}>Triaje de Síntomas</Text>
                <Text style={styles.actionSubtitle}>Evaluar síntomas y obtener recomendación</Text>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resumen Rápido</Text>
              
              {bienestar && (
                <TouchableOpacity
                  style={styles.widgetCard}
                  onPress={() => router.push('/bienestar' as any)}
                  activeOpacity={0.8}
                >
                  <BlurView intensity={80} tint="light" style={styles.glassCard}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
                      style={styles.glassGradient}
                    >
                      <View style={styles.widgetHeader}>
                        <View style={styles.widgetIconContainer}>
                          <Text style={styles.widgetIcon}>📊</Text>
                        </View>
                        <View style={styles.widgetInfo}>
                          <Text style={styles.widgetTitle}>Índice de Bienestar</Text>
                          <Text style={styles.widgetSubtitle}>Última actualización</Text>
                        </View>
                        <View style={styles.widgetValue}>
                          <Text style={[styles.widgetNumber, { color: getIndiceColor(bienestar.indiceBienestar) }]}>
                            {bienestar.indiceBienestar}
                          </Text>
                          <Text style={styles.widgetUnit}>/100</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
              )}

              {citas.length > 0 && (
                <TouchableOpacity
                  style={styles.widgetCard}
                  onPress={() => router.push('/citas' as any)}
                  activeOpacity={0.8}
                >
                  <BlurView intensity={80} tint="light" style={styles.glassCard}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
                      style={styles.glassGradient}
                    >
                      <View style={styles.widgetHeader}>
                        <View style={styles.widgetIconContainer}>
                          <Text style={styles.widgetIcon}>📅</Text>
                        </View>
                        <View style={styles.widgetInfo}>
                          <Text style={styles.widgetTitle}>Próxima Cita</Text>
                          <Text style={styles.widgetSubtitle}>
                            {citas[0].especialidad} - {new Date(citas[0].fecha).toLocaleDateString()}
                          </Text>
                        </View>
                        <Text style={styles.widgetArrow}>›</Text>
                      </View>
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
              )}

              {tratamientos.length > 0 && (
                <TouchableOpacity
                  style={styles.widgetCard}
                  onPress={() => router.push('/tratamientos' as any)}
                  activeOpacity={0.8}
                >
                  <BlurView intensity={80} tint="light" style={styles.glassCard}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
                      style={styles.glassGradient}
                    >
                      <View style={styles.widgetHeader}>
                        <View style={styles.widgetIconContainer}>
                          <Text style={styles.widgetIcon}>💊</Text>
                        </View>
                        <View style={styles.widgetInfo}>
                          <Text style={styles.widgetTitle}>Tratamientos Activos</Text>
                          <Text style={styles.widgetSubtitle}>
                            {tratamientos.length} tratamiento{tratamientos.length !== 1 ? 's' : ''}
                          </Text>
                        </View>
                        <Text style={styles.widgetArrow}>›</Text>
                      </View>
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Módulos Disponibles</Text>
              
              <View style={styles.modulesGrid}>
                {[
                  { icon: '🩺', title: 'Triaje', route: '/triaje' },
                  { icon: '💊', title: 'Tratamientos', route: '/tratamientos' },
                  { icon: '📊', title: 'Bienestar', route: '/bienestar' },
                  { icon: '🎁', title: 'Beneficios', route: '/beneficios' },
                  { icon: '📅', title: 'Citas', route: '/citas' },
                  { icon: '🏆', title: 'Gamificación', route: '/gamificacion' },
                ].map((module, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.moduleCard}
                    onPress={() => router.push(module.route as any)}
                    activeOpacity={0.8}
                  >
                    <BlurView intensity={80} tint="light" style={styles.glassCard}>
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
                        style={styles.glassGradient}
                      >
                        <Text style={styles.moduleIcon}>{module.icon}</Text>
                        <Text style={styles.moduleTitle}>{module.title}</Text>
                      </LinearGradient>
                    </BlurView>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}
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
  headerContent: {
    zIndex: 2,
  },
  brand: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: -0.5,
  },
  greeting: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 4,
    fontWeight: '600',
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -50,
    right: -50,
    zIndex: 1,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: 100,
    right: 50,
    zIndex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionCard: {
    marginBottom: 16,
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
    padding: 24,
    borderRadius: 20,
  },
  actionIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moduleCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  moduleIcon: {
    fontSize: 36,
    marginBottom: 12,
    textAlign: 'center',
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  widgetCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
  widgetIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  widgetIcon: {
    fontSize: 24,
  },
  widgetInfo: {
    flex: 1,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  widgetSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  widgetValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  widgetNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  widgetUnit: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
    fontWeight: '500',
  },
  widgetArrow: {
    fontSize: 28,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '300',
  },
});
