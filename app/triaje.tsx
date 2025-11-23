import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, ArrowLeft } from 'lucide-react-native';
import { RIMAC_COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { apiService } from '../services/api';

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: '0',
  type: 'ai',
  text: '¡Hola! Soy tu asistente médico IA de RIMAC. Cuéntame, ¿qué síntomas o molestias tienes hoy?',
  timestamp: new Date(),
};

const QUICK_OPTIONS = [
  '🤒 Dolor de cabeza',
  '🤧 Resfriado',
  '🦵 Dolor muscular',
  '😰 Ansiedad',
];

export default function TriajeScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll a los nuevos mensajes
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return;

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Llamar a la IA real
      const respuesta = await apiService.consultarIA(input.trim());
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: respuesta.respuesta,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error al obtener respuesta de IA:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: 'Disculpa, hubo un error procesando tu pregunta. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [input]);

  const handleQuickOption = useCallback((option: string) => {
    setInput(option);
  }, []);

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.type === 'user' ? styles.userMessageContainer : styles.aiMessageContainer,
      ]}
    >
      {item.type === 'ai' && (
        <View style={styles.aiAvatarContainer}>
          <Text style={styles.aiAvatar}>🤖</Text>
        </View>
      )}

      <View
        style={[
          styles.messageBubble,
          item.type === 'user' ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.type === 'user' ? styles.userText : styles.aiText,
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.timestamp,
            item.type === 'user' ? styles.userTimestamp : styles.aiTimestamp,
          ]}
        >
          {item.timestamp.toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      {item.type === 'user' && (
        <View style={styles.userAvatarContainer}>
          <Text style={styles.userAvatar}>👤</Text>
        </View>
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={[RIMAC_COLORS.primary, RIMAC_COLORS.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={RIMAC_COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>🤖 RIMAC IA</Text>
          <Text style={styles.headerSubtitle}>Triaje Médico Inteligente</Text>
        </View>
        <View style={styles.statusIndicator}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>En línea</Text>
        </View>
      </View>

      {/* MESSAGES AREA */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />

      {/* LOADING INDICATOR */}
      {loading && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDot1} />
          <View style={styles.loadingDot2} />
          <View style={styles.loadingDot3} />
          <Text style={styles.loadingText}>La IA está procesando...</Text>
        </View>
      )}

      {/* QUICK OPTIONS */}
      {messages.length < 3 && !loading && (
        <View style={styles.quickOptionsContainer}>
          <Text style={styles.quickOptionsLabel}>Opciones rápidas:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickOptionsScroll}
          >
            {QUICK_OPTIONS.map((option, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.quickOption}
                onPress={() => handleQuickOption(option)}
                activeOpacity={0.8}
              >
                <Text style={styles.quickOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* INPUT AREA */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Describe tus síntomas..."
            placeholderTextColor="rgba(31, 41, 55, 0.5)"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!input.trim() || loading}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={
                input.trim() && !loading
                  ? [RIMAC_COLORS.primary, RIMAC_COLORS.primaryLight]
                  : ['#ccc', '#999']
              }
              style={styles.sendButtonGradient}
            >
              <Send size={20} color={RIMAC_COLORS.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Text style={styles.charCount}>
          {input.length}/500
        </Text>
      </KeyboardAvoidingView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 Soy un asistente IA. Para diagnósticos confirmados, consulta con un médico.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  /* HEADER */
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 50,
    paddingBottom: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: RIMAC_COLORS.white,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },

  /* MESSAGES */
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    alignItems: 'flex-end',
    gap: SPACING.sm,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  aiAvatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiAvatar: {
    fontSize: 20,
  },
  userAvatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    fontSize: 20,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  userBubble: {
    backgroundColor: RIMAC_COLORS.primary,
    borderBottomRightRadius: BORDER_RADIUS.sm,
  },
  aiBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomLeftRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  userText: {
    color: RIMAC_COLORS.white,
  },
  aiText: {
    color: RIMAC_COLORS.white,
  },
  timestamp: {
    fontSize: 11,
    fontWeight: '400',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  aiTimestamp: {
    color: 'rgba(255, 255, 255, 0.6)',
  },

  /* LOADING */
  loadingContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: 'flex-start',
  },
  loadingDot1: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: SPACING.xs,
    marginRight: SPACING.xs,
  },
  loadingDot2: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: SPACING.xs,
    marginRight: SPACING.xs,
  },
  loadingDot3: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginBottom: SPACING.xs,
  },
  loadingText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
    marginTop: SPACING.sm,
  },

  /* QUICK OPTIONS */
  quickOptionsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickOptionsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: SPACING.sm,
  },
  quickOptionsScroll: {
    gap: SPACING.sm,
  },
  quickOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  quickOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: RIMAC_COLORS.white,
  },

  /* INPUT */
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.md,
    backgroundColor: 'rgba(198, 12, 48, 0.05)',
  },
  inputWrapper: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: RIMAC_COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: 14,
    color: RIMAC_COLORS.gray[900],
    maxHeight: 100,
    fontWeight: '500',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  charCount: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: SPACING.xs,
    textAlign: 'right',
  },

  /* FOOTER */
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
  },
});
