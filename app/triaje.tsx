import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { History, Calendar } from 'lucide-react-native';
import { apiService } from '../services/api';
import { USUARIO_ACTUAL } from '../config/usuario';

export default function TriajeScreen() {
  const router = useRouter();
  const [sintomas, setSintomas] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [historial, setHistorial] = useState<any>(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const sintomasComunes = [
    'Dolor de cabeza',
    'Fiebre',
    'Dolor de pecho',
    'Dificultad para respirar',
    'Náuseas',
    'Dolor abdominal',
    'Mareo',
    'Fatiga'
  ];

  const handleTriaje = async () => {
    if (!sintomas.trim()) {
      Alert.alert('Error', 'Por favor ingrese al menos un síntoma');
      return;
    }

    setLoading(true);
    try {
      const sintomasArray = sintomas.split(',').map(s => s.trim());
      const resultado = await apiService.realizarTriaje({
        usuarioId: USUARIO_ACTUAL,
        sintomas: sintomasArray,
        descripcion
      });
      setResultado(resultado);
    } catch (error) {
      Alert.alert('Error', 'No se pudo realizar el triaje. Verifique que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    try {
      const data = await apiService.obtenerHistorialTriaje(USUARIO_ACTUAL);
      setHistorial(data);
    } catch (error) {
      console.error('Error cargando historial:', error);
    }
  };

  const agregarSintoma = (sintoma: string) => {
    if (sintomas) {
      setSintomas(`${sintomas}, ${sintoma}`);
    } else {
      setSintomas(sintoma);
    }
  };

  const agendarCitaDesdeResultado = () => {
    if (resultado) {
      router.push({
        pathname: '/citas' as any,
        params: { 
          sugerencia: resultado.clasificacion.canal,
          especialidad: 'Medicina General'
        }
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Triaje de Síntomas</Text>
          <TouchableOpacity
            style={styles.historialButton}
            onPress={() => setMostrarHistorial(!mostrarHistorial)}
          >
            <History size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Describa sus síntomas para obtener una recomendación</Text>
      </View>

      {mostrarHistorial && historial && (
        <View style={styles.historialSection}>
          <Text style={styles.historialTitle}>Historial de Triajes</Text>
          {historial.emergencias && historial.emergencias.length > 0 && (
            <View style={styles.historialCard}>
              <Text style={styles.historialCardTitle}>Emergencias ({historial.emergencias.length})</Text>
              {historial.emergencias.map((emerg: any) => (
                <View key={emerg.id} style={styles.historialItem}>
                  <Text style={styles.historialFecha}>
                    {new Date(emerg.fecha).toLocaleDateString()}
                  </Text>
                  <Text style={styles.historialSintomas}>
                    {emerg.sintomas.join(', ')}
                  </Text>
                  <Text style={styles.historialEstado}>Estado: {emerg.estado}</Text>
                </View>
              ))}
            </View>
          )}
          {historial.citas && historial.citas.length > 0 && (
            <View style={styles.historialCard}>
              <Text style={styles.historialCardTitle}>Citas Relacionadas ({historial.citas.length})</Text>
              {historial.citas.map((cita: any) => (
                <View key={cita.id} style={styles.historialItem}>
                  <Text style={styles.historialFecha}>
                    {new Date(cita.fecha).toLocaleDateString()} - {cita.hora}
                  </Text>
                  <Text style={styles.historialSintomas}>
                    {cita.especialidad} - {cita.medico}
                  </Text>
                </View>
              ))}
            </View>
          )}
          {historial.total === 0 && (
            <Text style={styles.historialVacio}>No hay historial disponible</Text>
          )}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Síntomas (separados por comas)</Text>
        <TextInput
          style={styles.input}
          value={sintomas}
          onChangeText={setSintomas}
          placeholder="Ej: dolor de cabeza, fiebre"
          multiline
        />

        <Text style={styles.label}>Síntomas comunes</Text>
        <View style={styles.chipsContainer}>
          {sintomasComunes.map((sintoma, index) => (
            <TouchableOpacity
              key={index}
              style={styles.chip}
              onPress={() => agregarSintoma(sintoma)}
            >
              <Text style={styles.chipText}>{sintoma}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Descripción adicional (opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Describa cómo se siente..."
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleTriaje}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Evaluando...' : 'Realizar Triaje'}
          </Text>
        </TouchableOpacity>
      </View>

      {resultado && (
        <View style={styles.resultado}>
          <Text style={styles.resultadoTitle}>Resultado del Triaje</Text>
          <View style={[styles.nivelCard, resultado.clasificacion.nivel === 'urgente' && styles.urgente]}>
            <Text style={styles.nivelIcon}>{resultado.clasificacion.icono}</Text>
            <Text style={styles.nivelTexto}>
              {resultado.clasificacion.nivel === 'urgente' ? 'URGENTE' :
               resultado.clasificacion.nivel === 'hoy' ? 'ATENCIÓN HOY' : 'PROGRAMABLE'}
            </Text>
          </View>
          <Text style={styles.recomendacion}>{resultado.clasificacion.recomendacion}</Text>
          <Text style={styles.canal}>Canal recomendado: {resultado.clasificacion.canal}</Text>

          {resultado.sugerencias && resultado.sugerencias.length > 0 && (
            <View style={styles.sugerencias}>
              <Text style={styles.sugerenciasTitle}>Sugerencias según su plan:</Text>
              {resultado.sugerencias.map((sug: any, index: number) => (
                <View key={index} style={styles.sugerencia}>
                  <Text style={styles.sugerenciaTexto}>{sug.mensaje}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.agendarButton}
            onPress={agendarCitaDesdeResultado}
          >
            <Calendar size={20} color="#fff" />
            <Text style={styles.agendarButtonText}>Agendar Cita</Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
    backgroundColor: '#0066cc',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  section: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: '#0066cc',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultado: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultadoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  nivelCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  urgente: {
    backgroundColor: '#ffebee',
  },
  nivelIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  nivelTexto: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  recomendacion: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 24,
  },
  canal: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '600',
    marginBottom: 16,
  },
  sugerencias: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sugerenciasTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sugerencia: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  sugerenciaTexto: {
    fontSize: 14,
    color: '#666',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  historialButton: {
    padding: 8,
  },
  historialSection: {
    margin: 20,
    marginTop: 0,
  },
  historialTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  historialCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historialCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  historialItem: {
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historialFecha: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  historialSintomas: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  historialEstado: {
    fontSize: 12,
    color: '#999',
  },
  historialVacio: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
  agendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  agendarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

