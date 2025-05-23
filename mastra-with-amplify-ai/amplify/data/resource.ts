import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

import { chatHandler } from "./chatHandler/resource";

const schema = a.schema({
  User: a
    .model({
      name: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  // Define AI Kit
  chat: a
    .conversation({
      aiModel: a.ai.model("Claude 3.5 Sonnet"),
      systemPrompt: "You are a helpful AI assistant.",
      handler: chatHandler,
    })
    .authorization((allow) => allow.owner()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
