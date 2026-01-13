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
    """Formatea el texto en párrafos y títulos HTML"""
    # Separar por párrafos
    paragraphs = text.split('\n\n')
    
    def title_case(text):
        if not text or not text.strip(): return text
        words = text.strip().split()
        lowercase_words = {'y', 'de', 'del', 'la', 'el', 'los', 'las', 'a', 'en', 'con', 'por'}
        result = []
        for i, word in enumerate(words):
            if i == 0 or word.lower() not in lowercase_words:
                result.append(word.capitalize())
            else:
                result.append(word.lower())
        return ' '.join(result)
    
    formatted_html = ''
    for para in paragraphs:
        trimmed = para.strip()
        if not trimmed: continue
        
        # Detectar títulos (por numeración o mayúsculas)
        if re.match(r'^\d+\.', trimmed) or (trimmed.isupper() and len(trimmed) < 60):
            content = title_case(trimmed) if trimmed.isupper() else trimmed
            formatted_html += f'<h3>{content}</h3>\n'
            continue

        # Procesar líneas internas del párrafo
        processed_para = trimmed.replace('\n', '<br>')
        processed_para = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', processed_para)
        
        new_lines = []
        for line in processed_para.split('<br>'):
            if ':' in line and not ('<' in line.split(':')[0]):
                parts = line.split(':', 1)
                label = parts[0].strip()
                value = parts[1].strip()
                new_lines.append(f'<span class="data-label">{label}:</span> {value}')
            else:
                new_lines.append(line)
        
        processed_para = '<br>'.join(new_lines)
        formatted_html += f'<p>{processed_para}</p>\n'
    
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

    report_title = "Presupuesto de Obra / Servicio"
    
    # Extraer fecha
    date_match = re.search(r'Fecha:\s*(.*)', text_content)
    if date_match:
        report_date = date_match.group(1).strip()
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
