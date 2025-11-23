#!/bin/bash

# 🧪 Script de Testing para API IA RIMAC
# Uso: bash scripts/test-api.sh

echo "════════════════════════════════════════════════════════"
echo "🧪 TESTING API IA - RIMAC SALUD AI"
echo "════════════════════════════════════════════════════════"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
API_URL="http://localhost:3000"
ENDPOINT="/ia/consultar"

echo -e "${BLUE}📋 PASO 1: Verificar que el backend está corriendo...${NC}"
echo ""

# Test 1: Conectar al backend
if curl -s "$API_URL/" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend está corriendo en $API_URL${NC}"
else
    echo -e "${RED}❌ Backend NO está corriendo${NC}"
    echo -e "${YELLOW}Solución: npm start en la terminal del servidor${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📋 PASO 2: Verificar endpoint /ia/consultar...${NC}"
echo ""

# Test 2: Testear endpoint sin pregunta (debe fallar)
echo -e "${YELLOW}Enviando: POST $API_URL$ENDPOINT (sin pregunta)${NC}"
RESPONSE=$(curl -s -X POST "$API_URL$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{}')

echo "Respuesta:"
echo "$RESPONSE" | head -c 100
echo ""
echo ""

# Test 3: Testear endpoint con pregunta
echo -e "${BLUE}📋 PASO 3: Testear con pregunta válida...${NC}"
echo ""

PREGUNTA="¿Qué debo hacer si tengo fiebre?"
echo -e "${YELLOW}Enviando: POST $API_URL$ENDPOINT${NC}"
echo -e "${YELLOW}Pregunta: \"$PREGUNTA\"${NC}"
echo ""
echo -e "${YELLOW}⏳ Esperando respuesta (2-5 segundos)...${NC}"
echo ""

# Hacer request y guardar respuesta
RESPONSE=$(curl -s -X POST "$API_URL$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{\"pregunta\": \"$PREGUNTA\"}")

# Verificar si hay respuesta
if echo "$RESPONSE" | grep -q "respuesta"; then
    echo -e "${GREEN}✅ Respuesta recibida:${NC}"
    echo ""
    echo "$RESPONSE" | grep -o '"respuesta":"[^"]*"' | head -c 150
    echo "..."
    echo ""
    echo -e "${GREEN}✅ ¡API funcionando correctamente!${NC}"
else
    echo -e "${RED}❌ No se recibió respuesta válida${NC}"
    echo "Respuesta del servidor:"
    echo "$RESPONSE"
    exit 1
fi

echo ""
echo -e "${BLUE}📋 PASO 4: Testear con otro síntoma...${NC}"
echo ""

PREGUNTA2="Me duele la cabeza y tengo mareos"
echo -e "${YELLOW}Enviando: \"$PREGUNTA2\"${NC}"
echo -e "${YELLOW}⏳ Esperando respuesta...${NC}"
echo ""

RESPONSE2=$(curl -s -X POST "$API_URL$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{\"pregunta\": \"$PREGUNTA2\"}")

if echo "$RESPONSE2" | grep -q "respuesta"; then
    echo -e "${GREEN}✅ Segunda respuesta recibida${NC}"
    echo "$RESPONSE2" | grep -o '"respuesta":"[^"]*"' | head -c 150
    echo "..."
else
    echo -e "${RED}❌ Error en segunda petición${NC}"
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo -e "${GREEN}🎉 TESTING COMPLETADO${NC}"
echo "════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}Próximos pasos:${NC}"
echo "1. Abre la app: npm run android (o npm run ios)"
echo "2. Presiona: 'EVALÚA TUS SÍNTOMAS'"
echo "3. Escribe: Un síntoma"
echo "4. ¡La IA debería responder!"
echo ""
echo -e "${YELLOW}Si algo no funciona, revisa:${NC}"
echo "• docs/API_TESTING_GUIDE.md (Troubleshooting)"
echo "• Logs del backend en la otra terminal"
echo "• DevTools Console en el navegador (F12)"
echo ""

