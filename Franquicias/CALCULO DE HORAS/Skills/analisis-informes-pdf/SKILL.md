# Análisis de Informes PDF

Skill especializada en extraer información de auditoría desde informes en formato PDF y cruzarlos con la base de datos `Target.xlsx`.

## Reglas de Auditoría (Prompt Maestro - PDF Edition)

### 1. Extracción de Identificadores
- **Prioridad 1 (Código de Ticket)**: Buscar patrones como `Ticket #`, `Nro de Ticket`, `ID Servicio` o un número de 6 dígitos aislado.
- **Prioridad 2 (Local + Fecha + Técnico)**: Si no hay ticket, extraer el nombre del local de la cabecera o el nombre del archivo, la fecha del reporte y el nombre del técnico firmante.
- **Prioridad 3 (Contexto de Trabajo)**: Cruzar la descripción del trabajo (ej: "Cambio de filtro de leche") con la incidencia en el Excel si los otros campos son ambiguos.

### 2. Cuantificación de Horas
- **Tiempo Declarado**: Buscar campos como `Horas empleadas`, `Tiempo de labor`, `Duración` o `Total Horas`.
- **Análisis Técnico (Reglas Standard)**: Si no hay horas explícitas, aplicar las reglas del "Prompt Maestro":
    - Errores Cimbali 54/55/58/59.
    - Trabajos en Freidoras/Hornos/Broilers.
    - Lavados/Calibraciones/Puesta a cero.

## Procedimiento de Ejecución (Protocolo ETAPA)

### E - Estrategia
- Escanear la carpeta `Source/Informes/` buscando archivos `.pdf`.
- Extraer texto de cada página del PDF utilizando la librería `pypdf`.
- Identificar el Local y la Fecha (desde el nombre del archivo o el contenido).

### T - Tests
- Validar que el PDF sea legible y contenga texto analizable.
- Verificar que el match en el Excel sea unívoco (evitar asignaciones duplicadas si hay varios tickets para un mismo local en la misma fecha).

### A - Arquitectura
- Ejecutar el script `scripts/audit_pdf.py`.
- El script realizará el match multi-variable y actualizará la columna `Informes PDF` en el Excel original.

### P - Pulido
- Generar un reporte de "PDFs Procesados vs. Matches Encontrados".
- Listar los PDFs que no pudieron ser vinculados para revisión manual.

## Requisito de Salida
1. Columna `Informes PDF` actualizada en `Target.xlsx`.
2. Resumen de auditoría en consola/chat.
