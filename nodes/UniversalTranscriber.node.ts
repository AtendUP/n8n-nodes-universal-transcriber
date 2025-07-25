import { INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import axios from 'axios';
import OpenAI from 'openai';
import * as Tesseract from 'tesseract.js';
import pdfParse from 'pdf-parse';

// Polyfill for File class for OpenAI API compatibility in Node.js environment
// This is a simplified version and might need more robust implementation for production
class File extends Blob {
  name: string;
  lastModified: number;
  constructor(fileBits: BlobPart[], fileName: string, options?: BlobPropertyBag) {
    super(fileBits, options);
    this.name = fileName;
    this.lastModified = Date.now(); // Add lastModified property
  }
}

export class UniversalTranscriber implements INodeType {
	description: INodeTypeDescription = {
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const openAiCredentials = await this.getCredentials('openAiApi');

			const openAiApiKey = openAiCredentials.apiKey as string;

			const inputType = this.getNodeParameter('inputType', itemIndex) as string;
			const inputSource = this.getNodeParameter('inputSource', itemIndex) as string;
			const fileName = this.getNodeParameter('fileName', itemIndex, '') as string;
			const language = this.getNodeParameter('language', itemIndex, '') as string;

			let detectedType = inputType;
			let transcribedContent = '';
			let debugInfo: any = {};

			let processedInputSource = inputSource;

			// Pre-processamento para extrair o conteúdo da mídia de strings complexas
			const base64Match = inputSource.match(/(data:[^;]+;base64,[A-Za-z0-9+/=]+)/);
			const urlMatch = inputSource.match(/(https?:\/\/[^\s]+)/);

			if (base64Match && base64Match[1]) {
				processedInputSource = base64Match[1];
			} else if (urlMatch && urlMatch[1]) {
				processedInputSource = urlMatch[1];
			}

			// 2. Detect Media Type (if auto)
			if (detectedType === 'auto') {
				if (processedInputSource.startsWith('http://') || processedInputSource.startsWith('https://')) {
					if (fileName.match(/\.(mp3|wav|ogg|m4a)$/i)) {
						detectedType = 'audio';
					} else if (fileName.match(/\.(png|jpg|jpeg|gif|bmp)$/i)) {
						detectedType = 'image';
					} else if (fileName.match(/\.(pdf)$/i)) {
						detectedType = 'pdf';
					} else if (fileName.match(/\.(docx)$/i)) {
						detectedType = 'docx';
					} else {
						// Try to infer from content type if URL
						try {
							const headResponse = await axios.head(processedInputSource);
							const contentType = headResponse.headers['content-type'];
							if (contentType.includes('audio')) {
								detectedType = 'audio';
							} else if (contentType.includes('image')) {
								detectedType = 'image';
							} else if (contentType.includes('pdf')) {
								detectedType = 'pdf';
							} else if (contentType.includes('text')) {
								detectedType = 'text';
							} else {
								detectedType = 'text'; // Default to text if cannot determine
							}
						} catch (err) {
							detectedType = 'text'; // Default to text if cannot determine
						}
					}
				} else if (processedInputSource.startsWith('data:')) {
					if (processedInputSource.includes('audio')) {
						detectedType = 'audio';
					} else if (processedInputSource.includes('image')) {
						detectedType = 'image';
					} else if (processedInputSource.includes('application/pdf')) {
						detectedType = 'pdf';
					} else {
						detectedType = 'text'; // Default to text if cannot determine
					}
				} else {
					detectedType = 'text'; // Assume text if not URL or base64
				}
			}

			// 3. Process Content based on Detected Type
			switch (detectedType) {
				case 'text':
					transcribedContent = processedInputSource;
					break;
				case 'audio':
					const openaiAudio = new OpenAI({ apiKey: openAiApiKey });
					let audioBuffer: Buffer;

					if (processedInputSource.startsWith('http://') || processedInputSource.startsWith('https://')) {
						const audioResponse = await axios.get(processedInputSource, { responseType: 'arraybuffer' });
						audioBuffer = Buffer.from(audioResponse.data as ArrayBuffer);
					} else if (processedInputSource.startsWith('data:')) {
						const base64Data = processedInputSource.split(',')[1];
						audioBuffer = Buffer.from(base64Data, 'base64');
					} else {
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
					let imageBuffer: Buffer;
					if (processedInputSource.startsWith('data:')) {
						const base64Data = processedInputSource.split(',')[1];
						imageBuffer = Buffer.from(base64Data, 'base64');
					} else if (processedInputSource.startsWith('http://') || processedInputSource.startsWith('https://')) {
						const imageResponse = await axios.get(processedInputSource, { responseType: 'arraybuffer' });
						imageBuffer = Buffer.from(imageResponse.data as ArrayBuffer);
					} else {
						throw new Error('Formato de imagem não suportado. Use URL ou Base64.');
					}
					const { data: { text, confidence } } = await Tesseract.recognize(
						imageBuffer,
						language || 'eng',
					);
					transcribedContent = text;
					debugInfo = { confidence };
					break;
				case 'pdf':
					let pdfBuffer: Buffer;
					if (processedInputSource.startsWith('http://') || processedInputSource.startsWith('https://')) {
						const pdfResponse = await axios.get(processedInputSource, { responseType: 'arraybuffer' });
						pdfBuffer = Buffer.from(pdfResponse.data as ArrayBuffer);
					} else if (processedInputSource.startsWith('data:')) {
						const base64Data = processedInputSource.split(',')[1];
						pdfBuffer = Buffer.from(base64Data, 'base64');
					} else {
						throw new Error('Formato de PDF não suportado. Use URL ou Base64.');
					}
					const pdfData = await pdfParse(pdfBuffer);
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


