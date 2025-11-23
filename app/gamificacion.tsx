import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Trophy, Award, Target, TrendingUp, Star } from 'lucide-react-native';
import { apiService } from '../services/api';
import { USUARIO_ACTUAL } from '../config/usuario';

export default function GamificacionScreen() {
  const [gamificacion, setGamificacion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarGamificacion();
  }, []);

  const cargarGamificacion = async () => {
    try {
      const data = await apiService.obtenerGamificacion(USUARIO_ACTUAL);
      setGamificacion(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la información de gamificación');
    } finally {
      setLoading(false);
    }
  };

  const getNivelNombre = (nivel: number) => {
    if (nivel <= 1) return 'Principiante';
    if (nivel <= 3) return 'Aprendiz';
    if (nivel <= 5) return 'Experto';
    if (nivel <= 7) return 'Maestro';
    return 'Leyenda';
  };

  const getNivelColor = (nivel: number) => {
    if (nivel <= 1) return '#999';
    if (nivel <= 3) return '#4caf50';
    if (nivel <= 5) return '#0066cc';
    if (nivel <= 7) return '#9c27b0';
    return '#ff9800';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (!gamificacion) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se pudo cargar la información</Text>
      </View>
    );
  }

  const nivel = gamificacion.nivel || 1;
  const puntosParaSiguienteNivel = nivel * 100;
  const progresoNivel = (gamificacion.puntos / puntosParaSiguienteNivel) * 100;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Trophy size={32} color="#fff" />
        <Text style={styles.title}>Gamificación</Text>
        <Text style={styles.subtitle}>Tu progreso y logros</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.nivelCard}>
          <View style={[styles.nivelBadge, { backgroundColor: `${getNivelColor(nivel)}20` }]}>
            <Text style={[styles.nivelNumero, { color: getNivelColor(nivel) }]}>
              Nivel {nivel}
            </Text>
          </View>
          <Text style={styles.nivelNombre}>{getNivelNombre(nivel)}</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(progresoNivel, 100)}%`, backgroundColor: getNivelColor(nivel) },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {gamificacion.puntos} / {puntosParaSiguienteNivel} puntos para el siguiente nivel
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <TrendingUp size={32} color="#0066cc" />
            <Text style={styles.statValue}>{gamificacion.rachaActual}</Text>
            <Text style={styles.statLabel}>Racha Actual</Text>
          </View>

          <View style={styles.statCard}>
            <Target size={32} color="#4caf50" />
            <Text style={styles.statValue}>{gamificacion.rachaMaxima}</Text>
            <Text style={styles.statLabel}>Racha Máxima</Text>
          </View>

          <View style={styles.statCard}>
            <Star size={32} color="#ff9800" />
            <Text style={styles.statValue}>{gamificacion.puntos}</Text>
            <Text style={styles.statLabel}>Puntos Totales</Text>
          </View>
        </View>
      </View>

      {gamificacion.medallas && gamificacion.medallas.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medallas Obtenidas</Text>
          
          <View style={styles.medallasContainer}>
            {gamificacion.medallas.map((medalla: string, index: number) => (
              <View key={index} style={styles.medallaCard}>
                <Award size={40} color="#ff9800" />
                <Text style={styles.medallaText}>{medalla}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {(!gamificacion.medallas || gamificacion.medallas.length === 0) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medallas</Text>
          <View style={styles.emptyMedallas}>
            <Award size={48} color="#ccc" />
            <Text style={styles.emptyText}>Aún no has obtenido medallas</Text>
            <Text style={styles.emptySubtext}>
              Mantén tu racha de adherencia para ganar medallas
            </Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consejos</Text>
        <View style={styles.consejosCard}>
          <Text style={styles.consejoText}>
            💡 Mantén tu racha tomando tus medicamentos a tiempo
          </Text>
          <Text style={styles.consejoText}>
            🎯 Cada día de adherencia te da 10 puntos
          </Text>
          <Text style={styles.consejoText}>
            🏆 Alcanza 7 días consecutivos para obtener "Semana Perfecta"
          </Text>
          <Text style={styles.consejoText}>
            ⭐ Alcanza 30 días consecutivos para obtener "Mes Perfecto"
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0066cc',
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  nivelCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nivelBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 12,
  },
  nivelNumero: {
    fontSize: 24,
    fontWeight: '700',
  },
  nivelNombre: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  medallasContainer: {
    gap: 12,
  },
  medallaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 16,
  },
  medallaText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  emptyMedallas: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  consejosCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  consejoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
  },
});

