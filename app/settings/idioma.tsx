import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Globe, Check } from 'lucide-react-native';

export default function IdiomaScreen() {
  const [idiomaSeleccionado, setIdiomaSeleccionado] = useState('es');

  const idiomas = [
    { codigo: 'es', nombre: 'Español', nativo: 'Español' },
    { codigo: 'en', nombre: 'English', nativo: 'Inglés' },
    { codigo: 'pt', nombre: 'Português', nativo: 'Portugués' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Globe size={32} color="#0066cc" />
        <Text style={styles.title}>Idioma</Text>
        <Text style={styles.subtitle}>Selecciona tu idioma preferido</Text>
      </View>

      <View style={styles.section}>
        {idiomas.map((idioma) => (
          <TouchableOpacity
            key={idioma.codigo}
            style={[
              styles.option,
              idiomaSeleccionado === idioma.codigo && styles.optionSelected
            ]}
            onPress={() => setIdiomaSeleccionado(idioma.codigo)}
          >
            <View style={styles.optionLeft}>
              <Text style={styles.optionName}>{idioma.nombre}</Text>
              <Text style={styles.optionNative}>{idioma.nativo}</Text>
            </View>
            {idiomaSeleccionado === idioma.codigo && (
              <Check size={24} color="#0066cc" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            El idioma seleccionado se aplicará a toda la aplicación. Algunos cambios pueden requerir reiniciar la app.
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
  optionSelected: {
    borderWidth: 2,
    borderColor: '#0066cc',
    backgroundColor: '#e3f2fd',
  },
  optionLeft: {
    flex: 1,
  },
  optionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionNative: {
    fontSize: 14,
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

