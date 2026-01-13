# Generador de Informes Técnicos 📄

Sistema automatizado para crear informes técnicos profesionales en formato HTML a partir de archivos de texto e imágenes.

## 📋 Descripción

Esta aplicación lee una carpeta `source` que contiene archivos de texto (.txt) e imágenes (.jpg, .png), y genera un archivo HTML profesional y completamente independiente con todo el contenido formateado y estilizado.

## 🚀 Características

- ✅ **Procesamiento automático** de texto e imágenes
- ✅ **Imágenes embebidas en base64** (archivo HTML 100% autónomo)
- ✅ **Diseño profesional y moderno** con CSS responsive
- ✅ **Sin dependencias externas** (solo Node.js)
- ✅ **Listo para imprimir** con estilos específicos para impresión
- ✅ **Galería de imágenes** con captions automáticos
- ✅ **Formato técnico profesional** con estructura semántica

## 📁 Estructura del Proyecto

```
informes-tecnicos/
├── generator.js          # Script generador (Node.js)
├── template.html         # Plantilla HTML con estilos
├── README.md            # Este archivo
├── source/              # 👈 Carpeta de entrada (poner archivos aquí)
│   ├── informe.txt     # Texto del informe
│   └── *.jpg/*.png     # Imágenes del informe
└── informe_final.html   # 👈 Resultado generado
```

## 🔧 Requisitos

- **Python 3** (pre-instalado en macOS)
- **Alternativa**: Node.js (versión 12 o superior) si prefieres usar `generator.js`
- No se necesitan paquetes externos

## 📖 Cómo Usar

### 1. Preparar el contenido

Coloca tus archivos en la carpeta `source/`:

- **Archivo de texto** (.txt): Contenido del informe con el texto que quieras
- **Imágenes** (.jpg, .png): Fotos relacionadas con el informe

**Ejemplo de estructura del texto:**
```
TÍTULO DEL INFORME

Introducción o resumen del contenido...

1. SECCIÓN 1

Descripción detallada de la primera sección.
Se pueden usar múltiples párrafos.

2. SECCIÓN 2

Más contenido técnico...

CONCLUSIONES

Resumen final del informe.
```

### 2. Ejecutar el generador

Abre una terminal en la carpeta del proyecto y ejecuta:

**Opción 1: Python (Recomendado)**
```bash
python3 generator.py
```

**Opción 2: Node.js** (si tienes Node.js instalado)
```bash
node generator.js
```

### 3. Ver el resultado

El script generará el archivo `informe_final.html` que puedes:
- Abrir directamente en cualquier navegador
- Enviar por email (es un solo archivo)
- Imprimir (tiene estilos específicos para impresión)
- Compartir (no requiere conexión a internet)

## 💡 Ejemplo de Uso Real

**Caso práctico: Informe de Mantenimiento de Local**

1. Crea una carpeta nueva para cada local:
   ```bash
   cp -r source source_local_centro
   ```

2. Edita `source_local_centro/informe.txt` con los detalles del local

3. Agrega las fotos del local en `source_local_centro/`

4. Renombra temporalmente `source` → `source_backup` 
   y `source_local_centro` → `source`

5. Ejecuta `node generator.js`

6. Renombra el resultado:
   ```bash
   mv informe_final.html informe_local_centro.html
   ```

## 🎨 Personalización

### Cambiar el diseño

Edita el archivo `template.html`:
- **Colores**: Modifica las variables CSS en `:root`
- **Fuentes**: Cambia `font-family` en el selector `body`
- **Espaciados**: Ajusta los valores de `padding` y `margin`

### Modificar el formato de texto

Edita `generator.js`, función `formatTextContent()`:
- Detecta títulos automáticamente (texto en MAYÚSCULAS)
- Detecta subtítulos (texto que empieza con números)
- Convierte párrafos automáticamente

## 📊 Salida Generada

El HTML generado incluye:

- **Encabezado profesional** con título y fecha
- **Contenido formateado** con jerarquía de títulos
- **Galería de imágenes** responsive con captions
- **Footer** con información del sistema
- **Estilos modernos** con gradientes y sombras
- **100% autónomo** (no necesita archivos externos)

## 🔍 Solución de Problemas

**Error: "La carpeta 'source' no existe"**
- Asegúrate de tener una carpeta llamada `source` en el mismo directorio que `generator.js`

**No se procesan las imágenes**
- Verifica que las extensiones sean: .jpg, .jpeg, .png, .gif, o .webp
- Asegúrate de que los archivos estén directamente en `source/`, no en subcarpetas

**El archivo HTML es muy grande**
- Las imágenes se embeben en base64, por lo que archivos muy grandes pueden generar HTMLs de varios MB
- Considera comprimir las imágenes antes de procesarlas

## 🛠️ Tecnologías Utilizadas

- **Python 3**: Procesamiento de archivos (versión principal)
- **Node.js**: Alternativa para procesamiento (opcional)
- **HTML5**: Estructura semántica
- **CSS3**: Diseño moderno y responsive
- **JavaScript**: Template processing

## 📝 Notas

- El sistema convierte imágenes a base64 para crear un archivo HTML completamente independiente
- Se recomienda usar imágenes optimizadas (no más de 2-3 MB cada una)
- El texto se formatea automáticamente en párrafos y títulos
- Las imágenes se ordenan alfabéticamente por nombre de archivo

## 🔄 Próximas Mejoras

Ideas para futuras versiones:
- [ ] Soporte para múltiples archivos de texto
- [ ] Selección de diferentes plantillas/temas
- [ ] Exportación a PDF
- [ ] Interfaz web para subir archivos
- [ ] Lightbox para ver imágenes en tamaño completo

---

**Desarrollado para automatizar la creación de informes técnicos profesionales** ⚙️
