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
   * Lee y combina el contenido de todos los archivos de contexto
   */
  private async loadContext(): Promise<string> {
    if (this.contextCache) {
      return this.contextCache;
    }

    try {
      const contextDir = path.join(__dirname, 'context');
      const files = fs.readdirSync(contextDir);
      
      let contextContent = '';
      for (const file of files) {
        if (file.endsWith('.txt')) {
          const filePath = path.join(contextDir, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          contextContent += `\n\n--- Información del archivo ${file} ---\n${content}`;
        }
      }

      this.contextCache = contextContent;
      return contextContent;
    } catch (error) {
      console.error('Error al cargar el contexto:', error);
      return '';
    }
  }

  /**
   * Realiza una consulta a AWS Bedrock con el contexto clínico
   */
  async consultarIA(pregunta: string): Promise<BedrockResponse> {
    try {
      const contexto = await this.loadContext();

      const prompt = `Responde la pregunta en base a la información clínica que se tiene.

Información clínica del paciente:
${contexto}

Pregunta del usuario: ${pregunta}

Instrucciones:
- Utiliza únicamente la información clínica proporcionada
- Si la información no es suficiente para responder, indícalo claramente
- Sé preciso y profesional en tu respuesta
- Evita especular más allá de los datos disponibles`;

      const requestBody = {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
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
        throw new Error(`Bedrock API error: ${response.status}`);
      }

      const data = await response.json();
      const respuesta = data.content?.[0]?.text || 'Sin respuesta';

      return {
        respuesta,
        modelo: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        contextoUtilizado: contexto.length > 0
      };
    } catch (error) {
      throw error;
    }
  }
}

export const bedrockService = new BedrockService();
