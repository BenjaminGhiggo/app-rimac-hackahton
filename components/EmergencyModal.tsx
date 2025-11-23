import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, AlertTriangle, CheckCircle, MapPin, Clock } from 'lucide-react-native';
import { RIMAC_COLORS, SPACING, BORDER_RADIUS } from '../theme';

interface EmergencyModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (location: { latitude: number; longitude: number }, consent: any) => void;
  userName: string;
  userPhone: string;
  userAddress: string;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  visible,
  onClose,
  onConfirm,
  userName,
  userPhone,
  userAddress,
}) => {
  const [step, setStep] = useState<'warning' | 'consent' | 'location' | 'sending'>('warning');
  const [medicalConsent, setMedicalConsent] = useState(false);
  const [firstAidConsent, setFirstAidConsent] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);

  // Obtener ubicación
  useEffect(() => {
    if (step === 'location') {
      getLocation();
    }
  }, [step]);

  const getLocation = useCallback(async () => {
    try {
      setLoading(true);
      
      // En Expo, usar geolocation
      const mockLocation = {
        latitude: -12.0963,  // Lima, Peru
        longitude: -77.0369,
      };

      // Simular ubicación real (en producción usar Location API de Expo)
      setTimeout(() => {
        setLocation(mockLocation);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'No se pudo obtener la ubicación');
      setLoading(false);
    }
  }, []);

  const handleConfirmEmergency = useCallback(() => {
    if (!location) return;

    setStep('sending');
    
    // Simular envío de datos
    setTimeout(() => {
      onConfirm(location, {
        medicalConsent,
        firstAidConsent,
        timestamp: new Date().toISOString(),
      });
      
      // Resetear para próxima emergencia
      setStep('warning');
      setMedicalConsent(false);
      setFirstAidConsent(false);
      setLocation(null);
    }, 1500);
  }, [location, medicalConsent, firstAidConsent, onConfirm]);

  const handleClose = useCallback(() => {
    setStep('warning');
    setMedicalConsent(false);
    setFirstAidConsent(false);
    setLocation(null);
    onClose();
  }, [onClose]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* BACKDROP */}
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={0.3}
        onPress={handleClose}
      />

      {/* MODAL */}
      <View style={styles.modal}>
        {/* HEADER - Rojo RIMAC */}
        <LinearGradient
          colors={[RIMAC_COLORS.primary, RIMAC_COLORS.primaryDark]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <AlertTriangle size={32} color={RIMAC_COLORS.white} />
            <Text style={styles.headerTitle}>🚨 EMERGENCIA MÉDICA</Text>
          </View>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleClose}
          >
            <X size={24} color={RIMAC_COLORS.white} />
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* STEP 1: ADVERTENCIA */}
          {step === 'warning' && (
            <View style={styles.step}>
              <View style={styles.warningBox}>
                <Text style={styles.warningIcon}>⚠️</Text>
                <Text style={styles.warningTitle}>Activar Emergencia</Text>
                <Text style={styles.warningText}>
                  Estás a punto de solicitar una ambulancia. Esta acción alertará a:
                </Text>

                <View style={styles.alertList}>
                  <Text style={styles.alertItem}>🚑 Una ambulancia RIMAC cercana</Text>
                  <Text style={styles.alertItem}>📍 Se compartirá tu ubicación en tiempo real</Text>
                  <Text style={styles.alertItem}>👨‍⚕️ Tu historial médico será compartido con paramedics</Text>
                  <Text style={styles.alertItem}>🏥 Serás trasladado al hospital más cercano</Text>
                </View>

                {/* ADVERTENCIA SOBRE BROMAS */}
                <View style={styles.jokeWarning}>
                  <Text style={styles.jokeWarningTitle}>⚠️ Advertencia Legal</Text>
                  <Text style={styles.jokeWarningText}>
                    Llamadas falsas de emergencia son un delito. No utilices este servicio para bromas. Las autoridades pueden rastrear llamadas fraudulentas.
                  </Text>
                </View>

                <Text style={styles.stepLabel}>Paso 1 de 4</Text>
              </View>

              <TouchableOpacity 
                style={styles.nextButton}
                onPress={() => setStep('consent')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[RIMAC_COLORS.primary, RIMAC_COLORS.primaryLight]}
                  style={styles.nextButtonGradient}
                >
                  <Text style={styles.nextButtonText}>Continuar → </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: CONSENTIMIENTO */}
          {step === 'consent' && (
            <View style={styles.step}>
              <Text style={styles.stepLabel}>Paso 2 de 4 - Consentimiento</Text>

              <View style={styles.consentBox}>
                <Text style={styles.consentTitle}>Autorización Médica</Text>
                <Text style={styles.consentSubtitle}>
                  Acepta los siguientes términos para continuar:
                </Text>

                {/* CONSENTIMIENTO 1 */}
                <TouchableOpacity 
                  style={styles.consentItem}
                  onPress={() => setMedicalConsent(!medicalConsent)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.checkbox,
                    medicalConsent && styles.checkboxChecked
                  ]}>
                    {medicalConsent && (
                      <CheckCircle size={20} color={RIMAC_COLORS.white} />
                    )}
                  </View>
                  <View style={styles.consentText}>
                    <Text style={styles.consentItemTitle}>
                      📋 Acceso a Historial Médico
                    </Text>
                    <Text style={styles.consentItemSubtitle}>
                      Autorizo compartir mi historial médico, alergias, medicamentos activos y condiciones crónicas con el equipo de emergencia para brindar atención adecuada.
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* CONSENTIMIENTO 2 */}
                <TouchableOpacity 
                  style={styles.consentItem}
                  onPress={() => setFirstAidConsent(!firstAidConsent)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.checkbox,
                    firstAidConsent && styles.checkboxChecked
                  ]}>
                    {firstAidConsent && (
                      <CheckCircle size={20} color={RIMAC_COLORS.white} />
                    )}
                  </View>
                  <View style={styles.consentText}>
                    <Text style={styles.consentItemTitle}>
                      🏥 Primeros Auxilios y Transporte
                    </Text>
                    <Text style={styles.consentItemSubtitle}>
                      Autorizo a los paramedics de RIMAC a proporcionarme primeros auxilios y trasladarme al hospital más cercano para evaluación y tratamiento.
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* INFO IMPORTANTE */}
                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>ℹ️ Información Importante</Text>
                  <Text style={styles.infoText}>
                    • Tu ubicación será monitoreada en tiempo real hasta tu llegada al hospital
                  </Text>
                  <Text style={styles.infoText}>
                    • Se notificará a tu cuidador (Patricia Herrera)
                  </Text>
                  <Text style={styles.infoText}>
                    • Los costos de ambulancia están cubiertos por tu póliza
                  </Text>
                </View>
              </View>

              <TouchableOpacity 
                style={[
                  styles.nextButton,
                  (!medicalConsent || !firstAidConsent) && styles.disabledButton
                ]}
                onPress={() => setStep('location')}
                disabled={!medicalConsent || !firstAidConsent}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    medicalConsent && firstAidConsent 
                      ? [RIMAC_COLORS.primary, RIMAC_COLORS.primaryLight]
                      : ['#cccccc', '#999999']
                  }
                  style={styles.nextButtonGradient}
                >
                  <Text style={styles.nextButtonText}>Continuar → </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 3: UBICACIÓN */}
          {step === 'location' && (
            <View style={styles.step}>
              <Text style={styles.stepLabel}>Paso 3 de 4 - Ubicación</Text>

              <View style={styles.locationBox}>
                <Text style={styles.locationTitle}>📍 Localizando tu Ubicación</Text>

                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={RIMAC_COLORS.primary} />
                    <Text style={styles.loadingText}>Obteniendo coordenadas GPS...</Text>
                    <Text style={styles.loadingSubtext}>(Asegúrate de permitir acceso a ubicación)</Text>
                  </View>
                ) : location ? (
                  <>
                    <View style={styles.locationInfo}>
                      <View style={styles.locationDetail}>
                        <Text style={styles.locationLabel}>Dirección</Text>
                        <Text style={styles.locationValue}>{userAddress}</Text>
                      </View>
                      <View style={styles.locationDetail}>
                        <Text style={styles.locationLabel}>Coordenadas GPS</Text>
                        <Text style={styles.locationValue}>
                          {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                        </Text>
                      </View>
                      <View style={styles.locationDetail}>
                        <Text style={styles.locationLabel}>Contacto de Emergencia</Text>
                        <Text style={styles.locationValue}>{userPhone}</Text>
                      </View>
                    </View>

                    <View style={styles.confirmBox}>
                      <CheckCircle size={32} color="#10B981" />
                      <Text style={styles.confirmText}>
                        ✓ Ubicación confirmada
                      </Text>
                      <Text style={styles.confirmSubtext}>
                        La ambulancia será enviada a esta dirección
                      </Text>
                    </View>
                  </>
                ) : (
                  <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={getLocation}
                  >
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                  </TouchableOpacity>
                )}
              </View>

              {location && (
                <>
                  <TouchableOpacity 
                    style={styles.nextButton}
                    onPress={() => setStep('sending')}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#EF4444', '#DC2626']}
                      style={styles.nextButtonGradient}
                    >
                      <Text style={styles.nextButtonText}>Enviar Ambulancia → </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={handleClose}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          {/* STEP 4: ENVIANDO */}
          {step === 'sending' && (
            <View style={styles.step}>
              <Text style={styles.stepLabel}>Paso 4 de 4 - Enviando</Text>

              <View style={styles.sendingBox}>
                <View style={styles.sendingAnimation}>
                  <ActivityIndicator size="large" color={RIMAC_COLORS.primary} />
                </View>
                <Text style={styles.sendingTitle}>Ambulancia en Camino</Text>
                <Text style={styles.sendingText}>
                  Se ha activado emergencia médica. Una ambulancia RIMAC ha sido asignada y está en camino a tu ubicación.
                </Text>

                <View style={styles.eta}>
                  <Clock size={24} color={RIMAC_COLORS.primary} />
                  <View style={styles.etaText}>
                    <Text style={styles.etaLabel}>Tiempo estimado de llegada</Text>
                    <Text style={styles.etaTime}>8-12 minutos</Text>
                  </View>
                </View>

                <View style={styles.notificationBox}>
                  <Text style={styles.notificationTitle}>✓ Notificaciones Enviadas</Text>
                  <Text style={styles.notificationItem}>• Tu cuidador (Patricia Herrera)</Text>
                  <Text style={styles.notificationItem}>• Central RIMAC</Text>
                  <Text style={styles.notificationItem}>• Equipo de Paramedics</Text>
                </View>

                <View style={styles.warningFinal}>
                  <Text style={styles.warningFinalText}>
                    ℹ️ Permanece en un lugar seguro. La ambulancia llegará con luces y sirena.
                  </Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.completeButton}
                onPress={handleClose}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.completeButtonGradient}
                >
                  <Text style={styles.completeButtonText}>Cerrar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modal: {
    backgroundColor: RIMAC_COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '90%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: RIMAC_COLORS.white,
  },
  closeButton: {
    padding: SPACING.md,
  },
  content: {
    maxHeight: '80%',
  },
  step: {
    padding: SPACING.lg,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.md,
  },

  /* STEP 1: WARNING */
  warningBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  warningIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: RIMAC_COLORS.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 14,
    color: RIMAC_COLORS.gray[800],
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  alertList: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  alertItem: {
    fontSize: 13,
    color: RIMAC_COLORS.gray[800],
    marginBottom: SPACING.md,
    fontWeight: '500',
  },
  jokeWarning: {
    backgroundColor: '#FCE7E7',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: RIMAC_COLORS.primary,
  },
  jokeWarningTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: RIMAC_COLORS.primary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  jokeWarningText: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[800],
    lineHeight: 18,
  },

  /* STEP 2: CONSENT */
  consentBox: {
    backgroundColor: RIMAC_COLORS.gray[50],
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  consentTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: RIMAC_COLORS.primary,
    marginBottom: SPACING.sm,
  },
  consentSubtitle: {
    fontSize: 13,
    color: RIMAC_COLORS.gray[600],
    marginBottom: SPACING.lg,
  },
  consentItem: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    alignItems: 'flex-start',
    gap: SPACING.lg,
  },
  checkbox: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: RIMAC_COLORS.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  checkboxChecked: {
    backgroundColor: RIMAC_COLORS.primary,
    borderColor: RIMAC_COLORS.primary,
  },
  consentText: {
    flex: 1,
  },
  consentItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  consentItemSubtitle: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[600],
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: '#D1FAE5',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  infoText: {
    fontSize: 12,
    color: '#065F46',
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },

  /* STEP 3: LOCATION */
  locationBox: {
    backgroundColor: RIMAC_COLORS.gray[50],
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: RIMAC_COLORS.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING['3xl'],
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[800],
    marginTop: SPACING.lg,
  },
  loadingSubtext: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[600],
    marginTop: SPACING.sm,
  },
  locationInfo: {
    marginBottom: SPACING.lg,
  },
  locationDetail: {
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: RIMAC_COLORS.gray[200],
  },
  locationLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[500],
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  locationValue: {
    fontSize: 14,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[900],
  },
  confirmBox: {
    backgroundColor: '#D1FAE5',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
    marginTop: SPACING.md,
  },
  confirmSubtext: {
    fontSize: 12,
    color: '#065F46',
    marginTop: SPACING.sm,
  },
  retryButton: {
    backgroundColor: RIMAC_COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
  },

  /* STEP 4: SENDING */
  sendingBox: {
    backgroundColor: RIMAC_COLORS.gray[50],
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  sendingAnimation: {
    marginBottom: SPACING.lg,
  },
  sendingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: RIMAC_COLORS.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  sendingText: {
    fontSize: 14,
    color: RIMAC_COLORS.gray[700],
    marginBottom: SPACING.lg,
    textAlign: 'center',
    lineHeight: 22,
  },
  eta: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
    alignItems: 'center',
    width: '100%',
  },
  etaText: {
    flex: 1,
  },
  etaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[600],
    textTransform: 'uppercase',
  },
  etaTime: {
    fontSize: 18,
    fontWeight: '800',
    color: RIMAC_COLORS.primary,
    marginTop: SPACING.xs,
  },
  notificationBox: {
    backgroundColor: '#D1FAE5',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    width: '100%',
  },
  notificationTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  notificationItem: {
    fontSize: 12,
    color: '#065F46',
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  warningFinal: {
    backgroundColor: '#FCE7E7',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: RIMAC_COLORS.primary,
  },
  warningFinalText: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[800],
    lineHeight: 18,
    fontWeight: '500',
  },

  /* BUTTONS */
  nextButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  nextButtonGradient: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: RIMAC_COLORS.white,
  },
  cancelButton: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: RIMAC_COLORS.gray[200],
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: RIMAC_COLORS.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  completeButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  completeButtonGradient: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: RIMAC_COLORS.white,
  },
});

export default EmergencyModal;

