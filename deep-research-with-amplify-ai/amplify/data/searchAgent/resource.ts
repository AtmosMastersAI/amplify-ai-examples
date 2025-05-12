import { defineFunction, secret } from '@aws-amplify/backend';

export const searchAgent = defineFunction({
  name: 'searchAgent',
  entry: './index.ts',
  memoryMB: 512,
  timeoutSeconds: 60,
  runtime: 22,
  environment: {
    TAVILY_API_KEY: secret('TAVILY_API_KEY'),
  },
});
