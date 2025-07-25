![Universal Transcriber Icon](https://img.atendup.com/github/universal-transcriber.png)
Um node poderoso da **AtendUP** para transcrição universal de mídia no **n8n**, capaz de processar áudio, imagens, PDFs e texto puro, retornando o conteúdo transcrito em formato de texto. Ideal para automatizar fluxos de trabalho que exigem extração de informações de diferentes fontes.

## 🚧 Versão Beta

> ⚠️ Este node está atualmente em **versão beta**. Ainda estamos ajustando e melhorando algumas funcionalidades.

### Problemas conhecidos:
- ❌ A **transcrição de arquivos em Base64 ainda não está funcionando corretamente** e pode gerar erros.
- ✅ O uso de **URLs para mídia está funcionando normalmente** (áudio, imagens, PDF, etc).
- 🔁 Ainda **não é possível personalizar o comportamento da IA** (como traduzir, resumir ou interpretar o conteúdo).

### O que vem na próxima versão:
Na próxima atualização, vamos adicionar suporte a **prompts personalizados**, permitindo que o usuário defina o que deseja que a IA faça com o conteúdo transcrito:

- 📄 **PDF** → "Resuma para mim"
- 🖼️ **Imagem** → "Descreva a imagem"
- 🎧 **Áudio** → "Traduza esse áudio para português"

Com isso, o node se tornará muito mais flexível e inteligente para automações no n8n.



## Funcionalidades

- ✅ **Detecção Automática de Tipo de Mídia**: Identifica se a entrada é áudio, imagem, PDF, DOCX ou texto.
- 🤖 **Extração Inteligente de Conteúdo**: Lê URLs ou dados Base64 mesmo de strings bagunçadas.
- 🎙️ **Transcrição de Áudio**: Usa a OpenAI Whisper para transcrever arquivos MP3, WAV, OGG, M4A.
- 🖼️ **OCR (Reconhecimento Óptico de Caracteres)**: Extrai texto de imagens (PNG, JPG, JPEG, GIF, BMP) com Tesseract.js.
- 📄 **Extração de Texto de PDFs**: Lê o conteúdo de arquivos PDF.
- ✏️ **Texto Puro**: Apenas retorna o texto da entrada.
- 🔐 **Credenciais Seguras**: Usa a API da OpenAI com segurança.

## Instalação

Para instalar este node em sua instância do n8n, execute:

```bash
npm install n8n-nodes-atendup-universal-transcriber
```

Ou adicione ao seu `package.json`:

```json
"dependencies": {
  "n8n-nodes-atendup-universal-transcriber": "latest"
}
```

Depois, rode:

```bash
npm install
```

## Credenciais

Este node requer uma credencial:

### 🔑 OpenAI API

- **API Key**: Sua chave da OpenAI, usada para serviços como Whisper (áudio) e OCR (via GPT ou Tesseract, se necessário).

## Como Usar

1. Adicione o node **Universal Transcriber** no seu workflow do n8n.
2. Configure a credencial **OpenAI API** no node.
3. Preencha as propriedades:

   - **Input Type**: Tipo da mídia (Auto Detect, Text, Audio, Image, PDF, DOCX).
   - **Input Source**: Texto direto, URL do arquivo ou dados Base64.
   - **File Name (Optional)**: Caso use URL, ajude na identificação do tipo informando algo como `voz.mp3` ou `documento.pdf`.
   - **Language (Optional)**: Idioma do áudio ou imagem (ex: `pt`, `en`, `es`).

### Exemplo de Uso

Um fluxo pode:

1. Receber uma string com uma URL ou Base64.
2. Passar para o **Universal Transcriber**.
3. Ele detecta, extrai e transcreve.
4. O resultado pode ser enviado por e-mail, armazenado ou usado em IA.

## Desenvolvimento

Se quiser contribuir ou testar localmente:

1. Clone o repositório:

```bash
git clone https://github.com/AtendUP/n8n-nodes-universal-transcriber.git
```

2. Instale as dependências:

```bash
npm install
```

3. Compile o projeto:

```bash
npm run build
```

4. Teste localmente com `npm link` ou copie os arquivos do `dist/` para sua pasta de nodes personalizados do n8n.

## Licença

Este projeto está sob a Licença MIT com restrição de comercialização. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido por [Maicon Bartoski](https://github.com/maiconbartoski) • AtendUP**  
🌐 [atendup.com](https://atendup.com)
