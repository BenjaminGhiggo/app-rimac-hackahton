import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Gift, Info, CheckCircle, AlertCircle } from 'lucide-react-native';
import { apiService } from '../services/api';
import { USUARIO_ACTUAL } from '../config/usuario';

export default function BeneficiosScreen() {
  const [beneficios, setBeneficios] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [explicando, setExplicando] = useState<string | null>(null);

  useEffect(() => {
    cargarBeneficios();
  }, []);

  const cargarBeneficios = async () => {
    try {
      const data = await apiService.obtenerBeneficios(USUARIO_ACTUAL);
      setBeneficios(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los beneficios');
    } finally {
      setLoading(false);
    }
  };

  const explicarBeneficio = async (tipo: string) => {
    setExplicando(tipo);
    try {
      const explicacion = await apiService.explicarBeneficio(USUARIO_ACTUAL, tipo) as any;
      Alert.alert(
        getBeneficioNombre(tipo),
        explicacion.explicacion,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la explicación');
    } finally {
      setExplicando(null);
    }
  };

  const getBeneficioNombre = (tipo: string) => {
    const nombres: Record<string, string> = {
      consultasMedicas: 'Consultas Médicas',
      telemedicina: 'Telemedicina',
      medicamentos: 'Medicamentos',
      laboratorios: 'Laboratorios',
      emergencias: 'Emergencias',
      chequeosPreventivos: 'Chequeos Preventivos',
      saludMental: 'Salud Mental',
    };
    return nombres[tipo] || tipo;
  };

  const getBeneficioIcono = (tipo: string) => {
    const iconos: Record<string, string> = {
      consultasMedicas: '🩺',
      telemedicina: '💻',
      medicamentos: '💊',
      laboratorios: '🧪',
      emergencias: '🚨',
      chequeosPreventivos: '📋',
      saludMental: '🧠',
    };
    return iconos[tipo] || '🎁';
  };

  const renderBeneficio = (tipo: string, beneficio: any) => {
    const disponible = beneficio.disponible;
    const nombre = getBeneficioNombre(tipo);
    const icono = getBeneficioIcono(tipo);

    return (
      <View key={tipo} style={styles.beneficioCard}>
        <View style={styles.beneficioHeader}>
          <Text style={styles.beneficioIcono}>{icono}</Text>
          <View style={styles.beneficioInfo}>
            <Text style={styles.beneficioNombre}>{nombre}</Text>
            {disponible ? (
              <View style={styles.disponibleBadge}>
                <CheckCircle size={16} color="#4caf50" />
                <Text style={styles.disponibleText}>Disponible</Text>
              </View>
            ) : (
              <View style={styles.noDisponibleBadge}>
                <AlertCircle size={16} color="#ff4444" />
                <Text style={styles.noDisponibleText}>No disponible</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.beneficioDetalles}>
          {'limite' in beneficio && (
            <Text style={styles.detalleText}>
              Límite: {beneficio.limite}
              {beneficio.copago !== undefined && ` • Copago: S/ ${beneficio.copago}`}
            </Text>
          )}
          {'cobertura' in beneficio && (
            <Text style={styles.detalleText}>
              Cobertura: {beneficio.cobertura}%
              {'limiteMensual' in beneficio && ` • Límite mensual: S/ ${beneficio.limiteMensual}`}
              {'limiteAnual' in beneficio && ` • Límite anual: S/ ${beneficio.limiteAnual}`}
              {'sesiones' in beneficio && ` • Sesiones: ${beneficio.sesiones}`}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.explicarButton, explicando === tipo && styles.explicarButtonDisabled]}
          onPress={() => explicarBeneficio(tipo)}
          disabled={explicando === tipo}
        >
          {explicando === tipo ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Info size={18} color="#fff" />
              <Text style={styles.explicarButtonText}>Explicar beneficio</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Cargando beneficios...</Text>
      </View>
    );
  }

  if (!beneficios) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se pudieron cargar los beneficios</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Gift size={32} color="#fff" />
        <Text style={styles.title}>Mis Beneficios</Text>
        <Text style={styles.subtitle}>Plan {beneficios.usuario.plan}</Text>
        <Text style={styles.subtitle}>Póliza: {beneficios.usuario.poliza}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Beneficios Disponibles</Text>
        {Object.entries(beneficios.beneficios).map(([tipo, beneficio]: [string, any]) =>
          renderBeneficio(tipo, beneficio)
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vigencia</Text>
        <View style={styles.vigenciaCard}>
          <Text style={styles.vigenciaText}>
            Desde: {new Date(beneficios.vigencia.inicio).toLocaleDateString()}
          </Text>
          <Text style={styles.vigenciaText}>
            Hasta: {new Date(beneficios.vigencia.fin).toLocaleDateString()}
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
    marginBottom: 4,
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
  beneficioCard: {
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
  beneficioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  beneficioIcono: {
    fontSize: 32,
  },
  beneficioInfo: {
    flex: 1,
  },
  beneficioNombre: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  disponibleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  disponibleText: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '600',
  },
  noDisponibleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  noDisponibleText: {
    fontSize: 12,
    color: '#ff4444',
    fontWeight: '600',
  },
  beneficioDetalles: {
    marginBottom: 12,
    paddingLeft: 44,
  },
  detalleText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  explicarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  explicarButtonDisabled: {
    opacity: 0.6,
  },
  explicarButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  vigenciaCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vigenciaText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
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

