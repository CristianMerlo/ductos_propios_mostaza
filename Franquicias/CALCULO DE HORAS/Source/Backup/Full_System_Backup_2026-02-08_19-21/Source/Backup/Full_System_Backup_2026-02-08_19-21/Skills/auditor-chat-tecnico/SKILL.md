# Auditor de Chat Técnico

Skill especializada en extraer información de auditoría desde logs de chat (`chat.txt`) y cruzarla con la base de datos `Target.xlsx`.

## Reglas de Auditoría (Prompt Maestro - Chat Edition)

### 1. Extracción de Identificadores
- **Prioridad 1 (Código Directo)**: Buscar patrones como `Tiket#123456`, `Ticket 123456` o `Código: 123456`.
- **Prioridad 2 (Local + Fecha)**: Si no hay ticket, identificar el nombre del local (ej: "San Justo", "Once") y la fecha del mensaje `[DD/MM/YY]`.
- **Prioridad 3 (Nro Serie)**: Buscar números de serie de Cimbali (7 dígitos) para asociar al equipo.

### 2. Cuantificación de Horas
- **Extracto Directo**: Si el mensaje dice `(X horas de trabajo)`, asignar `X`.
- **Análisis Técnico**: Si no hay tiempo explícito, aplicar las reglas técnicas:
    - Cimbali Error 54/55 -> 5 hs.
    - Cimbali Error 58 -> 6 hs.
    - Cimbali Error 59 -> 1-2 hs.
    - Freidoras/Hornos -> Según complejidad (2-5 hs).
    - Tareas administrativas/Cierres -> 2 hs.

## Procedimiento de Ejecución (Protocolo ETAPA)

### E - Estrategia
- Identificar los bloques de reportes en cualquier archivo `Source/*chat*.txt`.
- Procesar todos los archivos de chat disponibles (chat1.txt, _chat.txt, etc.).
- Mapear cada reporte a una fila de `Source/Target.xlsx` usando Código, Local o Fecha.

### T - Tests
- Validar que el reporte del chat corresponda razonablemente a la incidencia descrita en el Excel.
- Verificar que las fechas coincidan o sean aproximadas (+/- 24hs).

### A - Arquitectura
- Ejecutar el script `scripts/audit_chat.py`.
- El script realizará el match multi-pista y asignará las horas en la nueva columna `horas informe`.

### P - Pulido
- Generar un resumen de cuántos tickets del chat fueron encontrados exitosamente en el Excel.
- Informar sobre tickets en el chat que no pudieron ser mapeados.

## Requisito de Salida
1. Columna `horas informe` actualizada en `Target.xlsx`.
2. Reporte de auditoría indicando: "N tickets mapeados, X% de éxito".
