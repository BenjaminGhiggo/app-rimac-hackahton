import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ChevronRight, Dna, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { RIMAC_COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import { EmergencyModal } from '../../components/EmergencyModal';

// Datos mock de Marisol Herrera Bruno
const PROFILE_DATA = {
  nombre: 'Marisol Herrera Bruno',
  edad: 47,
  sexo: 'Femenino',
  email: 'marisol.herrera@email.com',
  telefono: '+51 987 654 321',
  ubicacion: 'Lima, Perú - San Isidro',
  
  // Sistema de Puntos y Recompensas
  puntos: {
    totales: 2850,
    disponibles: 2850,
    nivelVIP: 'Oro',
    proximoBeneficio: 3000,
    descuentoActual: '15%',
  },

  // Salud
  salud: {
    grupoSanguineo: 'O+',
    presion: '120/80 mmHg',
    peso: 68,
    estatura: 165,
    imc: 24.9,
    condiciones: ['Hipertensión Leve (Controlada)', 'Colesterol Elevado'],
    medicamentos: [
      { nombre: 'Lisinopril 10mg', frecuencia: 'Diaria', activo: true },
      { nombre: 'Atorvastatina 20mg', frecuencia: 'Nocturna', activo: true },
    ],
    alergias: ['Penicilina', 'Sulfamidas'],
  },

  // Citas
  citas: {
    este_anio: 8,
    proximas: [
      {
        id: 1,
        especialidad: 'Cardiología',
        doctor: 'Dr. Rafael Montoya',
        fecha: '2025-11-28',
        hora: '14:30',
        clinica: 'Clínica Privada RIMAC',
        estado: 'Confirmada',
      },
      {
        id: 2,
        especialidad: 'Endocrinología',
        doctor: 'Dra. Patricia Saenz',
        fecha: '2025-12-10',
        hora: '09:00',
        clinica: 'Hospital General RIMAC',
        estado: 'Pendiente',
      },
    ],
  },

  // Cuidador
  cuidador: {
    nombre: 'Brigitte Chavez Herrera',
    relacion: 'Hija',
    telefono: '+51 987 654 321',
    activo: true,
  },

  // Beneficios
  beneficios: [
    { titulo: '20% Descuento en Consultas', estado: 'Activo' },
    { titulo: 'Acceso Prioritario a Citas', estado: 'Activo' },
    { titulo: 'Envío Gratis Medicamentos', estado: 'Activo por 3 meses' },
    { titulo: 'Asesoramiento Nutricional Gratis', estado: 'Disponible' },
  ],

  // Familia
  familia: [
    {
      id: 1,
      nombre: 'Rosa María Herrera',
      relacion: 'Madre',
      edad: 72,
      ultimaCita: '2025-11-10',
      especialista: 'Dra. Elena Romero - Geriatría',
      enTratamiento: true,
      tratamiento: 'Hipertensión y Diabetes Tipo II',
      recetasActivas: ['Metformina 500mg', 'Enalapril 10mg'],
      indicaciones: '• Realizar ejercicio ligero 30 minutos diarios\n• Dieta baja en sal y carbohidratos simples\n• Monitorear glucosa cada mañana\n• Control de presión arterial 2 veces por semana',
      recomendaciones: '• Próxima cita en 2 semanas\n• Realizar análisis de laboratorio en 3 semanas\n• Consultar si presenta mareos o visión borrosa',
    },
    {
      id: 2,
      nombre: 'Carlos Herrera',
      relacion: 'Hermano',
      edad: 45,
      ultimaCita: '2025-10-25',
      especialista: 'Dr. Juan Mendez - Cardiología',
      enTratamiento: false,
      tratamiento: null,
      recetasActivas: [],
      indicaciones: '• Evitar alimentos grasosos y ultraprocesados\n• Realizar actividad cardiovascular 3 veces por semana\n• Reducir consumo de alcohol\n• Mantener peso ideal',
      recomendaciones: '• Próximo chequeo en 6 meses\n• Mantener revisiones preventivas anuales\n• Realizar electrocardiograma el próximo año',
    },
    {
      id: 3,
      nombre: 'Brigitte Chavez Herrera',
      relacion: 'Hija',
      edad: 22,
      ultimaCita: '2025-11-15',
      especialista: 'Dra. Patricia González - Medicina General',
      enTratamiento: false,
      tratamiento: null,
      recetasActivas: [],
      indicaciones: '• Mantener rutina de ejercicio regular\n• Consumir 8 vasos de agua diaria\n• Dormir 7-8 horas diarias\n• Vacunación al día',
      recomendaciones: '• Próximo chequeo en 1 año\n• Mantener estilos de vida saludables\n• Consultar ante cualquier síntoma',
    },
    {
      id: 4,
      nombre: 'Miguel Herrera',
      relacion: 'Padre',
      edad: 75,
      ultimaCita: '2025-09-20',
      especialista: 'Dr. Ricardo Soto - Cardiología',
      enTratamiento: true,
      tratamiento: 'Fibrilación Auricular',
      recetasActivas: ['Warfarina 5mg', 'Bisoprolol 5mg'],
      indicaciones: '• Tomar medicamentos exactamente a la hora indicada\n• Evitar alimentos ricos en vitamina K\n• Realizar caminatas suaves diariamente\n• Controlar presión arterial 3 veces por semana',
      recomendaciones: '• Monitoreo de INR (anticoagulación) cada mes\n• Próxima cita cardiológica en 3 semanas\n• Acudir a emergencia si presenta palpitaciones severas',
    },
  ],
};

export default function ProfileScreen() {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);
  const [familiaExpanded, setFamiliaExpanded] = useState(false);
  const [selectedFamiliar, setSelectedFamiliar] = useState<any>(null);
  const [familiarModalVisible, setFamiliarModalVisible] = useState(false);

  const toggleSection = useCallback((section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  }, [expandedSection]);

  const handleEmergencyPress = useCallback(() => {
    setEmergencyModalVisible(true);
  }, []);

  const handleEmergencyConfirm = useCallback((location: any, consent: any) => {
    setEmergencyModalVisible(false);
    
    Alert.alert(
      '✅ Emergencia Activada',
      `Ambulancia en camino a ${PROFILE_DATA.ubicacion}. Tiempo estimado: 8-12 minutos. Se ha notificado a ${PROFILE_DATA.cuidador.nombre}.`,
      [{ text: 'Entendido', style: 'default' }]
    );

    // Aquí se enviaría la información al backend
    console.log('Emergencia enviada:', {
      usuario: PROFILE_DATA.nombre,
      telefono: PROFILE_DATA.telefono,
      ubicacion: PROFILE_DATA.ubicacion,
      coordenadas: location,
      consentimientos: consent,
      cuidador: PROFILE_DATA.cuidador.nombre,
    });
  }, []);

  const calcularDiasParaCita = (fechaCita: string) => {
    const hoy = new Date();
    const cita = new Date(fechaCita);
    const diferencia = cita.getTime() - hoy.getTime();
    const dias = Math.ceil(diferencia / (1000 * 3600 * 24));
    return dias;
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <LinearGradient
      colors={[RIMAC_COLORS.primary, RIMAC_COLORS.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* HEADER - FONDO ROJO CON TEXTO BLANCO */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.15)']}
              style={styles.profileImage}
            >
              <Text style={styles.initials}>MH</Text>
            </LinearGradient>
          </View>

          <Text style={styles.name}>{PROFILE_DATA.nombre}</Text>
          <View style={styles.basicInfo}>
            <Text style={styles.basicInfoText}>{PROFILE_DATA.edad} años • {PROFILE_DATA.sexo}</Text>
            <Text style={styles.locationText}>📍 {PROFILE_DATA.ubicacion}</Text>
          </View>
        </View>

        {/* RIMAC POINTS - CARD BLANCA CON TEXTO OSCURO */}
        <View style={styles.section}>
          <View style={styles.pointsCard}>
            <View style={styles.pointsHeader}>
              <View>
                <Text style={styles.pointsLabel}>🏆 RIMAC POINTS</Text>
                <Text style={styles.pointsValue}>{PROFILE_DATA.puntos.totales.toLocaleString()}</Text>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>{PROFILE_DATA.puntos.nivelVIP}</Text>
              </View>
            </View>

            <View style={styles.pointsProgress}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(PROFILE_DATA.puntos.totales / PROFILE_DATA.puntos.proximoBeneficio) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {PROFILE_DATA.puntos.proximoBeneficio - PROFILE_DATA.puntos.totales} puntos para próximo beneficio
              </Text>
            </View>

            <Text style={styles.discountText}>💰 Descuento actual: {PROFILE_DATA.puntos.descuentoActual} en servicios</Text>
          </View>
        </View>

        {/* PROXIMAS CITAS - TARJETAS BLANCAS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleDark}>📅 Próximas Citas ({PROFILE_DATA.citas.este_anio} en 2025)</Text>
            <TouchableOpacity onPress={() => toggleSection('citas')}>
              <ChevronRight 
                size={24} 
                color={RIMAC_COLORS.white} 
              />
            </TouchableOpacity>
          </View>

          {PROFILE_DATA.citas.proximas.map((cita, idx) => (
            <View key={idx} style={styles.citaCard}>
              <View style={styles.citaHeader}>
                <View style={styles.citaBadgeContainer}>
                  <Text style={styles.citaBadge}>{cita.especialidad}</Text>
                </View>
                <Text style={[
                  styles.citaEstado,
                  cita.estado === 'Confirmada' ? styles.confirmedBadge : styles.pendingBadge
                ]}>
                  {cita.estado}
                </Text>
              </View>

              <Text style={styles.citaDoctor}>{cita.doctor}</Text>
              
              <View style={styles.citaDetails}>
                <View style={styles.citaDetailItem}>
                  <Text style={styles.citaDetailLabel}>Fecha</Text>
                  <Text style={styles.citaDetailValue}>{formatearFecha(cita.fecha)}</Text>
                </View>
                <View style={styles.citaDetailItem}>
                  <Text style={styles.citaDetailLabel}>Hora</Text>
                  <Text style={styles.citaDetailValue}>🕐 {cita.hora}</Text>
                </View>
              </View>

              <View style={styles.citaDivider} />
              <Text style={styles.citaClinica}>{cita.clinica}</Text>
            </View>
          ))}
        </View>

        {/* MEDICAMENTOS - TARJETAS BLANCAS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleDark}>💊 Medicamentos Activos</Text>
            <TouchableOpacity onPress={() => toggleSection('medicamentos')}>
              <ChevronRight 
                size={24} 
                color={RIMAC_COLORS.white}
              />
            </TouchableOpacity>
          </View>

          {PROFILE_DATA.salud.medicamentos.map((med, idx) => (
            <View key={idx} style={styles.medicamentoCard}>
              <View style={styles.medicamentoHeader}>
                <View style={styles.medicamentoInfo}>
                  <Text style={styles.medicamentoNombre}>{med.nombre}</Text>
                  <Text style={styles.medicamentoFrecuencia}>⏰ {med.frecuencia}</Text>
                </View>
                <View style={styles.medicamentoBadge}>
                  <Text style={styles.medicamentoBadgeText}>✓ Activo</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* SALUD - TARJETA BLANCA GRANDE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleDark}>❤️ Perfil de Salud</Text>

          <View style={styles.healthCard}>
            <View style={styles.healthGrid}>
              <View style={styles.healthItem}>
                <Text style={styles.healthLabel}>Grupo</Text>
                <Text style={styles.healthValue}>{PROFILE_DATA.salud.grupoSanguineo}</Text>
              </View>
              <View style={styles.healthItem}>
                <Text style={styles.healthLabel}>Presión</Text>
                <Text style={styles.healthValue}>{PROFILE_DATA.salud.presion}</Text>
              </View>
              <View style={styles.healthItem}>
                <Text style={styles.healthLabel}>Peso</Text>
                <Text style={styles.healthValue}>{PROFILE_DATA.salud.peso} kg</Text>
              </View>
              <View style={styles.healthItem}>
                <Text style={styles.healthLabel}>IMC</Text>
                <Text style={styles.healthValue}>{PROFILE_DATA.salud.imc}</Text>
              </View>
            </View>

            {PROFILE_DATA.salud.condiciones.length > 0 && (
              <View style={styles.condicionesSection}>
                <Text style={styles.subLabel}>Condiciones Controladas:</Text>
                {PROFILE_DATA.salud.condiciones.map((cond, idx) => (
                  <Text key={idx} style={styles.condicion}>✓ {cond}</Text>
                ))}
              </View>
            )}

            {PROFILE_DATA.salud.alergias.length > 0 && (
              <View style={styles.alergiasSection}>
                <Text style={styles.alertLabel}>⚠️ Alergias Importantes:</Text>
                {PROFILE_DATA.salud.alergias.map((alergia, idx) => (
                  <Text key={idx} style={styles.alergia}>{alergia}</Text>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* CUIDADOR - TARJETA BLANCA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleDark}>👨‍👩‍👧 Cuidador Asignado</Text>

          <View style={styles.cuidadorCard}>
            <View style={styles.cuidadorHeader}>
              <View style={styles.cuidadorIcon}>
                <Text style={styles.cuidadorInitial}>
                  {PROFILE_DATA.cuidador.nombre.charAt(0)}
                </Text>
              </View>
              <View style={styles.cuidadorInfo}>
                <Text style={styles.cuidadorNombre}>{PROFILE_DATA.cuidador.nombre}</Text>
                <Text style={styles.cuidadorRelacion}>{PROFILE_DATA.cuidador.relacion}</Text>
              </View>
            </View>
            <View style={styles.cuidadorDivider} />
            <View style={styles.cuidadorContacto}>
              <Text style={styles.contactoLabel}>📞 {PROFILE_DATA.cuidador.telefono}</Text>
              <Text style={styles.notificacionLabel}>✓ Recibe notificaciones de citas y medicinas</Text>
            </View>
          </View>
        </View>

        {/* MIRA A TU FAMILIA */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.familiaHeaderButton}
            onPress={() => setFamiliaExpanded(!familiaExpanded)}
            activeOpacity={0.75}
          >
            <View style={styles.familiaHeaderContent}>
              <View style={styles.familiaHeaderLeft}>
                <Text style={styles.familiaHeaderIcon}>👨‍👩‍👧‍👦</Text>
                <View style={styles.familiaHeaderText}>
                  <Text style={styles.familiaHeaderTitle}>Mira a tu Familia</Text>
                  <Text style={styles.familiaHeaderSubtitle}>
                    {PROFILE_DATA.familia.length} familiares disponibles
                  </Text>
                </View>
              </View>
              <ChevronRight 
                size={24}
                color={RIMAC_COLORS.primary}
                style={familiaExpanded ? { transform: [{ rotate: '90deg' }] } : {}}
                strokeWidth={1.5}
              />
            </View>
          </TouchableOpacity>

          {familiaExpanded && (
            <View style={styles.familiaListContainer}>
              {PROFILE_DATA.familia.map((familiar, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.familiarCard}
                  onPress={() => {
                    setSelectedFamiliar(familiar);
                    setFamiliarModalVisible(true);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.familiarLeft}>
                    <View style={styles.familiarAvatar}>
                      <Text style={styles.familiarAvatarLetter}>
                        {familiar.nombre.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.familiarInfo}>
                      <Text style={styles.familiarName}>{familiar.nombre}</Text>
                      <Text style={styles.familiarRelation}>{familiar.relacion} • {familiar.edad} años</Text>
                      <View style={styles.familiarStatus}>
                        {familiar.enTratamiento && (
                          <View style={styles.statusBadge}>
                            <Text style={styles.statusBadgeText}>💊 En tratamiento</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  <ChevronRight 
                    size={20}
                    color={RIMAC_COLORS.gray[400]}
                    strokeWidth={1.5}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* BENEFICIOS - TARJETAS BLANCAS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleDark}>🎁 Beneficios Activos</Text>

          {PROFILE_DATA.beneficios.map((beneficio, idx) => (
            <View key={idx} style={styles.beneficioCard}>
              <View style={styles.beneficioContent}>
                <Text style={styles.beneficioTitulo}>{beneficio.titulo}</Text>
                <Text style={styles.beneficioEstado}>{beneficio.estado}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ANTECEDENTES HEREDITARIOS */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.hereditaryButton}
            activeOpacity={0.75}
            onPress={() => router.push('/hereditary-health')}
          >
            <View style={styles.hereditaryContent}>
              <View style={styles.hereditaryIcon}>
                <Dna size={24} color={RIMAC_COLORS.primary} strokeWidth={1.5} />
              </View>
              <View style={styles.hereditaryText}>
                <Text style={styles.hereditaryTitle}>Antecedentes Hereditarios</Text>
                <Text style={styles.hereditarySubtitle}>
                  Detecta enfermedades heredadas en tu familia
                </Text>
              </View>
              <ChevronRight 
                size={22} 
                color={RIMAC_COLORS.primary} 
                strokeWidth={1.5}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* BOTÓN EMERGENCIA - ROJO LLAMATIVO */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.emergencyButton} 
            activeOpacity={0.8}
            onPress={handleEmergencyPress}
          >
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              style={styles.emergencyGradient}
            >
              <Text style={styles.emergencyButtonText}>🚨 BOTÓN DE EMERGENCIA</Text>
              <Text style={styles.emergencySubtext}>Solicitar ambulancia RIMAC</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: SPACING['4xl'] }} />
      </ScrollView>

      {/* EMERGENCY MODAL */}
      <EmergencyModal
        visible={emergencyModalVisible}
        onClose={() => setEmergencyModalVisible(false)}
        onConfirm={handleEmergencyConfirm}
        userName={PROFILE_DATA.nombre}
        userPhone={PROFILE_DATA.telefono}
        userAddress={PROFILE_DATA.ubicacion}
      />

      {/* FAMILIAR DETAILS MODAL */}
      <Modal
        visible={familiarModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFamiliarModalVisible(false)}
      >
        <LinearGradient
          colors={[RIMAC_COLORS.primary, RIMAC_COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.modalGradient}
        >
          <ScrollView style={styles.modalContainer} showsVerticalScrollIndicator={false}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={() => setFamiliarModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color={RIMAC_COLORS.white} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Información Familiar</Text>
              <View style={{ width: 40 }} />
            </View>

            {selectedFamiliar && (
              <View style={styles.modalContent}>
                {/* Información Personal */}
                <View style={styles.modalCard}>
                  <View style={styles.modalCardHeader}>
                    <Text style={styles.modalCardTitle}>👤 Información Personal</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nombre</Text>
                    <Text style={styles.infoValue}>{selectedFamiliar.nombre}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Relación</Text>
                    <Text style={styles.infoValue}>{selectedFamiliar.relacion}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Edad</Text>
                    <Text style={styles.infoValue}>{selectedFamiliar.edad} años</Text>
                  </View>
                </View>

                {/* Última Cita */}
                <View style={styles.modalCard}>
                  <View style={styles.modalCardHeader}>
                    <Text style={styles.modalCardTitle}>📅 Última Cita Médica</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fecha</Text>
                    <Text style={styles.infoValue}>
                      {new Date(selectedFamiliar.ultimaCita).toLocaleDateString('es-PE')}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Especialista</Text>
                    <Text style={styles.infoValue}>{selectedFamiliar.especialista}</Text>
                  </View>
                </View>

                {/* Tratamiento Activo */}
                {selectedFamiliar.enTratamiento && (
                  <View style={styles.modalCard}>
                    <View style={styles.modalCardHeader}>
                      <Text style={styles.modalCardTitle}>💊 Tratamiento Activo</Text>
                    </View>
                    <View style={styles.treatmentBox}>
                      <Text style={styles.treatmentText}>{selectedFamiliar.tratamiento}</Text>
                    </View>
                  </View>
                )}

                {/* Recetas Activas */}
                {selectedFamiliar.recetasActivas.length > 0 && (
                  <View style={styles.modalCard}>
                    <View style={styles.modalCardHeader}>
                      <Text style={styles.modalCardTitle}>💉 Recetas Activas</Text>
                    </View>
                    {selectedFamiliar.recetasActivas.map((receta, idx) => (
                      <View key={idx} style={styles.recetaItem}>
                        <Text style={styles.recetaIcon}>💊</Text>
                        <Text style={styles.recetaText}>{receta}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Indicaciones del Doctor */}
                <View style={styles.modalCard}>
                  <View style={styles.modalCardHeader}>
                    <Text style={styles.modalCardTitle}>📋 Indicaciones del Doctor</Text>
                  </View>
                  <View style={styles.instructionsBox}>
                    <Text style={styles.instructionsText}>{selectedFamiliar.indicaciones}</Text>
                  </View>
                </View>

                {/* Recomendaciones */}
                <View style={styles.modalCard}>
                  <View style={styles.modalCardHeader}>
                    <Text style={styles.modalCardTitle}>✨ Recomendaciones</Text>
                  </View>
                  <View style={styles.recommendationsBox}>
                    <Text style={styles.recommendationsText}>{selectedFamiliar.recomendaciones}</Text>
                  </View>
                </View>

                {!selectedFamiliar.enTratamiento && selectedFamiliar.recetasActivas.length === 0 && (
                  <View style={styles.modalCard}>
                    <Text style={styles.noDataText}>✓ Sin tratamientos activos</Text>
                  </View>
                )}

                <View style={{ height: SPACING['3xl'] }} />
              </View>
            )}
          </ScrollView>
        </LinearGradient>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },

  /* HEADER */
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: RIMAC_COLORS.white,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 44,
    fontWeight: '800',
    color: RIMAC_COLORS.primary,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: RIMAC_COLORS.white,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  basicInfo: {
    alignItems: 'center',
  },
  basicInfoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  locationText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
  },

  /* SECTION */
  section: {
    padding: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitleDark: {
    fontSize: 18,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
    flex: 1,
  },

  /* POINTS CARD - BLANCA */
  pointsCard: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    shadowColor: RIMAC_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  pointsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[600],
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pointsValue: {
    fontSize: 40,
    fontWeight: '800',
    color: RIMAC_COLORS.primary,
  },
  levelBadge: {
    backgroundColor: '#FFD700',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  levelBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: RIMAC_COLORS.primary,
  },
  pointsProgress: {
    marginBottom: SPACING.md,
  },
  progressBar: {
    height: 10,
    backgroundColor: RIMAC_COLORS.gray[200],
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: BORDER_RADIUS.full,
  },
  progressText: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[600],
    fontWeight: '500',
  },
  discountText: {
    fontSize: 14,
    fontWeight: '600',
    color: RIMAC_COLORS.primary,
    marginTop: SPACING.sm,
  },

  /* CITAS - BLANCAS */
  citaCard: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: RIMAC_COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  citaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  citaBadgeContainer: {
    backgroundColor: RIMAC_COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  citaBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
  },
  citaEstado: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  confirmedBadge: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  citaDoctor: {
    fontSize: 16,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[900],
    marginBottom: SPACING.md,
  },
  citaDetails: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.md,
  },
  citaDetailItem: {
    flex: 1,
  },
  citaDetailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[500],
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  citaDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[800],
  },
  citaDivider: {
    height: 1,
    backgroundColor: RIMAC_COLORS.gray[200],
    marginBottom: SPACING.md,
  },
  citaClinica: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[600],
    fontWeight: '500',
  },

  /* MEDICAMENTOS - BLANCAS */
  medicamentoCard: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: RIMAC_COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicamentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicamentoInfo: {
    flex: 1,
  },
  medicamentoNombre: {
    fontSize: 15,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  medicamentoFrecuencia: {
    fontSize: 13,
    color: RIMAC_COLORS.gray[600],
    fontWeight: '500',
  },
  medicamentoBadge: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: '#D1FAE5',
  },
  medicamentoBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },

  /* SALUD - BLANCA */
  healthCard: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: RIMAC_COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  healthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  healthItem: {
    flex: 1,
    minWidth: 110,
  },
  healthLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[500],
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  healthValue: {
    fontSize: 16,
    fontWeight: '700',
    color: RIMAC_COLORS.primary,
  },
  condicionesSection: {
    marginBottom: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: RIMAC_COLORS.gray[200],
    paddingTop: SPACING.lg,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[800],
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  condicion: {
    fontSize: 13,
    color: RIMAC_COLORS.gray[700],
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  alergiasSection: {
    borderTopWidth: 1,
    borderTopColor: RIMAC_COLORS.gray[200],
    paddingTop: SPACING.lg,
  },
  alertLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: SPACING.md,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  alergia: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '600',
    marginBottom: SPACING.sm,
    paddingLeft: SPACING.md,
  },

  /* CUIDADOR - BLANCA */
  cuidadorCard: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: RIMAC_COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cuidadorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  cuidadorIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: RIMAC_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  cuidadorInitial: {
    fontSize: 24,
    fontWeight: '800',
    color: RIMAC_COLORS.white,
  },
  cuidadorInfo: {
    flex: 1,
  },
  cuidadorNombre: {
    fontSize: 16,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  cuidadorRelacion: {
    fontSize: 13,
    color: RIMAC_COLORS.gray[600],
    fontWeight: '500',
  },
  cuidadorDivider: {
    height: 1,
    backgroundColor: RIMAC_COLORS.gray[200],
    marginBottom: SPACING.lg,
  },
  cuidadorContacto: {
  },
  contactoLabel: {
    fontSize: 13,
    color: RIMAC_COLORS.gray[700],
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  notificacionLabel: {
    fontSize: 13,
    color: '#065F46',
    fontWeight: '600',
  },

  /* BENEFICIOS - BLANCAS */
  beneficioCard: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: RIMAC_COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  beneficioContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  beneficioTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[800],
    flex: 1,
  },
  beneficioEstado: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
    marginLeft: SPACING.md,
  },

  /* EMERGENCY */
  emergencyButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  emergencyGradient: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emergencyButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: RIMAC_COLORS.white,
    marginBottom: SPACING.xs,
  },
  emergencySubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
  },

  /* HEREDITARY HEALTH BUTTON */
  hereditaryButton: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: RIMAC_COLORS.primary + '30',
    overflow: 'hidden',
    shadowColor: RIMAC_COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hereditaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  hereditaryIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: RIMAC_COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hereditaryText: {
    flex: 1,
  },
  hereditaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  hereditarySubtitle: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[600],
    fontWeight: '400',
    lineHeight: 16,
  },

  /* FAMILIA SECTION */
  familiaHeaderButton: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: RIMAC_COLORS.primary + '20',
    overflow: 'hidden',
    shadowColor: RIMAC_COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  familiaHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  familiaHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  familiaHeaderIcon: {
    fontSize: 32,
  },
  familiaHeaderText: {
    flex: 1,
  },
  familiaHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  familiaHeaderSubtitle: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[600],
    fontWeight: '400',
  },
  familiaListContainer: {
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  familiarCard: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: RIMAC_COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  familiarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
    flex: 1,
  },
  familiarAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: RIMAC_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  familiarAvatarLetter: {
    fontSize: 20,
    fontWeight: '800',
    color: RIMAC_COLORS.white,
  },
  familiarInfo: {
    flex: 1,
  },
  familiarName: {
    fontSize: 14,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  familiarRelation: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[600],
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  familiarStatus: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
  },

  /* MODAL */
  modalGradient: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  modalCloseButton: {
    padding: SPACING.sm,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
    flex: 1,
    textAlign: 'center',
  },
  modalContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  modalCard: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: RIMAC_COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalCardHeader: {
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: RIMAC_COLORS.gray[200],
  },
  modalCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: RIMAC_COLORS.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: RIMAC_COLORS.gray[100],
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[600],
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[900],
  },
  treatmentBox: {
    backgroundColor: RIMAC_COLORS.gray[50],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  treatmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[900],
    lineHeight: 20,
  },
  recetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: RIMAC_COLORS.gray[100],
    gap: SPACING.md,
  },
  recetaIcon: {
    fontSize: 18,
  },
  recetaText: {
    fontSize: 13,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[800],
    flex: 1,
  },
  noDataText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
  instructionsBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  instructionsText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#92400E',
    lineHeight: 22,
  },
  recommendationsBox: {
    backgroundColor: '#D1FAE5',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  recommendationsText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#065F46',
    lineHeight: 22,
  },
});
