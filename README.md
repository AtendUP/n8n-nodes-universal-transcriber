# Universal Transcriber n8n Node

![Universal Transcriber Icon](https://raw.githubusercontent.com/n8n-io/n8n-nodes-base/master/nodes/UniversalTranscriber/UniversalTranscriber.node.ts/transcriber.svg)

Um node n8n poderoso para transcrição universal de mídia, capaz de processar áudio, imagens, PDFs e texto puro, retornando o conteúdo transcrito em formato de texto. Ideal para automação de fluxos de trabalho que exigem extração de informações de diversas fontes.

## Funcionalidades

- **Detecção Automática de Tipo de Mídia**: Identifica automaticamente se a entrada é áudio, imagem, PDF, DOCX ou texto.
- **Extração Inteligente de Conteúdo**: Capaz de extrair URLs e dados Base64 de strings de entrada complexas, tornando o node mais autônomo.
- **Transcrição de Áudio**: Utiliza a API OpenAI Whisper para transcrever arquivos de áudio (MP3, WAV, OGG, M4A) de URLs ou Base64.
- **Reconhecimento Óptico de Caracteres (OCR)**: Extrai texto de imagens (PNG, JPG, JPEG, GIF, BMP) usando Tesseract.js.
- **Extração de Texto de Documentos**: Processa arquivos PDF para extrair seu conteúdo textual.
- **Processamento de Texto Puro**: Retorna o texto de entrada diretamente.
- **Credenciais Seguras**: Utiliza credenciais para OpenAI API, mantendo suas chaves seguras.

## Instalação

Para instalar este node em sua instância n8n, siga os passos abaixo:

1. Navegue até o diretório de sua instalação n8n.
2. Instale o pacote npm:

```bash
npm install n8n-nodes-atendup-universal-transcriber
```

Ou, se você estiver desenvolvendo nodes personalizados, adicione-o ao seu `package.json`:

```json
"dependencies": {
  "n8n-nodes-atendup-universal-transcriber": "latest"
}
```

E então execute `npm install`.

## Credenciais

Este node requer uma credencial:

### 1. OpenAI API

- **API Key**: Sua chave de API da OpenAI. Esta chave é usada para acessar os serviços de transcrição (Whisper) e OCR (se necessário, via GPT ou Tesseract).

## Uso

1. Arraste e solte o node "Universal Transcriber" para o seu workflow n8n.
2. Configure a credencial "OpenAI API" na seção de credenciais do node.
3. Configure as propriedades do node:
   - **Input Type**: Selecione o tipo de mídia (Auto Detect, Text, Audio, Image, PDF, DOCX). Recomenda-se "Auto Detect" para a maioria dos casos.
   - **Input Source**: Forneça o conteúdo da mídia. Pode ser texto puro, uma URL para o arquivo ou dados Base64. O node tentará extrair o conteúdo relevante de strings complexas.
   - **File Name (Optional)**: Se a "Input Source" for uma URL, forneça o nome do arquivo com a extensão para auxiliar na detecção automática do tipo de mídia (ex: `audio.mp3`, `documento.pdf`).
   - **Language (for Audio/OCR)**: (Opcional) O idioma do conteúdo para transcrição de áudio (Whisper) ou OCR (Tesseract). Use códigos ISO 639-1 (ex: `pt`, `en`, `es`).

### Exemplo de Workflow

Um workflow simples pode:

1. Receber uma string contendo uma URL de áudio ou dados Base64.
2. Passar a string para o "Universal Transcriber" node.
3. O node extrai o conteúdo da mídia e transcreve o áudio para texto.
4. O texto transcrito é então usado em um node de e-mail ou armazenamento.

## Desenvolvimento

Para contribuir ou desenvolver este node localmente:

1. Clone este repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Compile o TypeScript:
   ```bash
   npm run build
   ```
4. Para testar o node em sua instância n8n local, você pode usar `npm link` ou copiar os arquivos `dist` para o diretório de nodes personalizados do n8n.

## Licença

Este projeto está licenciado sob a licença MIT com restrição de comercialização. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido por Manus AI**


