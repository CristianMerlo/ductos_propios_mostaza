import pandas as pd
import json
import os

def extract_excel_data(file_path):
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return

    try:
        # Load the Excel file
        # We'll try to read all sheets to see what's inside
        xls = pd.ExcelFile(file_path)
        data = {}
        
        for sheet_name in xls.sheet_names:
            df = pd.read_excel(xls, sheet_name=sheet_name)
            # Convert to dictionary for easy inspection
            data[sheet_name] = df.to_dict(orient='records')
            
        # For now, just print the sheet names and columns of the first sheet to understand the structure
        print(f"Sheets found: {xls.sheet_names}")
        if xls.sheet_names:
            first_sheet = xls.sheet_names[0]
            df_first = pd.read_excel(xls, sheet_name=first_sheet)
            print(f"Columns in '{first_sheet}': {df_first.columns.tolist()}")
            
        # Save to a temporary JSON for reference
        output_path = "extracted_data.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2, default=str)
        print(f"Data saved to {output_path}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    file_path = "/Users/CR1S714N/Documents/Repositorios GitHub/Franquicias/Status Mensual/Analisis Ultimos meses.xlsx"
    extract_excel_data(file_path)
