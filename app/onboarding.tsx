import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Heart, ChevronRight, CheckCircle } from 'lucide-react-native';
import { apiService } from '../services/api';
import { useRouter } from 'expo-router';
import { USUARIO_ACTUAL } from '../config/usuario';

interface Pregunta {
  id: string;
  pregunta: string;
  tipo: 'opcion' | 'texto' | 'multiple';
  opciones?: string[];
}

const preguntas: Pregunta[] = [
  {
    id: 'actividadFisica',
    pregunta: '¿Cuál es tu nivel de actividad física?',
    tipo: 'opcion',
    opciones: ['Baja (poco o nada de ejercicio)', 'Moderada (ejercicio 1-3 veces por semana)', 'Alta (ejercicio 4+ veces por semana)'],
  },
  {
    id: 'alimentacion',
    pregunta: '¿Cómo describirías tu alimentación?',
    tipo: 'opcion',
    opciones: ['Necesita mejorar', 'Balanceada', 'Muy saludable'],
  },
  {
    id: 'estres',
    pregunta: '¿Cómo calificarías tu nivel de estrés?',
    tipo: 'opcion',
    opciones: ['Bajo', 'Medio', 'Alto'],
  },
  {
    id: 'sueño',
    pregunta: '¿Cuántas horas duermes en promedio por noche?',
    tipo: 'opcion',
    opciones: ['Menos de 6 horas', '6-7 horas', '7-8 horas', 'Más de 8 horas'],
  },
  {
    id: 'objetivos',
    pregunta: '¿Cuáles son tus objetivos de salud? (Puedes seleccionar varios)',
    tipo: 'multiple',
    opciones: [
      'Mantener buena salud',
      'Perder peso',
      'Ganar peso',
      'Mejorar condición física',
      'Controlar condición crónica',
      'Mejorar sueño',
      'Reducir estrés',
      'Prevención',
    ],
  },
  {
    id: 'condiciones',
    pregunta: '¿Tienes alguna condición de salud crónica? (Opcional)',
    tipo: 'texto',
  },
  {
    id: 'medicamentos',
    pregunta: '¿Tomas medicamentos regularmente? (Opcional)',
    tipo: 'texto',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, any>>({});
  const [seleccionesMultiples, setSeleccionesMultiples] = useState<string[]>([]);
  const [textoLibre, setTextoLibre] = useState('');
  const [loading, setLoading] = useState(false);
  const [onboardingCompletado, setOnboardingCompletado] = useState(false);

  useEffect(() => {
    verificarOnboarding();
  }, []);

  const verificarOnboarding = async () => {
    try {
      const data = await apiService.obtenerOnboarding(USUARIO_ACTUAL) as any;
      if (data.onboarding.completado) {
        setOnboardingCompletado(true);
        // Redirigir después de 2 segundos
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 2000);
      }
    } catch (error) {
      console.error('Error verificando onboarding:', error);
    }
  };

  const handleOpcion = (opcion: string) => {
    const pregunta = preguntas[preguntaActual];
    if (pregunta.tipo === 'multiple') {
      if (seleccionesMultiples.includes(opcion)) {
        setSeleccionesMultiples(seleccionesMultiples.filter(s => s !== opcion));
      } else {
        setSeleccionesMultiples([...seleccionesMultiples, opcion]);
      }
    } else {
      setRespuestas({ ...respuestas, [pregunta.id]: opcion });
      siguientePregunta();
    }
  };

  const handleMultipleSiguiente = () => {
    if (seleccionesMultiples.length === 0) {
      Alert.alert('Selecciona al menos una opción');
      return;
    }
    const pregunta = preguntas[preguntaActual];
    setRespuestas({ ...respuestas, [pregunta.id]: seleccionesMultiples });
    setSeleccionesMultiples([]);
    siguientePregunta();
  };

  const handleTextoLibre = () => {
    const pregunta = preguntas[preguntaActual];
    setRespuestas({ ...respuestas, [pregunta.id]: textoLibre });
    setTextoLibre('');
    siguientePregunta();
  };

  const siguientePregunta = () => {
    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      completarOnboarding();
    }
  };

  const anteriorPregunta = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(preguntaActual - 1);
    }
  };

  const completarOnboarding = async () => {
    setLoading(true);
    try {
      await apiService.guardarOnboarding(USUARIO_ACTUAL, respuestas);
      Alert.alert('¡Onboarding completado!', 'Gracias por completar tu perfil de salud', [
        {
          text: 'Continuar',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el onboarding');
    } finally {
      setLoading(false);
    }
  };

  if (onboardingCompletado) {
    return (
      <View style={styles.container}>
        <CheckCircle size={64} color="#4caf50" />
        <Text style={styles.completadoText}>Onboarding ya completado</Text>
        <Text style={styles.completadoSubtext}>Redirigiendo...</Text>
      </View>
    );
  }

  const pregunta = preguntas[preguntaActual];
  const progreso = ((preguntaActual + 1) / preguntas.length) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Heart size={32} color="#fff" />
        <Text style={styles.title}>Bienvenido a Rimqhali.ai</Text>
        <Text style={styles.subtitle}>Ayúdanos a conocerte mejor</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progreso}%` }]} />
      </View>
      <Text style={styles.progressText}>
        Pregunta {preguntaActual + 1} de {preguntas.length}
      </Text>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.pregunta}>{pregunta.pregunta}</Text>

        {pregunta.tipo === 'opcion' && pregunta.opciones && (
          <View style={styles.opcionesContainer}>
            {pregunta.opciones.map((opcion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.opcionButton}
                onPress={() => handleOpcion(opcion)}
              >
                <Text style={styles.opcionText}>{opcion}</Text>
                <ChevronRight size={20} color="#0066cc" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {pregunta.tipo === 'multiple' && pregunta.opciones && (
          <View style={styles.opcionesContainer}>
            {pregunta.opciones.map((opcion, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.opcionButton,
                  seleccionesMultiples.includes(opcion) && styles.opcionButtonSelected,
                ]}
                onPress={() => handleOpcion(opcion)}
              >
                <Text
                  style={[
                    styles.opcionText,
                    seleccionesMultiples.includes(opcion) && styles.opcionTextSelected,
                  ]}
                >
                  {opcion}
                </Text>
                {seleccionesMultiples.includes(opcion) && (
                  <CheckCircle size={20} color="#0066cc" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.siguienteButton}
              onPress={handleMultipleSiguiente}
            >
              <Text style={styles.siguienteButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        )}

        {pregunta.tipo === 'texto' && (
          <View style={styles.textoContainer}>
            <Text style={styles.textoLabel}>
              {pregunta.id === 'condiciones'
                ? 'Ej: Hipertensión, Diabetes, etc.'
                : 'Ej: Losartan 50mg, Metformina, etc.'}
            </Text>
            <Text style={styles.textoInput} onPress={() => Alert.alert('Info', 'Puedes dejar este campo vacío si no aplica')}>
              {textoLibre || 'Escribe aquí (opcional)'}
            </Text>
            <TouchableOpacity
              style={styles.siguienteButton}
              onPress={handleTextoLibre}
            >
              <Text style={styles.siguienteButtonText}>
                {preguntaActual === preguntas.length - 1 ? 'Finalizar' : 'Continuar'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {preguntaActual > 0 && (
        <TouchableOpacity style={styles.anteriorButton} onPress={anteriorPregunta}>
          <Text style={styles.anteriorButtonText}>← Anterior</Text>
        </TouchableOpacity>
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Guardando...</Text>
        </View>
      )}
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
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e0e0',
    textAlign: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0066cc',
    borderRadius: 2,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  pregunta: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  opcionesContainer: {
    gap: 12,
  },
  opcionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  opcionButtonSelected: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#0066cc',
  },
  opcionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  opcionTextSelected: {
    color: '#0066cc',
    fontWeight: '600',
  },
  textoContainer: {
    marginTop: 20,
  },
  textoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  textoInput: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  siguienteButton: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  siguienteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  anteriorButton: {
    padding: 16,
    alignItems: 'center',
  },
  anteriorButtonText: {
    color: '#0066cc',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#fff',
    fontSize: 16,
  },
  completadoText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 8,
  },
  completadoSubtext: {
    fontSize: 16,
    color: '#666',
  },
});

