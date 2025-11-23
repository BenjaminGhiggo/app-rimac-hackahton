# 🧪 Guía de Testing: API IA + Frontend

## 📋 Resumen

Esta guía te ayuda a debuggear y verificar que la API funciona **antes** de intentar con el frontend.

---

## 🔧 **PASO 1: Verificar que el Backend Está Corriendo**

### Opción A: Usando cURL (Terminal)

```bash
# Abre una terminal y ejecuta:
curl -X GET http://localhost:3000/

# Debería responder (incluso con error es OK)
# Si dice "Connection refused" = Backend NO está corriendo
```

### Opción B: Usando Postman

1. Abre Postman
2. Nueva request
3. Method: **GET**
4. URL: `http://localhost:3000/`
5. Presiona Send
6. Si ves respuesta = ✅ Backend OK

### Opción C: Usando el Navegador

1. Abre: `http://localhost:3000/`
2. Si ves algo (incluso error) = ✅ Backend OK
3. Si dice "Connection refused" = ❌ Backend NO corre

---

## 🤖 **PASO 2: Testear el Endpoint de IA**

### Usando cURL (Recomendado)

```bash
curl -X POST http://localhost:3000/ia/consultar \
  -H "Content-Type: application/json" \
  -d '{"pregunta": "Tengo dolor de cabeza"}'
```

**Respuesta esperada:**

```json
{
  "respuesta": "He registrado tu síntoma de dolor de cabeza...",
  "modelo": "anthropic.claude-3-5-sonnet-20240620-v1:0",
  "contextoUtilizado": true
}
```

### Usando Postman

1. **Method:** POST
2. **URL:** `http://localhost:3000/ia/consultar`
3. **Headers:**
   ```
   Content-Type: application/json
   ```
4. **Body** (raw JSON):
   ```json
   {
     "pregunta": "¿Qué debo hacer si tengo fiebre?"
   }
   ```
5. Presiona **Send**

**Si ves error:**

```json
{
  "error": "Pregunta requerida"
}
```

Significa que la pregunta no está llegando correctamente.

---

## 🔍 **PASO 3: Ver los Logs del Backend**

### En la Terminal del Servidor

El servidor debería mostrar logs como:

```
✓ Contexto RAG cargado: 5 documentos
📤 POST /ia/consultar
├─ Pregunta: "Tengo dolor de cabeza"
├─ Llamando AWS Bedrock...
└─ Respuesta recibida en 2.3 segundos
```

**Si no ves logs:**
- ❌ El backend no está corriendo
- ❌ El logs no están configurados

**Si ves error de AWS:**
```
Error: AWS_BEARER_TOKEN_BEDROCK no está configurado
```

**Solución:** Configura la variable de entorno en `.env`

---

## 📱 **PASO 4: Testear desde el Frontend**

### Opción A: Agregar Log Console en el Chat

Edita `app/triaje.tsx` y agrega logs:

```typescript
const handleSendMessage = useCallback(async () => {
  if (!input.trim()) return;

  console.log('📤 Enviando mensaje:', input);
  
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
    console.log('🔄 Llamando apiService.consultarIA()...');
    const respuesta = await apiService.consultarIA(input.trim());
    
    console.log('✅ Respuesta recibida:', respuesta);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      text: respuesta.respuesta,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, aiMessage]);
    console.log('💬 Mensaje de IA agregado al chat');

  } catch (error) {
    console.error('❌ Error:', error);
    
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

### Opción B: Ver Logs en la Consola (DevTools)

1. Abre la app en el navegador (si usas web)
2. Presiona `F12` para abrir DevTools
3. Abre la pestaña **Console**
4. Escribe en el chat
5. Verás los logs:
   ```
   📤 Enviando mensaje: Tengo fiebre
   🔄 Llamando apiService.consultarIA()...
   ✅ Respuesta recibida: {...}
   💬 Mensaje de IA agregado al chat
   ```

---

## 🔗 **PASO 5: Flujo Completo de Testing**

### Secuencia Recomendada:

```
1. BACKEND
   └─ ¿npm start corriendo?
   └─ ¿Servidor en puerto 3000?
   └─ ¿Contexto RAG cargado?

2. API ENDPOINT
   └─ ¿curl http://localhost:3000/ responde?
   └─ ¿curl POST /ia/consultar funciona?
   └─ ¿Ves la respuesta JSON?

3. FRONTEND
   └─ ¿La app abre el chat?
   └─ ¿Escribo un síntoma?
   └─ ¿Se envía el mensaje?
   └─ ¿La IA responde?

4. LOGS
   └─ ¿Veo logs en DevTools Console?
   └─ ¿Veo logs en el servidor?
```

---

## 🎯 **Tabla de Troubleshooting**

| Problema | Síntoma | Solución |
|----------|---------|----------|
| Backend no corre | `ERR_CONNECTION_REFUSED` | `npm start` en servidor |
| Token AWS falta | Error en logs del servidor | Configura `.env` |
| Contexto RAG vacío | IA responde genéricamente | Agrega archivos a `/services/context/` |
| API lenta | Tarda >5 segundos | Normal. AWS es lento. Espera. |
| Frontend no conecta | Chat no envía | Verifica `API_BASE_URL` en `api.ts` |
| Mock data aparece | Ves "He registrado..." genérico | Backend cayó. Reinicia. |

---

## 📊 **Ejemplo de Testing Completo**

### 1️⃣ Terminal 1: Backend

```bash
$ npm start
✓ Server running on http://localhost:3000
✓ Contexto RAG cargado: 5 documentos
✓ AWS_BEARER_TOKEN_BEDROCK configurado
```

### 2️⃣ Terminal 2: Testing API con cURL

```bash
$ curl -X POST http://localhost:3000/ia/consultar \
  -H "Content-Type: application/json" \
  -d '{"pregunta": "Tengo fiebre"}'

# Respuesta después de 2-3 segundos:
{
  "respuesta": "He registrado tu síntoma de fiebre. Según la información clínica disponible, te recomendaría: 1) Medir tu temperatura... ",
  "modelo": "anthropic.claude-3-5-sonnet-20240620-v1:0",
  "contextoUtilizado": true
}
```

### 3️⃣ Terminal 3: Frontend

```bash
$ npm run android
# o
$ npm run ios

# Luego presionas "EVALÚA TUS SÍNTOMAS"
# Escribes: "Tengo fiebre"
# Presionas enviar
# ✅ Ver respuesta en el chat
```

### 4️⃣ Verificar Logs

En Terminal 1 verás:
```
📤 POST /ia/consultar
├─ Pregunta: "Tengo fiebre"
├─ Llamando AWS Bedrock...
└─ ✅ Respuesta recibida en 2.1 segundos
```

En DevTools Console verás:
```
📤 Enviando mensaje: Tengo fiebre
🔄 Llamando apiService.consultarIA()...
✅ Respuesta recibida: {respuesta: "...", ...}
💬 Mensaje de IA agregado al chat
```

---

## 🚨 **Casos de Error Comunes**

### Error 1: `ERR_CONNECTION_REFUSED`

**Qué significa:**
```
El frontend NO puede conectar al backend
```

**Causas:**
- Backend no está corriendo
- Puerto incorrecto (no es 3000)
- Firewall bloquea la conexión

**Solución:**
```bash
# 1. Verifica que backend está corriendo
curl http://localhost:3000/

# 2. Si no funciona, inicia el servidor
npm start

# 3. Si sigue fallando, verifica el puerto
# En el código, busca: PORT = 3000
```

### Error 2: `AWS_BEARER_TOKEN_BEDROCK no está configurado`

**Qué significa:**
```
Falta la credencial de AWS
```

**Solución:**
```bash
# En tu archivo .env o de configuración:
AWS_BEARER_TOKEN_BEDROCK=tu_token_aqui
```

### Error 3: `No hay contexto clínico disponible`

**Qué significa:**
```
No hay archivos en /services/context/
```

**Solución:**
```bash
# Crea la carpeta y agrega archivos .txt
mkdir services/context/
echo "contenido médico" > services/context/protocolos.txt
```

### Error 4: IA responde genéricamente

**Qué significa:**
```
Backend funcionó pero usó mock data
```

**Causas:**
- AWS rechazó la petición
- Contexto RAG vacío
- AWS_BEARER_TOKEN inválido

**Solución:**
- Verifica token en `.env`
- Agrega archivos a `/services/context/`
- Revisa logs del servidor

---

## ✅ **Checklist Final**

```
ANTES DE REPORTAR UN BUG:

□ ¿Backend está corriendo? (npm start)
□ ¿Puerto es 3000? (verifica en logs)
□ ¿API responde con cURL? (curl http://localhost:3000/)
□ ¿Endpoint /ia/consultar funciona? (POST request)
□ ¿AWS_BEARER_TOKEN configurado? (verifica .env)
□ ¿Contexto RAG existe? (ls services/context/)
□ ¿Frontend envía el mensaje? (DevTools Console)
□ ¿Frontend recibe respuesta? (DevTools Network)
□ ¿Respuesta se muestra en chat? (Visual)
```

Si todo esto funciona = ✅ Sistema 100% funcional

---

## 🔧 **Herramientas Útiles**

### cURL (Terminal)
```bash
# Test básico
curl http://localhost:3000/

# POST con JSON
curl -X POST http://localhost:3000/ia/consultar \
  -H "Content-Type: application/json" \
  -d '{"pregunta":"texto"}'

# Ver headers
curl -i http://localhost:3000/
```

### Postman (Visual)
- Descargar: https://www.postman.com/downloads/
- Interfaz gráfica para testing
- Perfecto para debuggear APIs

### DevTools (Navegador)
- F12 para abrir
- Console: Ver logs JavaScript
- Network: Ver peticiones HTTP
- Application: Ver localStorage

### Thunder Client (VS Code)
- Extensión de VS Code
- Similar a Postman pero integrado
- Instalar: `code --install-extension rangav.vscode-thunder-client`

---

## 🎓 **Resumen**

```
TESTING FLOW:

1. Backend corriendo? → ✅ Continúa
   ↓
2. API responde con cURL? → ✅ Continúa
   ↓
3. Endpoint /ia/consultar funciona? → ✅ Continúa
   ↓
4. Frontend envía mensaje? → ✅ Continúa
   ↓
5. Frontend recibe respuesta? → ✅ ¡Funciona!
   ↓
6. Respuesta en chat? → ✅ 🎉 ÉXITO
```

---

**Actualizado:** Noviembre 2025  
**Status:** Testing Guide v1.0  
**Próximo:** Agregar automated tests

