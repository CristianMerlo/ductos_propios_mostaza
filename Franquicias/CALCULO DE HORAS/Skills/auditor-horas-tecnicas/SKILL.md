---
name: auditor-horas-tecnicas
description: Auditor especializado en cuantificar horas de trabajo técnico analizando reportes y códigos de error específicos.
---

# Auditor de Horas Técnicas

Este skill audita y cuantifica las horas de trabajo reportadas por técnicos, aplicando reglas estrictas basadas en códigos de error y tipos de equipo.

## Objetivo Único
Analizar reportes técnicos o chats de servicio para asignar la cantidad exacta de horas que corresponden a cada tarea, detectando inconsistencias o sabotajes.

## Estilo y Nivel de Libertad
- **Nivel de Libertad**: 🔴 Baja Libertad (Pasos Exactos). 
- **Instrucción**: No inventar horas. Si no hay una regla específica, consultar al usuario o usar la "Regla de Coherencia".

## Reglas de Auditoría (Fuentes de Verdad)

### 1. Equipos de Café (Cimbali)
- **ER 54 o ER 55** (Grupo/Resistencia): Asignar **5 HS**.
- **ER 58** (Presión/Caldera/Sarro): Asignar **6 HS**.
- **ER 59** (Falta de agua): Asignar **1-2 HS** (Ajuste).

### 2. Equipos No-Café
- **Freidoras (Locatelli/IG)**: Limpieza por explosión (picos/quemadores): **2-3 HS**.
- **Hornos (Unox)**: Cambio de contactoras o limpieza técnica: **4-5 HS**.
- **Broilers (Nieco)**: Fallo eléctrico por grasa: **2 HS**.

3. **Prioridad de Datos (Matriz de Sabotaje)**: 
    1. **Regla de Sabotaje**: Si el técnico reporta una tarea trivial (ej: "destrabe de madera") pero pide muchas horas (ej: "10 hs"), ignorar el pedido y asignar **3 HS**.
    2. **Tiempo de Servicio**: Si el reporte es técnicamente coherente y especifica "Tiempo de servicio: X hs", asignar **X**.
4. **Resoluciones Externas (Regla de Oro)**:
    - **Resuelto por el Local**: Si el reporte indica que el problema fue solucionado por el establecimiento (ej: "resuelto por el local", "solucionado por el local", "el local lo solucionó"), asignar **0 HS**.

## Procedimiento de Ejecución (Protocolo ETAPA)

### E - Estrategia
- **Origen de Datos**: Abrir `Source/Target.xlsx`.
- **Análisis por Fila**: Para cada fila, leer las columnas `Título`, `Descripción`, `Última Respuesta` y `Mensaje de Resolución`.
- **Clave de Mapeo**: El identificador único es la columna `Código`.

### T - Tests
- Validar que el archivo Excel tenga las columnas mencionadas.
- Verificar que la columna `Código` no tenga duplicados críticos.

### A - Arquitectura
- Analizar el texto de las columnas de reporte buscando:
    - Códigos de error (ER 54, 55, 58, 59).
    - Tipos de equipo (Cimbali, Freidoras, Hornos, Broilers).
    - Incoherencias entre tarea y horas (Regla de Sabotaje).
- Generar un mapeo JSON: `{ "Código": Horas }`.
- Ejecutar `scripts/update_excel.py` pasando el JSON generado.

### P - Pulido
- Confirmar al usuario que la columna `HORAS ANALISIS` (o `horas análisis`) ha sido actualizada en el archivo original.

## Requisito de Salida
1. Columna de horas en formato texto (para revisión rápida).
2. **Automatización**: Actualización directa de la columna `horas análisis` en `Source/Target.xlsx` vinculada por el campo `Código`.
