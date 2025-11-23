import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { HelpCircle, ChevronDown, ChevronUp, Phone, Mail, MessageCircle } from 'lucide-react-native';

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <HelpCircle size={32} color="#0066cc" />
        <Text style={styles.title}>Ayuda</Text>
        <Text style={styles.subtitle}>Preguntas frecuentes y soporte</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqCard}>
            <TouchableOpacity
              style={styles.faqHeader}
              onPress={() => toggleFaq(index)}
            >
              <Text style={styles.faqPregunta}>{faq.pregunta}</Text>
              {faqAbierto === index ? (
                <ChevronUp size={24} color="#0066cc" />
              ) : (
                <ChevronDown size={24} color="#666" />
              )}
            </TouchableOpacity>
            {faqAbierto === index && (
              <View style={styles.faqRespuesta}>
                <Text style={styles.faqRespuestaText}>{faq.respuesta}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contacto</Text>
        
        <TouchableOpacity style={styles.contactCard}>
          <Phone size={24} color="#0066cc" />
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Llamar a RIMAC</Text>
            <Text style={styles.contactSubtitle}>106 - Línea de emergencias</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCard}>
          <Mail size={24} color="#0066cc" />
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Email de soporte</Text>
            <Text style={styles.contactSubtitle}>soporte@rimac.com</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCard}>
          <MessageCircle size={24} color="#0066cc" />
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Chat en vivo</Text>
            <Text style={styles.contactSubtitle}>Disponible 24/7</Text>
          </View>
        </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  faqCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  faqPregunta: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  faqRespuesta: {
    padding: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  faqRespuestaText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactCard: {
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
    gap: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

