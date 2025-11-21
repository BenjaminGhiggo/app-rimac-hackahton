import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Heart, TrendingUp, Activity, Moon, Smile } from 'lucide-react-native';
import { apiService } from '../services/api';
import { USUARIO_ACTUAL } from '../config/usuario';

export default function BienestarScreen() {
  const [bienestar, setBienestar] = useState<any>(null);
  const [timeline, setTimeline] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sentimiento, setSentimiento] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [bienestarData, timelineData] = await Promise.all([
        apiService.obtenerBienestar(USUARIO_ACTUAL),
        apiService.obtenerTimelineAnimo(USUARIO_ACTUAL).catch(() => null),
      ]);
      setBienestar(bienestarData);
      setTimeline(timelineData);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el índice de bienestar. Verifique que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const registrarSentimiento = async (sent: string, score: number) => {
    try {
      await apiService.registrarSentimiento(USUARIO_ACTUAL, sent, score);
      setSentimiento(sent);
      cargarDatos();
      Alert.alert('Éxito', 'Sentimiento registrado');
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el sentimiento. Verifique que el backend esté corriendo.');
    }
  };

  const getIndiceColor = (indice: number) => {
    if (indice >= 70) return '#4caf50';
    if (indice >= 50) return '#ffaa00';
    return '#ff4444';
  };

  const renderGraficoTendencias = (tendencias: any[]) => {
    if (!tendencias || tendencias.length === 0) return null;

    const maxValor = Math.max(...tendencias.map(t => t.valor), 100);
    const minValor = Math.min(...tendencias.map(t => t.valor), 0);

    return (
      <View style={styles.graficoContainer}>
        <Text style={styles.graficoTitle}>Tendencia del Índice</Text>
        <View style={styles.graficoBars}>
          {tendencias.map((tendencia, index) => {
            const altura = ((tendencia.valor - minValor) / (maxValor - minValor)) * 100;
            return (
              <View key={index} style={styles.graficoBarContainer}>
                <View
                  style={[
                    styles.graficoBar,
                    {
                      height: `${altura}%`,
                      backgroundColor: getIndiceColor(tendencia.valor),
                    },
                  ]}
                />
                <Text style={styles.graficoLabel}>
                  {new Date(tendencia.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                </Text>
                <Text style={styles.graficoValor}>{tendencia.valor}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderGraficoPasos = (pasos: number[]) => {
    if (!pasos || pasos.length === 0) return null;

    const maxPasos = Math.max(...pasos, 10000);

    return (
      <View style={styles.graficoContainer}>
        <Text style={styles.graficoTitle}>Pasos - Última Semana</Text>
        <View style={styles.graficoBars}>
          {pasos.map((paso, index) => {
            const altura = (paso / maxPasos) * 100;
            return (
              <View key={index} style={styles.graficoBarContainer}>
                <View
                  style={[
                    styles.graficoBar,
                    {
                      height: `${altura}%`,
                      backgroundColor: paso >= 8000 ? '#4caf50' : paso >= 5000 ? '#ffaa00' : '#ff4444',
                    },
                  ]}
                />
                <Text style={styles.graficoLabel}>D{index + 1}</Text>
                <Text style={styles.graficoValor}>{paso}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderGraficoSueño = (sueño: number[]) => {
    if (!sueño || sueño.length === 0) return null;

    return (
      <View style={styles.graficoContainer}>
        <Text style={styles.graficoTitle}>Horas de Sueño - Última Semana</Text>
        <View style={styles.graficoBars}>
          {sueño.map((horas, index) => {
            const altura = (horas / 10) * 100;
            return (
              <View key={index} style={styles.graficoBarContainer}>
                <View
                  style={[
                    styles.graficoBar,
                    {
                      height: `${altura}%`,
                      backgroundColor: horas >= 7 ? '#4caf50' : horas >= 6 ? '#ffaa00' : '#ff4444',
                    },
                  ]}
                />
                <Text style={styles.graficoLabel}>D{index + 1}</Text>
                <Text style={styles.graficoValor}>{horas.toFixed(1)}h</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Heart size={32} color="#fff" />
        <Text style={styles.title}>Índice de Bienestar</Text>
        <Text style={styles.subtitle}>Tu salud en un vistazo</Text>
      </View>

      {bienestar && (
        <>
          <View style={styles.section}>
            <View style={styles.indiceCard}>
              <Text style={styles.indiceLabel}>Índice Actual</Text>
              <Text style={[styles.indiceValor, { color: getIndiceColor(bienestar.indiceBienestar) }]}>
                {bienestar.indiceBienestar}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${bienestar.indiceBienestar}%`,
                      backgroundColor: getIndiceColor(bienestar.indiceBienestar),
                    },
                  ]}
                />
              </View>
              <Text style={styles.indiceDescripcion}>
                {bienestar.indiceBienestar >= 70
                  ? 'Excelente estado de bienestar'
                  : bienestar.indiceBienestar >= 50
                  ? 'Buen estado de bienestar'
                  : 'Necesita mejorar el bienestar'}
              </Text>
            </View>
          </View>

          {bienestar.tendencias && bienestar.tendencias.length > 0 && (
            <View style={styles.section}>
              {renderGraficoTendencias(bienestar.tendencias)}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estado de Ánimo</Text>
            
            <View style={styles.sentimientoCard}>
              <View style={styles.sentimientoHeader}>
                <Smile size={24} color="#0066cc" />
                <Text style={styles.sentimientoLabel}>Estado Actual</Text>
              </View>
              <Text style={styles.sentimientoValor}>
                {bienestar.sentimiento?.ultimo === 'positivo' ? '😊 Positivo' :
                 bienestar.sentimiento?.ultimo === 'negativo' ? '😔 Negativo' : '😐 Neutral'}
              </Text>
              
              <Text style={styles.registrarLabel}>¿Cómo te sientes hoy?</Text>
              <View style={styles.sentimientosButtons}>
                <TouchableOpacity
                  style={[styles.sentimientoButton, sentimiento === 'positivo' && styles.sentimientoButtonActive]}
                  onPress={() => registrarSentimiento('positivo', 0.7)}
                >
                  <Text style={styles.sentimientoButtonText}>😊 Bien</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sentimientoButton, sentimiento === 'neutral' && styles.sentimientoButtonActive]}
                  onPress={() => registrarSentimiento('neutral', 0.5)}
                >
                  <Text style={styles.sentimientoButtonText}>😐 Regular</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sentimientoButton, sentimiento === 'negativo' && styles.sentimientoButtonActive]}
                  onPress={() => registrarSentimiento('negativo', 0.3)}
                >
                  <Text style={styles.sentimientoButtonText}>😔 Mal</Text>
                </TouchableOpacity>
              </View>
            </View>

            {timeline && timeline.timeline && timeline.timeline.length > 0 && (
              <View style={styles.timelineCard}>
                <Text style={styles.timelineTitle}>Timeline de Ánimo</Text>
                {timeline.timeline.slice(0, 7).map((item: any, index: number) => (
                  <View key={index} style={styles.timelineItem}>
                    <Text style={styles.timelineIcon}>{item.icono}</Text>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineFecha}>
                        {new Date(item.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </Text>
                      <Text style={styles.timelineSentimiento}>
                        {item.sentimiento.charAt(0).toUpperCase() + item.sentimiento.slice(1)} ({(item.score * 100).toFixed(0)}%)
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {bienestar.actividadFisica && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Actividad Física</Text>
              
              <View style={styles.metricaCard}>
                <View style={styles.metricaHeader}>
                  <Activity size={24} color="#0066cc" />
                  <Text style={styles.metricaTitle}>Resumen Semanal</Text>
                </View>
                <View style={styles.metricaStats}>
                  <View style={styles.metricaStat}>
                    <Text style={styles.metricaValor}>{bienestar.actividadFisica.pasosPromedio.toLocaleString()}</Text>
                    <Text style={styles.metricaLabel}>Pasos promedio</Text>
                  </View>
                  <View style={styles.metricaStat}>
                    <Text style={styles.metricaValor}>{bienestar.actividadFisica.minutosEjercicio}</Text>
                    <Text style={styles.metricaLabel}>Minutos ejercicio</Text>
                  </View>
                </View>
                {renderGraficoPasos(bienestar.actividadFisica.ultimaSemana)}
              </View>
            </View>
          )}

          {bienestar.sueño && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sueño</Text>
              
              <View style={styles.metricaCard}>
                <View style={styles.metricaHeader}>
                  <Moon size={24} color="#0066cc" />
                  <Text style={styles.metricaTitle}>Resumen Semanal</Text>
                </View>
                <View style={styles.metricaStats}>
                  <View style={styles.metricaStat}>
                    <Text style={styles.metricaValor}>{bienestar.sueño.horasPromedio.toFixed(1)}h</Text>
                    <Text style={styles.metricaLabel}>Horas promedio</Text>
                  </View>
                  <View style={styles.metricaStat}>
                    <Text style={[styles.metricaValor, { fontSize: 18 }]}>
                      {bienestar.sueño.calidad}
                    </Text>
                    <Text style={styles.metricaLabel}>Calidad</Text>
                  </View>
                </View>
                {renderGraficoSueño(bienestar.sueño.ultimaSemana)}
              </View>
            </View>
          )}

          {bienestar.recomendaciones && bienestar.recomendaciones.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recomendaciones</Text>
              <View style={styles.recomendacionesCard}>
                {bienestar.recomendaciones.map((rec: string, index: number) => (
                  <View key={index} style={styles.recomendacion}>
                    <Text style={styles.recomendacionIcon}>💡</Text>
                    <Text style={styles.recomendacionTexto}>{rec}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </>
      )}
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  indiceCard: {
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
  indiceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  indiceValor: {
    fontSize: 64,
    fontWeight: '700',
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  indiceDescripcion: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  sentimientoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sentimientoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  sentimientoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sentimientoValor: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  registrarLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  sentimientosButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  sentimientoButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  sentimientoButtonActive: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#0066cc',
  },
  sentimientoButtonText: {
    fontSize: 14,
    color: '#333',
  },
  timelineCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  timelineIcon: {
    fontSize: 24,
  },
  timelineContent: {
    flex: 1,
  },
  timelineFecha: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timelineSentimiento: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  metricaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  metricaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  metricaStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  metricaStat: {
    alignItems: 'center',
  },
  metricaValor: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  metricaLabel: {
    fontSize: 12,
    color: '#666',
  },
  graficoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  graficoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  graficoBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
  },
  graficoBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  graficoBar: {
    width: 24,
    borderRadius: 4,
    marginBottom: 4,
    minHeight: 10,
  },
  graficoLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  graficoValor: {
    fontSize: 10,
    color: '#333',
    fontWeight: '600',
    marginTop: 2,
  },
  recomendacionesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recomendacion: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
    gap: 12,
  },
  recomendacionIcon: {
    fontSize: 20,
  },
  recomendacionTexto: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
