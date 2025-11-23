import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { HelpCircle, ChevronDown, ChevronUp, Phone, Mail, MessageCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RIMAC_COLORS } from '../../theme/colors';

export default function AyudaScreen() {
  const [faqAbierto, setFaqAbierto] = useState<number | null>(null);

  const faqs = [
    {
      pregunta: '¿Cómo uso el triaje de síntomas?',
      respuesta: 'Puedes usar el triaje desde la pantalla principal. Describe tus síntomas y el sistema te clasificará según urgencia (Urgente, Hoy, o Programable) y te recomendará el canal adecuado.',
    },
    {
      pregunta: '¿Cómo registro que tomé mi medicamento?',
      respuesta: 'Ve a la sección de Tratamientos, selecciona tu medicamento y presiona el botón "Registrar toma". Esto actualizará tu adherencia automáticamente.',
    },
    {
      pregunta: '¿Qué es el Índice de Bienestar?',
      respuesta: 'El Índice de Bienestar es un score de 0-100 que combina tu estado de ánimo, actividad física, sueño y otros factores para darte una visión general de tu salud.',
    },
    {
      pregunta: '¿Cómo activo una emergencia?',
      respuesta: 'Presiona el botón de emergencia en la pantalla principal o di "emergencia" en cualquier momento. Se enviará una alerta inmediata a la central RIMAC con tu ubicación y datos.',
    },
    {
      pregunta: '¿Puedo agendar citas desde la app?',
      respuesta: 'Sí, puedes ver tus citas programadas y agendar nuevas desde la sección de Citas. El sistema te mostrará disponibilidad según tu plan.',
    },
  ];

  const toggleFaq = (index: number) => {
    setFaqAbierto(faqAbierto === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[RIMAC_COLORS.white, '#F9FAFB']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.backButton} />
            <Text style={styles.headerTitle}>Ayuda</Text>
            <View style={styles.headerIcon}>
              <HelpCircle size={24} color={RIMAC_COLORS.primary} strokeWidth={1.5} />
            </View>
          </View>
          <Text style={styles.headerSubtitle}>
            Preguntas frecuentes y soporte
          </Text>
        </View>

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* FAQs */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
            </View>
            {faqs.map((faq, index) => (
              <View key={index} style={styles.faqCard}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => toggleFaq(index)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqPregunta}>{faq.pregunta}</Text>
                  <View style={styles.chevronContainer}>
                    {faqAbierto === index ? (
                      <ChevronUp
                        size={20}
                        color={RIMAC_COLORS.primary}
                        strokeWidth={2}
                      />
                    ) : (
                      <ChevronDown
                        size={20}
                        color={RIMAC_COLORS.gray[400]}
                        strokeWidth={1.5}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                {faqAbierto === index && (
                  <View style={styles.faqRespuesta}>
                    <Text style={styles.faqRespuestaText}>
                      {faq.respuesta}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Contact Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Contacto</Text>
            </View>

            <TouchableOpacity style={styles.contactCard} activeOpacity={0.7}>
              <View style={styles.contactIcon}>
                <Phone size={22} color={RIMAC_COLORS.primary} strokeWidth={1.5} />
              </View>
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>Llamar a RIMAC</Text>
                <Text style={styles.contactSubtitle}>106 - Línea de emergencias</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard} activeOpacity={0.7}>
              <View style={styles.contactIcon}>
                <Mail size={22} color={RIMAC_COLORS.primary} strokeWidth={1.5} />
              </View>
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>Email de soporte</Text>
                <Text style={styles.contactSubtitle}>soporte@rimac.com</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard} activeOpacity={0.7}>
              <View style={styles.contactIcon}>
                <MessageCircle
                  size={22}
                  color={RIMAC_COLORS.primary}
                  strokeWidth={1.5}
                />
              </View>
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>Chat en vivo</Text>
                <Text style={styles.contactSubtitle}>Disponible 24/7</Text>
              </View>
            </TouchableOpacity>
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

  /* FAQ Cards */
  faqCard: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: RIMAC_COLORS.gray[200],
    marginBottom: 10,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  faqPregunta: {
    fontSize: 14,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[900],
    flex: 1,
    marginRight: 10,
    lineHeight: 20,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: RIMAC_COLORS.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqRespuesta: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: RIMAC_COLORS.gray[100],
    backgroundColor: RIMAC_COLORS.primary + '03',
  },
  faqRespuestaText: {
    fontSize: 13,
    color: RIMAC_COLORS.gray[700],
    fontWeight: '400',
    lineHeight: 20,
  },

  /* Contact Cards */
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RIMAC_COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: RIMAC_COLORS.gray[200],
    marginBottom: 10,
    gap: 14,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: RIMAC_COLORS.primary + '08',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[900],
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[500],
    fontWeight: '400',
  },
});

