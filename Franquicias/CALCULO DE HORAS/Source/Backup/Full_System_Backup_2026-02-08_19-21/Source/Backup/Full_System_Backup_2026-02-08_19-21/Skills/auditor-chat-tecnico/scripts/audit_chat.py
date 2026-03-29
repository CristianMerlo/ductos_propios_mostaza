import pandas as pd
import re
import json
import os
import glob
from datetime import datetime

# Importamos la lógica de auditoría técnica del script anterior para reutilizar reglas
def audit_text_logic(text):
    text = text.lower()
    # Regla: (X horas de trabajo)
    match_hours = re.search(r'\((\d+)\s*hor[as]+\s*de\s*trabajo\)', text)
    if match_hours:
        return int(match_hours.group(1))
    
    # Si no, aplicar reglas técnicas (resumidas)
    if '58' in text and ('er' in text or 'error' in text): return 6
    if ('54' in text or '55' in text) and ('er' in text or 'error' in text): return 5
    if '59' in text: return 1
    if 'se realiza puesta cero' in text or 'regulacion de muelas' in text: return 2
    if 'se activa termica' in text: return 2
    
    # Tiempo de servicio explícito (nuestro fix anterior)
    exact_match = re.search(r'tiempo de servicio[:\s]+(\d+)\s*([a-z]+)?', text)
    if exact_match:
        val = int(exact_match.group(1))
        unit = exact_match.group(2) if exact_match.group(2) else 'hs'
        if unit.startswith('m'): return max(1, val // 60 if val >= 60 else 1)
        else: return val

    return 2 # Default

def parse_chat(chat_path):
    reports = []
    # Regex para detectar inicio de mensaje con fecha: [16/1/26, 9:15:22 p. m.]
    msg_start = re.compile(r'^\[(\d+/\d+/\d+),.*\] (.*): (.*)')
    
    current_report = None
    
    if not os.path.exists(chat_path):
        return []

    with open(chat_path, 'r', encoding='utf-8') as f:
        for line in f:
            match = msg_start.match(line)
            if match:
                date_str, sender, content = match.groups()
                # Si el contenido parece el inicio de un reporte (ej: "Cafetera local...")
                # O si contiene un ticket #
                if 'tiket#' in content.lower() or 'ticket#' in content.lower() or 'cafetera' in content.lower():
                    if current_report: reports.append(current_report)
                    current_report = {
                        'fecha': date_str,
                        'texto': content,
                        'codigo': None,
                        'local': None,
                        'source_file': os.path.basename(chat_path)
                    }
                    # Intentar extraer código inmediatamente
                    code_match = re.search(r'tiket#\s*(\d+)', content.lower())
                    if code_match: current_report['codigo'] = code_match.group(1)
                    
                    # Intentar extraer local (asumimos que suele estar al inicio)
                    local_match = re.search(r'cafetera\s+([a-z\s]+)\s*\(', content.lower())
                    if local_match: current_report['local'] = local_match.group(1).strip()
                elif current_report:
                    current_report['texto'] += " " + content
                    # Seguir buscando código si no lo tenemos
                    code_match = re.search(r'tiket#\s*(\d+)', line.lower())
                    if code_match: current_report['codigo'] = code_match.group(1)
            elif current_report:
                current_report['texto'] += " " + line.strip()
                
    if current_report: reports.append(current_report)
    return reports

def find_target_excel():
    possible_paths = [
        os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../Source/Target.xlsx")),
        os.path.abspath(os.path.join(os.getcwd(), "Source/Target.xlsx")),
        os.path.abspath(os.path.join(os.getcwd(), "../Source/Target.xlsx"))
    ]
    for p in possible_paths:
        if os.path.exists(p): return p
    return None

def find_chat_files():
    """Busca todos los archivos que contengan 'chat' y terminen en '.txt' en la carpeta Source."""
    source_dirs = [
        os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../Source")),
        os.path.abspath(os.path.join(os.getcwd(), "Source")),
        os.path.abspath(os.path.join(os.getcwd(), "../Source"))
    ]
    
    all_chats = []
    for d in source_dirs:
        if os.path.exists(d):
            # Buscar patrones: *chat*.txt, *_chat.txt, chat*.txt, etc.
            all_chats.extend(glob.glob(os.path.join(d, "*chat*.txt")))
            all_chats.extend(glob.glob(os.path.join(d, "chat*.txt")))
            all_chats.extend(glob.glob(os.path.join(d, "*_chat*.txt")))
    
    # Eliminar duplicados y asegurar que existen
    return sorted(list(set([os.path.abspath(f) for f in all_chats if os.path.exists(f)])))

def main():
    excel_path = find_target_excel()
    if not excel_path:
        # Fallback para pruebas si no estamos en la estructura de skills
        excel_path = "/Users/CR1S714N/Documents/Repositorios GitHub/Franquicias/CALCULO DE HORAS/Source/Target.xlsx"

    chat_files = find_chat_files()
    if not chat_files:
        # Fallback manual si glob falla por alguna razón de entorno
        manual_fallback = "/Users/CR1S714N/Documents/Repositorios GitHub/Franquicias/CALCULO DE HORAS/Source/chat.txt"
        if os.path.exists(manual_fallback):
            chat_files = [manual_fallback]
        else:
            print("Error: No se encontraron archivos de chat (*chat*.txt) en la carpeta Source.")
            return

    if not os.path.exists(excel_path):
        print(f"Error: No se encontró el archivo Target.xlsx.")
        return

    print(f"Archivos de chat encontrados: {len(chat_files)}")
    for f in chat_files:
        print(f" - {os.path.basename(f)}")

    all_reports = []
    for f in chat_files:
        all_reports.extend(parse_chat(f))

    print(f"Total de reportes extraídos: {len(all_reports)}")
    df = pd.read_excel(excel_path)
    
    if 'horas informe' not in df.columns:
        df['horas informe'] = 0

    mapping_count = 0
    for report in all_reports:
        hours = audit_text_logic(report['texto'])
        matched = False
        
        # 1. Match por Código
        if report['codigo']:
            mask = df['Código'].astype(str) == str(report['codigo'])
            if mask.any():
                df.loc[mask, 'horas informe'] = hours
                matched = True
        
        # 2. Match por Local + Fecha (Si no hubo match por código)
        if not matched and report['local']:
            local_name = report['local'].lower()
            mask_local = df['Sucursal'].str.lower().str.contains(local_name, na=False) | \
                         df['Incidencia'].str.lower().str.contains(local_name, na=False)
            
            if mask_local.any():
                df.loc[mask_local, 'horas informe'] = hours
                matched = True
        
        if matched: mapping_count += 1

    df.to_excel(excel_path, index=False)
    print(f"Proceso finalizado. Mapeados exitosamente: {mapping_count} de {len(all_reports)} reportes.")

if __name__ == "__main__":
    main()
