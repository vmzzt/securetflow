#!/usr/bin/env python3
"""
Script para baixar modelos TTS do Hugging Face Hub
Execute este script para configurar os modelos necessários para o Godofreda
"""

import os
import sys
from pathlib import Path

def download_tts_models():
    """Baixa os modelos TTS necessários"""
    
    try:
        from huggingface_hub import snapshot_download
    except ImportError:
        print("❌ Erro: huggingface_hub não está instalado")
        print("Instale com: pip install huggingface_hub")
        return False
    
    # Definir caminhos
    current_dir = Path(__file__).parent
    tts_models_dir = current_dir / "tts_models" / "tts"
    model_dir = tts_models_dir / "tts_models--multilingual--multi-dataset--xtts_v2"
    
    print("🚀 Iniciando download dos modelos TTS...")
    print(f"📁 Diretório de destino: {model_dir}")
    
    # Criar diretório se não existir
    model_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        # Baixar modelo XTTS v2
        print("📥 Baixando modelo XTTS v2...")
        snapshot_download(
            repo_id='coqui/XTTS-v2',
            local_dir=str(model_dir),
            local_dir_use_symlinks=False
        )
        
        print("✅ Modelo TTS baixado com sucesso!")
        
        # Verificar arquivos baixados
        expected_files = ['model.pth', 'speakers_xtts.pth', 'config.json', 'vocab.json']
        missing_files = []
        
        for file in expected_files:
            if not (model_dir / file).exists():
                missing_files.append(file)
        
        if missing_files:
            print(f"⚠️  Arquivos faltando: {', '.join(missing_files)}")
            return False
        
        print("📋 Arquivos verificados:")
        for file in expected_files:
            file_path = model_dir / file
            if file_path.exists():
                size_mb = file_path.stat().st_size / (1024 * 1024)
                print(f"   ✅ {file} ({size_mb:.1f} MB)")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao baixar modelo: {e}")
        return False

def main():
    """Função principal"""
    print("=" * 50)
    print("🎤 Download de Modelos TTS - Godofreda")
    print("=" * 50)
    
    success = download_tts_models()
    
    if success:
        print("\n🎉 Configuração concluída com sucesso!")
        print("📝 Os modelos TTS estão prontos para uso.")
    else:
        print("\n❌ Falha na configuração dos modelos TTS.")
        print("🔧 Verifique a conexão com a internet e tente novamente.")
        sys.exit(1)

if __name__ == "__main__":
    main() 