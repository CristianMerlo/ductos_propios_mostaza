import pandas as pd
import json
import os

def inspect_hoja1(file_path):
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return

    try:
        # Load Hoja1
        df = pd.read_excel(file_path, sheet_name='Hoja1')
        
        # Display the first few rows and columns to understand the table layout
        print("--- Hoja1 Content Sample ---")
        print(df.head(20))
        print("--- Columns ---")
        print(df.columns.tolist())
        
        # Save to JSON for easier inspection of the whole sheet
        output_path = "hoja1_inspection.json"
        df_dump = df.to_dict(orient='records')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(df_dump, f, ensure_ascii=False, indent=2, default=str)
        print(f"\nFull sheet data saved to {output_path}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    file_path = "/Users/CR1S714N/Documents/Repositorios GitHub/Franquicias/Status Mensual/Analisis Ultimos meses.xlsx"
    inspect_hoja1(file_path)
