# Auditor de Mensajes de Resolución

Skill especializada en extraer horas de trabajo declaradas explícitamente por el técnico en la columna `Mensaje de Resolución` del archivo maestro.

## Reglas de Auditoría (Text Extraction Edition)

### 1. Patrones de Extracción (Regex)
Buscamos expresiones que indiquen duración o tiempo de labor de forma directa:
- `(\d+)\s*horas?\s*de\s*trabajo`
- `duración\s*(?:del)?\s*trabajo\s*[:\s]*(\d+)\s*horas?`
- `duración\s*[:\s]*(\d+)\s*horas?`
- `tiempo\s*de\s*labor\s*[:\s]*(\d+)\s*horas?`
- `(\d+)\s*hs\s*de\s*trabajo`

### 2. Prioridad de Campo
- El análisis se centra **exclusivamente** en el contenido de la columna `Mensaje de Resolución`.
- Si se encuentran múltiples menciones, se toma el valor más coherente o el primero detectado.

## Procedimiento de Ejecución (Protocolo ETAPA)

### E - Estrategia
- Analizar el texto de `Mensaje de Resolución` fila por fila.
- Aplicar un set de expresiones regulares exhaustivas para capturar variaciones lingüísticas.

### T - Tests
- Validar extracciones contra casos conocidos (ej: Ticket 102198 que menciona "Duración trabajo 5 horas").

### A - Arquitectura
- El motor `master_auditor.py` invoca esta lógica y guarda el resultado en la columna `HS_Resolucion`.

### P - Pulido
- Si no se detecta ninguna mención de tiempo, el valor por defecto es **0 HS** para este relevamiento específico.

## Requisito de Salida
1. Columna `HS_Resolucion` actualizada en `Target.xlsx`.
2. Inclusión de "Skill: Mensaje de Resolución" en las observaciones si hay match.
