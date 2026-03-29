import pandas as pd
import sys
import json
import os

def update_excel(excel_path, analysis_data):
    """
    Actualiza el archivo Excel con las horas de análisis.
    :param excel_path: Ruta al archivo Target.xlsx
    :param analysis_data: Diccionario con { "código_ticket": horas }
    """
    if not os.path.exists(excel_path):
        print(f"Error: El archivo {excel_path} no existe.")
        return

    try:
        # Leer el Excel
        df = pd.read_excel(excel_path)
        
        # Verificar que existe la columna 'Código'
        if 'Código' not in df.columns:
            print("Error: No se encontró la columna 'Código' en el archivo Excel.")
            return

        # Crear la columna 'horas análisis' si no existe
        # Nota: Adaptamos a 'horas análisis' o 'HORAS ANALISIS' según el archivo
        column_name = 'horas análisis'
        if 'HORAS ANALISIS' in df.columns:
            column_name = 'HORAS ANALISIS'
        
        if column_name not in df.columns:
            df[column_name] = 0

        # Mapear los datos
        analysis_map = {str(k): v for k, v in analysis_data.items()}
        
        # Actualizar filas basadas en el Código
        def get_hours(row):
            code = str(row['Código'])
            return analysis_map.get(code, row[column_name])

        df[column_name] = df.apply(get_hours, axis=1)

        # Guardar cambios
        df.to_excel(excel_path, index=False)
        print(f"Éxito: Se ha actualizado la columna '{column_name}' en {excel_path}")

    except Exception as e:
        print(f"Error procesando el Excel: {e}")

def find_target_excel():
    possible_paths = [
        os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../Source/Target.xlsx")),
        os.path.abspath(os.path.join(os.getcwd(), "Source/Target.xlsx")),
        os.path.abspath(os.path.join(os.getcwd(), "../Source/Target.xlsx"))
    ]
    for p in possible_paths:
        if os.path.exists(p):
            return p
    return None

if __name__ == "__main__":
    # Si se pasan argumentos, usarlos. Si no, intentar buscar automáticamente.
    if len(sys.argv) >= 3:
        path = sys.argv[1]
        try:
            data = json.loads(sys.argv[2])
            update_excel(path, data)
        except json.JSONDecodeError:
            print("Error: El segundo argumento debe ser un JSON válido.")
    else:
        # Modo de recuperación: buscar resultados de auditoría en el mismo directorio
        res_path = os.path.join(os.path.dirname(__file__), 'audit_results.json')
        target_path = find_target_excel()
        if os.path.exists(res_path) and target_path:
            with open(res_path, 'r') as f:
                update_excel(target_path, json.load(f))
        else:
            print("Uso: python3 update_excel.py <ruta_excel> <json_data>")
