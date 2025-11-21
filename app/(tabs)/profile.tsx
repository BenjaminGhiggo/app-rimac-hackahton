import { View, Text, StyleSheet } from 'react-native';
import { User } from 'lucide-react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <User size={80} color="#007AFF" strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>Mi Perfil</Text>
      <Text style={styles.info}>Usuario Demo</Text>
      <Text style={styles.email}>demo@example.com</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  info: {
    fontSize: 18,
    color: '#666',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#999',
  },
});
