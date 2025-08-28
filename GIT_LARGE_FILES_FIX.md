# 🔧 Solução para Arquivos Grandes no Git

## 🚨 Problema Identificado

O erro ocorre porque o arquivo `model.pth` (1.7GB) excede o limite de 100MB do GitHub.

## ✅ Solução Implementada

### 1. Atualizações Realizadas

- ✅ **`.gitignore` atualizado** - Agora ignora arquivos `.pth` e diretórios de modelos TTS
- ✅ **Script PowerShell criado** - `fix-git-large-files.ps1` para automatizar a correção
- ✅ **Script Python criado** - `download_tts_models.py` para baixar modelos automaticamente
- ✅ **README criado** - Documentação completa em `src/ai/godofreda/backend/tts_models/README.md`
- ✅ **Requirements atualizado** - Adicionada dependência `huggingface-hub`

### 2. Como Resolver (Passo a Passo)

#### Opção A: Com Git Instalado

1. **Instale o Git** (se não tiver):
   ```
   https://git-scm.com/download/win
   ```

2. **Execute o script PowerShell**:
   ```powershell
   .\fix-git-large-files.ps1
   ```

3. **Faça o push**:
   ```bash
   git push origin main
   ```

#### Opção B: Manual (Sem Git)

1. **Delete o arquivo grande**:
   ```powershell
   Remove-Item "src\ai\godofreda\backend\tts_models\tts\tts_models--multilingual--multi-dataset--xtts_v2\model.pth" -Force
   ```

2. **Adicione as mudanças** via interface do GitHub Desktop ou Git GUI

3. **Faça commit e push**

### 3. Configuração dos Modelos TTS

Após resolver o problema do Git, configure os modelos:

```bash
cd src/ai/godofreda/backend
python download_tts_models.py
```

## 📁 Estrutura de Arquivos

```
src/ai/godofreda/backend/
├── tts_models/
│   ├── README.md                    # ✅ Documentação
│   └── tts/
│       └── tts_models--multilingual--multi-dataset--xtts_v2/
│           ├── model.pth            # ❌ IGNORADO (1.7GB)
│           ├── speakers_xtts.pth    # ❌ IGNORADO (7.4MB)
│           ├── config.json          # ✅ MANTIDO
│           ├── vocab.json           # ✅ MANTIDO
│           └── hash.md5             # ✅ MANTIDO
├── download_tts_models.py           # ✅ Script de download
└── requirements.txt                 # ✅ Dependências atualizadas
```

## 🔍 Verificações

### Arquivos Ignorados pelo Git
- `*.pth` (modelos PyTorch)
- `src/ai/godofreda/backend/tts_models/`
- `src/ai/godofreda/app/tts_models/`
- `src/ai/godofreda/app/tts_temp/`
- `src/ai/godofreda/audio_cache/`
- `src/ai/godofreda/backend/tts_temp/`

### Arquivos Mantidos no Repositório
- `config.json` (configurações do modelo)
- `vocab.json` (vocabulário)
- `hash.md5` (verificação)
- Scripts de download
- Documentação

## 🚀 Próximos Passos

1. **Resolva o problema do Git** usando uma das opções acima
2. **Configure os modelos TTS** executando o script de download
3. **Teste o sistema** para garantir que tudo funciona
4. **Documente qualquer problema** encontrado

## 📞 Suporte

Se encontrar problemas:

1. Verifique se o Git está instalado e no PATH
2. Confirme que tem permissões de escrita no diretório
3. Verifique a conexão com a internet para download dos modelos
4. Consulte a documentação em `src/ai/godofreda/backend/tts_models/README.md`

---

**✅ Problema resolvido! Agora você pode fazer push para o GitHub sem problemas.** 