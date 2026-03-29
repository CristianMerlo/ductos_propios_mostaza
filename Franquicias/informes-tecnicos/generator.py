#!/usr/bin/env python3
"""
Generador de Informes Técnicos
Procesa archivos de texto e imágenes de la carpeta 'source' y genera un HTML profesional
"""

import os
import re
import base64
import sys
import json
import urllib.request
import urllib.error
from pathlib import Path
from datetime import datetime

# Configuración
BASE_DIR = Path(__file__).parent
SOURCE_DIR = BASE_DIR / 'source'
TEMPLATE_FILE = BASE_DIR / 'template.html'
OUTPUT_FILE = BASE_DIR / 'informe_final.html'
PROMPT_FILE = BASE_DIR / 'PROMPTS TECNICOS' / 'prompt tecnico.txt'

def load_env():
    """Carga variables de entorno desde el archivo .env en la raíz del repositorio"""
    repo_root = BASE_DIR.parent.parent
    env_file = repo_root / '.env'
    if env_file.exists():
        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()

# Cargar variables de entorno al iniciar
load_env()

def natural_sort_key(s):
    """Clave para ordenamiento natural (ej: 1, 2, 10 en vez de 1, 10, 2)"""
    return [int(text) if text.isdigit() else text.lower()
            for text in re.split('([0-9]+)', s.name)]

def read_source_files():
    """Lee archivos de source, separando el logo del resto"""
    if not SOURCE_DIR.exists():
        print(f"❌ Error: La carpeta 'source' no existe en {SOURCE_DIR}")
        sys.exit(1)
    
    text_files = []
    image_files = []
    logo_file = None
    
    # Buscar logo
    possible_logos = [
        SOURCE_DIR / 'img' / 'logo.png',
        SOURCE_DIR / 'img' / 'logo.jpg',
        SOURCE_DIR / 'logo.png',
        SOURCE_DIR / 'logo.jpg'
    ]
    
    for logo_path in possible_logos:
        if logo_path.exists():
            logo_file = logo_path
            print(f"✓ Logo encontrado: {logo_file.name}")
            break

    # Función auxiliar para procesar un directorio
    def process_dir(directory):
        for file_path in directory.iterdir():
            if not file_path.is_file():
                continue
            
            if file_path.name.startswith('.'):
                continue
                
            if logo_file and file_path.resolve() == logo_file.resolve():
                continue
                
            ext = file_path.suffix.lower()
            
            if ext == '.txt':
                text_files.append(file_path)
            elif ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
                image_files.append(file_path)

    process_dir(SOURCE_DIR)
    
    img_dir = SOURCE_DIR / 'img'
    if img_dir.exists() and img_dir.is_dir():
        process_dir(img_dir)
            
    return text_files, image_files, logo_file

def read_prompt():
    """Lee el archivo de prompt técnico"""
    if PROMPT_FILE.exists():
        try:
            return PROMPT_FILE.read_text(encoding='utf-8')
        except Exception as e:
            print(f"⚠️  No se pudo leer el prompt técnico: {e}")
    else:
        print(f"⚠️  No se encontró el archivo de prompt en: {PROMPT_FILE}")
    return None

def enhance_text_with_llm(raw_text, prompt_instruction):
    """
    Intenta mejorar el texto usando LLaMA 3 a través de Groq.
    """
    api_key = os.environ.get('GROQ_API_KEY')
    
    if not api_key:
        print("ℹ️  Nota: No se detectó GROQ_API_KEY en el archivo .env. Usando texto original (sin mejora IA).")
        return raw_text

    print("🤖 Procesando texto con LLM (LLaMA 3 vía Groq)...")
    
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
        "User-Agent": "ReportGenerator/1.0"
    }
    
    data = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": prompt_instruction},
            {"role": "user", "content": f"Por favor, estructura y procesa la siguiente información:\n\n{raw_text}"}
        ],
        "temperature": 0.3
    }
    
    try:
        req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            enhanced_text = result['choices'][0]['message']['content']
            print("✓ Texto formateado con IA exitosamente")
            return enhanced_text
    except urllib.error.HTTPError as e:
        error_info = e.read().decode('utf-8')
        print(f"⚠️  Error HTTP al consultar API de IA ({e.code}): {error_info}")
        return raw_text
    except Exception as e:
        print(f"⚠️  Error de conexión al consultar API de IA: {e}")
        return raw_text

def read_text_content(text_files):
    """Lee el contenido de texto y aplica mejora si es posible"""
    if not text_files:
        print('⚠️  Advertencia: No se encontraron archivos .txt en la carpeta source')
        return ''
    
    try:
        content = text_files[0].read_text(encoding='utf-8')
    except UnicodeDecodeError:
        print('⚠️  Error de codificación UTF-8, intentando con latin-1...')
        content = text_files[0].read_text(encoding='latin-1')
        
    print(f'✓ Contenido de texto leído: {text_files[0].name}')
    
    # Intentar mejora con IA
    prompt = read_prompt()
    if prompt:
        content = enhance_text_with_llm(content, prompt)
    
    return content

def convert_image_to_base64(image_path):
    """Convierte una imagen a base64"""
    with open(image_path, 'rb') as image_file:
        image_data = image_file.read()
        base64_image = base64.b64encode(image_data).decode('utf-8')
    
    ext = image_path.suffix.lower().replace('.', '')
    mime_type = 'jpeg' if ext == 'jpg' else ext
    return f'data:image/{mime_type};base64,{base64_image}'

def generate_image_gallery(image_files):
    """Genera el HTML para la galería de imágenes"""
    if not image_files:
        return '<p class="no-images">No disponible</p>'
    
    # Ordenar imágenes naturalmente (1, 2, 10...)
    image_files.sort(key=natural_sort_key)
    
    gallery_html = '<div class="image-gallery">\n'
    
    for index, image_path in enumerate(image_files, 1):
        base64_image = convert_image_to_base64(image_path)
        # Usar el nombre del archivo (sin extensión) como leyenda
        label = image_path.stem
        
        gallery_html += f'''    <div class="image-item">
        <img src="{base64_image}" alt="{label}" loading="lazy">
        <p class="image-caption">{label}</p>
    </div>\n'''
        
        print(f'✓ Imagen procesada en galería ({image_path.name})')
    
    gallery_html += '</div>'
    return gallery_html

def title_case(text):
    """Convierte texto a Title Case, respetando artículos en español"""
    if not text or not text.strip():
        return text
    words = text.strip().split()
    # Artículos y preposiciones que van en minúscula (excepto al inicio)
    lowercase_words = {'y', 'de', 'del', 'la', 'el', 'los', 'las', 'a', 'en', 'con', 'por'}
    result = []
    for i, word in enumerate(words):
        # Primera palabra siempre con mayúscula
        if i == 0 or word.lower() not in lowercase_words:
            result.append(word.capitalize())
        else:
            result.append(word.lower())
    return ' '.join(result)

def format_text_content(text):
    """Formatea el texto en párrafos y títulos HTML con jerarquía de negritas corregida"""
    # Pre-procesamiento: Asegurar que los títulos numerados tengan doble salto de línea
    # Esto evita que el contenido siguiente sea tratado como parte del título
    text = re.sub(r'(?m)^(\d+\..+)$', r'\n\n\1\n\n', text)
    while '\n\n\n' in text:
        text = text.replace('\n\n\n', '\n\n')
        
    paragraphs = text.split('\n\n')
    
    formatted_html = ''
    for para in paragraphs:
        trimmed = para.strip()
        if not trimmed:
            continue
            
        # Filtro de seguridad avanzado: Eliminar frases típicas de chatbots
        lower_trimmed = trimmed.lower()
        forbidden_phrases = [
            'aquí tienes', 'he redactado', 'adjunto informe', 'espero que sea de su agrado',
            '¿desea procesar otro?', '¿necesitas algo más?', 'qué tal', 'hola', 'saludos',
            'claro que sí', 'por supuesto', 'listo, aquí está'
        ]
        if any(trigger in lower_trimmed for trigger in forbidden_phrases):
            if len(trimmed) < 300: # Si es un bloque corto con estas frases, se descarta
                continue
        trimmed = trimmed.replace('(Ver imágenes adjuntas a continuación)', '')
        
        # 1. Títulos de Sección (H3) - Ej: 1. Datos Generales
        # Solo tratamos como título si es una línea corta o empieza con número
        if (re.match(r'^\d+\.', trimmed) and len(trimmed.split('\n')[0]) < 100) or \
           (trimmed.isupper() and len(trimmed) < 60):
            
            # Si el "párrafo" tiene más de una línea, el título es solo la primera
            lines = trimmed.split('\n')
            title_line = lines[0]
            
            # Solo aplicamos Title Case si no es el apartado de EQUIPO (que suele ir en CAPS)
            if title_line.isupper() and 'EQUIPO' not in title_line and len(title_line) > 5:
                title_line = title_case(title_line)
            
            # El título SIEMPRE va en negrita (es el "apartado")
            formatted_html += f'<h3><b>{title_line}</b></h3>\n'
            
            # Si había más líneas en este "párrafo", las procesamos como texto normal
            if len(lines) > 1:
                content_lines = '\n'.join(lines[1:]).strip()

                # REGLA: Forzar iconos de estado en la sección de ESTADO FINAL
                if 'ESTADO FINAL' in title_line.upper():
                    status_text = content_lines.upper()
                    icon = ""
                    state = ""
                    
                    if 'INOPERATIV' in status_text:
                        icon = "🔴"
                        state = "INOPERATIVA"
                    elif 'CON OBSERVACIONES' in status_text:
                        icon = "🟡"
                        state = "OPERATIVA CON OBSERVACIONES"
                    elif 'OPERATIV' in status_text:
                        icon = "🟢"
                        state = "OPERATIVA"
                    
                    if icon and state:
                        # Buscamos si ya tiene el prefijo para no duplicar
                        if "ESTADO FINAL:" not in content_lines.upper():
                            # Intentamos limpiar la descripción original si contenía la palabra clave
                            # para que no quede redundante (ej: "Estado Final: 🔴 INOPERATIVA. INOPERATIVA...")
                            clean_content = content_lines
                            if state in clean_content.upper():
                                # Eliminar la primera oración si es solo el estado
                                parts = clean_content.split('.', 1)
                                if len(parts) > 1 and state in parts[0].upper() and len(parts[0]) < 20:
                                    clean_content = parts[1].strip()
                                elif state in parts[0].upper() and len(parts[0]) < 20:
                                    clean_content = ""
                            
                            content_lines = f"Estado Final: {icon} {state}"
                            if clean_content:
                                if not clean_content.startswith('.') and clean_content:
                                    content_lines += ". "
                                content_lines += clean_content

                # REGLA: No mostrar contenido en la Sección 7 (se llena sola con la galería)
                if 'REGISTRO FOTOGRÁFICO' in title_line.upper():
                    content_lines = ""

                if content_lines:
                    # Procesar como párrafo normal (puntos 3 abajo)
                    formatted_html += f'<p>{content_lines}</p>\n'
            continue

        # 2. Subtítulos (H4)
        if (trimmed.startswith('REPORTE') or (trimmed.startswith('**') and trimmed.endswith('**'))) and len(trimmed) < 100:
            content = trimmed.replace('*', '')
            formatted_html += f'<h4><b>{content}</b></h4>\n'
            continue

        # 3. Párrafos normales
        processed_para = trimmed.replace('\n', "<br>")
        
        # Convertir **texto** a <b>texto</b> (permitir negrita manual si el usuario la pone)
        processed_para = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', processed_para)
        
        # REGLA: Eliminar aclaraciones redundantes tipo "1 (Un)" o "Un (1)"
        # Caso 1: Numero (Texto) -> Numero
        processed_para = re.sub(r'(\d+)\s*\([^)]*[a-zA-ZñÑ]{2,}[^)]*\)', r'\1', processed_para)
        # Caso 2: Texto (Numero) -> Texto
        processed_para = re.sub(r'([a-zA-ZñÑ]{2,})\s*\(\s*\d+\s*\)', r'\1', processed_para)
        
        # Manejo de etiquetas tipo "Local: ..." en párrafos
        # El usuario pidió que el resto NO vaya en negrita, pero mantendremos las etiquetas 
        # con una clase CSS para que se vean ordenadas, y el CSS decidirá la negrita.
        new_lines = []
        for line in processed_para.split('<br>'):
            if ':' in line and len(line.split(':')[0]) < 30: # Solo si es un label corto al inicio
                parts = line.split(':', 1)
                label = parts[0].strip()
                value = parts[1].strip()
                
                # Aplicar Title Case a nombres propios en ciertos campos
                if any(k in label for k in ['Local', 'Técnico', 'Responsable']):
                    value = title_case(value)
                
                # REGLA: Tiempo de Labor (Búsqueda más flexible y REDONDEO SIEMPRE HACIA ARRIBA)
                labor_keywords = [
                    'Tiempo de Labor', 'Tiempo de Trabajo', 'Tiempo de Servicio', 
                    'Horario de Servicio', 'Hora de Servicio', 'Horas de Trabajo', 'Labor'
                ]
                if any(k.lower() in label.lower() for k in labor_keywords):
                    value = value.strip()
                    print(f"DEBUG: Procesando tiempo: '{value}'")
                    
                    # Intentar extraer horas y minutos
                    # Formatos: "2:30", "2 hs 30", "2.5 hs", "2,5 hs"
                    hours = 0
                    minutes = 0
                    
                    # Caso 1: HH:MM o H:MM
                    time_match = re.search(r'(\d+):(\d+)', value)
                    if time_match:
                        hours = int(time_match.group(1))
                        minutes = int(time_match.group(2))
                    else:
                        # Caso 2: X hs Y mins o similar
                        h_match = re.search(r'(\d+)\s*(?:hs?|horas?)', value, re.I)
                        m_match = re.search(r'(\d+)\s*(?:min?|minutos?)', value, re.I)
                        if h_match: hours = int(h_match.group(1))
                        if m_match: minutes = int(m_match.group(1))
                        
                        # Caso 3: Decimal (2.5 o 2,5)
                        if not h_match and not m_match:
                            dec_match = re.search(r'(\d+)[.,](\d+)', value)
                            if dec_match:
                                hours = int(dec_match.group(1))
                                minutes = 1 # Forzar redondeo si hay decimales

                    # Lógica de Redondeo hacia arriba
                    if minutes > 0:
                        final_hours = hours + 1
                        print(f"⚠️  Redondeo: {hours}h {minutes}m -> {final_hours}hs (siempre hacia arriba)")
                    else:
                        final_hours = hours
                    
                    # Aplicar mínimo de 2 horas
                    if final_hours < 2:
                        final_hours = 2
                        print(f"⚠️  Regla de negocio: Tiempo mínimo aplicado (2hs)")
                    
                    if 'jornada' not in value.lower():
                        value = f"{final_hours:02d}:00 hs."
                
                new_lines.append(f'<span class="data-label">{label}:</span> {value}')
            else:
                new_lines.append(line)
        processed_para = '<br>'.join(new_lines)
        
        formatted_html += f'<p>{processed_para}</p>\n'
    
    return formatted_html

def generate_report():
    """Genera el informe final"""
    print('\n🚀 Iniciando generación de informe técnico avanzado...\n')
    
    if not TEMPLATE_FILE.exists():
        print(f'❌ Error: No se encontró el archivo template.html en {TEMPLATE_FILE}')
        sys.exit(1)
    
    template = TEMPLATE_FILE.read_text(encoding='utf-8')
    print('✓ Template cargado')
    
    text_files, image_files, logo_file = read_source_files()
    print(f'✓ Encontrados: {len(text_files)} archivo(s) de texto, {len(image_files)} imagen(es) para galería')
    
    # Procesar contenido (Incluye lectura de prompt y posible IA)
    text_content = read_text_content(text_files)
    formatted_content = format_text_content(text_content)
    image_gallery = generate_image_gallery(image_files)
    
    # Procesar Logo
    if logo_file:
        logo_base64 = convert_image_to_base64(logo_file)
        logo_display = 'block'
    else:
        logo_base64 = ''
        logo_display = 'none'
        print('⚠️  Advertencia: No se encontró logo')
    
    report_title = ('Informe Técnico' if SOURCE_DIR.name == 'source' 
                   else f'Informe Técnico - {SOURCE_DIR.name}')
    # Obtener fecha (buscar en texto o usar actual)
    date_match = re.search(r'Fecha:\s*(.*)', text_content)
    if date_match:
        report_date = date_match.group(1).strip()
        print(f"✓ Fecha personalizada encontrada: {report_date}")
    else:
        report_date = datetime.now().strftime('%d de %B, %Y')
        months_es = {
            'January': 'Enero', 'February': 'Febrero', 'March': 'Marzo',
            'April': 'Abril', 'May': 'Mayo', 'June': 'Junio',
            'July': 'Julio', 'August': 'Agosto', 'September': 'Septiembre',
            'October': 'Octubre', 'November': 'Noviembre', 'December': 'Diciembre'
        }
        for en, es in months_es.items():
            report_date = report_date.replace(en, es)
    
    # Reemplazar placeholders
    template = template.replace('{{REPORT_TITLE}}', report_title)
    template = template.replace('{{REPORT_DATE}}', report_date)
    template = template.replace('{{REPORT_CONTENT}}', formatted_content)
    template = template.replace('{{IMAGE_GALLERY}}', image_gallery)
    template = template.replace('{{LOGO}}', logo_base64)
    template = template.replace('{{LOGO_DISPLAY}}', logo_display)
    
    OUTPUT_FILE.write_text(template, encoding='utf-8')
    
    print(f'\n✅ ¡Informe generado exitosamente!')
    print(f'📄 Archivo: {OUTPUT_FILE}')
    
    # Abrir en el navegador automáticamente
    try:
        import webbrowser
        file_url = f"file://{OUTPUT_FILE.resolve()}"
        webbrowser.open(file_url)
        print("🌐 Abriendo informe en el navegador por defecto...")
    except Exception as e:
        print(f"⚠️ No se pudo abrir el navegador automáticamente: {e}")

if __name__ == '__main__':
    generate_report()

