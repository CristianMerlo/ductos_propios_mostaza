import pandas as pd
import os
from pathlib import Path

# Configuración de rutas
BASE_DIR = Path("/Users/CR1S714N/Documents/Repositorios GitHub")
LOCALES_PATH = BASE_DIR / "analisis de datos/resultados/base locales Franquicias.xlsx"
OUTPUT_DIR = BASE_DIR / "Franquicias/equipos"
OUTPUT_EXCEL = OUTPUT_DIR / "base datos cafeteras.xlsx"

# Datos consolidados (NotebookLM + TXT Validado por Usuario)
notebook_data = [
    # --- CIMBALI ---
    {"Local": "9 de Julio", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["No especificado"]},
    {"Local": "Avellaneda", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["No especificado"]},
    {"Local": "Berazategui", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["2037123"]},
    {"Local": "Boedo", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["1860967"]},
    {"Local": "Cabildo", "Marca": "La Cimbali", "Cantidad": 2, "Series": ["1840650", "S/N (Falta chapa)"]},
    {"Local": "Cabildo 2", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["2032629"]},
    {"Local": "Callao y Corrientes", "Marca": "La Cimbali", "Cantidad": 2, "Series": ["No especificado", "No especificado"]},
    {"Local": "Canning", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["203305"]},
    {"Local": "Constitución", "Marca": "La Cimbali", "Cantidad": 2, "Series": ["No especificado", "No especificado"]},
    {"Local": "Ezeiza", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["1980865"]},
    {"Local": "Flores", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["1860973"]},
    {"Local": "Francisco Alvarez", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["1969718"]},
    {"Local": "Güemes", "Marca": "La Cimbali", "Cantidad": 2, "Series": ["1977235", "No especificado"], "Obs": "Serie 1977235 es de un sensor, no placa técnica"},
    {"Local": "La Plata 2", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["1851680"]},
    {"Local": "La Plata 3", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["2095737"]},
    {"Local": "Liniers", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["1842009"]},
    {"Local": "Moreno", "Marca": "La Cimbali", "Cantidad": 2, "Series": ["2033458", "1838967"]},
    {"Local": "Parque Chacabuco", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["No especificado"]},
    {"Local": "Quilmes Peatonal", "Marca": "La Cimbali", "Cantidad": 2, "Series": ["1855442", "1969721"]},
    {"Local": "San Justo Peatonal", "Marca": "La Cimbali", "Cantidad": 2, "Series": ["2033462", "1840208"]},
    {"Local": "San Martin Auto", "Marca": "La Cimbali", "Cantidad": 2, "Series": ["1978013", "1970909"], "Obs": "1970909 es equipo donante (Fuera de servicio)"},
    {"Local": "Villa del Parque", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["2095734"]},
    {"Local": "Grand Bourg", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["1859984"]},
    {"Local": "San Fernando", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["1851676"]},
    {"Local": "San Martín Peatonal", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["2107577"]},
    {"Local": "San Miguel", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["2096509"]},
    {"Local": "San Telmo", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["1850073"]},
    {"Local": "Villa Urquiza", "Marca": "La Cimbali", "Cantidad": 2, "Series": ["1857847", "1843850"]},
    {"Local": "Wilde", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["2095738"]},
    {"Local": "José C. Paz", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["1977240"]},
    {"Local": "Lanús Peatonal", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["1856434"]},
    {"Local": "Merlo", "Marca": "La Cimbali", "Cantidad": 2, "Series": ["1969719", "1851881"]},
    {"Local": "Palmas del Pilar", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["1842014"]},
    {"Local": "Pilar", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["1842014"]},
    {"Local": "Pompeya", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["1841251"], "Obs": "Validado por placa técnica en foto"},
    
    # --- MELITTA ---
    {"Local": "Ramos Mejía", "Marca": "Melitta", "Cantidad": 1, "Series": ["2437SBB00484"]},
    {"Local": "San Isidro", "Marca": "Melitta", "Cantidad": 1, "Series": ["61171"]},
    {"Local": "Once", "Marca": "Melitta", "Cantidad": 1, "Series": ["No especificado"], "Obs": "Foto muestra Melitta Cafina CT8"},
    
    # --- OTROS ---
    {"Local": "Luján", "Marca": "La Cimbali", "Cantidad": 1, "Series": ["S/N"], "Obs": "Informe explicita Sin Número Identificatorio"},
]

def run_consolidation():
    print("🚀 Iniciando consolidación FINAL (NotebookLM + TXT + Maestros)...")
    
    try:
        df_locales = pd.read_excel(LOCALES_PATH)
        local_col = 'Local' if 'Local' in df_locales.columns else df_locales.columns[0]
        lista_locales = df_locales[local_col].unique().tolist()
        print(f"✓ Base de locales cargada: {len(lista_locales)} locales encontrados.")
    except Exception as e:
        print(f"⚠️ No se pudo cargar la base de locales: {e}. Usando lista de NotebookLM.")
        lista_locales = [item["Local"] for item in notebook_data]

    consolidated = []
    notebook_map = {item["Local"].lower(): item for item in notebook_data}
    
    for local in lista_locales:
        local_clean = str(local).strip()
        data = notebook_map.get(local_clean.lower(), None)
        
        row = {
            "Local": local_clean,
            # Cafetera 1
            "Marca 1": data["Marca"] if data and len(data["Series"]) > 0 else ("No especificado" if data else ""),
            "Serie 1": data["Series"][0] if data and len(data["Series"]) > 0 else "",
            "Shots 1": 0,
            # Cafetera 2
            "Marca 2": data["Marca"] if data and len(data["Series"]) > 1 else "",
            "Serie 2": data["Series"][1] if data and len(data["Series"]) > 1 else "",
            "Shots 2": 0,
            # Generales
            "Cantidad Total": data["Cantidad"] if data else 0,
            "Observaciones": data.get("Obs", "") if data else ""
        }
        consolidated.append(row)

    df_final = pd.DataFrame(consolidated)
    
    if not OUTPUT_DIR.exists():
        OUTPUT_DIR.mkdir(parents=True)
        
    df_final.to_excel(OUTPUT_EXCEL, index=False)
    print(f"✅ ¡Éxito! Base de cafeteras final generada en: {OUTPUT_EXCEL}")
    
    print("\n📊 Resumen de Validación:")
    print(f"Total locales procesados: {len(df_final)}")
    print(f"Cafeteras con Serie 1: {len(df_final[df_final['Serie 1'] != ''])}")
    print(f"Cafeteras con Serie 2: {len(df_final[df_final['Serie 2'] != ''])}")

if __name__ == "__main__":
    run_consolidation()
