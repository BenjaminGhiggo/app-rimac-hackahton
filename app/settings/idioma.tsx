import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Globe, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RIMAC_COLORS } from '../../theme/colors';

export default function IdiomaScreen() {
  const [idiomaSeleccionado, setIdiomaSeleccionado] = useState('es');

  const idiomas = [
    { codigo: 'es', nombre: 'Español', nativo: 'Español', flag: '🇪🇸' },
    { codigo: 'en', nombre: 'English', nativo: 'Inglés', flag: '🇺🇸' },
    { codigo: 'pt', nombre: 'Português', nativo: 'Portugués', flag: '🇧🇷' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[RIMAC_COLORS.white, '#F9FAFB']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.backButton} />
            <Text style={styles.headerTitle}>Idioma</Text>
            <View style={styles.headerIcon}>
              <Globe size={24} color={RIMAC_COLORS.primary} strokeWidth={1.5} />
            </View>
          </View>
          <Text style={styles.headerSubtitle}>
            Selecciona tu idioma preferido para la app
          </Text>
        </View>

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Idiomas Disponibles</Text>
            </View>

            {idiomas.map((idioma, index) => (
              <TouchableOpacity
                key={idioma.codigo}
                style={[
                  styles.languageCard,
                  idiomaSeleccionado === idioma.codigo &&
                    styles.languageCardSelected,
                ]}
                onPress={() => setIdiomaSeleccionado(idioma.codigo)}
                activeOpacity={0.7}
              >
                <View style={styles.languageContent}>
                  <View style={styles.flagContainer}>
                    <Text style={styles.flag}>{idioma.flag}</Text>
                  </View>
                  <View style={styles.languageText}>
                    <Text style={styles.languageName}>{idioma.nombre}</Text>
                    <Text style={styles.languageNative}>{idioma.nativo}</Text>
                  </View>
                </View>
                {idiomaSeleccionado === idioma.codigo && (
                  <View style={styles.checkContainer}>
                    <Check
                      size={24}
                      color={RIMAC_COLORS.primary}
                      strokeWidth={2}
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Info Card */}
          <View style={styles.section}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>ℹ️ Cambios de idioma</Text>
              <Text style={styles.infoText}>
                El idioma seleccionado se aplicará a toda la aplicación. Algunos cambios pueden requerir reiniciar la app.
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: RIMAC_COLORS.white,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  /* Header */
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: RIMAC_COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: RIMAC_COLORS.gray[100],
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: RIMAC_COLORS.primary,
    flex: 1,
    textAlign: 'center',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: RIMAC_COLORS.primary + '08',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 13,
    color: RIMAC_COLORS.gray[600],
    fontWeight: '400',
    lineHeight: 18,
  },

  /* Sections */
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[900],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  /* Language Cards */
  languageCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: RIMAC_COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: RIMAC_COLORS.gray[200],
    marginBottom: 10,
  },
  languageCardSelected: {
    backgroundColor: RIMAC_COLORS.primary + '08',
    borderColor: RIMAC_COLORS.primary,
    borderWidth: 2,
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  flagContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: RIMAC_COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  flag: {
    fontSize: 24,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[900],
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[500],
    fontWeight: '400',
  },
  checkContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: RIMAC_COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Info Card */
  infoCard: {
    backgroundColor: RIMAC_COLORS.primary + '08',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: RIMAC_COLORS.primary,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: RIMAC_COLORS.primary,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: RIMAC_COLORS.gray[700],
    fontWeight: '400',
    lineHeight: 18,
  },
});

