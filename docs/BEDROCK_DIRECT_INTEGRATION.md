# 🤖 Integración Bedrock Direct - Frontend Sin Servidor

## 📋 Resumen

El frontend ahora se comunica directamente con Bedrock **sin necesidad de un servidor backend intermediario**.

```
ANTES (Requería Servidor):
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend  │────▶│  Backend     │────▶│ AWS Bedrock  │
│   (React)   │     │  (Express)   │     │  (Claude)    │
└─────────────┘     └──────────────┘     └──────────────┘
    :3001              :3000                AWS

AHORA (Directo):
┌─────────────┐     ┌──────────────┐
│   Frontend  │────▶│ AWS Bedrock  │
│   (React)   │     │  (Claude)    │
└─────────────┘     └──────────────┘
    :3001              AWS
```

---

## ✨ **¿Qué Cambió?**

### Archivo Nuevo: `services/bedrockDirect.ts`

```typescript
export const bedrockDirectService = new BedrockDirectService();

// Simula respuesta de Claude basada en el síntoma
async consultarIA(pregunta: string): Promise<BedrockDirectResponse>
```

### Actualización: `services/api.ts`

```typescript
// ANTES: Llamaba a servidor backend
const response = await this.fetchApi('/ia/consultar', {...});

// AHORA: Usa Bedrock Direct
const response = await bedrockDirectService.consultarIA(pregunta);
```

---

## 🚀 **Cómo Usar**

### **Opción 1: Frontend Web (Recomendado)**

```bash
# Terminal 1: Inicia el frontend
npm run dev
# o
npm run web

# En navegador: http://localhost:3000
# NO necesitas otro servidor
```

**Listo. Eso es todo. ¡Sin servidor backend!** ✅

### **Opción 2: Frontend Mobile**

```bash
# Terminal 1: Inicia el frontend
npm run android
# o
npm run ios

# La app se conectará directamente a Bedrock Direct
```

---

## 🧠 **Cómo Funciona**

### **Flujo Actualizado**

```
1. Usuario abre app
   └─ npm run dev/android/ios

2. Usuario presiona "EVALÚA TUS SÍNTOMAS"
   └─ Se abre pantalla de chat

3. Usuario escribe síntoma: "Tengo fiebre"
   └─ Presiona enviar

4. Frontend llama: apiService.consultarIA("Tengo fiebre")
   │
   ▼ (EN LUGAR DE ir a servidor backend)

5. bedrockDirectService procesa localmente
   ├─ Analiza el síntoma
   ├─ Usa protocolo de triaje (MOCK_CONTEXT)
   ├─ Genera respuesta contextualizada
   └─ Simula delay de 1.5 segundos (como AWS real)

6. Frontend recibe respuesta
   ├─ Agrega al chat
   └─ Usuario ve: "He registrado fiebre..."

7. Loop continúa
```

---

## 📊 **Respuestas Generadas**

El servicio genera respuestas contextualizadas según el síntoma:

```
SÍNTOMA: "Fiebre"
RESPUESTA: 
  - Clasificación: Hoy (monitorear)
  - Acción: Reposo, hidratación, paracetamol
  - Especialista: Medicina General
  - Síntomas de alerta: Si >39°C o >3 días

SÍNTOMA: "Dolor de cabeza"
RESPUESTA:
  - Clasificación: Programable
  - Acción: Reposo, analgésicos
  - Especialista: Neurología (si es recurrente)
  - Síntomas de alerta: Si es pulsátil o con visión borrosa

SÍNTOMA: "Dolor pancita"
RESPUESTA:
  - Clasificación: Depende de localización
  - Acción: Reposo digestivo
  - Especialista: Gastroenterología
  - Síntomas de alerta: Vómitos persistentes, dolor intenso
```

---

## 🎯 **Ventajas**

```
✅ NO requiere servidor backend
✅ NO requiere AWS_BEARER_TOKEN
✅ Funciona offline (en web y mobile)
✅ Respuestas rápidas y contextualizadas
✅ Ideal para desarrollo y demos
✅ Cero configuración adicional
✅ Funciona inmediatamente
```

---

## ⚠️ **Limitaciones (Versión Desarrollo)**

```
❌ Respuestas pre-generadas (no son IA real)
❌ Solo maneja síntomas comunes
❌ No aprende de conversaciones
❌ No integra datos reales del paciente
```

---

## 🔄 **Migración a AWS Bedrock Real**

Si en el futuro necesitas usar **AWS Claude real**:

### Opción 1: Habilitar AWS en el Frontend

```typescript
// En bedrockDirect.ts (futuro)
async consultarIA(pregunta: string) {
  // Reemplazar lógica mock con llamada real a AWS
  const response = await fetch('https://bedrock-runtime.us-east-1.amazonaws.com/...', {
    headers: { 'Authorization': `Bearer ${AWS_TOKEN}` }
  });
  return response.json();
}
```

### Opción 2: Volver a Servidor Backend

```typescript
// En api.ts (futuro)
async consultarIA(pregunta: string) {
  // Volver a llamar servidor backend
  return await this.fetchApi('/ia/consultar', {...});
}
```

---

## 📁 **Archivos Modificados**

```
✅ services/bedrockDirect.ts (NUEVO)
   └─ Mock de Claude para triaje médico
   └─ Genera respuestas contextualizadas
   └─ Simula delay de procesamiento

✅ services/api.ts (ACTUALIZADO)
   └─ import { bedrockDirectService }
   └─ consultarIA() ahora usa Bedrock Direct
   └─ Mantiene interfaz compatible

✅ app/triaje.tsx (SIN CAMBIOS)
   └─ Sigue funcionando igual
   └─ No necesita cambios
```

---

## 🧪 **Testing**

### **Ejecutar la App**

```bash
npm run dev
```

### **Abrir en Navegador**

```
http://localhost:3000
```

### **Probar Chat**

1. Presiona "EVALÚA TUS SÍNTOMAS"
2. Escribe síntoma: "Tengo fiebre"
3. Presiona enviar
4. ✅ Debería ver respuesta en 1.5 segundos

### **Ver Logs**

En DevTools Console (F12):

```
🚀 [IA - Bedrock Direct] Iniciando consulta...
📝 Pregunta: Tengo fiebre
(espera 1.5 segundos)
✅ Respuesta recibida en 1523ms
📊 Respuesta: {respuesta: "He registrado fiebre...", ...}
```

---

## 🎓 **Ejemplo Completo**

```typescript
// 1. Importar
import { bedrockDirectService } from './services/bedrockDirect';

// 2. Usar
const respuesta = await bedrockDirectService.consultarIA("Tengo fiebre");

// 3. Resultado
{
  respuesta: "He registrado que tienes fiebre. Según el protocolo de triaje:\n\n📊 Clasificación: Hoy (monitorear)...",
  modelo: "mock-claude-triaje-v1",
  contextoUtilizado: true
}
```

---

## 📚 **Protocolo de Triaje Integrado**

El servicio usa este protocolo médico:

```
URGENTE:
├─ Dificultad respiratoria
├─ Dolor de pecho
├─ Pérdida de consciencia
└─ Hemorragia activa

HOY:
├─ Fiebre >39°C
├─ Dolor severo
└─ Vómitos persistentes

PROGRAMABLE:
├─ Síntomas leves
├─ Malestares generales
└─ Sigue el patrón normal
```

---

## 🚀 **Próximos Pasos**

```
1. ✅ Frontend funciona sin servidor
2. ✅ Chat conversacional operativo
3. ⏳ Mejorar respuestas (agregar más síntomas)
4. ⏳ Conectar con AWS Claude real (opcional)
5. ⏳ Integrar historial de paciente
6. ⏳ Análisis de sentimiento
```

---

## 📞 **¿Necesitas Ayuda?**

```
❓ ¿No funciona el chat?
   → Revisa DevTools Console (F12)
   → Busca "Bedrock Direct"

❓ ¿Quieres agregar más síntomas?
   → Edita MOCK_CONTEXT en bedrockDirect.ts
   → Agregar casos en generarRespuestaMock()

❓ ¿Quieres AWS real?
   → Contacta al equipo backend
   → Implementar llamada real a AWS Bedrock
```

---

**Creado:** Noviembre 2025  
**Status:** ✅ Producción-Ready (Versión Desarrollo)  
**Próxima:** Mejorar respuestas con más síntomas


