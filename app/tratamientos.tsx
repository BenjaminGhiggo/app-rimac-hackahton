import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Pill, Plus, AlertTriangle, Trophy, TrendingUp } from 'lucide-react-native';
import { apiService } from '../services/api';
import { USUARIO_ACTUAL } from '../config/usuario';

export default function TratamientosScreen() {
  const router = useRouter();
  const [tratamientos, setTratamientos] = useState<any[]>([]);
  const [perfilRiesgo, setPerfilRiesgo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoTratamiento, setNuevoTratamiento] = useState({
    medicamento: '',
    dosis: '',
    frecuencia: 'diaria',
    indicaciones: '',
    hora: '08:00',
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [tratamientosData, riesgoData] = await Promise.all([
        apiService.obtenerTratamientos(USUARIO_ACTUAL),
        apiService.obtenerPerfilRiesgo(USUARIO_ACTUAL).catch(() => null),
      ]);
      setTratamientos(tratamientosData.tratamientos || []);
      setPerfilRiesgo(riesgoData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los tratamientos. Verifique que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const registrarToma = async (tratamientoId: string) => {
    try {
      await apiService.registrarAdherencia(tratamientoId, true);
      Alert.alert('Éxito', 'Toma registrada correctamente');
      cargarDatos();
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar la toma. Verifique que el backend esté corriendo.');
    }
  };

  const crearTratamiento = async () => {
    if (!nuevoTratamiento.medicamento || !nuevoTratamiento.dosis) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    try {
      await apiService.registrarTratamiento(USUARIO_ACTUAL, nuevoTratamiento);
      Alert.alert('Éxito', 'Tratamiento registrado correctamente');
      setModalVisible(false);
      setNuevoTratamiento({
        medicamento: '',
        dosis: '',
        frecuencia: 'diaria',
        indicaciones: '',
        hora: '08:00',
      });
      cargarDatos();
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el tratamiento');
    }
  };

  const getRiesgoColor = (riesgo: string) => {
    switch (riesgo) {
      case 'alto': return '#ff4444';
      case 'medio': return '#ffaa00';
      case 'bajo': return '#4caf50';
      default: return '#666';
    }
  };

  const renderGraficoAdherencia = (ultimos7Dias: boolean[]) => {
    return (
      <View style={styles.graficoContainer}>
        <Text style={styles.graficoLabel}>Últimos 7 días</Text>
        <View style={styles.graficoBars}>
          {ultimos7Dias.map((tomado, index) => (
            <View key={index} style={styles.graficoBarContainer}>
              <View
                style={[
                  styles.graficoBar,
                  {
                    height: tomado ? 40 : 10,
                    backgroundColor: tomado ? '#4caf50' : '#ff4444',
                  },
                ]}
              />
              <Text style={styles.graficoDia}>D{index + 1}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Cargando tratamientos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pill size={32} color="#fff" />
        <Text style={styles.title}>Mis Tratamientos</Text>
        <Text style={styles.subtitle}>Seguimiento de adherencia</Text>
      </View>

      {perfilRiesgo && perfilRiesgo.riesgoGeneral && (
        <View style={styles.section}>
          <View style={[styles.riesgoCard, { borderLeftColor: getRiesgoColor(perfilRiesgo.riesgoGeneral) }]}>
            <View style={styles.riesgoCardHeader}>
              <AlertTriangle size={24} color={getRiesgoColor(perfilRiesgo.riesgoGeneral)} />
              <Text style={[styles.riesgoCardTitle, { color: getRiesgoColor(perfilRiesgo.riesgoGeneral) }]}>
                Perfil de Riesgo: {perfilRiesgo.riesgoGeneral.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.riesgoCardText}>
              {perfilRiesgo.tratamientos.length} tratamiento{perfilRiesgo.tratamientos.length !== 1 ? 's' : ''} activo{perfilRiesgo.tratamientos.length !== 1 ? 's' : ''}
            </Text>
            {perfilRiesgo.requiereAtencion && (
              <Text style={styles.riesgoAlerta}>
                ⚠️ Se requiere atención médica
              </Text>
            )}
            {perfilRiesgo.alertas && perfilRiesgo.alertas.length > 0 && (
              <View style={styles.alertasContainer}>
                {perfilRiesgo.alertas.map((alerta: any, index: number) => (
                  <View key={index} style={styles.alertaItem}>
                    <Text style={styles.alertaTexto}>{alerta.mensaje}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      )}

      <ScrollView style={styles.scrollView}>
        {tratamientos.length === 0 ? (
          <View style={styles.empty}>
            <Pill size={64} color="#ccc" />
            <Text style={styles.emptyText}>No tiene tratamientos activos</Text>
            <Text style={styles.emptySubtext}>Registra un nuevo tratamiento para comenzar</Text>
          </View>
        ) : (
          <View style={styles.section}>
            {tratamientos.map((tratamiento) => (
              <View key={tratamiento.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.medicamento}>{tratamiento.medicamento}</Text>
                  <View style={[styles.riesgoBadge, { backgroundColor: getRiesgoColor(tratamiento.adherencia.riesgo) }]}>
                    <Text style={styles.riesgoText}>
                      {tratamiento.adherencia.riesgo.toUpperCase()}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.dosis}>{tratamiento.dosis}</Text>
                <Text style={styles.frecuencia}>{tratamiento.frecuencia}</Text>
                {tratamiento.indicaciones && (
                  <Text style={styles.indicaciones}>💡 {tratamiento.indicaciones}</Text>
                )}
                
                <View style={styles.adherencia}>
                  <View style={styles.adherenciaHeader}>
                    <Text style={styles.adherenciaLabel}>Adherencia</Text>
                    <Text style={styles.adherenciaPorcentaje}>
                      {tratamiento.adherencia.porcentaje}%
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${tratamiento.adherencia.porcentaje}%`,
                          backgroundColor: getRiesgoColor(tratamiento.adherencia.riesgo),
                        },
                      ]}
                    />
                  </View>
                  {renderGraficoAdherencia(tratamiento.adherencia.ultimos7Dias)}
                </View>

                <TouchableOpacity 
                  style={styles.button}
                  onPress={() => registrarToma(tratamiento.id)}
                >
                  <Text style={styles.buttonText}>✓ Registrar toma</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.gamificacionButton}
        onPress={() => router.push('/gamificacion' as any)}
      >
        <Trophy size={20} color="#fff" />
        <Text style={styles.gamificacionButtonText}>Gamificación</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Registrar Nuevo Tratamiento</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Medicamento *</Text>
              <TextInput
                style={styles.input}
                value={nuevoTratamiento.medicamento}
                onChangeText={(text) => setNuevoTratamiento({ ...nuevoTratamiento, medicamento: text })}
                placeholder="Ej: Losartan 50mg"
              />

              <Text style={styles.inputLabel}>Dosis *</Text>
              <TextInput
                style={styles.input}
                value={nuevoTratamiento.dosis}
                onChangeText={(text) => setNuevoTratamiento({ ...nuevoTratamiento, dosis: text })}
                placeholder="Ej: 1 tableta cada 24 horas"
              />

              <Text style={styles.inputLabel}>Frecuencia</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[styles.radioOption, nuevoTratamiento.frecuencia === 'diaria' && styles.radioOptionSelected]}
                  onPress={() => setNuevoTratamiento({ ...nuevoTratamiento, frecuencia: 'diaria' })}
                >
                  <Text style={[styles.radioText, nuevoTratamiento.frecuencia === 'diaria' && styles.radioTextSelected]}>
                    Diaria
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.radioOption, nuevoTratamiento.frecuencia === 'dos veces al día' && styles.radioOptionSelected]}
                  onPress={() => setNuevoTratamiento({ ...nuevoTratamiento, frecuencia: 'dos veces al día' })}
                >
                  <Text style={[styles.radioText, nuevoTratamiento.frecuencia === 'dos veces al día' && styles.radioTextSelected]}>
                    2x día
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Hora del recordatorio</Text>
              <TextInput
                style={styles.input}
                value={nuevoTratamiento.hora}
                onChangeText={(text) => setNuevoTratamiento({ ...nuevoTratamiento, hora: text })}
                placeholder="HH:MM (Ej: 08:00)"
              />

              <Text style={styles.inputLabel}>Indicaciones (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={nuevoTratamiento.indicaciones}
                onChangeText={(text) => setNuevoTratamiento({ ...nuevoTratamiento, indicaciones: text })}
                placeholder="Ej: Tomar con alimentos"
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity style={styles.crearButton} onPress={crearTratamiento}>
                <Text style={styles.crearButtonText}>Registrar Tratamiento</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
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
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  riesgoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  riesgoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  riesgoCardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  riesgoCardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  riesgoAlerta: {
    fontSize: 14,
    color: '#ff4444',
    fontWeight: '600',
    marginTop: 8,
  },
  alertasContainer: {
    marginTop: 12,
    gap: 8,
  },
  alertaItem: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#ffaa00',
  },
  alertaTexto: {
    fontSize: 14,
    color: '#856404',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  empty: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
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
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicamento: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  riesgoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  riesgoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  dosis: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  frecuencia: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  indicaciones: {
    fontSize: 14,
    color: '#0066cc',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  adherencia: {
    marginBottom: 16,
  },
  adherenciaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  adherenciaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  adherenciaPorcentaje: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  graficoContainer: {
    marginTop: 12,
  },
  graficoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  graficoBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 60,
  },
  graficoBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  graficoBar: {
    width: 20,
    borderRadius: 4,
    marginBottom: 4,
  },
  graficoDia: {
    fontSize: 10,
    color: '#666',
  },
  button: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gamificacionButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff9800',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gamificacionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  modalClose: {
    fontSize: 24,
    color: '#666',
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  radioOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  radioOptionSelected: {
    borderColor: '#0066cc',
    backgroundColor: '#e3f2fd',
  },
  radioText: {
    fontSize: 14,
    color: '#666',
  },
  radioTextSelected: {
    color: '#0066cc',
    fontWeight: '600',
  },
  crearButton: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  crearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
