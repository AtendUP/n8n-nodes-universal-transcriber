"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtendupApi = void 0;
class AtendupApi {
    constructor() {
        this.name = 'atendupApi';
        this.displayName = 'AtendUP API';
        this.properties = [
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
                placeholder: 'Seu token de acesso da AtendUP',
                description: 'O token de acesso fornecido pela AtendUP para validação da licença.',
                required: true,
            },
        ];
    }
}
exports.AtendupApi = AtendupApi;
//# sourceMappingURL=AtendupApi.credentials.js.map