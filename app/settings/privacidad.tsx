import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Lock, Shield, Eye, Database } from 'lucide-react-native';

export default function PrivacidadScreen() {
  const opciones = [
    {
      icon: Shield,
      title: 'Datos de Salud',
      description: 'Cómo se utilizan y protegen tus datos médicos',
      color: '#0066cc',
    },
    {
      icon: Eye,
      title: 'Visibilidad',
      description: 'Controla quién puede ver tu información',
      color: '#34C759',
    },
    {
      icon: Database,
      title: 'Almacenamiento',
      description: 'Gestiona el almacenamiento de tus datos',
      color: '#FF9500',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Lock size={32} color="#0066cc" />
        <Text style={styles.title}>Privacidad</Text>
        <Text style={styles.subtitle}>Gestiona tu privacidad y seguridad</Text>
      </View>

      <View style={styles.section}>
        {opciones.map((opcion, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: `${opcion.color}20` }]}>
              <opcion.icon size={24} color={opcion.color} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{opcion.title}</Text>
              <Text style={styles.cardDescription}>{opcion.description}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Tu privacidad es importante</Text>
          <Text style={styles.infoText}>
            Todos tus datos de salud están protegidos y encriptados. Solo tú y tu equipo médico autorizado pueden acceder a esta información.
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  arrow: {
    fontSize: 28,
    color: '#ccc',
    fontWeight: '300',
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

