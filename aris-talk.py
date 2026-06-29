#!/usr/bin/env python3
import sys
import os
import subprocess
import tempfile
import asyncio
import edge_tts

# Configuración del motor de voz
VOICE = "es-AR-ElenaNeural"
# Ruta al binario de edge-tts si no está en el PATH
EDGE_TTS_PATH = "/Users/CR1S714N/Library/Python/3.9/bin/edge-tts"

async def generate_and_play(text):
    if not text:
        return

    # Crear un archivo temporal para el audio (.mp3)
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
        output_file = tmp.name

    try:
        # Generar el audio usando edge-tts (Elena - Online)
        print(f"🎙️ Generando voz con Elena (Neural)...")
        communicate = edge_tts.Communicate(text, VOICE)
        await communicate.save(output_file)

        # Reproducir el audio usando afplay (nativo de macOS)
        print(f"🔊 Reproduciendo: \"{text}\"")
        subprocess.run(["afplay", output_file], check=True)
    except Exception as e:
        # Fallback inteligente: Paulina (Offline) para mantener el perfil femenino
        print(f"⚠️ Elena offline o error de audio: {e}")
        print(f"🔊 Usando fallback (Paulina - macOS Native)...")
        subprocess.run(["say", "-v", "Paulina", text])
    finally:
        # Limpiar el archivo temporal
        if os.path.exists(output_file):
            os.remove(output_file)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python3 aris-talk.py \"texto a decir\"")
        sys.exit(1)
    
    text_to_speak = sys.argv[1]
    asyncio.run(generate_and_play(text_to_speak))
