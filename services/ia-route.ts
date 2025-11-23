/**
 * Endpoint para consultas con IA usando AWS Bedrock
 * Agregar a tu servidor Express existente
 */

import { bedrockService } from './bedrock';

// POST /ia/consultar
export async function consultarIA(req: any, res: any) {
  try {
    const { pregunta } = req.body;
    
    if (!pregunta) {
      return res.status(400).json({ error: 'Pregunta requerida' });
    }

    const resultado = await bedrockService.consultarIA(pregunta);
    res.json(resultado);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Error al procesar consulta',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}
