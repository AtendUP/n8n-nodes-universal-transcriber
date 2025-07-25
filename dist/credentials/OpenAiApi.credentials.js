"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAiApi = void 0;
class OpenAiApi {
    constructor() {
        this.name = 'openAiApi';
        this.displayName = 'OpenAI API';
        this.properties = [
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
}
exports.OpenAiApi = OpenAiApi;
//# sourceMappingURL=OpenAiApi.credentials.js.map