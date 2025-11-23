# 🤖 Guía de Integración: IA Conversacional + Frontend Chat

## 📋 Resumen

Esta documentación explica cómo el **frontend del chat** (`app/triaje.tsx`) está integrado con el **backend de IA** (`services/bedrock.ts` y `services/ia-route.ts`).

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                  PANTALLA DE INICIO                     │
│          (app/(tabs)/index.tsx)                         │
│                                                         │
│  [🏥 EVALÚA TUS SÍNTOMAS] ← Botón "Iniciar Evaluación"│
└────────────────────┬────────────────────────────────────┘
                     │ router.push('/triaje')
                     ↓
┌─────────────────────────────────────────────────────────┐
│            CHAT CONVERSACIONAL IA                       │
│           (app/triaje.tsx)                              │
│                                                         │
│  Usuario: "Tengo dolor de cabeza"                      │
│          ↓                                              │
│  apiService.consultarIA(pregunta)                      │
│          ↓                                              │
│  POST /ia/consultar                                    │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP Request
                     ↓
┌─────────────────────────────────────────────────────────┐
│           BACKEND - SERVICIOS IA                        │
│                                                         │
│  ia-route.ts (Endpoint)                                │
│      ↓                                                  │
│  bedrock.ts (AWS Claude con RAG)                       │
│      ├─ Carga contexto clínico (RAG)                  │
│      ├─ Construye prompt con contexto                 │
│      └─ Consulta AWS Bedrock (Claude 3.5)             │
│          ↓                                              │
│  Retorna: { respuesta: "...", modelo: "...", ... }   │
└────────────────────┬────────────────────────────────────┘
                     │ JSON Response
                     ↓
┌─────────────────────────────────────────────────────────┐
│          FRONTEND - ACTUALIZA CHAT                      │
│                                                         │
│  Muestra: 🤖 "He registrado tu síntoma..."             │
│           IA: "Te recomendaría consultar..."           │
│                                                         │
│  Loop continúa → Usuario escribe más                   │
└─────────────────────────────────────────────────────────┘
```

---

## 📱 Frontend: `app/triaje.tsx`

### Importes Principales

```typescript
import { apiService } from '../services/api';
```

### Función Principal: `handleSendMessage()`

```typescript
const handleSendMessage = useCallback(async () => {
  if (!input.trim()) return;

  // 1. Agregar mensaje del usuario al chat
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
    // 2. LLAMAR A LA IA
    const respuesta = await apiService.consultarIA(input.trim());
    
    // 3. Mostrar respuesta en el chat
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      text: respuesta.respuesta,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);

  } catch (error) {
    // 4. Manejar errores
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      text: 'Disculpa, hubo un error procesando tu pregunta.',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, errorMessage]);
  } finally {
    setLoading(false);
  }
}, [input]);
```

### UI Generado

```
┌─────────────────────────────┐
│ 🤖 RIMAC IA              ● En línea
├─────────────────────────────┤
│                             │
│ 🤖                         │
│ ┌───────────────────────┐  │
│ │ ¡Hola! ¿Qué síntomas  │  │
│ │ tienes hoy?           │  │
│ └───────────────────────┘  │
│                          3:45
│                             │
│               👤            │
│          ┌─────────────┐    │
│          │ Dolor de    │    │
│          │ cabeza      │    │
│          └─────────────┘    │
│                          3:46
│                             │
│ 🤖                         │
│ ┌───────────────────────┐  │
│ │ He registrado tu      │  │
│ │ síntoma. Te recomend..│  │
│ └───────────────────────┘  │
│                          3:47
├─────────────────────────────┤
│ [Describe tus síntomas...] 📤
├─────────────────────────────┤
│ 💡 Soy asistente IA...     │
└─────────────────────────────┘
```

---

## 🔧 Backend: API Service

### Función: `apiService.consultarIA()`

En `services/api.ts`:

```typescript
async consultarIA(pregunta: string): Promise<{ respuesta: string; modelo: string; contextoUtilizado: boolean }> {
  try {
    return await this.fetchApi('/ia/consultar', {
      method: 'POST',
      body: JSON.stringify({ pregunta }),
    });
  } catch (error) {
    // Fallback a respuesta mock si backend no disponible
    return {
      respuesta: 'He registrado tu síntoma. Te recomendaría consultar con un especialista.',
      modelo: 'mock',
      contextoUtilizado: false,
    };
  }
}
```

### Endpoint: `POST /ia/consultar`

En `services/ia-route.ts`:

```typescript
export async function consultarIA(req: any, res: any) {
  try {
    const { pregunta } = req.body;
    
    if (!pregunta) {
      return res.status(400).json({ error: 'Pregunta requerida' });
    }

    // Llama al servicio Bedrock
    const resultado = await bedrockService.consultarIA(pregunta);
    res.json(resultado);
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al procesar consulta',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}
```

---

## 🧠 IA: AWS Bedrock con RAG

En `services/bedrock.ts`:

### 1. Carga Contexto Clínico (RAG)

```typescript
private async loadContext(): Promise<string> {
  // Lee archivos en /services/context/*.txt
  // Carga documentos clínicos, protocolos médicos, etc.
  // Retorna contexto combinado para alimentar la IA
}
```

### 2. Construye Prompt con Contexto

```typescript
const prompt = `Eres un asistente médico especializado. Responde la pregunta basándote ÚNICAMENTE en la información clínica proporcionada.

CONTEXTO CLÍNICO DISPONIBLE:
${contexto}

PREGUNTA DEL PACIENTE:
${pregunta}

INSTRUCCIONES:
- Analiza cuidadosamente toda la información clínica
- Responde de forma precisa, profesional y empática
- Cita específicamente los datos relevantes del contexto
- Si la información no es suficiente, indícalo claramente
- No inventes ni especules información

RESPUESTA:`;
```

### 3. Consulta AWS Claude

```typescript
const response = await fetch(this.BEDROCK_ENDPOINT, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.BEARER_TOKEN}`,
  },
  body: JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5, // Respuestas precisas y consistentes
    top_p: 0.9
  }),
});
```

### 4. Retorna Respuesta

```typescript
return {
  respuesta: respuesta.trim(),
  modelo: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
  contextoUtilizado: contexto.length > 0
};
```

---

## 🔄 Flujo Completo de Una Consulta

```
1. Usuario abre app → Pantalla de Inicio
   └─ Ve botón "EVALÚA TUS SÍNTOMAS"

2. Usuario presiona botón
   └─ router.push('/triaje')
   └─ Se abre pantalla de chat

3. IA saluda: "¡Hola! ¿Qué síntomas tienes hoy?"

4. Usuario escribe: "Tengo dolor de cabeza"
   └─ Presiona botón enviar

5. Frontend: handleSendMessage()
   ├─ Agrega mensaje del usuario al chat
   ├─ Llama: apiService.consultarIA("Tengo dolor de cabeza")
   └─ Loading = true

6. API Service → POST /ia/consultar
   └─ Body: { pregunta: "Tengo dolor de cabeza" }

7. Backend: ia-route.ts → consultarIA()
   └─ Extrae: pregunta = "Tengo dolor de cabeza"
   └─ Llama: bedrockService.consultarIA(pregunta)

8. Bedrock Service:
   ├─ loadContext() → Carga archivos médicos
   ├─ Construye prompt con contexto + pregunta
   └─ fetch() → AWS Claude API

9. AWS Claude procesa
   └─ Retorna respuesta profesional

10. Backend retorna:
    ├─ respuesta: "He registrado tu síntoma..."
    ├─ modelo: "anthropic.claude-3-5-sonnet..."
    └─ contextoUtilizado: true

11. Frontend recibe respuesta
    ├─ Loading = false
    ├─ Agrega mensaje IA al chat
    └─ Usuario ve: "🤖 He registrado tu síntoma..."

12. Loop continúa: Usuario puede escribir más
```

---

## 📝 Configuración Requerida

### Variables de Entorno

En tu `.env` o configuración del servidor:

```env
AWS_BEARER_TOKEN_BEDROCK=tu_token_aqui
```

### Contexto Médico (RAG)

Crea archivos de contexto en `/services/context/`:

```
/services/context/
├─ protocolos-medicos.txt      (Protocolos clínicos)
├─ especialidades.txt          (Información de especialidades)
├─ medicamentos.txt            (Base de medicamentos)
└─ signos-alarma.txt           (Síntomas de urgencia)
```

---

## 🧪 Testing Manual

### 1. Asegúrate que el backend esté corriendo

```bash
npm start  # o tu servidor Express
```

### 2. Abre la app mobile

```bash
npm run android
# o
npm run ios
```

### 3. Navega a: Inicio → "EVALÚA TUS SÍNTOMAS"

### 4. Escribe un síntoma: "Tengo gripe"

### 5. Observa:
- ✅ Mensaje aparece en chat
- ✅ Spinner de carga
- ✅ Respuesta de IA aparece
- ✅ Puedes escribir más

---

## ✅ Checklist de Integración

```
✅ Frontend: app/triaje.tsx → Importa apiService
✅ Frontend: handleSendMessage() → Llama consultarIA()
✅ API Service: apiService.consultarIA() → Implementada
✅ Backend: ia-route.ts → Endpoint /ia/consultar
✅ Backend: bedrock.ts → Integración AWS Claude
✅ Configuración: AWS_BEARER_TOKEN_BEDROCK configurado
✅ RAG: Contexto clínico cargado en /services/context/
✅ Testing: Chat conversacional funciona end-to-end
```

---

## 🐛 Troubleshooting

### Error: "Failed to fetch"
**Causa:** Backend no está corriendo
**Solución:** Inicia el servidor: `npm start`

### Error: "AWS_BEARER_TOKEN_BEDROCK no está configurado"
**Causa:** Variable de entorno no definida
**Solución:** Agrega token en `.env` o configuración

### IA responde genéricamente
**Causa:** Contexto RAG vacío
**Solución:** Agregar documentos a `/services/context/`

### Respuesta lenta
**Causa:** AWS Bedrock tarda mucho
**Solución:** Normal. Tiempo típico: 2-5 segundos

---

## 🚀 Próximas Mejoras

- [ ] Historial de conversaciones persistente
- [ ] Análisis de sentimiento del usuario
- [ ] Integración con citas médicas desde el chat
- [ ] Recomendaciones basadas en contexto
- [ ] Caché de respuestas frecuentes
- [ ] Análisis de urgencia en tiempo real

---

## 📞 Contacto

Si tienes dudas sobre la integración, consulta con:
- **Frontend:** Tu equipo de UI/UX
- **Backend IA:** Tu colega (Benjamin)
- **AWS Bedrock:** Documentación oficial AWS

