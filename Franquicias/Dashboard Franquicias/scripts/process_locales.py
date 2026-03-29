import pandas as pd
import json
import os

def process_locales():
    excel_path = "/Users/CR1S714N/Documents/Repositorios GitHub/Franquicias/Dashboard Franquicias/source/Locales Franquicia.xlsx"
    output_path = "/Users/CR1S714N/Documents/Repositorios GitHub/Franquicias/Dashboard Franquicias/assets/data/locales.json"
    
    if not os.path.exists(excel_path):
        print(f"Error: {excel_path} not found.")
        return

    try:
        # Read Excel
        df = pd.read_excel(excel_path)
        
        # Standardize columns based on inspection
        # Headers are expected to be: Lider, Supervisor, Local, Email, Direccion, Ciudad, Provincia
        # But let's be flexible and use column indices if names vary
        
        data = []
        for _, row in df.iterrows():
            item = {
                "regional": str(row.iloc[0]) if not pd.isna(row.iloc[0]) else "-",
                "supervisor": str(row.iloc[1]) if not pd.isna(row.iloc[1]) else "-",
                "local": str(row.iloc[2]) if not pd.isna(row.iloc[2]) else "-",
                "email": str(row.iloc[3]) if not pd.isna(row.iloc[3]) else "-",
                "direccion": str(row.iloc[4]) if not pd.isna(row.iloc[4]) else "-",
                "ciudad": str(row.iloc[5]) if not pd.isna(row.iloc[5]) else "-",
                "provincia": str(row.iloc[6]) if not pd.isna(row.iloc[6]) else "-",
                "tecnico": str(row.iloc[7]) if not pd.isna(row.iloc[7]) else "-"
            }
            data.append(item)
            
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
        print(f"Successfully processed {len(data)} locales into {output_path}")
        
    except Exception as e:
        print(f"Error processing Excel: {e}")

if __name__ == "__main__":
    process_locales()
