import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { User, Phone, Mail, MapPin, Shield, Heart, AlertCircle, CheckCircle } from 'lucide-react-native';
import { apiService } from '../../services/api';
import { USUARIO_ACTUAL } from '../../config/usuario';

export default function ProfileScreen() {
  const [usuario, setUsuario] = useState<any>(null);
  const [poliza, setPoliza] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const data = await apiService.obtenerDatosUsuario(USUARIO_ACTUAL) as any;
      setUsuario(data.usuario);
      setPoliza(data.poliza);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  if (loading) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2', '#f093fb']} style={styles.gradient}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!usuario) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2', '#f093fb']} style={styles.gradient}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>No se pudieron cargar los datos</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2', '#f093fb']} style={styles.gradient}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
      <View style={styles.iconContainer}>
            <BlurView intensity={80} tint="light" style={styles.iconBlur}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.iconGradient}
              >
                <User size={60} color="#fff" strokeWidth={1.5} />
              </LinearGradient>
            </BlurView>
          </View>
          <Text style={styles.name}>{usuario.nombre}</Text>
          <Text style={styles.age}>{calcularEdad(usuario.fechaNacimiento)} años</Text>
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <View style={styles.infoCard}>
            <BlurView intensity={80} tint="light" style={styles.glassCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.glassGradient}
              >
                <Phone size={20} color="#fff" />
                <Text style={styles.infoText}>{usuario.telefono}</Text>
              </LinearGradient>
            </BlurView>
          </View>

          <View style={styles.infoCard}>
            <BlurView intensity={80} tint="light" style={styles.glassCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.glassGradient}
              >
                <Mail size={20} color="#fff" />
                <Text style={styles.infoText}>{usuario.email}</Text>
              </LinearGradient>
            </BlurView>
          </View>

          <View style={styles.infoCard}>
            <BlurView intensity={80} tint="light" style={styles.glassCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.glassGradient}
              >
                <MapPin size={20} color="#fff" />
                <Text style={styles.infoText}>{usuario.ubicacion.direccion}</Text>
              </LinearGradient>
            </BlurView>
          </View>
        </View>

        {poliza && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Póliza y Plan</Text>
            
            <View style={styles.card}>
              <BlurView intensity={80} tint="light" style={styles.glassCard}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
                  style={styles.glassGradient}
                >
                  <View style={styles.cardHeader}>
                    <Shield size={24} color="#fff" />
                    <Text style={styles.cardTitle}>Plan {poliza.plan}</Text>
                  </View>
                  <Text style={styles.cardSubtitle}>Póliza: {usuario.poliza}</Text>
                  <Text style={styles.cardSubtitle}>
                    Vigencia: {new Date(poliza.vigencia.inicio).toLocaleDateString()} - {new Date(poliza.vigencia.fin).toLocaleDateString()}
                  </Text>
                </LinearGradient>
              </BlurView>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfil de Salud</Text>
          
          <View style={styles.card}>
            <BlurView intensity={80} tint="light" style={styles.glassCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.glassGradient}
              >
                <View style={styles.cardHeader}>
                  <Heart size={24} color="#fff" />
                  <Text style={styles.cardTitle}>Información Médica</Text>
                </View>
                
                <View style={styles.healthInfo}>
                  <Text style={styles.healthLabel}>Grupo Sanguíneo:</Text>
                  <Text style={styles.healthValue}>{usuario.perfilSalud.grupoSanguineo}</Text>
                </View>

                <View style={styles.healthInfo}>
                  <Text style={styles.healthLabel}>IMC:</Text>
                  <Text style={styles.healthValue}>{usuario.perfilSalud.imc} ({usuario.perfilSalud.peso} kg / {usuario.perfilSalud.estatura} cm)</Text>
                </View>

                {usuario.perfilSalud.condicionesCronicas.length > 0 && (
                  <View style={styles.healthInfo}>
                    <Text style={styles.healthLabel}>Condiciones Crónicas:</Text>
                    {usuario.perfilSalud.condicionesCronicas.map((cond: string, index: number) => (
                      <Text key={index} style={styles.healthValue}>• {cond}</Text>
                    ))}
                  </View>
                )}

                {usuario.perfilSalud.alergias.length > 0 && (
                  <View style={styles.healthInfo}>
                    <Text style={styles.healthLabel}>Alergias:</Text>
                    {usuario.perfilSalud.alergias.map((alergia: string, index: number) => (
                      <Text key={index} style={[styles.healthValue, styles.alertText]}>⚠️ {alergia}</Text>
                    ))}
                  </View>
                )}
              </LinearGradient>
            </BlurView>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Onboarding</Text>
          
          <View style={styles.card}>
            <BlurView intensity={80} tint="light" style={styles.glassCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.glassGradient}
              >
                <View style={styles.cardHeader}>
                  {usuario.onboarding.completado ? (
                    <CheckCircle size={24} color="#4caf50" />
                  ) : (
                    <AlertCircle size={24} color="#ffaa00" />
                  )}
                  <Text style={styles.cardTitle}>
                    {usuario.onboarding.completado ? 'Completado' : 'Pendiente'}
                  </Text>
                </View>
                {usuario.onboarding.completado && (
                  <Text style={styles.cardSubtitle}>
                    Fecha: {new Date(usuario.onboarding.fecha!).toLocaleDateString()}
                  </Text>
                )}
              </LinearGradient>
            </BlurView>
      </View>
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
    backgroundColor: 'transparent',
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  iconBlur: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  age: {
    fontSize: 18,
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  infoCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  glassCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  glassGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
    fontWeight: '400',
  },
  healthInfo: {
    marginBottom: 12,
  },
  healthLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  healthValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  alertText: {
    color: '#ffeb3b',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
});
