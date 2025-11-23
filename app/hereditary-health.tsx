import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Search,
  AlertCircle,
  Heart,
  Users,
  Dna,
} from 'lucide-react-native';
import { RIMAC_COLORS } from '../theme/colors';

interface FamilyMember {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  relation: 'mother' | 'father' | 'sister' | 'brother' | 'son' | 'daughter' | 'grandmother' | 'grandfather';
  conditions: string[];
  source: 'manual' | 'rimac_id';
  rimacId?: string;
}

interface HealthRisk {
  condition: string;
  risk: 'alto' | 'medio' | 'bajo';
  relatedMembers: string[];
  recommendation: string;
}

const relationshipLabels: Record<string, string> = {
  mother: 'Madre',
  father: 'Padre',
  sister: 'Hermana',
  brother: 'Hermano',
  son: 'Hijo',
  daughter: 'Hija',
  grandmother: 'Abuela',
  grandfather: 'Abuelo',
};

const commonConditions = [
  'Diabetes',
  'Hipertensión',
  'Cáncer',
  'Enfermedad Cardíaca',
  'Accidente Cerebrovascular',
  'Colesterol Alto',
  'Asma',
  'Artritis',
  'Depresión',
  'Alzheimer',
  'Parkinson',
  'Obesidad',
];

export default function HereditaryHealthScreen() {
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Brigitte Chavez Herrera',
      age: 65,
      gender: 'F',
      relation: 'mother',
      conditions: ['Diabetes', 'Hipertensión'],
      source: 'manual',
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'search' | 'manual'>('manual');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'F' as 'M' | 'F',
    relation: 'mother' as const,
    selectedConditions: [] as string[],
    rimacId: '',
  });

  // Search state
  const [searchId, setSearchId] = useState('');
  const [searchResults, setSearchResults] = useState<FamilyMember[]>([]);

  const openModal = (type: 'search' | 'manual', memberId?: string) => {
    if (memberId) {
      const member = members.find((m) => m.id === memberId);
      if (member) {
        setFormData({
          name: member.name,
          age: member.age.toString(),
          gender: member.gender,
          relation: member.relation,
          selectedConditions: member.conditions,
          rimacId: member.rimacId || '',
        });
        setEditingId(memberId);
      }
    } else {
      setFormData({
        name: '',
        age: '',
        gender: 'F',
        relation: 'mother',
        selectedConditions: [],
        rimacId: '',
      });
      setEditingId(null);
    }
    setModalType(type);
    setModalVisible(true);
  };

  const handleAddMember = () => {
    if (!formData.name || !formData.age) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const newMember: FamilyMember = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      relation: formData.relation,
      conditions: formData.selectedConditions,
      source: 'manual',
    };

    if (editingId) {
      setMembers(members.map((m) => (m.id === editingId ? newMember : m)));
    } else {
      setMembers([...members, newMember]);
    }

    setModalVisible(false);
    resetForm();
  };

  const handleSearchRimacId = () => {
    // Mock search - en producción sería una API call
    if (searchId.trim()) {
      const mockResults: FamilyMember[] = [
        {
          id: searchId,
          name: 'Brigitte Chavez Herrera',
          age: 65,
          gender: 'F',
          relation: 'mother',
          conditions: ['Diabetes', 'Hipertensión'],
          source: 'rimac_id',
          rimacId: searchId,
        },
      ];
      setSearchResults(mockResults);
    }
  };

  const handleSelectFromSearch = (member: FamilyMember) => {
    setMembers([...members, member]);
    setModalVisible(false);
    setSearchId('');
    setSearchResults([]);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      gender: 'F',
      relation: 'mother',
      selectedConditions: [],
      rimacId: '',
    });
    setEditingId(null);
  };

  const deleteMember = (id: string) => {
    Alert.alert('Eliminar', '¿Deseas eliminar este familiar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => setMembers(members.filter((m) => m.id !== id)),
      },
    ]);
  };

  const getRecommendation = (condition: string, risk: string): string => {
    const recommendations: Record<string, Record<string, string>> = {
      'Diabetes': {
        alto: 'Se recomienda hacer screening de glucosa cada 6 meses',
        medio: 'Realizar chequeo anual de glucosa',
        bajo: 'Mantén un estilo de vida saludable',
      },
      'Hipertensión': {
        alto: 'Monitorea tu presión arterial diariamente',
        medio: 'Realiza chequeos mensuales de presión',
        bajo: 'Chequeo anual recomendado',
      },
      'Cáncer': {
        alto: 'Consulta con oncología para screenings personalizados',
        medio: 'Realiza screenings según edad y tipo',
        bajo: 'Mantén revisiones preventivas',
      },
      'Enfermedad Cardíaca': {
        alto: 'Cardiología anual + ECG',
        medio: 'Chequeo cardiológico cada 2 años',
        bajo: 'Mantén buena salud cardiovascular',
      },
    };

    return (
      recommendations[condition]?.[risk] ||
      'Consulta con tu médico para recomendaciones personalizadas'
    );
  };

  const calculateRisks = (): HealthRisk[] => {
    const conditionMap: Record<string, FamilyMember[]> = {};

    members.forEach((member) => {
      member.conditions.forEach((condition) => {
        if (!conditionMap[condition]) {
          conditionMap[condition] = [];
        }
        conditionMap[condition].push(member);
      });
    });

    return Object.entries(conditionMap).map(([condition, relatedMembers]) => {
      let riskLevel: 'alto' | 'medio' | 'bajo' = 'bajo';
      
      // Calcular riesgo basado en:
      // - Número de familiares afectados
      // - Proximidad familiar (padres > abuelos)
      const directRelatives = relatedMembers.filter(
        (m) => m.relation === 'mother' || m.relation === 'father'
      ).length;

      if (directRelatives >= 2) {
        riskLevel = 'alto';
      } else if (directRelatives === 1) {
        riskLevel = 'medio';
      } else if (relatedMembers.length > 1) {
        riskLevel = 'medio';
      } else {
        riskLevel = 'bajo';
      }

      return {
        condition,
        risk: riskLevel,
        relatedMembers: relatedMembers.map((m) => m.name),
        recommendation: getRecommendation(condition, riskLevel),
      };
    });
  };

  const risks = calculateRisks().sort((a, b) => {
    const riskOrder = { alto: 0, medio: 1, bajo: 2 };
    return riskOrder[a.risk] - riskOrder[b.risk];
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[RIMAC_COLORS.white, '#F9FAFB']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Antecedentes Hereditarios</Text>
              <Text style={styles.subtitle}>
                Detecta enfermedades que podrían ser hereditarias
              </Text>
            </View>
            <View style={styles.headerIcon}>
              <Dna size={28} color={RIMAC_COLORS.primary} strokeWidth={1.5} />
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Mi Información */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mi Información</Text>
            </View>
            <View style={styles.myInfoCard}>
              <View style={styles.myInfoContent}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatar}>👤</Text>
                </View>
                <View style={styles.myInfoText}>
                  <Text style={styles.myInfoName}>Marisol Herrera Bruno</Text>
                  <Text style={styles.myInfoDetails}>32 años • Femenino</Text>
                </View>
              </View>
              <Heart size={24} color={RIMAC_COLORS.primary} strokeWidth={1.5} />
            </View>
          </View>

          {/* Familiares */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Miembros de la Familia</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => openModal('manual')}
              >
                <Plus size={18} color={RIMAC_COLORS.white} strokeWidth={2.5} />
                <Text style={styles.addButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>

            {members.length === 0 ? (
              <View style={styles.emptyState}>
                <Users size={40} color={RIMAC_COLORS.gray[400]} strokeWidth={1} />
                <Text style={styles.emptyStateText}>
                  Agrega familiares para detectar enfermedades hereditarias
                </Text>
              </View>
            ) : (
              <View style={styles.membersList}>
                {members.map((member) => (
                  <View key={member.id} style={styles.memberCard}>
                    <View style={styles.memberContent}>
                      <View style={styles.memberIcon}>
                        <Text style={styles.memberEmoji}>
                          {member.gender === 'F' ? '👩' : '👨'}
                        </Text>
                      </View>
                      <View style={styles.memberInfo}>
                        <Text style={styles.memberName}>{member.name}</Text>
                        <Text style={styles.memberRelation}>
                          {relationshipLabels[member.relation]} • {member.age} años
                        </Text>
                        <View style={styles.conditionsTags}>
                          {member.conditions.slice(0, 2).map((condition, idx) => (
                            <View key={idx} style={styles.conditionTag}>
                              <Text style={styles.conditionTagText}>{condition}</Text>
                            </View>
                          ))}
                          {member.conditions.length > 2 && (
                            <View style={styles.conditionTag}>
                              <Text style={styles.conditionTagText}>
                                +{member.conditions.length - 2}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                    <View style={styles.memberActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => openModal('manual', member.id)}
                      >
                        <Edit2 size={18} color={RIMAC_COLORS.primary} strokeWidth={1.5} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => deleteMember(member.id)}
                      >
                        <Trash2 size={18} color="#EF4444" strokeWidth={1.5} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Detector de Riesgos */}
          {risks.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Detector de Riesgos</Text>
              </View>

              {risks.map((risk, index) => (
                <View
                  key={index}
                  style={[
                    styles.riskCard,
                    risk.risk === 'alto' && styles.riskCardHigh,
                    risk.risk === 'medio' && styles.riskCardMedium,
                    risk.risk === 'bajo' && styles.riskCardLow,
                  ]}
                >
                  <View style={styles.riskHeader}>
                    <View style={styles.riskLeft}>
                      <AlertCircle
                        size={22}
                        color={
                          risk.risk === 'alto'
                            ? '#EF4444'
                            : risk.risk === 'medio'
                            ? RIMAC_COLORS.warning
                            : '#10B981'
                        }
                        strokeWidth={1.5}
                      />
                      <Text
                        style={[
                          styles.riskCondition,
                          risk.risk === 'alto' && styles.riskTextHigh,
                          risk.risk === 'medio' && styles.riskTextMedium,
                        ]}
                      >
                        {risk.condition}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.riskBadge,
                        risk.risk === 'alto' && styles.riskBadgeHigh,
                        risk.risk === 'medio' && styles.riskBadgeMedium,
                        risk.risk === 'bajo' && styles.riskBadgeLow,
                      ]}
                    >
                      <Text
                        style={[
                          styles.riskBadgeText,
                          risk.risk === 'alto' && styles.riskBadgeTextHigh,
                        ]}
                      >
                        {risk.risk === 'alto' ? 'ALTO' : risk.risk === 'medio' ? 'MEDIO' : 'BAJO'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.riskDetails}>
                    <Text style={styles.riskLabel}>Familiares afectados:</Text>
                    <Text style={styles.riskMembers}>{risk.relatedMembers.join(', ')}</Text>

                    <Text style={styles.riskLabel}>Recomendación:</Text>
                    <Text style={styles.riskRecommendation}>{risk.recommendation}</Text>
                  </View>

                  <TouchableOpacity style={styles.consultButton}>
                    <Text style={styles.consultButtonText}>Consultar con Doctor →</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Info Footer */}
          <View style={styles.infoBox}>
            <AlertCircle size={20} color={RIMAC_COLORS.primary} strokeWidth={1.5} />
            <Text style={styles.infoText}>
              Esta información es orientativa. Consulta con tu médico para diagnósticos
              confirmados y plan de tratamiento personalizado.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <SafeAreaView style={styles.modalContainer}>
          <LinearGradient
            colors={[RIMAC_COLORS.white, '#F9FAFB']}
            style={styles.modalGradient}
          >
            {/* Modal Tabs */}
            <View style={styles.modalTabs}>
              <TouchableOpacity
                style={[styles.modalTab, modalType === 'manual' && styles.modalTabActive]}
                onPress={() => setModalType('manual')}
              >
                <Text
                  style={[
                    styles.modalTabText,
                    modalType === 'manual' && styles.modalTabTextActive,
                  ]}
                >
                  Agregar Manual
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalTab, modalType === 'search' && styles.modalTabActive]}
                onPress={() => setModalType('search')}
              >
                <Text
                  style={[
                    styles.modalTabText,
                    modalType === 'search' && styles.modalTabTextActive,
                  ]}
                >
                  Buscar en RIMAC
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {modalType === 'manual' ? (
                // Manual Form
                <View style={styles.formSection}>
                  <Text style={styles.formLabel}>Nombre Completo</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ej: Brigitte Chavez Herrera"
                    value={formData.name}
                    onChangeText={(text) =>
                      setFormData({ ...formData, name: text })
                    }
                    placeholderTextColor={RIMAC_COLORS.gray[400]}
                  />

                  <View style={styles.twoColumnsRow}>
                    <View style={styles.twoColumnsItem}>
                      <Text style={styles.formLabel}>Edad</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Ej: 65"
                        keyboardType="numeric"
                        value={formData.age}
                        onChangeText={(text) =>
                          setFormData({ ...formData, age: text })
                        }
                        placeholderTextColor={RIMAC_COLORS.gray[400]}
                      />
                    </View>
                    <View style={styles.twoColumnsItem}>
                      <Text style={styles.formLabel}>Género</Text>
                      <View style={styles.genderButtons}>
                        {['M', 'F'].map((g) => (
                          <TouchableOpacity
                            key={g}
                            style={[
                              styles.genderButton,
                              formData.gender === g && styles.genderButtonActive,
                            ]}
                            onPress={() =>
                              setFormData({
                                ...formData,
                                gender: g as 'M' | 'F',
                              })
                            }
                          >
                            <Text
                              style={[
                                styles.genderButtonText,
                                formData.gender === g &&
                                  styles.genderButtonTextActive,
                              ]}
                            >
                              {g === 'M' ? '👨' : '👩'}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>

                  <Text style={styles.formLabel}>Relación Familiar</Text>
                  <View style={styles.relationshipGrid}>
                    {Object.entries(relationshipLabels).map(([key, label]) => (
                      <TouchableOpacity
                        key={key}
                        style={[
                          styles.relationshipButton,
                          formData.relation === key &&
                            styles.relationshipButtonActive,
                        ]}
                        onPress={() =>
                          setFormData({
                            ...formData,
                            relation: key as any,
                          })
                        }
                      >
                        <Text
                          style={[
                            styles.relationshipButtonText,
                            formData.relation === key &&
                              styles.relationshipButtonTextActive,
                          ]}
                        >
                          {label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.formLabel}>Antecedentes Médicos</Text>
                  <View style={styles.conditionsGrid}>
                    {commonConditions.map((condition) => (
                      <TouchableOpacity
                        key={condition}
                        style={[
                          styles.conditionButton,
                          formData.selectedConditions.includes(condition) &&
                            styles.conditionButtonActive,
                        ]}
                        onPress={() => {
                          const updated = formData.selectedConditions.includes(
                            condition
                          )
                            ? formData.selectedConditions.filter(
                                (c) => c !== condition
                              )
                            : [...formData.selectedConditions, condition];
                          setFormData({ ...formData, selectedConditions: updated });
                        }}
                      >
                        <Text
                          style={[
                            styles.conditionButtonText,
                            formData.selectedConditions.includes(condition) &&
                              styles.conditionButtonTextActive,
                          ]}
                        >
                          {condition}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleAddMember}
                  >
                    <Text style={styles.submitButtonText}>
                      {editingId ? 'Actualizar Familiar' : 'Agregar Familiar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // Search Form
                <View style={styles.formSection}>
                  <Text style={styles.formLabel}>Buscar por ID o Email RIMAC</Text>
                  <View style={styles.searchContainer}>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Ej: USR_12345 o email@rimac.com"
                      value={searchId}
                      onChangeText={setSearchId}
                      placeholderTextColor={RIMAC_COLORS.gray[400]}
                    />
                    <TouchableOpacity
                      style={styles.searchButton}
                      onPress={handleSearchRimacId}
                    >
                      <Search
                        size={20}
                        color={RIMAC_COLORS.white}
                        strokeWidth={2}
                      />
                    </TouchableOpacity>
                  </View>

                  {searchResults.length > 0 && (
                    <View style={styles.searchResults}>
                      <Text style={styles.searchResultsTitle}>Resultados</Text>
                      {searchResults.map((result) => (
                        <TouchableOpacity
                          key={result.id}
                          style={styles.searchResultCard}
                          onPress={() => handleSelectFromSearch(result)}
                        >
                          <View style={styles.searchResultContent}>
                            <Text style={styles.searchResultName}>
                              {result.name}
                            </Text>
                            <Text style={styles.searchResultInfo}>
                              {result.age} años • {relationshipLabels[result.relation]}
                            </Text>
                            <Text style={styles.searchResultConditions}>
                              {result.conditions.join(', ')}
                            </Text>
                          </View>
                          <ChevronRight
                            size={20}
                            color={RIMAC_COLORS.primary}
                            strokeWidth={2}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <View style={styles.infoBoxModal}>
                    <AlertCircle
                      size={20}
                      color={RIMAC_COLORS.primary}
                      strokeWidth={1.5}
                    />
                    <Text style={styles.infoTextModal}>
                      Busca a tus familiares que ya usan RIMAC para sincronizar
                      automáticamente sus datos de salud.
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                resetForm();
              }}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </LinearGradient>
        </SafeAreaView>
      </Modal>
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
    paddingVertical: 24,
    backgroundColor: RIMAC_COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: RIMAC_COLORS.gray[100],
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: RIMAC_COLORS.primary,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: RIMAC_COLORS.gray[600],
    fontWeight: '400',
    lineHeight: 20,
  },
  headerIcon: {
    marginLeft: 16,
    padding: 12,
    backgroundColor: RIMAC_COLORS.primary + '08',
    borderRadius: 12,
  },

  /* Sections */
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[900],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: RIMAC_COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: RIMAC_COLORS.white,
  },

  /* My Info Card */
  myInfoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: RIMAC_COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: RIMAC_COLORS.primary + '30',
    backgroundColor: RIMAC_COLORS.primary + '05',
  },
  myInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: RIMAC_COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: RIMAC_COLORS.primary,
  },
  avatar: {
    fontSize: 24,
  },
  myInfoText: {
    flex: 1,
  },
  myInfoName: {
    fontSize: 16,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[900],
    marginBottom: 2,
  },
  myInfoDetails: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[600],
    fontWeight: '500',
  },

  /* Members List */
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: RIMAC_COLORS.gray[600],
    fontWeight: '400',
    marginTop: 12,
    textAlign: 'center',
  },
  membersList: {
    gap: 10,
  },
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: RIMAC_COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: RIMAC_COLORS.gray[200],
  },
  memberContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  memberIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: RIMAC_COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberEmoji: {
    fontSize: 22,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[900],
    marginBottom: 2,
  },
  memberRelation: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[600],
    fontWeight: '400',
    marginBottom: 6,
  },
  conditionsTags: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  conditionTag: {
    backgroundColor: RIMAC_COLORS.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  conditionTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: RIMAC_COLORS.primary,
  },
  memberActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: RIMAC_COLORS.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Risk Cards */
  riskCard: {
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: RIMAC_COLORS.gray[200],
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  riskCardHigh: {
    borderColor: '#EF4444' + '40',
    backgroundColor: '#EF4444' + '05',
  },
  riskCardMedium: {
    borderColor: RIMAC_COLORS.warning + '40',
    backgroundColor: RIMAC_COLORS.warning + '05',
  },
  riskCardLow: {
    borderColor: '#10B981' + '40',
    backgroundColor: '#10B981' + '05',
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  riskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  riskCondition: {
    fontSize: 16,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[900],
  },
  riskTextHigh: {
    color: '#EF4444',
  },
  riskTextMedium: {
    color: RIMAC_COLORS.warning,
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: RIMAC_COLORS.gray[100],
  },
  riskBadgeHigh: {
    backgroundColor: '#EF4444' + '15',
  },
  riskBadgeMedium: {
    backgroundColor: RIMAC_COLORS.warning + '15',
  },
  riskBadgeLow: {
    backgroundColor: '#10B981' + '15',
  },
  riskBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[900],
    letterSpacing: 0.5,
  },
  riskBadgeTextHigh: {
    color: '#EF4444',
  },
  riskDetails: {
    gap: 8,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: RIMAC_COLORS.gray[100],
  },
  riskLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[700],
    marginTop: 4,
  },
  riskMembers: {
    fontSize: 13,
    color: RIMAC_COLORS.gray[900],
    fontWeight: '500',
  },
  riskRecommendation: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[700],
    fontWeight: '400',
    lineHeight: 16,
  },
  consultButton: {
    backgroundColor: RIMAC_COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  consultButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
    textAlign: 'center',
  },

  /* Info Box */
  infoBox: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: RIMAC_COLORS.primary + '08',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: RIMAC_COLORS.primary,
    gap: 10,
  },
  infoText: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[700],
    fontWeight: '500',
    lineHeight: 16,
    flex: 1,
  },

  /* Modal */
  modalContainer: {
    flex: 1,
    backgroundColor: RIMAC_COLORS.white,
  },
  modalGradient: {
    flex: 1,
  },
  modalTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: RIMAC_COLORS.gray[200],
  },
  modalTab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  modalTabActive: {
    borderBottomColor: RIMAC_COLORS.primary,
  },
  modalTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[500],
    textAlign: 'center',
  },
  modalTabTextActive: {
    color: RIMAC_COLORS.primary,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  /* Form */
  formSection: {
    gap: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[900],
    marginBottom: 6,
  },
  input: {
    backgroundColor: RIMAC_COLORS.white,
    borderWidth: 1,
    borderColor: RIMAC_COLORS.gray[300],
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: RIMAC_COLORS.gray[900],
  },
  twoColumnsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  twoColumnsItem: {
    flex: 1,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: RIMAC_COLORS.gray[300],
    backgroundColor: RIMAC_COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: RIMAC_COLORS.primary,
    borderColor: RIMAC_COLORS.primary,
  },
  genderButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[600],
  },
  genderButtonTextActive: {
    color: RIMAC_COLORS.white,
  },
  relationshipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relationshipButton: {
    flex: 0.48,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: RIMAC_COLORS.gray[300],
    backgroundColor: RIMAC_COLORS.white,
  },
  relationshipButtonActive: {
    backgroundColor: RIMAC_COLORS.primary,
    borderColor: RIMAC_COLORS.primary,
  },
  relationshipButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[700],
    textAlign: 'center',
  },
  relationshipButtonTextActive: {
    color: RIMAC_COLORS.white,
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionButton: {
    flex: 0.31,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: RIMAC_COLORS.gray[300],
    backgroundColor: RIMAC_COLORS.white,
  },
  conditionButtonActive: {
    backgroundColor: RIMAC_COLORS.primary + '20',
    borderColor: RIMAC_COLORS.primary,
  },
  conditionButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: RIMAC_COLORS.gray[700],
    textAlign: 'center',
  },
  conditionButtonTextActive: {
    color: RIMAC_COLORS.primary,
  },
  submitButton: {
    backgroundColor: RIMAC_COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 30,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
    textAlign: 'center',
  },

  /* Search */
  searchContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: RIMAC_COLORS.white,
    borderWidth: 1,
    borderColor: RIMAC_COLORS.gray[300],
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: RIMAC_COLORS.gray[900],
  },
  searchButton: {
    width: 44,
    backgroundColor: RIMAC_COLORS.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchResults: {
    gap: 10,
    marginBottom: 20,
  },
  searchResultsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[900],
  },
  searchResultCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: RIMAC_COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: RIMAC_COLORS.gray[200],
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 15,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[900],
    marginBottom: 3,
  },
  searchResultInfo: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[600],
    fontWeight: '400',
    marginBottom: 4,
  },
  searchResultConditions: {
    fontSize: 11,
    color: RIMAC_COLORS.primary,
    fontWeight: '500',
  },
  infoBoxModal: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: RIMAC_COLORS.primary + '08',
    borderRadius: 10,
    gap: 10,
    marginBottom: 30,
  },
  infoTextModal: {
    fontSize: 12,
    color: RIMAC_COLORS.gray[700],
    fontWeight: '500',
    lineHeight: 16,
    flex: 1,
  },

  /* Close Button */
  closeButton: {
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: RIMAC_COLORS.gray[300],
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: RIMAC_COLORS.gray[700],
    textAlign: 'center',
  },
});

