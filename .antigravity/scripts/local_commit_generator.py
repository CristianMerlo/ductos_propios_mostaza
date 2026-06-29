#!/usr/bin/env python3
import subprocess
import json
import urllib.request
import urllib.error
import sys

# [LOCAL COMMIT GENERATOR V1.0]
# Utiliza IA Local (LM Studio / Ollama) para generar mensajes de commit profesionales.

ENDPOINT = "http://localhost:1234/v1/chat/completions" # Default LM Studio
MODEL = "local-model" # LM Studio usa el modelo cargado actualmente

def get_git_diff():
    """Obtiene los cambios preparados (staged) para el commit."""
    try:
        diff = subprocess.check_output(["git", "diff", "--cached"], stderr=subprocess.STDOUT).decode("utf-8")
        return diff
    except subprocess.CalledProcessError as e:
        print(f"Error al ejecutar git diff: {e.output.decode('utf-8')}")
        return None

def generate_commit_message(diff):
    if not diff:
        return "No hay cambios preparados para el commit (usa 'git add')."

    prompt = f"""Genera un mensaje de commit profesional en español basado en el siguiente 'git diff'. 
Sigue el estándar de 'Conventional Commits' (feat:, fix:, docs:, style:, refactor:, test:, chore:).
Estructura:
1. Una línea de título concisa.
2. Un listado breve de los cambios principales si es necesario.

DIFF:
{diff[:4000]} 
""" # Limitamos el diff para no saturar contextos pequeños

    data = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "Eres un asistente experto en Git. Eres breve, técnico y profesional."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3
    }

    try:
        req = urllib.request.Request(ENDPOINT, data=json.dumps(data).encode('utf-8'), headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result['choices'][0]['message']['content']
    except urllib.error.URLError:
        return "⚠️ Error: El servidor local de IA (LM Studio) no parece estar corriendo en http://localhost:1234"
    except Exception as e:
        return f"⚠️ Error inesperado: {str(e)}"

if __name__ == "__main__":
    print("\n🔍 Analizando cambios locales...\n")
    diff_content = get_git_diff()
    if diff_content:
        print("🤖 Generando sugerencia de commit vía IA Local...\n")
        suggestion = generate_commit_message(diff_content)
        print("-" * 40)
        print(suggestion)
        print("-" * 40)
        print("\n💡 Tip: Puedes usar 'git commit -m \"mensage\"' con la sugerencia anterior.")
    else:
        print("No se detectaron cambios en el área de STAGE. Usa 'git add <archivo>' primero.")
