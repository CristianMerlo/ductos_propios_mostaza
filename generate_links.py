import re

def generate_links_csv():
    with open('/Users/CR1S714N/Documents/Repositorios GitHub/script.js', 'r') as f:
        content = f.read()
    
    match = re.search(r'const csvRaw = `(.*?)`;', content, re.DOTALL)
    if not match:
        print("Error: Could not find csvRaw")
        return

    csv_content = match.group(1)
    lines = csv_content.strip().split('\n')
    
    output_lines = ["ID;LINK_DRIVE"]
    
    for line in lines[1:]: # Skip header
        if not line.strip(): continue
        parts = line.split(';')
        if len(parts) > 0:
            id_ = parts[0].strip()
            if id_:
                output_lines.append(f"{id_};")
    
    with open('/Users/CR1S714N/Documents/Repositorios GitHub/Proyecto Seguimiento Ductos/links.csv', 'w') as f:
        f.write('\n'.join(output_lines))
    
    print("links.csv generated successfully.")

if __name__ == "__main__":
    generate_links_csv()
