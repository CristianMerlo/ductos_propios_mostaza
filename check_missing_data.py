import re

def check_missing_data():
    """Check for locales with missing frequency or provider"""
    with open('/Users/CR1S714N/Documents/Repositorios GitHub/script.js', 'r') as f:
        content = f.read()
    
    # Extract csvRaw
    match = re.search(r'const csvRaw = `(.*?)`;', content, re.DOTALL)
    if not match:
        print("Error: Could not find csvRaw")
        return
    
    csv_content = match.group(1)
    lines = csv_content.strip().split('\n')
    
    missing_freq = []
    missing_prov = []
    empty_locals = []
    
    for i, line in enumerate(lines[1:], start=2):  # Skip header, line numbers start at 2
        if not line.strip() or line.strip() == ';;;;;;;;;;;;;;;;':
            continue
            
        parts = line.split(';')
        if len(parts) < 5:
            continue
        
        id_ = parts[0].strip()
        region = parts[1].strip()
        local = parts[2].strip()
        freq = parts[3].strip()
        prov = parts[4].strip()
        
        if not local:
            empty_locals.append(f"Línea {i}: ID={id_}, Region={region}")
            continue
        
        if not freq or freq.lower() == 'determinar':
            missing_freq.append(f"{id_} - {local}")
        
        if not prov or prov.lower() == 'determinar':
            missing_prov.append(f"{id_} - {local}")
    
    print("\n📋 REPORTE DE DATOS FALTANTES\n")
    
    if empty_locals:
        print(f"❌ LOCALES SIN NOMBRE ({len(empty_locals)}):")
        for item in empty_locals:
            print(f"  - {item}")
    else:
        print("✅ No hay locales sin nombre")
    
    print(f"\n⚠️  FRECUENCIA FALTANTE O 'Determinar' ({len(missing_freq)}):")
    if missing_freq:
        for item in missing_freq:
            print(f"  - {item}")
    else:
        print("  ✅ Todos los locales tienen frecuencia asignada")
    
    print(f"\n⚠️  PROVEEDOR FALTANTE O 'Determinar' ({len(missing_prov)}):")
    if missing_prov:
        for item in missing_prov:
            print(f"  - {item}")
    else:
        print("  ✅ Todos los locales tienen proveedor asignado")

if __name__ == "__main__":
    check_missing_data()
