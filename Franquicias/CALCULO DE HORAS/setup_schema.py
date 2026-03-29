import openpyxl
import json
import os
import difflib

# ─────────────────────────────────────────────────────────
# CONFIGURACIÓN DE ESQUEMA AUTOMÁTICO
# Detecta las columnas necesarias en el Excel y genera SCHEMA.json
# ─────────────────────────────────────────────────────────

BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
SOURCE_DIR = os.path.join(BASE_DIR, "Source")
SCHEMA_PATH = os.path.join(SOURCE_DIR, "SCHEMA.json")

# Roles que el sistema necesita identificar
ROLES = {
    "codigo": ["Código", "Ticket", "ID", "Nro Ticket", "Incidencia ID"],
    "sucursal": ["Sucursal", "Local", "Nombre Local", "Tienda", "Establecimiento"],
    "cod_sucursal": ["Cód. de Sucursal", "Cod Local", "ID Sucursal", "Codigo Sucursal"],
    "incidencia": ["Incidencia", "Tipo Incidencia", "Asunto"],
    "descripcion": ["Descripción", "Detalle", "Mensaje"],
    "ultima_respuesta": ["Última Respuesta", "Última respuesta del técnico"],
    "mensaje_resolucion": ["Mensaje de Resolución", "Comentario Cierre", "Resolución"],
    "fecha_resolucion": ["Fecha de Resolución", "Fecha Cierre", "Resuelto el"],
    "estado": ["Estado", "Status"],
    "tecnico": ["Técnico Asignado", "Técnico", "Asignado a"],
    
    # Columnas generadas por tarifario/auditoría (fuzzy match también por si cambian)
    "zona": ["Zona", "Radio"],
    "km": ["Km", "Kilómetros", "Distancia"],
    "valor_hora": ["Valor Hora (USD)", "Tarifa", "Precio Hora"],
    "hs_minimas": ["Hs Mínimas", "Mínimo Horas", "Base Horas"],
    "hs_chat": ["HS_Chat", "Horas Chat", "Chat_HS"],
    "hs_final": ["HS_Final", "Horas Finales", "Total_HS"],
    "usd": ["USD", "Total USD", "Costo Total"],
    "observaciones_audit": ["Observaciones_Audit", "Notas Auditoría", "Audit_Obs"],
    "check": ["Check", "Validado", "OK"]
}

def find_target_excel():
    """Busca el archivo target.xlsx (case insensitive)."""
    if not os.path.exists(SOURCE_DIR):
        print(f"Error: No existe el directorio {SOURCE_DIR}")
        return None
    for f in os.listdir(SOURCE_DIR):
        if f.lower().replace(" ", "") == "target.xlsx":
            return os.path.join(SOURCE_DIR, f)
    return None

def main():
    print("🔍 Iniciando detección de esquema...")
    excel_path = find_target_excel()
    if not excel_path:
        print("❌ No se encontró target.xlsx en Source/")
        return

    try:
        wb = openpyxl.load_workbook(excel_path, read_only=True)
        ws = wb.active
        headers = [str(cell.value).strip() for cell in next(ws.iter_rows(max_row=1)) if cell.value]
        wb.close()
    except Exception as e:
        print(f"❌ Error al leer el Excel: {e}")
        return

    schema = {}
    discrepancias = []

    for role, candidates in ROLES.items():
        match = None
        # 1. Match exacto
        for c in candidates:
            if c in headers:
                match = c
                break
        
        # 2. Fuzzy match si no hubo exacto
        if not match:
            for h in headers:
                # Si el encabezado real contiene alguna de nuestras palabras clave
                if any(c.lower() in h.lower() for c in candidates):
                    match = h
                    break
            
            if not match:
                # Intento con difflib para casos muy distintos
                for c in candidates:
                    matches = difflib.get_close_matches(c, headers, n=1, cutoff=0.6)
                    if matches:
                        match = matches[0]
                        break

        if match:
            schema[role] = match
            # Si el match no es el preferido (el primero de la lista), avisar
            if match != candidates[0]:
                discrepancias.append(f"⚠️  Rol '{role}': Usando '{match}' (Esperaba '{candidates[0]}')")
        else:
            schema[role] = None
            print(f"❌ No se pudo encontrar una columna para: {role}")

    # Guardar SCHEMA.json
    with open(SCHEMA_PATH, 'w', encoding='utf-8') as f:
        json.dump(schema, f, indent=4, ensure_ascii=False)

    print(f"\n✅ SCHEMA.json generado en {SCHEMA_PATH}")
    
    if discrepancias:
        print("\n--- DISCREPANCIAS DETECTADAS ---")
        for d in discrepancias:
            print(d)
        print("--------------------------------")
    
    print("\nResumen de columnas detectadas:")
    for role, col in schema.items():
        status = "✅" if col else "❌"
        print(f"  {status} {role:<18} -> {col}")

if __name__ == "__main__":
    main()
