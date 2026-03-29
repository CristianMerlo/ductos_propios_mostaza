import pandas as pd
import json
import re
import os

def perform_audit(row):
    # Combinar texto de todas las columnas de diagnóstico
    text = f"{row['Título']} {row['Descripción']} {row['Última Respuesta']} {row['Mensaje de Resolución']}".lower()
    
    # 1. Reglas Cimbali
    if '54' in text or '55' in text:
        if 'er' in text or 'error' in text:
            return 5
    if '58' in text:
        if 'er' in text or 'error' in text:
            return 6
    if '59' in text:
        if 'er' in text or 'error' in text:
            return 1 # 1-2 HS (Ajuste)

    # 2. Equipos No-Café
    if 'freidora' in text or 'locatelli' in text:
        if 'picos' in text or 'quemadores' in text or 'explos' in text:
            return 3 # 2-3 HS
    if 'horno' in text or 'unox' in text:
        if 'contactora' in text or 'cable' in text:
            return 5 # 4-5 HS
    if 'broiler' in text or 'nieco' in text:
        return 2

    # 3. Regla de Sabotaje / Trivial
    if 'destrabe' in text or 'madera' in text:
        return 3
    if 'se cierra' in text and len(text.strip()) < 50:
        return 2 # Tarea mínima / administrativa

    # 4. Búsqueda de "Tiempo de servicio" explícito con detección de unidad
    # Busca el número y opcionalmente la unidad (minutos, min, m, hs, horas)
    exact_match = re.search(r'tiempo de servicio[:\s]+(\d+)\s*([a-z]+)?', text)
    if exact_match:
        val = int(exact_match.group(1))
        unit = exact_match.group(2) if exact_match.group(2) else 'hs'
        
        # Si la unidad empieza con 'm', son minutos (m, min, minutos...)
        if unit.startswith('m'):
            # Convertimos a horas. 30m -> 1h (mínimo técnico)
            return max(1, val // 60 if val >= 60 else 1)
        else:
            return val

    # Default si hay algo de info
    if len(text.strip()) > 10:
        # Si menciona error 59 específicamente sin "error" antes
        if '59' in text: return 1
        return 2
    
    return 0

def find_target_excel():
    """Busca el archivo Target.xlsx en una carpeta Source relativa al proyecto."""
    # Intentar buscar en ../../Source (si se ejecuta desde skills/nombre/scripts/)
    # O en Source/ (si se ejecuta desde la raíz del proyecto)
    possible_paths = [
        os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../Source/Target.xlsx")), # Desde skills/agente/scripts/
        os.path.abspath(os.path.join(os.getcwd(), "Source/Target.xlsx")), # Desde la raíz
        os.path.abspath(os.path.join(os.getcwd(), "../Source/Target.xlsx")) # Genérico
    ]
    
    for p in possible_paths:
        if os.path.exists(p):
            return p
    return None

def main():
    path = find_target_excel()
    if not path:
        print("Error: No se encontró el archivo 'Source/Target.xlsx'. Por favor, asegúrate de que la carpeta Source esté en la raíz de tu proyecto.")
        return
        
    print(f"Iniciando auditoría sobre: {path}")
    df = pd.read_excel(path)
    df = df.fillna('')
    
    results = {}
    for _, row in df.iterrows():
        hours = perform_audit(row)
        if hours > 0:
            results[str(row['Código'])] = hours
            
    # Guardar mapeo JSON para pasárselo al script de actualización
    with open('audit_results.json', 'w') as f:
        json.dump(results, f)
    
    print(f"Auditoría completada. {len(results)} tickets auditados con reglas.")

if __name__ == "__main__":
    main()
