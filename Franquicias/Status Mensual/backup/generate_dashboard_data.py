import pandas as pd
import json
import os
from datetime import datetime

def generate_dashboard_data(input_file, output_file):
    if not os.path.exists(input_file):
        print(f"Error: Input file not found at {input_file}")
        return

    # try:
    # Load the relevant sheet
    df = pd.read_excel(input_file, sheet_name='Horas Franquicia')
    
    # Data Cleaning
    df['Fecha creación'] = pd.to_datetime(df['Fecha creación'], errors='coerce')
    df['Fecha de Resolución'] = pd.to_datetime(df['Fecha de Resolución'], errors='coerce')
    df['Inicio'] = pd.to_datetime(df['Inicio'], errors='coerce')
    
    # NEW: Ensure HS is numeric to avoid "concatenate str and int" error during sum()
    df['HS'] = pd.to_numeric(df['HS'], errors='coerce').fillna(0)
    
    # Drop rows without creation date if any
    df = df.dropna(subset=['Fecha creación'])
    
    # Filter 2025 (as per old template aesthetic "Evolución 2025")
    # However, looking at the data, it seems to be late 2025. 
    # We'll group by month regardless.
    
    df['Month'] = df['Fecha creación'].dt.strftime('%b').str.upper()
    df['MonthNum'] = df['Fecha creación'].dt.month
    
    # Sort by month number
    df = df.sort_values('MonthNum')
    
    months = df['Month'].unique().tolist()
    
    monthly_data = []
    for month in months:
        month_df = df[df['Month'] == month]
        
        total_tickets = len(month_df)
        solved_tickets = len(month_df[month_df['Estado'] == 'Cerrado'])
        pending_tickets = total_tickets - solved_tickets
        
        # SLA Calculation: Average time from Inicio to Resolución in days
        valid_sla_df = month_df.dropna(subset=['Inicio', 'Fecha de Resolución'])
        if not valid_sla_df.empty:
            avg_sla = (valid_sla_df['Fecha de Resolución'] - valid_sla_df['Inicio']).dt.total_seconds().mean() / (24 * 3600)
        else:
            avg_sla = 0
            
        monthly_data.append({
            "month": month,
            "total": total_tickets,
            "solved": solved_tickets,
            "pending": pending_tickets,
            "sla": round(avg_sla, 2)
        })
        
    # Top Fallas (Incidencia)
    top_fallas = df['Incidencia'].value_counts().head(5).reset_index()
    top_fallas.columns = ['incidencia', 'count']
    
    # Top Sucursales
    top_sucursales = df['Sucursal'].value_counts().head(5).reset_index()
    top_sucursales.columns = ['sucursal', 'count']
    
    # Tech Workload (Resuelto por) - monthly breakdown for stacked chart
    techs = df['Resuelto por'].dropna().unique().tolist()
    tech_data = {
        "labels": months,
        "datasets": []
    }
    
    # Colors for tech chart (vibrant / brand related)
    colors = ['#DA291C', '#FFC72C', '#22c55e', '#3b82f6', '#a855f7', '#f97316', '#06b6d4', '#ec4899']
    
    for i, tech in enumerate(techs):
        tech_counts = []
        for month in months:
            count = len(df[(df['Month'] == month) & (df['Resuelto por'] == tech)])
            tech_counts.append(count)
            
        tech_data['datasets'].append({
            "label": tech,
            "data": tech_counts,
            "backgroundColor": colors[i % len(colors)]
        })

    # --- GLOBAL METRICS FROM Horas Franquicia ---
    total_tickets = int(len(df))
    total_hours = int(df['HS'].sum())
    
    valid_overall_sla = df.dropna(subset=['Inicio', 'Fecha de Resolución'])
    if not valid_overall_sla.empty:
        avg_overall_sla = round(float((valid_overall_sla['Fecha de Resolución'] - valid_overall_sla['Inicio']).dt.total_seconds().mean() / (24 * 3600)), 2)
    else:
        avg_overall_sla = 0

    # --- DATA FROM Hoja1 (Indicators and Tasks) ---
    df_hoja1 = pd.read_excel(input_file, sheet_name='Hoja1')
    
    # Extract indicators (first 6 rows of Hoja1 based on inspection)
    # Rows: 0: Horas MO, 1: Tecnicos campo, 2: Tecnico taller, 3: Flexsol, 4: Otros, 5: Facturacion
    months_cols = ['abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    
    indicators = []
    for idx in range(0, 6):
        row = df_hoja1.iloc[idx]
        label = str(row['Unnamed: 2'])
        values = [float(row[m]) if pd.notnull(row[m]) else 0 for m in months_cols]
        indicators.append({
            "label": label,
            "data": values
        })
        
    # Extract Regular Tasks (Starting row 13 approx based on inspection)
    # "Tareas realizadas REGULARMENTE" is at row 12 (idx 12)
    # We take the items following that row until end or empty
    regular_tasks = []
    start_tasks_idx = 13
    for idx in range(start_tasks_idx, len(df_hoja1)):
        row_val = df_hoja1.iloc[idx]['Unnamed: 2']
        if pd.notnull(row_val) and str(row_val).strip() != "":
            regular_tasks.append(str(row_val).strip())
        elif idx > start_tasks_idx + 5: # Break if we find empty rows after some tasks
            break

    # --- FINAL DATA OBJECT ---
    final_data = {
        "monthlyEvolution": monthly_data,
        "topFallas": top_fallas.to_dict(orient='records'),
        "topSucursales": top_sucursales.to_dict(orient='records'),
        "techWorkload": tech_data,
        "indicators": indicators,
        "regularTasks": regular_tasks,
        "months": [m.upper() for m in months_cols],
        "overallMetrics": {
            "totalTickets": total_tickets,
            "totalHours": total_hours,
            "avgSLA": avg_overall_sla
        }
    }
    
    # Save as .js file to avoid CORS issues when opening index.html via file://
    output_js = output_file.replace('.json', '.js')
    with open(output_js, 'w', encoding='utf-8') as f:
        f.write("const DASHBOARD_DATA = ")
        json.dump(final_data, f, ensure_ascii=False, indent=2)
        f.write(";")
        
    print(f"Dashboard data generated successfully at {output_js}")

    # except Exception as e:
    #     print(f"An error occurred: {e}")

if __name__ == "__main__":
    input_path = "/Users/CR1S714N/Documents/Repositorios GitHub/Franquicias/Status Mensual/Analisis Ultimos meses.xlsx"
    output_path = "/Users/CR1S714N/Documents/Repositorios GitHub/Franquicias/Status Mensual/dashboard_data.json"
    generate_dashboard_data(input_path, output_path)
