"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UniversalTranscriber_node_1 = require("./nodes/UniversalTranscriber.node");
const OpenAiApi_credentials_1 = require("./credentials/OpenAiApi.credentials");
exports.default = {
    nodes: [
        UniversalTranscriber_node_1.UniversalTranscriber,
    ],
    credentials: [
        OpenAiApi_credentials_1.OpenAiApi,
    ],
};
//# sourceMappingURL=index.js.map