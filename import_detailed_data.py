import re

def parse_output2():
    """Parse output2.txt and extract detailed information for each local"""
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

def update_script_js():
    """Update script.js with detailed information"""
    data_map = parse_output2()
    
    # Read current script.js
    with open('/Users/CR1S714N/Documents/Repositorios GitHub/script.js', 'r') as f:
        content = f.read()
    
    # Generate the detailedData object
    lines = ['const detailedData = {']
    for id_, info in data_map.items():
        lines.append(f'  "{id_}": {{')
        for key, value in info.items():
            # Escape quotes in values
            safe_value = value.replace('"', '\\"').replace("'", "\\'")
            lines.append(f'    {key}: "{safe_value}",')
        lines.append('  },')
    lines.append('};')
    
    detailed_data_str = '\n'.join(lines)
    
    # Insert after csvRaw declaration
    match = re.search(r'(const csvRaw = `.*?`;)', content, re.DOTALL)
    if match:
        insertion_point = match.end()
        new_content = content[:insertion_point] + '\n\n// --- DATOS DETALLADOS (desde Excel) ---\n' + detailed_data_str + '\n' + content[insertion_point:]
        
        with open('/Users/CR1S714N/Documents/Repositorios GitHub/script.js', 'w') as f:
            f.write(new_content)
        
        print("✓ script.js updated with detailed data")
    else:
        print("✗ Could not find csvRaw in script.js")

if __name__ == "__main__":
    update_script_js()
