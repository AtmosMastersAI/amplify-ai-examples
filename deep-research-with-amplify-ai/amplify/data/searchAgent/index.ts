import { env } from '$amplify/env/searchAgent';
import { ChatBedrockConverse } from '@langchain/aws';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableLambda } from '@langchain/core/runnables';
import { TavilySearch } from '@langchain/tavily';

import { searchPrompt } from '../../prompts';
import { BEDROCK_MODEL } from '../constants';
import type { Schema } from '../resource';

const tavilyTool = new TavilySearch({
  maxResults: 3,
  tavilyApiKey: env.TAVILY_API_KEY,
});
const model = new ChatBedrockConverse({
  model: BEDROCK_MODEL,
});
const modelWithTavily = model.bindTools([tavilyTool]);
const prompt = ChatPromptTemplate.fromMessages([
  new SystemMessage(searchPrompt),
  ['placeholder', '{messages}'],
]);
const chain = prompt.pipe(modelWithTavily);

const toolChain = RunnableLambda.from(async (userInput: string, config) => {
  const aiMsg = await chain.invoke(
    {
      messages: [new HumanMessage(userInput)],
    },
    config
  );
  console.log({ aiMsg });

  // @ts-ignore
  const toolMsgs = await tavilyTool.batch(aiMsg.tool_calls, config);
  console.log({ toolMsgs });

  const humanMessage = new HumanMessage(userInput);
  return chain.invoke(
    {
      messages: [humanMessage, aiMsg, ...toolMsgs],
    },
    config
  );
});

export const handler: Schema['searchAgent']['functionHandler'] = async (
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
  // Use the agent
  const answer = await toolChain.invoke(message);
  console.log({ answer });

  return {
    value: answer.content as string,
  };
};
