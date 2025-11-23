import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { RIMAC_COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { ChevronLeft, Plus, MapPin, Clock, User } from 'lucide-react-native';

const CITAS_DATA = [
  {
    id: 1,
    estado: 'confirmada',
    especialista: 'Dr. Rafael Montoya',
    especialidad: 'Cardiología',
    fecha: '28 de noviembre 2024',
    hora: '14:30',
    clinica: 'Clínica Privada RIMAC',
    ubicacion: 'Av. Paseo de la República 3505, Lima',
  },
  {
    id: 2,
    estado: 'pendiente',
    especialista: 'Dra. María González',
    especialidad: 'Medicina General',
    fecha: '5 de diciembre 2024',
    hora: '10:00',
    clinica: 'Centro Médico RIMAC',
    ubicacion: 'Calle Principal 1234, Lima',
  },
  {
    id: 3,
    estado: 'historial',
    especialista: 'Dr. Carlos Pérez',
    especialidad: 'Dermatología',
    fecha: '15 de octubre 2024',
    hora: '16:00',
    clinica: 'Policlínico RIMAC',
    ubicacion: 'Av. Javier Prado 789, Lima',
  },
];

export default function CitasScreen() {
  const router = useRouter();
  const [selectedCita, setSelectedCita] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getStatusColor = useCallback((estado: string) => {
    switch (estado) {
      case 'confirmada':
        return '#10B981';
      case 'pendiente':
        return '#F59E0B';
      case 'historial':
        return '#6B7280';
      default:
        return RIMAC_COLORS.gray[500];
    }
  }, []);

  const getStatusLabel = useCallback((estado: string) => {
    switch (estado) {
      case 'confirmada':
        return 'Confirmada';
      case 'pendiente':
        return 'Pendiente';
      case 'historial':
        return 'Historial';
      default:
        return estado;
    }
  }, []);

  return (
    <LinearGradient
      colors={[RIMAC_COLORS.primary, RIMAC_COLORS.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={RIMAC_COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Citas</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => alert('Agendar nueva cita')}>
          <Plus size={24} color={RIMAC_COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* PRÓXIMAS CITAS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Próximas Citas</Text>
          {CITAS_DATA.filter(c => c.estado === 'confirmada' || c.estado === 'pendiente').map((cita) => (
            <TouchableOpacity
              key={cita.id}
              style={styles.citaCard}
              onPress={() => {
                setSelectedCita(cita);
                setModalVisible(true);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.citaLeft}>
                <View style={[styles.citaStatusBadge, { backgroundColor: getStatusColor(cita.estado) }]}>
                  <Text style={styles.citaStatusText}>{getStatusLabel(cita.estado)}</Text>
                </View>
                <Text style={styles.citaDoctor}>{cita.especialista}</Text>
                <Text style={styles.citaSpecialty}>{cita.especialidad}</Text>
                <Text style={styles.citaDate}>{cita.fecha}</Text>
              </View>
              <View style={styles.citaRight}>
                <Text style={styles.citaTime}>🕐 {cita.hora}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* HISTORIAL DE CITAS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Historial</Text>
          {CITAS_DATA.filter(c => c.estado === 'historial').map((cita) => (
            <TouchableOpacity
              key={cita.id}
              style={styles.citaCardHistory}
              onPress={() => {
                setSelectedCita(cita);
                setModalVisible(true);
              }}
              activeOpacity={0.8}
            >
              <View>
                <Text style={styles.citaDoctor}>{cita.especialista}</Text>
                <Text style={styles.citaSpecialty}>{cita.especialidad}</Text>
                <Text style={styles.citaDate}>{cita.fecha}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: SPACING['4xl'] }} />
      </ScrollView>

      {/* MODAL DE DETALLES */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <LinearGradient
          colors={[RIMAC_COLORS.primary, RIMAC_COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.modalGradient}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <ChevronLeft size={24} color={RIMAC_COLORS.white} />
            </TouchableOpacity>

            {selectedCita && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>Detalles de la Cita</Text>

                <View style={styles.detailCard}>
                  <Text style={styles.detailLabel}>👨‍⚕️ Especialista</Text>
                  <Text style={styles.detailValue}>{selectedCita.especialista}</Text>
                </View>

                <View style={styles.detailCard}>
                  <Text style={styles.detailLabel}>🏥 Especialidad</Text>
                  <Text style={styles.detailValue}>{selectedCita.especialidad}</Text>
                </View>

                <View style={styles.detailCard}>
                  <Text style={styles.detailLabel}>🏢 Clínica</Text>
                  <Text style={styles.detailValue}>{selectedCita.clinica}</Text>
                </View>

                <View style={styles.detailCard}>
                  <Text style={styles.detailLabel}>📍 Ubicación</Text>
                  <Text style={styles.detailValue}>{selectedCita.ubicacion}</Text>
                </View>

                <View style={styles.detailCard}>
                  <Text style={styles.detailLabel}>📅 Fecha</Text>
                  <Text style={styles.detailValue}>{selectedCita.fecha}</Text>
                </View>

                <View style={styles.detailCard}>
                  <Text style={styles.detailLabel}>🕐 Hora</Text>
                  <Text style={styles.detailValue}>{selectedCita.hora}</Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.btnPrimary} onPress={() => setModalVisible(false)}>
                    <Text style={styles.btnText}>Cerrar</Text>
                  </TouchableOpacity>
                  {selectedCita.estado === 'confirmada' && (
                    <TouchableOpacity style={styles.btnSecondary} onPress={() => alert('Cita cancelada')}>
                      <Text style={styles.btnTextSecondary}>Cancelar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        </LinearGradient>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 50,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButton: {
    padding: SPACING.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    padding: SPACING.sm,
  },
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
    marginBottom: SPACING.lg,
  },
  citaCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  citaCardHistory: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  citaLeft: {
    flex: 1,
  },
  citaRight: {
    alignItems: 'flex-end',
  },
  citaStatusBadge: {
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.sm,
    alignSelf: 'flex-start',
  },
  citaStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
  },
  citaDoctor: {
    fontSize: 14,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
    marginBottom: SPACING.xs,
  },
  citaSpecialty: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  citaDate: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  citaTime: {
    fontSize: 12,
    fontWeight: '600',
    color: RIMAC_COLORS.white,
  },
  modalGradient: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: SPACING.lg,
  },
  closeButton: {
    alignSelf: 'flex-start',
    marginBottom: SPACING.lg,
  },
  detailsContainer: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: RIMAC_COLORS.white,
    marginBottom: SPACING.xl,
  },
  detailCard: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[600],
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[900],
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginTop: SPACING.xl,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: RIMAC_COLORS.white,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '700',
    color: RIMAC_COLORS.primary,
  },
  btnTextSecondary: {
    fontSize: 14,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
  },
});
