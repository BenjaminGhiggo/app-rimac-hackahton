import * as fs from 'fs';
import * as path from 'path';

export interface BedrockResponse {
  respuesta: string;
  modelo: string;
  contextoUtilizado: boolean;
}

class BedrockService {
  private readonly BEDROCK_ENDPOINT = 'https://bedrock-runtime.us-east-1.amazonaws.com/model/anthropic.claude-3-5-sonnet-20240620-v1:0/invoke';
  private readonly BEARER_TOKEN: string;
  private contextCache: string | null = null;

  constructor() {
    this.BEARER_TOKEN = process.env.AWS_BEARER_TOKEN_BEDROCK || '';
    if (!this.BEARER_TOKEN) {
      console.warn('AWS_BEARER_TOKEN_BEDROCK no está configurado');
    }
  }

  /**
   * Lee y combina el contenido de todos los archivos de contexto (RAG)
   * Carga documentos clínicos para alimentar el contexto de la IA
   */
  private async loadContext(): Promise<string> {
    if (this.contextCache) {
      return this.contextCache;
    }

    try {
      const contextDir = path.join(__dirname, 'context');
      
      // Verificar que el directorio existe
      if (!fs.existsSync(contextDir)) {
        console.warn(`Directorio de contexto no encontrado: ${contextDir}`);
        return '';
      }

      const files = fs.readdirSync(contextDir).sort(); // Ordenar para consistencia
      
      if (files.length === 0) {
        console.warn('No se encontraron archivos de contexto');
        return '';
      }

      const documents: string[] = [];
      
      for (const file of files) {
        if (file.endsWith('.txt')) {
          const filePath = path.join(contextDir, file);
          const content = fs.readFileSync(filePath, 'utf-8').trim();
          
          if (content) {
            documents.push(`=== Documento: ${file} ===\n${content}`);
          }
        }
      }

      if (documents.length === 0) {
        console.warn('No se encontró contenido en los archivos de contexto');
        return '';
      }

      // Combinar todos los documentos con separadores claros
      this.contextCache = documents.join('\n\n');
      
      console.log(`✓ Contexto RAG cargado: ${documents.length} documentos`);
      return this.contextCache;
      
    } catch (error) {
      console.error('Error al cargar el contexto RAG:', error);
      return '';
    }
  }

  /**
   * Realiza una consulta a AWS Bedrock con el contexto clínico (RAG)
   * Retrieval-Augmented Generation: combina documentos recuperados con generación de IA
   */
  async consultarIA(pregunta: string): Promise<BedrockResponse> {
    try {
      // Paso 1: Recuperar contexto relevante (Retrieval)
      const contexto = await this.loadContext();

      if (!contexto) {
        throw new Error('No hay contexto clínico disponible');
      }

      // Paso 2: Construir prompt con contexto recuperado (Augmented)
      const prompt = `Eres un asistente médico especializado. Responde la pregunta basándote ÚNICAMENTE en la información clínica proporcionada.

CONTEXTO CLÍNICO DISPONIBLE:
${contexto}

PREGUNTA DEL PACIENTE:
${pregunta}

INSTRUCCIONES:
- Analiza cuidadosamente toda la información clínica proporcionada
- Responde de forma precisa, profesional y empática
- Cita específicamente los datos relevantes del contexto cuando sea apropiado
- Si la información no es suficiente para responder completamente, indícalo claramente
- No inventes ni especules información que no esté en el contexto
- Mantén un tono profesional pero accesible

RESPUESTA:`;

      // Paso 3: Generar respuesta con IA (Generation)
      const requestBody = {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5, // Temperatura más baja para respuestas más precisas y consistentes
        top_p: 0.9
      };

      const response = await fetch(this.BEDROCK_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.BEARER_TOKEN}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Bedrock API error:', errorBody);
        throw new Error(`Bedrock API error: ${response.status} - ${errorBody}`);
      }

      const data = await response.json();
      const respuesta = data.content?.[0]?.text || 'No se pudo generar una respuesta';

      // Validar que se generó una respuesta válida
      if (!respuesta || respuesta.length < 10) {
        throw new Error('Respuesta inválida o vacía de la IA');
      }

      return {
        respuesta: respuesta.trim(),
        modelo: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        contextoUtilizado: contexto.length > 0
      };
    } catch (error) {
      console.error('Error en consultarIA:', error);
      throw error;
    }
  }

  /**
   * Limpia el caché de contexto para forzar una recarga
   * Útil cuando se actualizan los documentos de contexto
   */
  clearContextCache(): void {
    this.contextCache = null;
    console.log('✓ Caché de contexto RAG limpiado');
  }
}

export const bedrockService = new BedrockService();
