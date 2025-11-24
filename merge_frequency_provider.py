import re
import json

def parse_output1():
    """Parse output1.txt (Ductos Propios) for frequency and provider data"""
    with open('/Users/CR1S714N/Documents/Repositorios GitHub/output1.txt', 'r') as f:
        lines = f.readlines()
    
    freq_prov_map = {}
    for line in lines[1:]:  # Skip header
        parts = line.strip().split(';')
        if len(parts) < 5:
            continue
        
        id_ = parts[0].strip()
        if not id_:
            continue
        
        freq_prov_map[id_] = {
            'frecuencia': parts[3].strip(),
            'proveedor': parts[4].strip()
        }
    
    return freq_prov_map

def parse_output2():
    """Parse output2.txt for complete local details"""
    with open('/Users/CR1S714N/Documents/Repositorios GitHub/output2.txt', 'r') as f:
        lines = f.readlines()
    
    data_map = {}
    for line in lines[1:]:  # Skip header
        parts = line.strip().split(';')
        if len(parts) < 16:
            continue
        
        id_ = parts[0].strip()
        if not id_:
            continue
        
        data_map[id_] = {
            'local': parts[1].strip(),
            'frecuencia': parts[2].strip(),
            'proveedor': parts[3].strip(),
            'complejo': parts[4].strip(),
            'direccion': parts[5].strip(),
            'zona': parts[6].strip(),
            'localidad': parts[7].strip(),
            'provincia': parts[8].strip(),
            'cp': parts[9].strip(),
            'razon_social': parts[10].strip(),
            'mail': parts[11].strip(),
            'gerente': parts[12].strip(),
            'tel_gerente': parts[13].strip(),
            'supervisor_interno': parts[14].strip(),
            'region': parts[15].strip()
        }
    
    return data_map

def merge_and_update():
    """Merge data sources and update script.js"""
    print("📊 Leyendo datos...")
    freq_prov_data = parse_output1()
    detailed_data = parse_output2()
    
    print(f"  - Ductos Propios: {len(freq_prov_data)} locales")
    print(f"  - Datos detallados: {len(detailed_data)} locales")
    
    # Merge: priority to output1.txt for frequency and provider
    updates_count = 0
    for id_ in detailed_data:
        if id_ in freq_prov_data:
            old_freq = detailed_data[id_]['frecuencia']
            old_prov = detailed_data[id_]['proveedor']
            
            detailed_data[id_]['frecuencia'] = freq_prov_data[id_]['frecuencia']
            detailed_data[id_]['proveedor'] = freq_prov_data[id_]['proveedor']
            
            if old_freq != detailed_data[id_]['frecuencia'] or old_prov != detailed_data[id_]['proveedor']:
                updates_count += 1
    
    print(f"\n✅ {updates_count} locales actualizados con frecuencia/proveedor")
    
    # Read current script.js
    with open('/Users/CR1S714N/Documents/Repositorios GitHub/script.js', 'r') as f:
        content = f.read()
    
    # Generate new detailedData object
    lines = ['const detailedData = {']
    for id_ in sorted(detailed_data.keys()):
        info = detailed_data[id_]
        lines.append(f'  "{id_}": {{')
        for key, value in info.items():
            safe_value = value.replace('"', '\\"').replace("'", "\\'")
            lines.append(f'    {key}: "{safe_value}",')
        lines.append('  },')
    lines.append('};')
    
    detailed_data_str = '\n'.join(lines)
    
    # Replace detailedData in script.js
    pattern = r'const detailedData = \{.*?\};'
    new_content = re.sub(pattern, detailed_data_str, content, flags=re.DOTALL)
    
    with open('/Users/CR1S714N/Documents/Repositorios GitHub/script.js', 'w') as f:
        f.write(new_content)
    
    print("✓ script.js actualizado con datos completos")

if __name__ == "__main__":
    merge_and_update()
