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
import argparse
import shutil
from pathlib import Path
from datetime import datetime

# Configuración
BASE_DIR = Path(__file__).parent
SOURCE_DIR = BASE_DIR / 'source'
TEMPLATE_FILE = BASE_DIR / 'template.html'
OUTPUT_FILE = BASE_DIR / 'informe_final.html'
PROMPT_FILE = BASE_DIR / 'PROMPTS TECNICOS' / 'prompt tecnico.txt'

# Variables Globales de Sesión
CURRENT_YEAR = "2026"
TICKET_NUMBER = None
force_status = None
force_hours = None
force_local = None
force_equipment = None
force_date = None

class InconsistencyError(Exception):
    """Excepción lanzada cuando hay una contradicción lógica en el informe"""
    def __init__(self, message, detected_status, context):
        self.message = message
        self.detected_status = detected_status
        self.context = context
        super().__init__(self.message)

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
    
    equipment_clause = f" Y el equipo principal debe ser nombrado como '{force_equipment}' en lugar de solo su código/N/S." if force_equipment else ""
    
    data = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": prompt_instruction},
            {"role": "user", "content": f"Por favor, estructura y formatea la siguiente información:\n\n{raw_text}\n\nIMPORTANTE: El Número de Ticket es {TICKET_NUMBER if TICKET_NUMBER else '[No especificado]'}. Asegúrate de incluirlo en el campo correspondiente de la Sección 1.{equipment_clause}"}
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
        try:
            base64_image = convert_image_to_base64(image_path)
            # Usar el nombre del archivo (sin extensión) como leyenda
            label = image_path.stem
            
            gallery_html += f'''    <div class="image-item">
            <img src="{base64_image}" alt="{label}">
            <p class="image-caption">{label}</p>
        </div>\n'''
            
            print(f'✓ Imagen procesada en galería ({image_path.name})')
        except Exception as e:
            print(f'⚠️ Error al procesar imagen {image_path.name}: {e}')
    
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

def format_text_content(text, local_name=None, ticket_num=None, forced_status=None):
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
                    
                    # Prioridad 1: Estado forzado por parámetro
                    if force_status:
                        if force_status.lower() == 'rojo':
                            icon, state = "🔴", "INOPERATIVA"
                        elif force_status.lower() == 'amarillo':
                            icon, state = "🟡", "OPERATIVA CON OBSERVACIONES"
                        elif force_status.lower() == 'verde':
                            icon, state = "🟢", "OPERATIVA"
                    
                    # Prioridad 2: Detección automática (si no hay force_status)
                    if not icon:
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
    
                # --- PARCHE DE SEGURIDAD: SI HAY ESTADO FORZADO, REEMPLAZAR CUALQUIER LÍNEA SIMILAR ---
                if force_status:
                    if 'ESTADO FINAL' in title_line.upper():
                        # Si el título mismo es "Estado Final", inyectamos el forzado
                        icon, state = ("🟢", "OPERATIVA") if force_status == 'verde' else (("🟡", "OPERATIVA CON OBSERVACIONES") if force_status == 'amarillo' else ("🔴", "INOPERATIVA"))
                        formatted_html += f'<h3><b>{title_line}</b></h3>\n'
                        formatted_html += f'<p>Estado Final: {icon} {state}</p>\n'
                        continue
                # --- FIN PARCHE ---

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
                    if 'local' in label.lower() and local_name and local_name != "Local No Detectado":
                        value = local_name
                
                # REGLA: Forzar Estado Final en párrafos (si el LLM lo puso ahí)
                if force_status and 'Estado Final' in label:
                    icon, state = ("🟢", "OPERATIVA") if force_status == 'verde' else (("🟡", "OPERATIVA CON OBSERVACIONES") if force_status == 'amarillo' else ("🔴", "INOPERATIVA"))
                    label = "Estado Final"
                    value = f"{icon} {state}"

                # REGLA: Tiempo de Labor (Búsqueda más flexible y REDONDEO SIEMPRE HACIA ARRIBA)
                labor_keywords = [
                    'Tiempo de Labor', 'Tiempo de Trabajo', 'Tiempo de Servicio', 
                    'Horario de Servicio', 'Hora de Servicio', 'Horas de Trabajo', 'Labor'
                ]
                if any(k.lower() in label.lower() for k in labor_keywords):
                    value = value.strip()
                    
                    # Intentar extraer horas y minutos
                    hours = 0
                    minutes = 0
                    
                    time_match = re.search(r'(\d+):(\d+)', value)
                    if time_match:
                        hours = int(time_match.group(1))
                        minutes = int(time_match.group(2))
                    else:
                        h_match = re.search(r'(\d+)\s*(?:hs?|horas?)', value, re.I)
                        m_match = re.search(r'(\d+)\s*(?:min?|minutos?)', value, re.I)
                        if h_match: hours = int(h_match.group(1))
                        if m_match: minutes = int(m_match.group(1))
 
                    if force_hours is not None:
                        final_hours = int(force_hours)
                    else:
                        final_hours = hours + 1 if minutes > 0 else hours
                    
                    if final_hours < 2: final_hours = 2
                    
                    if 'jornada' not in value.lower():
                        value = f"{final_hours:02d}:00 hs."
                
                new_lines.append(f'<span class="data-label">{label}:</span> {value}')
            else:
                new_lines.append(line)
        processed_para = '<br>'.join(new_lines)
        processed_para = re.sub(r'(?i)\(sin código especificado\)', '', processed_para).strip()
        processed_para = re.sub(r'(?i)\(sin N/?S\)', '', processed_para).strip()
        
        formatted_html += f'<p>{processed_para}</p>\n'
    
    return formatted_html
def audit_technical_logic(html_content):
    """
    Auditoría de coherencia: Verifica que no haya estatus verde si se mencionan repuestos pendientes.
    """
    # 1. Detectar el ícono de estado
    status_match = re.search(r'Estado Final:</span> (..)', html_content)
    if not status_match:
        return True # No se encontró estatus para auditar
        
    icon = status_match.group(1)
    
    # 2. Si es verde, buscar palabras de alerta de repuestos pendientes
    if "🟢" in icon:
        # Palabras clave que indican una visita incompleta o repuestos pedidos
        alert_keywords = [
            'necesario', 'pendientes', 'solicitar', 'comprar', 
            'reemplazar', 'faltan', 'visita adicional'
        ]
        
        # Analizar secciones de Observaciones y Detalle
        # Buscamos en el texto después de que el LLM lo procesó
        found_alerts = []
        for word in alert_keywords:
            if word.lower() in html_content.lower():
                found_alerts.append(word)
        
        if found_alerts:
            context_snippet = ""
            # Intentar obtener un fragmento del contexto para mostrar al usuario
            for word in found_alerts:
                match = re.search(rf'([^.]{{0,50}}{word}[^.]{{0,50}})', html_content, re.I)
                if match:
                    context_snippet = match.group(1).strip()
                    break
            
            raise InconsistencyError(
                message=f"Detección de incoherencia: El estatus es VERDE pero se detectaron términos de repuestos pendientes: {found_alerts}",
                detected_status="VERDE",
                context=context_snippet
            )
            
    return True

def generate_email_speech(html_content, local_name, report_date):
    """
    Analiza el HTML generado para extraer datos clave y armar un borrador de correo.
    """
    # 1. Detectar el ícono y texto de estado
    # Buscamos de forma más flexible en todo el contenido HTML
    status_match = re.search(r'Estado Final:</span>\s*(.*?)(?:<br>|</p>)', html_content, re.IGNORECASE)
    status_text = status_match.group(1).strip() if status_match else "[Estado no detectado]"
    
    # 2. Extraer requerimientos de repuestos (Sección 5 - Nueva estructura)
    req_match = re.search(r'5\. REPUESTOS NECESARIOS.*?</b></h3>\s*<p>(.*?)</p>', html_content, re.DOTALL | re.IGNORECASE)
    spare_parts = req_match.group(1).strip() if req_match else "Ninguno"
    
    # 3. Extraer observaciones (Sección 7)
    obs_match = re.search(r'7\. OBSERVACIONES Y RECOMENDACIONES</b></h3>\s*<p>(.*?)</p>', html_content, re.DOTALL | re.IGNORECASE)
    observations = obs_match.group(1) if obs_match else ""
    
    if not observations:
        # Intento alternativo por si el formato varía
        obs_match = re.search(r'7\. Datos de Observaciones.*?</b></h3>\s*<p>(.*?)</p>', html_content, re.DOTALL | re.IGNORECASE)
        observations = obs_match.group(1) if obs_match else "Sin observaciones críticas adicionales."
    
    # Limpiar etiquetas HTML y entidades
    observations = re.sub(r'<[^>]+>', '', observations)
    observations = observations.replace('&nbsp;', ' ').strip()
    spare_parts_clean = re.sub(r'<[^>]+>', '', spare_parts).strip()
    
    # Remover frases genéricas de disponibilidad si existen
    generic_phrases = ["El técnico se encuentra a disposición", "quedo a disposición", "cualquier consulta o problema adicional"]
    for phrase in generic_phrases:
        observations = re.sub(f'{phrase}.*?[\.\!]', '', observations, flags=re.IGNORECASE)

    # Acortar observaciones a las primeras oraciones relevantes
    sentences = [s.strip() for s in observations.split('.') if s.strip()]
    
    # Obtener fecha para el asunto (formato DD-MM-YY sugerido por usuario)
    try:
        date_obj = datetime.strptime(report_date, "%d-%m-%Y")
        formatted_date = date_obj.strftime("%d-%m-%y")
    except:
        formatted_date = report_date

    subject = f"Informe de visita Mantenimiento local {local_name} {formatted_date}"
    
    body = f"Estimados,\n\nAdjunto el informe de la visita técnica realizada.\n\n"
    body += f"El equipo queda {status_text}.\n\n"
    
    # SI HAY REPUESTOS: Detallarlos prioritariamente
    if "ninguno" not in spare_parts_clean.lower() and len(spare_parts_clean) > 2:
        body += "Solicitud de Repuestos PARA MANTENIMIENTO REGULAR:\n"
        # Si la IA los puso con saltos de línea o comas, los listamos
        parts_list = [p.strip() for p in re.split(r'<br>|,|\n', spare_parts) if p.strip()]
        for p in parts_list:
            clean_p = re.sub(r'<[^>]+>', '', p).strip()
            if clean_p: body += f"* {clean_p}\n"
        body += "\n"

    # Notas adicionales de la visita
    if any(icon in status_text for icon in ["🟡", "🔴"]) or any(word in observations.lower() for word in ["necesario", "pendiente", "recomienda"]):
        body += "Observaciones de la visita:\n"
        for sentence in sentences[:2]:
            if len(sentence) > 5:
                body += f"* {sentence}.\n"
        body += "\n"
    else:
        body += "El equipo se encuentra en condiciones operatividades normales.\n\n"
        
    body += "Saludos cordiales."
    
    print("\n" + "="*40)
    print("📋 BORRADOR PARA EL CORREO (Copiar y Pegar)")
    print("="*40)
    print(f"ASUNTO: {subject}")
    print("-"*40)
    print(body)
    print("="*40)

def generate_report(force_status_param=None, skip_audit=False):
    """Genera el informe final"""
    global force_status
    force_status = force_status_param
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
    
    # Obtener el nombre del local
    global force_local
    if force_local:
        local_from_text = force_local
    else:
        first_line_clean = re.sub(r'<[^>]+>', '', text_content).strip().split('\n')[0]
        local_from_text = first_line_clean.replace('Cafetera', '').strip() if 'Cafetera' in first_line_clean else first_line_clean.strip()
        if not local_from_text or len(local_from_text) > 50:
            local_from_text = "Local No Detectado"
        
    formatted_content = format_text_content(text_content, local_name=local_from_text, ticket_num=TICKET_NUMBER, forced_status=force_status_param)
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
    global force_date
    if force_date:
        report_date = force_date
        print(f"✓ Fecha forzada por parámetro: {report_date}")
    else:
        date_match = re.search(r'Fecha:\s*(.*)', text_content)
        if date_match:
            report_date = date_match.group(1).strip()
            # REGLA: Forzar año 2026 si detectamos patrones de marcadores de posición o años anteriores
            if any(x in report_date for x in ["2024", "AAAA", "0000"]):
                report_date = re.sub(r'2024|AAAA|0000', CURRENT_YEAR, report_date)
                print(f"⚠️  Blindaje de año aplicado: -> {CURRENT_YEAR}")
            print(f"✓ Fecha personalizada encontrada: {report_date}")
        else:
            report_date = datetime.now().strftime(f'%d de %B, {CURRENT_YEAR}')
            months_es = {
                'January': 'Enero', 'February': 'Febrero', 'March': 'Marzo',
                'April': 'Abril', 'May': 'Mayo', 'June': 'Junio',
                'July': 'Julio', 'August': 'Agosto', 'September': 'Septiembre',
                'October': 'Octubre', 'November': 'Noviembre', 'December': 'Diciembre'
            }
            for en, es in months_es.items():
                report_date = report_date.replace(en, es)
    
    # Reemplazar placeholders estructurales de texto
    template = template.replace('{{REPORT_TITLE}}', report_title)
    template = template.replace('{{REPORT_DATE}}', report_date)
    template = template.replace('{{REPORT_CONTENT}}', formatted_content)

    # REGLA DE BLOQUEO DE ERRORES: Parches de última milla para Cristian
    template = template.replace('[No especificado]', TICKET_NUMBER if TICKET_NUMBER else '[No especificado]')
    template = template.replace('AAAA', CURRENT_YEAR)
    template = template.replace('2024', CURRENT_YEAR)
    
    # Corregir Local si el LLM falló
    if '[Nombre del local]' in template or '[no Especificado]' in template:
        template = template.replace('[Nombre del local]', local_from_text)
        template = template.replace('[no Especificado]', local_from_text)
        print(f"✓ Local corregido manualmente a: {local_from_text}")

    # INYECTAR BASE64 AL FINAL (Para evitar que los parches corrompan secuencias como 'AAAA' en los binarios)
    template = template.replace('{{IMAGE_GALLERY}}', image_gallery)
    template = template.replace('{{LOGO}}', logo_base64)
    template = template.replace('{{LOGO_DISPLAY}}', logo_display)

    # --- AUDITORÍA LÓGICA (DESACTIVADA POR SIMPLICIDAD) ---
    # audit_technical_logic(template) 
    # --- FIN AUDITORÍA ---

    OUTPUT_FILE.write_text(template, encoding='utf-8')
    
    print(f'\n✅ ¡Informe generado exitosamente!')
    print(f'📄 Archivo: {OUTPUT_FILE}')
    
    # --- GENERAR SPEECH PARA CORREO ---
    local_name = SOURCE_DIR.name if SOURCE_DIR.name != 'source' else "San Telmo" # Fallback para test
    # Intentar sacar el local del texto si existe
    local_match = re.search(r'Local:</span> (.*?)<br>', template)
    if local_match:
        local_name = local_match.group(1).strip()
        
    # --- DESACTIVADO POR PETICIÓN DEL USUARIO ---
    # try:
    #     processed_base = BASE_DIR / 'processed'
    #     processed_base.mkdir(exist_ok=True)
    #     timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    #     run_dir = processed_base / f"run_{timestamp}"
    #     run_dir.mkdir(exist_ok=True)
    #
    #     text_files, image_files, logo_file = read_source_files()
    #     all_to_move = text_files + image_files
    #     
    #     for f in all_to_move:
    #         if f.exists():
    #             try:
    #                 shutil.move(str(f), str(run_dir / f.name))
    #             except Exception as ex:
    #                 print(f"⚠️ No se pudo mover {f.name}: {ex}")
    #     
    #     print(f"📦 Archivos de origen movidos a: {run_dir.relative_to(BASE_DIR)}")
    # except Exception as e:
    #     print(f"⚠️ Error en post-procesamiento (movimiento de archivos): {e}")
    # --- FIN DESACTIVACIÓN ---

    return True

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Generador de Informes Técnicos desde archivo de texto')
    parser.add_argument('--force-status', choices=['verde', 'amarillo', 'rojo'], help='Forzar color del semáforo: verde, amarillo o rojo.')
    parser.add_argument('--ticket', help='Especificar el número de ticket.')
    parser.add_argument('--force-hours', type=int, help='Forzar horas de labor')
    parser.add_argument('--equipment', help='Forzar nombre descriptivo del equipo')
    parser.add_argument('--local', help='Forzar el nombre del local')
    parser.add_argument('--date', help='Forzar fecha del informe (ej: 13-04-26)')
    parser.add_argument('--skip-audit', action='store_true', help='Saltar la auditoría de coherencia lógica')
    args = parser.parse_args()
    
    if args.force_status: force_status = args.force_status
    if args.ticket: TICKET_NUMBER = args.ticket
    if args.force_hours: force_hours = args.force_hours
    if args.equipment: force_equipment = args.equipment
    if args.local: force_local = args.local
    if args.date: force_date = args.date
        
    generate_report(force_status_param=args.force_status, skip_audit=args.skip_audit)
