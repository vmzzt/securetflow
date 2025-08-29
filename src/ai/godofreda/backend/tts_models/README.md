# Modelos TTS - Godofreda

## 📋 Visão Geral

Este diretório contém os modelos de Text-to-Speech (TTS) utilizados pelo sistema Godofreda. Os arquivos de modelo são grandes (1.7GB+) e não são incluídos no repositório Git devido às limitações do GitHub.

## 🚀 Configuração Inicial

### 1. Baixar os Modelos

Os modelos TTS devem ser baixados manualmente. Execute o seguinte comando Python:

```bash
cd src/ai/godofreda/backend
python -c "
from huggingface_hub import snapshot_download
import os

# Criar diretório se não existir
os.makedirs('tts_models/tts', exist_ok=True)

# Baixar modelo XTTS v2
snapshot_download(
    repo_id='coqui/XTTS-v2',
    local_dir='tts_models/tts/tts_models--multilingual--multi-dataset--xtts_v2',
    local_dir_use_symlinks=False
)
print('Modelo TTS baixado com sucesso!')
"
```

### 2. Verificar Estrutura

Após o download, a estrutura deve ser:

```
tts_models/
└── tts/
    └── tts_models--multilingual--multi-dataset--xtts_v2/
        ├── model.pth (1.7GB)
        ├── speakers_xtts.pth (7.4MB)
        ├── config.json
        ├── vocab.json
        └── hash.md5
```

## 📁 Arquivos do Modelo

| Arquivo | Tamanho | Descrição |
|---------|---------|-----------|
| `model.pth` | ~1.7GB | Modelo principal do XTTS v2 |
| `speakers_xtts.pth` | ~7.4MB | Vozes e configurações de speaker |
| `config.json` | ~4.3KB | Configurações do modelo |
| `vocab.json` | ~353KB | Vocabulário do modelo |
| `hash.md5` | 32B | Hash de verificação |

## ⚠️ Importante

- **NÃO** commite os arquivos `.pth` no Git
- Os modelos são baixados automaticamente na primeira execução
- Mantenha os arquivos de configuração (`config.json`, `vocab.json`) no repositório
- O diretório `tts_models/` está no `.gitignore`

## 🔧 Solução de Problemas

### Erro: "Modelo não encontrado"

1. Verifique se o diretório `tts_models/` existe
2. Execute o script de download novamente
3. Verifique as permissões de escrita no diretório

### Erro: "Arquivo corrompido"

1. Delete o diretório `tts_models/`
2. Execute o download novamente
3. Verifique a conexão com a internet

## 📚 Recursos

- [Documentação XTTS v2](https://docs.coqui.ai/en/latest/models/xtts.html)
- [Hugging Face Hub](https://huggingface.co/coqui/XTTS-v2)
- [Coqui TTS](https://github.com/coqui-ai/TTS) 