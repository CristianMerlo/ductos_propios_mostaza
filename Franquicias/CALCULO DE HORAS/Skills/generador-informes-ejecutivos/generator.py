#!/usr/bin/env python3
import os
import re
import base64
import sys
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).parent
SOURCE_DIR = BASE_DIR / 'source'
TEMPLATE_FILE = BASE_DIR / 'template.html'
OUTPUT_FILE = BASE_DIR / 'informe_ejecutivo.html'

def convert_image_to_base64(image_path):
    if not image_path.exists(): return ""
    with open(image_path, 'rb') as f:
        data = base64.b64encode(f.read()).decode('utf-8')
    ext = image_path.suffix.lower().replace('.', '')
    return f"data:image/{ext};base64,{data}"

def md_to_html(text):
    # Basic Markdown Parser using Regex
    
    # Tables
    def process_table(match):
        lines = match.group(0).strip().split('\n')
        if len(lines) < 2: return match.group(0)
        
        html = "<table><thead><tr>"
        headers = [c.strip() for c in lines[0].split('|') if c.strip()]
        html += "".join(f"<th>{h}</th>" for h in headers)
        html += "</tr></thead><tbody>"
        
        for line in lines[2:]: # Skip header and divider
            cols = [c.strip() for c in line.split('|') if c.strip()]
            if cols:
                html += "<tr>" + "".join(f"<td>{c}</td>" for c in cols) + "</tr>"
        
        html += "</tbody></table>"
        return html

    text = re.sub(r'((?:\|.+\|\s*\n)+)', process_table, text)

    # Headers
    text = re.sub(r'^#\s+(.+)$', r'<h1>\1</h1>', text, flags=re.M)
    text = re.sub(r'^##\s+(.+)$', r'<h2>\1</h2>', text, flags=re.M)
    text = re.sub(r'^###\s+(.+)$', r'<h3>\1</h3>', text, flags=re.M)

    # Bold / Italic
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'\*(.+?)\*', r'<i>\1</i>', text)

    # Lists (Unordered)
    def process_list(match):
        items = match.group(0).strip().split('\n')
        html = "<ul>"
        for item in items:
            content = re.sub(r'^[\-\*]\s+', '', item)
            html += f"<li>{content}</li>"
        html += "</ul>"
        return html

    text = re.sub(r'((?:^[\-\*]\s.+\n?)+)', process_list, text, flags=re.M)

    # Paragraphs (split by double newline)
    paragraphs = text.split('\n\n')
    output = []
    for p in paragraphs:
        p = p.strip()
        if not p: continue
        if p.startswith('<h') or p.startswith('<table') or p.startswith('<ul'):
            output.append(p)
        else:
            p_html = p.replace('\n', '<br>')
            output.append(f"<p>{p_html}</p>")
    
    return "\n".join(output)

def generate():
    print("🚀 Generando Informe Ejecutivo...")
    
    if not SOURCE_DIR.exists(): os.makedirs(SOURCE_DIR)
    
    # Read text
    text = ""
    for f in SOURCE_DIR.glob('*.md'):
        text += f.read_text(encoding='utf-8') + "\n\n"
    if not text:
        for f in SOURCE_DIR.glob('*.txt'):
            text += f.read_text(encoding='utf-8') + "\n\n"
            
    if not text:
        print("❌ No se encontraron archivos de origen en source/")
        return

    # Process
    html_content = md_to_html(text)
    
    # Date
    report_date = datetime.now().strftime('%d de %B, %Y')
    months = {'January':'Enero','February':'Febrero','March':'Marzo','April':'Abril','May':'Mayo','June':'Junio','July':'Julio','August':'Agosto','September':'Septiembre','October':'Octubre','November':'Noviembre','December':'Diciembre'}
    for en, es in months.items(): report_date = report_date.replace(en, es)

    # Title
    title_match = re.search(r'<h1>(.+?)</h1>', html_content)
    report_title = title_match.group(1) if title_match else "Informe Ejecutivo"

    # Logo
    logo_path = Path("/Users/CR1S714N/Documents/Repositorios GitHub/Franquicias/informes-tecnicos/source/img/logo.png")
    logo_base64 = convert_image_to_base64(logo_path)
    logo_display = "block" if logo_base64 else "none"

    # Template
    template = TEMPLATE_FILE.read_text(encoding='utf-8')
    template = template.replace('{{REPORT_TITLE}}', report_title)
    template = template.replace('{{REPORT_DATE}}', report_date)
    template = template.replace('{{REPORT_CONTENT}}', html_content)
    template = template.replace('{{LOGO}}', logo_base64)
    template = template.replace('{{LOGO_DISPLAY}}', logo_display)

    OUTPUT_FILE.write_text(template, encoding='utf-8')
    print(f"✅ Informe generado: {OUTPUT_FILE}")

if __name__ == "__main__":
    generate()
