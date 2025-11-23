/**
 * Servicio Bedrock Directo para Frontend
 * Usa AWS Bedrock directamente sin necesidad de servidor intermediario
 * Ideal para desarrollo y pruebas rápidas
 */

export interface BedrockDirectResponse {
  respuesta: string;
  modelo: string;
  contextoUtilizado: boolean;
}

// Mock context para desarrollo (RAG simulado)
const MOCK_CONTEXT = `
=== Protocolo de Triaje Médico ===

SÍNTOMAS COMUNES Y RECOMENDACIONES:

1. FIEBRE:
   - Urgencia: Hoy (monitorear temperatura)
   - Acción: Reposo, hidratación, paracetamol
   - Especialista: Medicina General
   - Alerta: Si >39°C o >3 días → Urgente

2. DOLOR DE CABEZA:
   - Urgencia: Programable
   - Acción: Reposo, analgésicos
   - Especialista: Neurología si es frecuente
   - Alerta: Si es pulsátil o con visión borrosa → Hoy

3. DOLOR ABDOMINAL (Pancita):
   - Urgencia: Varía según localización
   - Acción: Reposo, esperar cambios
   - Especialista: Gastroenterología
   - Alerta: Si hay vómitos persistentes → Urgente

4. RESFRIADO:
   - Urgencia: Programable
   - Acción: Reposo, vitamina C, hidratación
   - Especialista: Medicina General
   - Alerta: Si hay dificultad respiratoria → Urgente

5. MAREOS:
   - Urgencia: Hoy si es severo
   - Acción: Reposo, hidratación
   - Especialista: Neurología o Cardiología
   - Alerta: Si hay visión doble o pérdida de consciencia → Urgente

6. GRIPE:
   - Urgencia: Hoy
   - Acción: Antiviral, reposo, hidratación
   - Especialista: Medicina General
   - Alerta: Si hay problemas respiratorios → Urgente

=== PROTOCOLO DE SEGURIDAD ===
- Siempre recomendar consulta médica para diagnóstico confirmado
- No recetar medicinas específicamente
- Clasificar por urgencia: Urgente (ahora), Hoy, Programable
- Mencionar síntomas de alarma
- Recordar que esto es orientación, no diagnóstico

=== TRIAJE RÁPIDO ===
URGENTE: Dificultad respiratoria, pecho, pérdida de consciencia, hemorragia
HOY: Fiebre >39°C, dolor severo, vómitos persistentes
PROGRAMABLE: Síntomas leves, malestares generales
`;

class BedrockDirectService {
  private contextCache: string = MOCK_CONTEXT;

  /**
   * Simula respuesta de Claude (mock para desarrollo)
   * En producción, esto conectaría a AWS Bedrock real
   */
  private generarRespuestaMock(pregunta: string): string {
    const preguntaLower = pregunta.toLowerCase();

    // Respuestas contextualizadas según la pregunta
    if (preguntaLower.includes('fiebre')) {
      return `He registrado que tienes fiebre. Según el protocolo de triaje:

📊 **Clasificación**: Hoy (monitorear)
🏥 **Acción recomendada**:
   • Mide tu temperatura cada 4 horas
   • Descansa y mantén hidratación constante
   • Paracetamol o ibuprofeno según necesites
   • Si supera 39°C o persiste >3 días → ¡Urgente!

👨‍⚕️ **Especialista sugerido**: Medicina General
📍 **Ubicación**: Clínicas RIMAC cercanas

¿Tienes otros síntomas? ¿Fiebre alta o dolor adicional?`;
    }

    if (preguntaLower.includes('dolor') && preguntaLower.includes('cabeza')) {
      return `He registrado dolor de cabeza. Según el protocolo médico:

📊 **Clasificación**: Programable (a menos que sea severo)
🏥 **Acción recomendada**:
   • Reposo en ambiente tranquilo y oscuro
   • Analgésicos (paracetamol o ibuprofeno)
   • Hidratación adecuada
   • Evita pantallas por 30 minutos

⚠️ **Síntomas de alerta**: Si es pulsátil intenso, con visión borrosa o acompañado de fiebre alta → Consulta hoy

👨‍⚕️ **Si es recurrente**: Recomendamos Neurología

¿Es tu primer episodio o es frecuente? ¿Acompañado de otros síntomas?`;
    }

    if (preguntaLower.includes('pancita') || preguntaLower.includes('abdominal') || preguntaLower.includes('estómago')) {
      return `He registrado dolor abdominal. Evalúemos:

📊 **Clasificación**: Depende de la localización y intensidad
🏥 **Acción recomendada**:
   • Reposo digestivo (evita comidas pesadas)
   • Agua tibia puede aliviar
   • Monitorea cambios en los síntomas
   • Observa si hay vómitos o cambios en heces

⚠️ **Síntomas de alerta - ¡Urgente!**:
   • Vómitos persistentes
   • Dolor muy intenso que empeora
   • Distensión abdominal severa
   • Posible apendicitis

👨‍⚕️ **Especialista**: Gastroenterología (si persiste)

¿El dolor es constante o intermitente? ¿Hay vómitos o cambios en tu digestión?`;
    }

    if (preguntaLower.includes('mareo')) {
      return `He registrado que tienes mareos. Evaluemos:

📊 **Clasificación**: Hoy si es severo o recurrente
🏥 **Acción recomendada**:
   • Siéntate o acuéstate inmediatamente
   • Hidratación inmediata
   • Respiración lenta y profunda
   • Evita movimientos bruscos

⚠️ **Síntomas de alerta - ¡Urgente!**:
   • Visión doble
   • Pérdida de equilibrio severa
   • Pérdida de consciencia
   • Dolor de pecho asociado

👨‍⚕️ **Especialista recomendado**: Neurología o Cardiología

¿Es tu primer episodio? ¿Acompañado de otros síntomas como taquicardia?`;
    }

    if (preguntaLower.includes('resfriado')) {
      return `He registrado un posible resfriado. Aquí está el protocolo:

📊 **Clasificación**: Programable
🏥 **Acción recomendada**:
   • Reposo adecuado (6-8 horas de sueño)
   • Hidratación constante (agua, té, caldo)
   • Vitamina C (cítricos, kiwi)
   • Vapores inhalados para descongestión
   • Medicamentos de venta libre si hay síntomas

⚠️ **Síntomas de alerta - ¡Urgente!**:
   • Dificultad para respirar
   • Fiebre muy alta (>39°C)
   • Tos persistente con flemas verdes

👨‍⚕️ **Especialista**: Medicina General (si persiste >10 días)

¿Tienes fiebre también? ¿Tos seca o con flemas?`;
    }

    if (preguntaLower.includes('gripe')) {
      return `He registrado síntomas de gripe. Protocolo de acción:

📊 **Clasificación**: Hoy (requiere atención)
🏥 **Acción recomendada**:
   • Antivirales tempranos (ideales en primeras 48h)
   • Reposo absoluto 24-48 horas
   • Hidratación agresiva
   • Aislamiento para evitar contagio
   • Paracetamol para síntomas

⚠️ **Síntomas de alerta - ¡Urgente!**:
   • Dificultad respiratoria
   • Dolor de pecho
   • Confusión mental

👨‍⚕️ **Especialista recomendado**: Medicina General - Urgencias

La gripe requiere evaluación médica rápida. ¿Cuándo comenzaron los síntomas?`;
    }

    // Respuesta genérica si no coincide
    return `He registrado tu síntoma: "${pregunta}"

📊 **Clasificación Inicial**: Programable
🏥 **Recomendación General**:
   • Reposo adecuado
   • Hidratación constante
   • Monitorea cambios en los síntomas
   • Si empeora → consulta hoy

⚠️ **Símbolos de alerta**:
   • Síntomas que empeoran rápidamente
   • Nuevos síntomas asociados
   • Persistencia >5 días

👨‍⚕️ **Próximo paso**: Consulta con Medicina General para evaluación

¿Puedes describir más detalles del síntoma? ¿Cuándo comenzó? ¿Has tenido esto antes?`;
  }

  /**
   * Consulta la IA Bedrock (versión mock para desarrollo)
   */
  async consultarIA(pregunta: string): Promise<BedrockDirectResponse> {
    try {
      console.log('🤖 [Bedrock Direct] Procesando pregunta...');
      console.log('📝 Pregunta:', pregunta);

      // Simular delay de procesamiento (como AWS)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generar respuesta basada en contexto
      const respuesta = this.generarRespuestaMock(pregunta);

      console.log('✅ Respuesta generada');
      console.log('📊 Contexto utilizado: Sí');

      return {
        respuesta: respuesta,
        modelo: 'mock-claude-triaje-v1',
        contextoUtilizado: true,
      };
    } catch (error) {
      console.error('❌ Error en consultarIA:', error);
      throw error;
    }
  }

  /**
   * Limpia el caché (para futuras mejoras)
   */
  clearCache(): void {
    console.log('✓ Caché limpiado');
  }
}

// Exportar instancia singleton
export const bedrockDirectService = new BedrockDirectService();


