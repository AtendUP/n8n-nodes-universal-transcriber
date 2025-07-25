import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class OpenAiApi implements ICredentialType {

	name = 'openAiApi';
	displayName = 'OpenAI API';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			placeholder: 'sk-...',
			description: 'Sua chave de API da OpenAI para usar os serviços de transcrição e OCR.',
			required: true,
		},
	];
}

