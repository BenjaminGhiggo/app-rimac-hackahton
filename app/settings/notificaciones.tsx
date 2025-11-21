import { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { Bell } from 'lucide-react-native';

export default function NotificacionesScreen() {
  const [notificaciones, setNotificaciones] = useState({
    recordatorios: true,
    citas: true,
    emergencias: true,
    bienestar: true,
    tratamientos: true,
    promociones: false,
  });

  const toggleNotificacion = (key: keyof typeof notificaciones) => {
    setNotificaciones(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Bell size={32} color="#0066cc" />
        <Text style={styles.title}>Notificaciones</Text>
        <Text style={styles.subtitle}>Gestiona qué notificaciones recibes</Text>
      </View>

      <View style={styles.section}>
        {Object.entries(notificaciones).map(([key, value]) => (
          <View key={key} style={styles.option}>
            <View style={styles.optionLeft}>
              <Text style={styles.optionLabel}>
                {key === 'recordatorios' && 'Recordatorios de medicación'}
                {key === 'citas' && 'Recordatorios de citas'}
                {key === 'emergencias' && 'Alertas de emergencia'}
                {key === 'bienestar' && 'Actualizaciones de bienestar'}
                {key === 'tratamientos' && 'Seguimiento de tratamientos'}
                {key === 'promociones' && 'Promociones y ofertas'}
              </Text>
              <Text style={styles.optionDescription}>
                {key === 'recordatorios' && 'Recibe recordatorios para tomar tus medicamentos'}
                {key === 'citas' && 'Notificaciones sobre tus citas médicas'}
                {key === 'emergencias' && 'Alertas importantes de emergencia'}
                {key === 'bienestar' && 'Actualizaciones sobre tu índice de bienestar'}
                {key === 'tratamientos' && 'Notificaciones sobre adherencia a tratamientos'}
                {key === 'promociones' && 'Ofertas y promociones de servicios de salud'}
              </Text>
            </View>
            <Switch
              value={value}
              onValueChange={() => toggleNotificacion(key as keyof typeof notificaciones)}
              trackColor={{ false: '#ccc', true: '#0066cc' }}
              thumbColor="#fff"
            />
          </View>
        ))}
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
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  optionLeft: {
    flex: 1,
    marginRight: 16,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
});

