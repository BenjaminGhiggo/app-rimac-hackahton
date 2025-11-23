@echo off
REM 🧪 Script de Testing para API IA RIMAC (Windows)
REM Uso: scripts\test-api.bat

echo.
echo ════════════════════════════════════════════════════════
echo 🧪 TESTING API IA - RIMAC SALUD AI
echo ════════════════════════════════════════════════════════
echo.

setlocal enabledelayedexpansion
set "API_URL=http://localhost:3000"
set "ENDPOINT=/ia/consultar"

echo 📋 PASO 1: Verificar que el backend está corriendo...
echo.

REM Test 1: Conectar al backend
timeout /t 1 /nobreak > nul
curl -s "%API_URL%/" > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend está corriendo en %API_URL%
) else (
    echo ❌ Backend NO está corriendo
    echo Solución: npm start en la terminal del servidor
    pause
    exit /b 1
)

echo.
echo 📋 PASO 2: Testear endpoint /ia/consultar
echo.

echo Enviando: POST %API_URL%%ENDPOINT% (sin pregunta)
curl -X POST "%API_URL%%ENDPOINT%" ^
  -H "Content-Type: application/json" ^
  -d "{}"

echo.
echo.
echo 📋 PASO 3: Testear con pregunta válida...
echo.

set "PREGUNTA=¿Qué debo hacer si tengo fiebre?"
echo Enviando: POST %API_URL%%ENDPOINT%
echo Pregunta: "%PREGUNTA%"
echo.
echo ⏳ Esperando respuesta (2-5 segundos)...
echo.

curl -X POST "%API_URL%%ENDPOINT%" ^
  -H "Content-Type: application/json" ^
  -d "{"pregunta": "%PREGUNTA%"}"

echo.
echo.
echo ════════════════════════════════════════════════════════
echo 🎉 TESTING COMPLETADO
echo ════════════════════════════════════════════════════════
echo.
echo Próximos pasos:
echo 1. Abre la app: npm run android
echo 2. Presiona: 'EVALÚA TUS SÍNTOMAS'
echo 3. Escribe: Un síntoma
echo 4. ¡La IA debería responder!
echo.
echo Si algo no funciona, revisa:
echo • docs/API_TESTING_GUIDE.md (Troubleshooting)
echo • Logs del backend en la otra terminal
echo • DevTools Console en el navegador (F12)
echo.

pause

