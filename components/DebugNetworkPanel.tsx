import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { ChevronDown, X, Copy, AlertCircle } from 'lucide-react-native';
import { RIMAC_COLORS, SPACING, BORDER_RADIUS } from '../theme';

interface NetworkLog {
  id: string;
  method: string;
  endpoint: string;
  status: 'pending' | 'success' | 'error';
  timestamp: Date;
  duration?: number;
  request?: any;
  response?: any;
  error?: string;
}

let networkLogs: NetworkLog[] = [];

export const addNetworkLog = (log: Omit<NetworkLog, 'id'>) => {
  networkLogs.push({
    ...log,
    id: Date.now().toString(),
  });
  // Mantener solo los últimos 50 logs
  if (networkLogs.length > 50) {
    networkLogs.shift();
  }
};

export default function DebugNetworkPanel() {
  const [visible, setVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<NetworkLog | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'success':
        return '#10B981';
      case 'error':
        return '#EF4444';
      case 'pending':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  }, []);

  const getStatusLabel = useCallback((status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '❓';
    }
  }, []);

  const copyToClipboard = useCallback((text: string) => {
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(text);
    }
    Alert.alert('Copiado', 'Contenido copiado al portapapeles');
  }, []);

  return (
    <>
      {/* Botón Flotante */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.debugIcon}>🔧</Text>
        <Text style={styles.logCount}>{networkLogs.length}</Text>
      </TouchableOpacity>

      {/* Modal de Debug */}
      <Modal
        visible={visible && !selectedLog}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🔧 Network Debug Panel</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <X size={24} color={RIMAC_COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Logs List */}
          <ScrollView style={styles.logsList} showsVerticalScrollIndicator={false}>
            {networkLogs.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No hay logs de red aún</Text>
              </View>
            ) : (
              networkLogs.map((log, idx) => (
                <TouchableOpacity
                  key={log.id}
                  style={styles.logItem}
                  onPress={() => setSelectedLog(log)}
                >
                  <View style={styles.logHeader}>
                    <Text style={styles.logStatus}>
                      {getStatusLabel(log.status)}
                    </Text>
                    <View style={styles.logInfo}>
                      <Text style={styles.logMethod}>{log.method}</Text>
                      <Text style={styles.logEndpoint} numberOfLines={1}>
                        {log.endpoint}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(log.status) },
                      ]}
                    />
                  </View>
                  <View style={styles.logFooter}>
                    <Text style={styles.logTime}>
                      {log.timestamp.toLocaleTimeString('es-PE')}
                    </Text>
                    {log.duration && (
                      <Text style={styles.logDuration}>{log.duration}ms</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                networkLogs = [];
                setVisible(false);
              }}
            >
              <Text style={styles.clearButtonText}>🗑️ Limpiar Logs</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Detalle */}
      {selectedLog && (
        <Modal animationType="slide" transparent={true}>
          <View style={styles.detailContainer}>
            {/* Header */}
            <View style={styles.detailHeader}>
              <TouchableOpacity onPress={() => setSelectedLog(null)}>
                <Text style={styles.backText}>◀ Volver</Text>
              </TouchableOpacity>
              <Text style={styles.detailTitle}>Detalles de Request</Text>
              <View style={{ width: 60 }} />
            </View>

            {/* Contenido */}
            <ScrollView style={styles.detailContent}>
              {/* Request Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📤 Request</Text>
                <View style={styles.infoBox}>
                  <View style={styles.infoPair}>
                    <Text style={styles.infoLabel}>Método:</Text>
                    <Text style={styles.infoValue}>{selectedLog.method}</Text>
                  </View>
                  <View style={styles.infoPair}>
                    <Text style={styles.infoLabel}>Endpoint:</Text>
                    <Text style={styles.infoValue}>{selectedLog.endpoint}</Text>
                  </View>
                  <View style={styles.infoPair}>
                    <Text style={styles.infoLabel}>Status:</Text>
                    <Text
                      style={[
                        styles.infoValue,
                        { color: getStatusColor(selectedLog.status) },
                      ]}
                    >
                      {selectedLog.status.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.infoPair}>
                    <Text style={styles.infoLabel}>Tiempo:</Text>
                    <Text style={styles.infoValue}>
                      {selectedLog.timestamp.toLocaleTimeString('es-PE')}
                    </Text>
                  </View>
                  {selectedLog.duration && (
                    <View style={styles.infoPair}>
                      <Text style={styles.infoLabel}>Duración:</Text>
                      <Text style={styles.infoValue}>{selectedLog.duration}ms</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Request Body */}
              {selectedLog.request && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>📝 Request Body</Text>
                  <TouchableOpacity
                    style={styles.jsonBox}
                    onPress={() => {
                      copyToClipboard(JSON.stringify(selectedLog.request, null, 2));
                    }}
                  >
                    <Text style={styles.jsonText}>
                      {JSON.stringify(selectedLog.request, null, 2)}
                    </Text>
                    <Copy size={16} color={RIMAC_COLORS.primary} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Response */}
              {selectedLog.response && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>📥 Response</Text>
                  <TouchableOpacity
                    style={styles.jsonBox}
                    onPress={() => {
                      copyToClipboard(JSON.stringify(selectedLog.response, null, 2));
                    }}
                  >
                    <Text style={styles.jsonText}>
                      {JSON.stringify(selectedLog.response, null, 2)}
                    </Text>
                    <Copy size={16} color={RIMAC_COLORS.primary} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Error */}
              {selectedLog.error && (
                <View style={styles.section}>
                  <View style={styles.errorBox}>
                    <AlertCircle size={20} color="#EF4444" />
                    <Text style={styles.errorText}>{selectedLog.error}</Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: RIMAC_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  debugIcon: {
    fontSize: 28,
  },
  logCount: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    color: RIMAC_COLORS.white,
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },

  /* Modal */
  modalContainer: {
    flex: 1,
    backgroundColor: '#1F2937',
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: RIMAC_COLORS.white,
  },

  logsList: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
  },

  logItem: {
    backgroundColor: '#374151',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  logStatus: {
    fontSize: 18,
  },
  logInfo: {
    flex: 1,
  },
  logMethod: {
    color: RIMAC_COLORS.white,
    fontWeight: '600',
    fontSize: 12,
  },
  logEndpoint: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 2,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  logFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logTime: {
    color: '#6B7280',
    fontSize: 11,
  },
  logDuration: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '600',
  },

  footer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  clearButton: {
    backgroundColor: '#EF4444',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  clearButtonText: {
    color: RIMAC_COLORS.white,
    fontWeight: '600',
  },

  /* Detail Modal */
  detailContainer: {
    flex: 1,
    backgroundColor: '#1F2937',
    paddingTop: 50,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backText: {
    color: RIMAC_COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: RIMAC_COLORS.white,
  },

  detailContent: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },

  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: RIMAC_COLORS.white,
    marginBottom: SPACING.md,
  },

  infoBox: {
    backgroundColor: '#374151',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  infoPair: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
  },
  infoLabel: {
    color: '#9CA3AF',
    fontWeight: '600',
    fontSize: 12,
  },
  infoValue: {
    color: RIMAC_COLORS.white,
    fontSize: 12,
    fontWeight: '500',
  },

  jsonBox: {
    backgroundColor: '#374151',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jsonText: {
    color: '#D1D5DB',
    fontSize: 11,
    fontFamily: 'monospace',
    flex: 1,
    marginRight: SPACING.md,
  },

  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#EF4444',
    padding: SPACING.md,
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'flex-start',
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 12,
    flex: 1,
  },
});

