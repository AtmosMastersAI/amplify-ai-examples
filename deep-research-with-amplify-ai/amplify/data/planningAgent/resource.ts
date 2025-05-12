import { defineFunction } from '@aws-amplify/backend';

export const planningAgent = defineFunction({
  name: 'planningAgent',
  entry: './index.ts',
  memoryMB: 512,
  timeoutSeconds: 60,
  runtime: 22,
});
