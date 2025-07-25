import { UniversalTranscriber } from './nodes/UniversalTranscriber.node';
import { OpenAiApi } from './credentials/OpenAiApi.credentials';

export default {
  nodes: [
    UniversalTranscriber,
  ],
  credentials: [
    OpenAiApi,
  ],
};


