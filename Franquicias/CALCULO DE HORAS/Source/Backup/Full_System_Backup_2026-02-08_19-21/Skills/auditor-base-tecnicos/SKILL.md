# Auditor de Base de Técnicos

Skill especializada en cruzar la información de la planilla de gestión de técnicos (`Base Tecnicos.xlsx`) con la base de datos maestra `Target.xlsx`.

## Reglas de Auditoría (Excel Source Edition)

### 1. Extracción de Identificadores
- **Matching Directo**: Utilizar la columna `Codigo` de la planilla `Base Tecnicos.xlsx`.
- **Limpieza de Datos**: Asegurar que los códigos numéricos se traten como strings para evitar discrepancias con el Excel maestro.

### 2. Cuantificación de Horas
- **Valor Directo**: Tomar el valor de la columna `Horas de Trabajo`.
- **Validación**: Si el campo está vacío o no es un número, asignar **0 HS**.

## Procedimiento de Ejecución (Protocolo ETAPA)

### E - Estrategia
- Localizar el archivo `Source/Base Tecnicos.xlsx`.
- Mapear los tickets de la planilla a las filas correspondientes en `Target.xlsx`.

### T - Tests
- Validar que el archivo Excel sea legible por `pandas`.
- Verificar que los tickets correspondan al mes bajo evaluación.

### A - Arquitectura
- Integrado directamente en el motor `master_auditor.py`.
- Genera la columna `base tecnicos` en el reporte final.

### P - Pulido
- Si un ticket no figura en esta base, su valor en la columna correspondiente debe ser estrictamente **0**.

## Requisito de Salida
1. Columna `base tecnicos` actualizada en `Target.xlsx`.
2. Inclusión en la columna `Observaciones_Audit` si hubo match.
