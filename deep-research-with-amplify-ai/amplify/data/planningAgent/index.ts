import { ChatBedrockConverse } from '@langchain/aws';

import { planningPrompt } from '../../prompts';
import { BEDROCK_MODEL } from '../constants';
import type { Schema } from '../resource';

// AWS SDK
const model = new ChatBedrockConverse({
  model: BEDROCK_MODEL,
});

export const handler: Schema['planningAgent']['functionHandler'] = async (
  event
) => {
  console.log({ event });

  const authorization = event.request.headers.authorization;
  const identity = event.identity as any;
  const username = identity?.username;
  const message = event.arguments.message;

  if (!authorization || !username || !message) {
    throw new Error('Unauthorized');
  }

  const answer = await model.invoke([
    ['system', planningPrompt],
    ['human', message],
  ]);
  console.log({ answer });

  return {
    value: answer.content as string,
  };
};
