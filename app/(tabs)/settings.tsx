import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, Lock, Globe, HelpCircle } from 'lucide-react-native';

export default function SettingsScreen() {
  const settingsOptions = [
    { icon: Bell, label: 'Notificaciones', color: '#FF9500' },
    { icon: Lock, label: 'Privacidad', color: '#007AFF' },
    { icon: Globe, label: 'Idioma', color: '#34C759' },
    { icon: HelpCircle, label: 'Ayuda', color: '#5856D6' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajustes</Text>
      <View style={styles.optionsContainer}>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity key={index} style={styles.option}>
            <View style={styles.optionLeft}>
              <option.icon size={24} color={option.color} />
              <Text style={styles.optionLabel}>{option.label}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
  },
  optionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 28,
    color: '#ccc',
    fontWeight: '300',
  },
});
