# Backup del Dashboard de Mantenimiento Franquicias

Este backup contiene la versión completa del proyecto actualizado el 2026-01-12 23:07:39.

## Estructura del Dashboard (7 Slides)

### Slides Históricos:
- **Slide 0**: Portada institucional
- **Slide 1**: Seguimiento mensual (Abril-Diciembre) con tabla y gráficos de tendencias
- **Slide 2**: Tareas y responsabilidades del equipo

### Slides de Desempeño Diciembre 2024:
- **Slide 3**: KPIs principales (364 tickets, 51 locales, 4.15 días) + Volumen semanal + Cumplimiento 98.4%
- **Slide 4**: Análisis por categoría (Dona de equipos + Barras de subcategorías)
- **Slide 5**: Fallas principales + Top 15 locales

### Cierre:
- **Slide 6**: Fin del reporte con botón de impresión PDF

## Archivos incluidos:
- `index.html`: Estructura HTML con 7 slides completos
- `script.js`: Lógica JavaScript con 10+ funciones de gráficos
- `style.css`: Estilos personalizados Mostaza
- `dashboard_data.js`: Datos históricos mensuales (Abril-Diciembre)
- `dashboard_performance_data.js`: Métricas de desempeño Diciembre 2024
- `templates/logo.png`: Logo institucional
- `Analisis Ultimos meses.xlsx`: Fuente de datos
- `generate_dashboard_data.py`: Script de procesamiento

## Funcionalidades implementadas:
✅ 10 gráficos Chart.js (líneas multi-eje, dona, barras)
✅ Navegación fluida por slides (dots + scroll)
✅ Efectos hover interactivos (verde claro)
✅ Etiquetas alineadas con detección de colisiones
✅ Botón de impresión PDF
✅ Diseño responsive con glassmorphism
✅ Paleta de colores Mostaza (#DA291C, #FFC72C)

## Métricas destacadas:
- **Histórico**: 452 horas MO, $11,100 facturación (Diciembre)
- **Desempeño**: 364 tickets totales, 98.4% cumplimiento
- **Principal falla**: ER 021/022 Anomalía muelas (113 casos)
- **Local más activo**: Quilmes Peatonal (26 tickets)

## Para usar este backup:
1. Abre `index.html` en un navegador moderno
2. Navega usando dots laterales o scroll
3. Imprime a PDF desde el slide de cierre
4. Para actualizar datos: `python generate_dashboard_data.py`

