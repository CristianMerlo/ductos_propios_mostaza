import re

def parse_script_js(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Extract CSV part
    match = re.search(r'const csvRaw = `(.*?)`;', content, re.DOTALL)
    if not match:
        return {}
    
    csv_content = match.group(1)
    lines = csv_content.strip().split('\n')
    
    data = {}
    for line in lines[1:]: # Skip header
        parts = line.split(';')
        if len(parts) < 3: continue
        id_ = parts[0].strip()
        if not id_: continue
        supervisor = parts[1].strip()
        data[id_] = {'supervisor': supervisor, 'line': line}
    return data

def parse_output2(file_path):
    with open(file_path, 'r') as f:
        lines = f.readlines()
    
    data = {}
    for line in lines[1:]: # Skip header
        parts = line.strip().split(';')
        if len(parts) < 16: continue
        id_ = parts[0].strip()
        if not id_: continue
        local_name = parts[1].strip()
        supervisor = parts[15].strip() # Last column
        data[id_] = {'local': local_name, 'supervisor': supervisor}
    return data

def compare():
    script_data = parse_script_js('/Users/CR1S714N/Documents/Repositorios GitHub/script.js')
    excel_data = parse_output2('/Users/CR1S714N/Documents/Repositorios GitHub/output2.txt')
    
    missing_in_script = []
    supervisor_updates = []
    
    # Check for missing and updates
    for id_, info in excel_data.items():
        if id_ not in script_data:
            missing_in_script.append(f"{id_};{info['supervisor']};{info['local']}")
        else:
            current_supervisor = script_data[id_]['supervisor']
            new_supervisor = info['supervisor']
            
            # Normalize names for comparison
            if current_supervisor.lower() != new_supervisor.lower():
                # Specific check for Alejandro Alvarez -> Yanina Solano
                if "alejandro" in current_supervisor.lower() and "yanina" in new_supervisor.lower():
                     supervisor_updates.append((id_, current_supervisor, new_supervisor))
                # Or just general updates if needed, but user asked specifically for this one.
                # Let's include all updates where script has Alejandro and Excel has Yanina
    
    print("MISSING IN SCRIPT:")
    for item in missing_in_script:
        print(item)
        
    print("\nSUPERVISOR UPDATES (Alejandro -> Yanina):")
    for id_, old, new in supervisor_updates:
        print(f"{id_}: {old} -> {new}")

if __name__ == "__main__":
    compare()
