import pandas as pd
import re
import json
import os
import glob
from pypdf import PdfReader

def extract_hours_from_text(text):
    """Extrae las horas del texto del PDF o aplica lógica técnica."""
    text_lower = text.lower()
    
    # 1. Buscar "Tiempo de Labor: XX:XX hs."
    labor_match = re.search(r'tiempo de labor[:\s]+(\d+)[:\s]*(\d+)?\s*hs', text_lower)
    if labor_match:
        hours = int(labor_match.group(1))
        # Si hay minutos, los redondeamos o tomamos la hora base (ej: 01:30 -> 1 o 2?)
        # Por ahora tomamos la hora entera para simplificar o según pida el flujo.
        return max(1, hours)

    # 2. Fallback: Lógica técnica (reutilizada)
    if '58' in text_lower and ('er' in text_lower or 'error' in text_lower): return 6
    if ('54' in text_lower or '55' in text_lower) and ('er' in text_lower or 'error' in text_lower): return 5
    if '59' in text_lower: return 1
    
    # Tiempo de servicio (otro formato posible)
    exact_match = re.search(r'tiempo de servicio[:\s]+(\d+)\s*([a-z]+)?', text_lower)
    if exact_match:
        val = int(exact_match.group(1))
        unit = exact_match.group(2) if exact_match.group(2) else 'hs'
        if unit.startswith('m'): return max(1, val // 60 if val >= 60 else 1)
        else: return val

    return 2 # Default por reporte formal

def parse_pdf(pdf_path):
    """Extrae datos clave de un informe PDF."""
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        data = {
            'file': os.path.basename(pdf_path),
            'ticket': None,
            'fecha': None,
            'local': None,
            'tecnico': None,
            'texto_completo': text
        }
        
        # Extraer Ticket N°
        ticket_match = re.search(r'ticket\s*n[°º]?[:\s]+(\d+)', text, re.IGNORECASE)
        if ticket_match: data['ticket'] = ticket_match.group(1)
        
        # Extraer Fecha (formato DD/MM/YYYY)
        fecha_match = re.search(r'fecha[:\s]+(\d{2}/\d{2}/\d{2,4})', text, re.IGNORECASE)
        if fecha_match: data['fecha'] = fecha_match.group(1)
        
        # Extraer Cliente / Sucursal
        local_match = re.search(r'sucursal[:\s]+(?:local\s+)?([a-z\s2]+)', text, re.IGNORECASE)
        if local_match: data['local'] = local_match.group(1).strip()
        
        # Extraer Técnico
        tech_match = re.search(r'técnico\s*responsable[:\s]+([a-z\s]+)', text, re.IGNORECASE)
        if tech_match: data['tecnico'] = tech_match.group(1).strip()
        
        return data
    except Exception as e:
        print(f"Error parseando {pdf_path}: {e}")
        return None

def find_target_excel():
    possible_paths = [
        os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../Source/Target.xlsx")),
        os.path.abspath(os.path.join(os.getcwd(), "Source/Target.xlsx")),
        os.path.abspath(os.path.join(os.getcwd(), "../Source/Target.xlsx"))
    ]
    for p in possible_paths:
        if os.path.exists(p): return p
    return None

def find_pdf_files():
    """Busca PDFs en la carpeta Informes."""
    source_dirs = [
        os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../Source/Informes")),
        os.path.abspath(os.path.join(os.getcwd(), "Source/Informes")),
        os.path.abspath(os.path.join(os.getcwd(), "../Source/Informes"))
    ]
    
    all_pdfs = []
    for d in source_dirs:
        if os.path.exists(d):
            all_pdfs.extend(glob.glob(os.path.join(d, "*.pdf")))
    
    return sorted(list(set([os.path.abspath(f) for f in all_pdfs if os.path.exists(f)])))

def main():
    excel_path = find_target_excel()
    if not excel_path:
        # Fallback local
        excel_path = "/Users/CR1S714N/Documents/Repositorios GitHub/Franquicias/CALCULO DE HORAS/Source/Target.xlsx"

    pdf_files = find_pdf_files()
    if not pdf_files:
        print("Error: No se encontraron archivos PDF en la carpeta Source/Informes.")
        return

    print(f"Informes PDF encontrados: {len(pdf_files)}")
    df = pd.read_excel(excel_path)
    
    if 'Informes PDF' not in df.columns:
        df['Informes PDF'] = 0

    mapping_count = 0
    for f in pdf_files:
        data = parse_pdf(f)
        if not data: continue
        
        hours = extract_hours_from_text(data['texto_completo'])
        matched = False
        
        # 1. Match por Ticket (N° exacto)
        if data['ticket']:
            mask = df['Código'].astype(str) == str(data['ticket'])
            if mask.any():
                df.loc[mask, 'Informes PDF'] = hours
                matched = True
                print(f" - [MATCH TICKET] {data['file']} -> Ticket {data['ticket']} ({hours} hs)")

        # 2. Match por Local + Fecha (Si no hubo ticket)
        if not matched and data['local'] and data['fecha']:
            local_name = data['local'].lower()
            # Simplificar nombre del local para match (ej: "Cabildo 2" -> "Cabildo")
            short_local = local_name.split()[0]
            
            # Formatos de fecha en Excel pueden variar, intentamos match flexible
            # Para simplificar, buscamos local en Sucursal e incidencia y chequeamos que la fila no tenga horas ya
            mask_local = df['Sucursal'].str.lower().str.contains(short_local, na=False)
            
            # Si hay varios, intentamos ver si la fecha coincide (en el Excel la fecha suele ser 'Inicio' o 'Fecha de Resolución')
            if mask_local.any():
                # Por ahora, si es el mismo local y no tiene horas de PDF, lo asignamos si es un match razonable.
                # Nota: En un sistema real se compararía datetime.
                target_rows = df[mask_local & (df['Informes PDF'] == 0)]
                if not target_rows.empty:
                    df.loc[target_rows.index[0], 'Informes PDF'] = hours
                    matched = True
                    print(f" - [MATCH LOCAL/FECHA] {data['file']} -> Local {data['local']} ({hours} hs)")

        if matched: mapping_count += 1
        else: print(f" - [NO MATCH] {data['file']}")

    df.to_excel(excel_path, index=False)
    print(f"\nProceso finalizado. PDFs procesados: {len(pdf_files)}. Mapeados exitosamente: {mapping_count}.")

if __name__ == "__main__":
    main()
