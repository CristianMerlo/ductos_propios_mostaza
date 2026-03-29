#!/usr/bin/env python3
import os
import re
import base64
import json
import urllib.request
from pathlib import Path
from datetime import datetime

# Configuración
BASE_DIR = Path(__file__).parent
SOURCE_DIR = BASE_DIR / 'source'
TEMPLATE_FILE = BASE_DIR / 'template.html'
OUTPUT_FILE = BASE_DIR / 'informe_final.html'
PROMPT_FILE = BASE_DIR / 'prompt_informes_generales.txt'

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

def read_system_prompt():
    """Lee el archivo de prompt para informes generales"""
    if PROMPT_FILE.exists():
        try:
            return PROMPT_FILE.read_text(encoding='utf-8')
        except Exception as e:
            print(f"⚠️  No se pudo leer el prompt general: {e}")
    
    print("⚠️  Usando prompt de respaldo (no se encontró el archivo)")
    return "Estructura el siguiente texto como un informe formal:"


def get_base64_img(path):
    if not path or not path.exists(): return ""
    try:
        with open(path, "rb") as f:
            data = base64.b64encode(f.read()).decode("utf-8")
        ext = path.suffix.lower().replace(".", "")
        mime = "jpeg" if ext == "jpg" else ext
        return f"data:image/{mime};base64,{data}"
    except: return ""

def enhance_with_ai(text):
    api_key = os.environ.get('GROQ_API_KEY')
    if not api_key:
        print("ℹ️ IA: No se detectó GROQ_API_KEY. Usando parseo manual.")
        return None

    print("🤖 IA: Mejorando redacción con LLM (LLaMA 3 vía Groq)...")
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
        "User-Agent": "ReportGenerator/1.0"
    }
    
    system_prompt = read_system_prompt()
    
    data = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Estructura este texto:\n\n{text}"}
        ],
        "temperature": 0.2
    }
    
    try:
        req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            print("✓ Texto formateado con IA exitosamente")
            return result['choices'][0]['message']['content']
    except Exception as e:
        print(f"⚠️ IA: Error al consultar API: {e}")
        return None

def format_content_manual(text):
    if not text: return "<p>Sin contenido.</p>"
    
    # Normalizar saltos de línea
    text = text.replace("\r\n", "\n")
    
    # Detectar títulos (líneas que empiezan con número o son CAPS)
    lines = text.split("\n")
    html = ""
    list_active = False
    
    for line in lines:
        line = line.strip()
        if not line:
            if list_active:
                html += "</ul>"
                list_active = False
            continue
        
        # Títulos de sección
        if re.match(r"^\d+\.", line) or (line.isupper() and len(line) < 60):
            if list_active:
                html += "</ul>"
                list_active = False
            html += f"<h3>{line}</h3>"
        
        # Elementos de lista (empiezan con fecha, guión, o punto)
        elif re.match(r"^(\d+|[•\-\*])", line) or re.match(r"^\d{2}\s+de\s+\w+", line):
            if not list_active:
                html += "<ul>"
                list_active = True
            # Resaltar Tickets e información clave (soporta plural y múltiples números)
            proc_line = re.sub(r'(Tickets?\s*#?\d+(?:[\s\/\,y&]+#?\d+)*)', r'<b>\1</b>', line, flags=re.IGNORECASE)
            proc_line = re.sub(r"(\d{2}\s+de\s+\w+)", r"<b>\1</b>", proc_line)
            html += f"<li>{proc_line}</li>"
        
        # Párrafos normales
        else:
            if list_active:
                html += "</ul>"
                list_active = False
            proc_line = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", line)
            html += f"<p>{proc_line}</p>"
            
    if list_active: html += "</ul>"
    return html

def run():
    print("🚀 Iniciando Generador de Informes Generales...")
    if not TEMPLATE_FILE.exists(): return print("❌ Error: Falta template.html")
    
    # 1. Buscar archivos recursivamente
    all_files = []
    for p in Path(SOURCE_DIR).rglob('*'):
        if p.is_file() and not p.name.startswith('.'):
            all_files.append(p)
            
    txt_files = [f for f in all_files if f.suffix.lower() == ".txt"]
    img_exts = [".jpg", ".jpeg", ".png", ".webp"]
    img_files = [f for f in all_files if f.suffix.lower() in img_exts]
    
    # Identificar Logo
    logo_path = next((f for f in img_files if "logo" in f.name.lower()), None)
    if logo_path:
        print(f"✓ Logo detectado: {logo_path.relative_to(SOURCE_DIR)}")
        img_files.remove(logo_path)
    
    # 2. Procesar Texto
    content_raw = ""
    if txt_files:
        # Priorizar informe.txt o el archivo más grande
        target_txt = next((f for f in txt_files if f.name == "informe.txt"), txt_files[0])
        content_raw = target_txt.read_text(encoding="utf-8", errors="replace")
    
    # Intentar mejora con IA, si falla usar manual
    html_body = enhance_with_ai(content_raw)
    if not html_body:
        html_body = format_content_manual(content_raw)
    
    # 3. Procesar Galería
    gallery_html = ""
    if img_files:
        for img in sorted(img_files):
            b64 = get_base64_img(img)
            gallery_html += f'''
            <div class="img-card">
                <img src="{b64}" loading="lazy">
                <div class="img-caption">{img.stem}</div>
            </div>'''
    
    # 4. Generar Documento
    template_str = TEMPLATE_FILE.read_text(encoding="utf-8")
    
    # Fecha formateada
    now = datetime.now()
    meses_es = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    date_str = f"{now.day} de {meses_es[now.month-1]}, {now.year}"
    
    # Reemplazos
    replacements = {
        "{{REPORT_TITLE}}": "Guía de Verificación de Instalación",
        "{{REPORT_DATE}}": date_str,
        "{{REPORT_CONTENT}}": html_body,
        "{{IMAGE_GALLERY}}": gallery_html if gallery_html else '',
        "{{LOGO}}": get_base64_img(logo_path),
        "{{LOGO_DISPLAY}}": "block" if logo_path else "none",
        "{{GALLERY_DISPLAY}}": "block" if gallery_html else "none" 
    }
    
    for key, val in replacements.items():
        template_str = template_str.replace(key, val)
        
    OUTPUT_FILE.write_text(template_str, encoding="utf-8")
    print(f"✅ ¡Éxito! Informe generado en: {OUTPUT_FILE.name}")
    
    # 5. Abrir en el navegador automáticamente
    try:
        import webbrowser
        file_url = f"file://{OUTPUT_FILE.resolve()}"
        webbrowser.open(file_url)
        print("🌐 Abriendo informe en el navegador por defecto...")
    except Exception as e:
        print(f"⚠️ No se pudo abrir el navegador automáticamente: {e}")

if __name__ == "__main__":
    run()
