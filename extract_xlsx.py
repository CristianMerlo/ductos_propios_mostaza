import zipfile
import xml.etree.ElementTree as ET
import sys
import os

def parse_xlsx(file_path):
    try:
        with zipfile.ZipFile(file_path, 'r') as z:
            # Load shared strings
            shared_strings = []
            if 'xl/sharedStrings.xml' in z.namelist():
                with z.open('xl/sharedStrings.xml') as f:
                    tree = ET.parse(f)
                    root = tree.getroot()
                    # Namespace is usually http://schemas.openxmlformats.org/spreadsheetml/2006/main
                    ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
                    for si in root.findall('ns:si', ns):
                        t = si.find('ns:t', ns)
                        if t is not None:
                            shared_strings.append(t.text)
                        else:
                            # Handle rich text runs
                            text_parts = []
                            for r in si.findall('ns:r', ns):
                                t_node = r.find('ns:t', ns)
                                if t_node is not None and t_node.text:
                                    text_parts.append(t_node.text)
                            shared_strings.append("".join(text_parts))

            # Load sheet 1
            rows = []
            if 'xl/worksheets/sheet1.xml' in z.namelist():
                with z.open('xl/worksheets/sheet1.xml') as f:
                    tree = ET.parse(f)
                    root = tree.getroot()
                    ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
                    sheet_data = root.find('ns:sheetData', ns)
                    
                    for row in sheet_data.findall('ns:row', ns):
                        row_values = []
                        for cell in row.findall('ns:c', ns):
                            cell_type = cell.get('t')
                            v = cell.find('ns:v', ns)
                            if v is not None:
                                val = v.text
                                if cell_type == 's': # Shared string
                                    idx = int(val)
                                    if idx < len(shared_strings):
                                        row_values.append(shared_strings[idx])
                                    else:
                                        row_values.append(val)
                                else:
                                    row_values.append(val)
                            else:
                                row_values.append("")
                        rows.append(row_values)
            
            return rows
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_xlsx.py <file_path>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    data = parse_xlsx(file_path)
    
    if isinstance(data, list):
        for row in data:
            print(";".join([str(x) for x in row]))
    else:
        print(f"Error: {data}")
