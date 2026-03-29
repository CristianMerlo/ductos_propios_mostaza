# Skill: Generador de Informes Ejecutivos

Esta skill permite transformar archivos Markdown (.md) o texto (.txt) en informes profesionales con estética corporativa Mostaza.

## Directorios
- `source/`: Carpeta donde se deben colocar los archivos de texto de origen.
- `scripts/`: Scripts auxiliares (opcional).

## Uso
1. Colocar el contenido del informe en un archivo `.md` dentro de la carpeta `source/`.
2. Ejecutar el script principal:
   ```bash
   python3 generator.py
   ```
3. El resultado se generará en `informe_ejecutivo.html`.

## Características
- Soporte para tablas de Markdown.
- Listas con viñetas.
- Títulos jerárquicos (H1, H2, H3).
- Salto de línea automático en párrafos.
- Integración automática del logo de Mostaza.
- Botón de impresión/PDF integrado.
