#!/usr/bin/env python3
"""
Generador de Presupuestos
Procesa archivos de texto e imágenes de la carpeta 'source' y genera un HTML con formato de presupuesto
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
OUTPUT_FILE = BASE_DIR / 'presupuesto_final.html'
PROMPT_FILE = BASE_DIR / 'prompts' / 'prompt_presupuesto.txt'

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
    
    # Buscar logo (en source o source/img)
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
    """Lee el archivo de prompt de presupuesto"""
    if PROMPT_FILE.exists():
        try:
            return PROMPT_FILE.read_text(encoding='utf-8')
        except Exception as e:
            print(f"⚠️  No se pudo leer el prompt: {e}")
    return None

def enhance_text_with_llm(raw_text, prompt_instruction):
    """
    Intenta mejorar el texto usando una API de LLM (ej: OpenAI).
    """
    api_key = os.environ.get('OPENAI_API_KEY')
    
    if not api_key:
        print("ℹ️  Nota: No se detectó OPENAI_API_KEY. Usando texto original.")
        return raw_text

    print("🤖 Procesando texto con LLM...")
    
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    full_user_content = f"{prompt_instruction}\n\nInformación a procesar:\n{raw_text}"
    
    data = {
        "model": "gpt-4o",
        "messages": [
            {"role": "system", "content": "Eres un experto en redacción de presupuestos técnicos y comerciales."},
            {"role": "user", "content": full_user_content}
        ],
        "temperature": 0.3
    }
    
    try:
        req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            enhanced_text = result['choices'][0]['message']['content']
            print("✓ Texto mejorado con IA exitosamente")
            return enhanced_text
    except Exception as e:
        print(f"⚠️  Error al consultar API de IA: {e}")
        return raw_text

def read_text_content(text_files):
    """Lee el contenido de texto"""
    if not text_files:
        print('⚠️  Advertencia: No se encontraron archivos .txt en la carpeta source')
        return ''
    
    # Tomamos el primero o combinamos si hay varios
    content = ""
    for f in text_files:
        try:
            content += f.read_text(encoding='utf-8') + "\n\n"
        except UnicodeDecodeError:
            content += f.read_text(encoding='latin-1') + "\n\n"
        
    print(f'✓ Contenido de texto leído')
    
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


def format_text_content(text):
    """
    Formatea el contenido del presupuesto en secciones estructuradas (cards),
    tablas y listas con iconos.
    """
    sections = re.split(r'\n(?=[IVX]+\.\s)', text)
    formatted_html = ''

    def clean_header(line):
        return re.sub(r'^[IVX]+\.\s*', '', line).strip()

    for section in sections:
        lines = [l.strip() for l in section.strip().split('\n') if l.strip()]
        if not lines: continue

        header_raw = lines[0]
        header_text = clean_header(header_raw)
        content_lines = lines[1:]

        # Determinar el tipo de sección
        if "DATOS GENERALES" in header_raw.upper():
            formatted_html += f'<section class="section-card"><h2>I. {header_text}</h2>'
            formatted_html += '<div class="info-grid">'
            for line in content_lines:
                if ':' in line:
                    label, value = map(str.strip, line.split(':', 1))
                    formatted_html += f'<div class="info-item"><span class="info-label">{label}</span><span class="info-value">{value}</span></div>'
            formatted_html += '</div></section>'

        elif "ALCANCE" in header_raw.upper():
            formatted_html += f'<section class="section-card"><h2>II. {header_text}</h2>'
            # Buscar el párrafo descriptivo y la lista de sucursales
            desc_lines = []
            sucursales = []
            for line in content_lines:
                if line.startswith('Mostaza') or line.startswith('📍') or (not any(c.islower() for c in line) and len(line) > 5):
                     # Probable sucursal: Limpiar iconos si ya los tiene
                    clean_name = line.replace('📍', '').strip()
                    sucursales.append(clean_name)
                else:
                    desc_lines.append(line)
            
            if desc_lines:
                formatted_html += f'<div class="scope-content"><p>{" ".join(desc_lines)}</p></div>'
            
            if sucursales:
                formatted_html += '<ul class="sucursales-list">'
                for suc in sucursales:
                    formatted_html += f'<li class="sucursal-item"><span>📍</span> {suc}</li>'
                formatted_html += '</ul>'
            formatted_html += '</section>'

        elif "DESGLOSE" in header_raw.upper() or "INVERSIÓN" in header_raw.upper():
            formatted_html += f'<section class="section-card"><h2>III. {header_text}</h2>'
            formatted_html += '<div class="table-container"><table>'
            
            # Procesar tabla
            rows_found = 0
            for line in content_lines:
                # Detectar fila de encabezado (ítem, Concepto, etc)
                if rows_found == 0 and ("ítem" in line.lower() or "item" in line.lower()):
                    cols = re.split(r'\t|\s{2,}', line.strip())
                    formatted_html += '<thead><tr>' + ''.join(f'<th>{c}</th>' for c in cols) + '</tr></thead><tbody>'
                    rows_found += 1
                    continue
                
                # Detectar fila de TOTAL
                if "TOTAL" in line.upper():
                    cols = re.split(r'\t|\s{2,}', line.strip())
                    # Asegurar que tenga 3 o 4 columnas para que no se rompa el layout
                    formatted_html += '<tr class="total-row">' + ''.join(f'<td>{c}</td>' for c in cols) + '</tr>'
                    continue

                # Filas normales
                cols = re.split(r'\t|\s{2,}', line.strip())
                if len(cols) > 1:
                    formatted_html += '<tr>' + ''.join(f'<td>{c}</td>' for c in cols) + '</tr>'
                    rows_found += 1

            formatted_html += '</tbody></table></div></section>'

        elif "CONSIDERACIONES" in header_raw.upper() or "TÉCNICAS" in header_raw.upper():
            formatted_html += f'<section class="section-card"><h2>IV. {header_text}</h2>'
            formatted_html += '<div class="terms-grid">'
            for line in content_lines:
                if ':' in line:
                    badge, text = map(str.strip, line.split(':', 1))
                    formatted_html += f'<div class="term-item"><span class="term-badge">{badge}</span><p>{text}</p></div>'
                else:
                    formatted_html += f'<div class="term-item"><p>{line}</p></div>'
            formatted_html += '</div></section>'
        
        else:
            # Fallback para secciones no identificadas
            formatted_html += f'<section class="section-card"><h2>{header_text}</h2>'
            for line in content_lines:
                formatted_html += f'<p>{line}</p>'
            formatted_html += '</section>'

    return formatted_html

def generate_budget():
    """Genera el presupuesto final"""
    print('\n🚀 Iniciando generación de presupuesto...\n')
    
    if not TEMPLATE_FILE.exists():
        print(f'❌ Error: No se encontró template.html en {TEMPLATE_FILE}')
        sys.exit(1)
    
    template = TEMPLATE_FILE.read_text(encoding='utf-8')
    text_files, image_files, logo_file = read_source_files()
    
    text_content = read_text_content(text_files)
    formatted_content = format_text_content(text_content)
    
    if logo_file:
        logo_base64 = convert_image_to_base64(logo_file)
        logo_display = 'block'
    else:
        logo_base64 = ''
        logo_display = 'none'

    report_title = "Presupuesto de Servicio"
    
    # Extraer fecha
    date_match = re.search(r'Fecha:\s*(.*)', text_content)
    if date_match:
        report_date = date_match.group(1).strip()
    else:
        # Intentar extraer del primer bloque de datos
        dt_match = re.search(r'\d{1,2}\s+de\s+[a-zA-Z]+,\s+\d{4}', text_content)
        if dt_match:
            report_date = dt_match.group(0)
        else:
            report_date = datetime.now().strftime('%d de %B, %Y')
            months_es = {'January': 'Enero', 'February': 'Febrero', 'March': 'Marzo', 'April': 'Abril', 'May': 'Mayo', 'June': 'Junio', 'July': 'Julio', 'August': 'Agosto', 'September': 'Septiembre', 'October': 'Octubre', 'November': 'Noviembre', 'December': 'Diciembre'}
            for en, es in months_es.items(): report_date = report_date.replace(en, es)
    
    # Reemplazos
    template = template.replace('{{REPORT_TITLE}}', report_title)
    template = template.replace('{{REPORT_DATE}}', report_date)
    template = template.replace('{{REPORT_CONTENT}}', formatted_content)
    template = template.replace('{{LOGO}}', logo_base64)
    template = template.replace('{{LOGO_DISPLAY}}', logo_display)
    
    OUTPUT_FILE.write_text(template, encoding='utf-8')
    
    print(f'\n✅ Presupuesto generado: {OUTPUT_FILE}\n')

if __name__ == '__main__':
    generate_budget()
