import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import { Calendar, Clock, MapPin, User, Plus, X } from 'lucide-react-native';
import { apiService } from '../services/api';
import { USUARIO_ACTUAL } from '../config/usuario';

export default function CitasScreen() {
  const [citas, setCitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaCita, setNuevaCita] = useState({
    tipo: 'consulta',
    especialidad: '',
    fecha: '',
    hora: '',
    modalidad: 'presencial',
  });

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      const data = await apiService.obtenerCitas(USUARIO_ACTUAL) as any;
      setCitas(data.citas || []);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const agendarCita = async () => {
    if (!nuevaCita.especialidad || !nuevaCita.fecha || !nuevaCita.hora) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      await apiService.crearCita(USUARIO_ACTUAL, nuevaCita);
      Alert.alert('Éxito', 'Cita agendada correctamente');
      setModalVisible(false);
      setNuevaCita({
        tipo: 'consulta',
        especialidad: '',
        fecha: '',
        hora: '',
        modalidad: 'presencial',
      });
      cargarCitas();
    } catch (error) {
      Alert.alert('Error', 'No se pudo agendar la cita');
    }
  };

  const citasProgramadas = citas.filter(c => c.estado === 'programada');
  const citasPasadas = citas.filter(c => c.estado === 'completada' || new Date(`${c.fecha}T${c.hora}`) < new Date());

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'programada': return '#0066cc';
      case 'completada': return '#4caf50';
      case 'cancelada': return '#ff4444';
      default: return '#666';
    }
  };

  const renderCita = (cita: any) => (
    <View key={cita.id} style={styles.citaCard}>
      <View style={styles.citaHeader}>
        <View style={[styles.estadoBadge, { backgroundColor: `${getEstadoColor(cita.estado)}20` }]}>
          <Text style={[styles.estadoText, { color: getEstadoColor(cita.estado) }]}>
            {cita.estado.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.citaInfo}>
        <View style={styles.citaRow}>
          <Calendar size={18} color="#666" />
          <Text style={styles.citaText}>
            {new Date(cita.fecha).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </View>

        <View style={styles.citaRow}>
          <Clock size={18} color="#666" />
          <Text style={styles.citaText}>{cita.hora}</Text>
        </View>

        <View style={styles.citaRow}>
          <User size={18} color="#666" />
          <Text style={styles.citaText}>{cita.medico}</Text>
        </View>

        <View style={styles.citaRow}>
          <Text style={styles.citaLabel}>Especialidad:</Text>
          <Text style={styles.citaText}>{cita.especialidad}</Text>
        </View>

        <View style={styles.citaRow}>
          <Text style={styles.citaLabel}>Modalidad:</Text>
          <Text style={styles.citaText}>{cita.modalidad}</Text>
        </View>

        {cita.ubicacion && (
          <View style={styles.citaRow}>
            <MapPin size={18} color="#666" />
            <Text style={styles.citaText}>{cita.ubicacion}</Text>
          </View>
        )}

        {cita.link && (
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>🔗 Unirse a videollamada</Text>
          </TouchableOpacity>
        )}

        {cita.diagnostico && (
          <View style={styles.diagnosticoBox}>
            <Text style={styles.diagnosticoTitle}>Diagnóstico:</Text>
            <Text style={styles.diagnosticoText}>{cita.diagnostico}</Text>
          </View>
        )}

        {cita.recomendaciones && cita.recomendaciones.length > 0 && (
          <View style={styles.recomendacionesBox}>
            <Text style={styles.recomendacionesTitle}>Recomendaciones:</Text>
            {cita.recomendaciones.map((rec: string, index: number) => (
              <Text key={index} style={styles.recomendacionText}>• {rec}</Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Cargando citas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Calendar size={32} color="#fff" />
        <Text style={styles.title}>Mis Citas</Text>
        <Text style={styles.subtitle}>
          {citasProgramadas.length} programada{citasProgramadas.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {citasProgramadas.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Próximas Citas</Text>
            {citasProgramadas.map(renderCita)}
          </View>
        )}

        {citasPasadas.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Historial</Text>
            {citasPasadas.map(renderCita)}
          </View>
        )}

        {citas.length === 0 && (
          <View style={styles.emptyState}>
            <Calendar size={64} color="#ccc" />
            <Text style={styles.emptyText}>No tienes citas programadas</Text>
            <Text style={styles.emptySubtext}>Agenda una nueva cita para comenzar</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Plus size={24} color="#fff" />
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
              <Text style={styles.modalTitle}>Agendar Nueva Cita</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Tipo de Cita</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[styles.radioOption, nuevaCita.tipo === 'consulta' && styles.radioOptionSelected]}
                  onPress={() => setNuevaCita({ ...nuevaCita, tipo: 'consulta' })}
                >
                  <Text style={[styles.radioText, nuevaCita.tipo === 'consulta' && styles.radioTextSelected]}>
                    Consulta
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.radioOption, nuevaCita.tipo === 'telemedicina' && styles.radioOptionSelected]}
                  onPress={() => setNuevaCita({ ...nuevaCita, tipo: 'telemedicina', modalidad: 'virtual' })}
                >
                  <Text style={[styles.radioText, nuevaCita.tipo === 'telemedicina' && styles.radioTextSelected]}>
                    Telemedicina
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.radioOption, nuevaCita.tipo === 'chequeo' && styles.radioOptionSelected]}
                  onPress={() => setNuevaCita({ ...nuevaCita, tipo: 'chequeo' })}
                >
                  <Text style={[styles.radioText, nuevaCita.tipo === 'chequeo' && styles.radioTextSelected]}>
                    Chequeo
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Especialidad</Text>
              <TextInput
                style={styles.input}
                value={nuevaCita.especialidad}
                onChangeText={(text) => setNuevaCita({ ...nuevaCita, especialidad: text })}
                placeholder="Ej: Cardiología, Medicina General"
              />

              <Text style={styles.inputLabel}>Fecha</Text>
              <TextInput
                style={styles.input}
                value={nuevaCita.fecha}
                onChangeText={(text) => setNuevaCita({ ...nuevaCita, fecha: text })}
                placeholder="YYYY-MM-DD (Ej: 2024-04-15)"
              />

              <Text style={styles.inputLabel}>Hora</Text>
              <TextInput
                style={styles.input}
                value={nuevaCita.hora}
                onChangeText={(text) => setNuevaCita({ ...nuevaCita, hora: text })}
                placeholder="HH:MM (Ej: 10:00)"
              />

              <Text style={styles.inputLabel}>Modalidad</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[styles.radioOption, nuevaCita.modalidad === 'presencial' && styles.radioOptionSelected]}
                  onPress={() => setNuevaCita({ ...nuevaCita, modalidad: 'presencial' })}
                >
                  <Text style={[styles.radioText, nuevaCita.modalidad === 'presencial' && styles.radioTextSelected]}>
                    Presencial
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.radioOption, nuevaCita.modalidad === 'virtual' && styles.radioOptionSelected]}
                  onPress={() => setNuevaCita({ ...nuevaCita, modalidad: 'virtual' })}
                >
                  <Text style={[styles.radioText, nuevaCita.modalidad === 'virtual' && styles.radioTextSelected]}>
                    Virtual
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.agendarButton} onPress={agendarCita}>
                <Text style={styles.agendarButtonText}>Agendar Cita</Text>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  citaCard: {
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
  citaHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  citaInfo: {
    gap: 8,
  },
  citaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  citaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
  },
  citaText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  linkButton: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  linkText: {
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '600',
  },
  diagnosticoBox: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  diagnosticoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  diagnosticoText: {
    fontSize: 14,
    color: '#666',
  },
  recomendacionesBox: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  recomendacionesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  recomendacionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
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
  agendarButton: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  agendarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

