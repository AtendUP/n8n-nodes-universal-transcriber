"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversalTranscriber = void 0;
const axios_1 = __importDefault(require("axios"));
const openai_1 = __importDefault(require("openai"));
const Tesseract = __importStar(require("tesseract.js"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
// Polyfill for File class for OpenAI API compatibility in Node.js environment
// This is a simplified version and might need more robust implementation for production
class File extends Blob {
    constructor(fileBits, fileName, options) {
        super(fileBits, options);
        this.name = fileName;
        this.lastModified = Date.now(); // Add lastModified property
    }
}
class UniversalTranscriber {
    constructor() {
        this.description = {
            displayName: 'Universal Transcriber',
            name: 'universalTranscriber',
            icon: 'file:transcriber.svg',
            group: ['transform'],
            version: 1,
            description: 'Recebe mídia e transcreve o conteúdo para texto usando IA.',
            defaults: {
                name: 'Universal Transcriber',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'openAiApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Input Type',
                    name: 'inputType',
                    type: 'options',
                    options: [
                        { name: 'Auto Detect', value: 'auto' },
                        { name: 'Text', value: 'text' },
                        { name: 'Audio', value: 'audio' },
                        { name: 'Image', value: 'image' },
                        { name: 'PDF', value: 'pdf' },
                        { name: 'DOCX', value: 'docx' },
                    ],
                    default: 'auto',
                    description: 'Tipo de conteúdo de entrada. Selecione \'Auto Detect\' para detecção automática.',
                },
                {
                    displayName: 'Input Source',
                    name: 'inputSource',
                    type: 'string',
                    default: '',
                    placeholder: 'Conteúdo da mídia (texto, URL, base64)',
                    description: 'O conteúdo da mídia a ser processado. Pode ser texto, URL ou dados base64.',
                    required: true,
                },
                {
                    displayName: 'File Name (Optional)',
                    name: 'fileName',
                    type: 'string',
                    default: '',
                    placeholder: 'nome_do_arquivo.mp3',
                    description: 'Nome do arquivo, útil para detecção de tipo de mídia.',
                },
                {
                    displayName: 'Language (for Audio/OCR)',
                    name: 'language',
                    type: 'string',
                    default: '',
                    placeholder: 'pt, en, es, ...',
                    description: 'Idioma do áudio para Whisper ou para OCR (ex: pt, en).',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            const openAiCredentials = await this.getCredentials('openAiApi');
            const openAiApiKey = openAiCredentials.apiKey;
            const inputType = this.getNodeParameter('inputType', itemIndex);
            const inputSource = this.getNodeParameter('inputSource', itemIndex);
            const fileName = this.getNodeParameter('fileName', itemIndex, '');
            const language = this.getNodeParameter('language', itemIndex, '');
            let detectedType = inputType;
            let transcribedContent = '';
            let debugInfo = {};
            let processedInputSource = inputSource;
            // Pre-processamento para extrair o conteúdo da mídia de strings complexas
            const base64Match = inputSource.match(/(data:[^;]+;base64,[A-Za-z0-9+/=]+)/);
            const urlMatch = inputSource.match(/(https?:\/\/[^\s]+)/);
            if (base64Match && base64Match[1]) {
                processedInputSource = base64Match[1];
            }
            else if (urlMatch && urlMatch[1]) {
                processedInputSource = urlMatch[1];
            }
            // 2. Detect Media Type (if auto)
            if (detectedType === 'auto') {
                if (processedInputSource.startsWith('http://') || processedInputSource.startsWith('https://')) {
                    if (fileName.match(/\.(mp3|wav|ogg|m4a)$/i)) {
                        detectedType = 'audio';
                    }
                    else if (fileName.match(/\.(png|jpg|jpeg|gif|bmp)$/i)) {
                        detectedType = 'image';
                    }
                    else if (fileName.match(/\.(pdf)$/i)) {
                        detectedType = 'pdf';
                    }
                    else if (fileName.match(/\.(docx)$/i)) {
                        detectedType = 'docx';
                    }
                    else {
                        // Try to infer from content type if URL
                        try {
                            const headResponse = await axios_1.default.head(processedInputSource);
                            const contentType = headResponse.headers['content-type'];
                            if (contentType.includes('audio')) {
                                detectedType = 'audio';
                            }
                            else if (contentType.includes('image')) {
                                detectedType = 'image';
                            }
                            else if (contentType.includes('pdf')) {
                                detectedType = 'pdf';
                            }
                            else if (contentType.includes('text')) {
                                detectedType = 'text';
                            }
                            else {
                                detectedType = 'text'; // Default to text if cannot determine
                            }
                        }
                        catch (err) {
                            detectedType = 'text'; // Default to text if cannot determine
                        }
                    }
                }
                else if (processedInputSource.startsWith('data:')) {
                    if (processedInputSource.includes('audio')) {
                        detectedType = 'audio';
                    }
                    else if (processedInputSource.includes('image')) {
                        detectedType = 'image';
                    }
                    else if (processedInputSource.includes('application/pdf')) {
                        detectedType = 'pdf';
                    }
                    else {
                        detectedType = 'text'; // Default to text if cannot determine
                    }
                }
                else {
                    detectedType = 'text'; // Assume text if not URL or base64
                }
            }
            // 3. Process Content based on Detected Type
            switch (detectedType) {
                case 'text':
                    transcribedContent = processedInputSource;
                    break;
                case 'audio':
                    const openaiAudio = new openai_1.default({ apiKey: openAiApiKey });
                    let audioBuffer;
                    if (processedInputSource.startsWith('http://') || processedInputSource.startsWith('https://')) {
                        const audioResponse = await axios_1.default.get(processedInputSource, { responseType: 'arraybuffer' });
                        audioBuffer = Buffer.from(audioResponse.data);
                    }
                    else if (processedInputSource.startsWith('data:')) {
                        const base64Data = processedInputSource.split(',')[1];
                        audioBuffer = Buffer.from(base64Data, 'base64');
                    }
                    else {
                        throw new Error('Formato de áudio não suportado. Use URL ou Base64.');
                    }
                    const audioFile = new File([audioBuffer], fileName || 'audio.mp3', { type: 'audio/mpeg' });
                    const transcription = await openaiAudio.audio.transcriptions.create({
                        file: audioFile,
                        model: 'whisper-1',
                        language: language || undefined,
                    });
                    transcribedContent = transcription.text;
                    debugInfo = transcription;
                    break;
                case 'image':
                    let imageBuffer;
                    if (processedInputSource.startsWith('data:')) {
                        const base64Data = processedInputSource.split(',')[1];
                        imageBuffer = Buffer.from(base64Data, 'base64');
                    }
                    else if (processedInputSource.startsWith('http://') || processedInputSource.startsWith('https://')) {
                        const imageResponse = await axios_1.default.get(processedInputSource, { responseType: 'arraybuffer' });
                        imageBuffer = Buffer.from(imageResponse.data);
                    }
                    else {
                        throw new Error('Formato de imagem não suportado. Use URL ou Base64.');
                    }
                    const { data: { text, confidence } } = await Tesseract.recognize(imageBuffer, language || 'eng');
                    transcribedContent = text;
                    debugInfo = { confidence };
                    break;
                case 'pdf':
                    let pdfBuffer;
                    if (processedInputSource.startsWith('http://') || processedInputSource.startsWith('https://')) {
                        const pdfResponse = await axios_1.default.get(processedInputSource, { responseType: 'arraybuffer' });
                        pdfBuffer = Buffer.from(pdfResponse.data);
                    }
                    else if (processedInputSource.startsWith('data:')) {
                        const base64Data = processedInputSource.split(',')[1];
                        pdfBuffer = Buffer.from(base64Data, 'base64');
                    }
                    else {
                        throw new Error('Formato de PDF não suportado. Use URL ou Base64.');
                    }
                    const pdfData = await (0, pdf_parse_1.default)(pdfBuffer);
                    transcribedContent = pdfData.text;
                    debugInfo = { numPages: pdfData.numpages, info: pdfData.info };
                    break;
                case 'docx':
                    // DOCX parsing is more complex and typically requires a dedicated library or service.
                    // For simplicity, this example will throw an error. In a real scenario, you'd integrate a library like 'mammoth.js'
                    // or send to a cloud service.
                    throw new Error('Processamento de DOCX não implementado. Por favor, converta para PDF ou texto.');
                default:
                    throw new Error('Tipo de entrada não suportado ou não detectado: ' + detectedType);
            }
            returnData.push({
                json: {
                    content: transcribedContent,
                    typeDetected: detectedType,
                    debug: debugInfo,
                },
                binary: {},
            });
        }
        return [returnData];
    }
}
exports.UniversalTranscriber = UniversalTranscriber;
//# sourceMappingURL=UniversalTranscriber.node.js.map