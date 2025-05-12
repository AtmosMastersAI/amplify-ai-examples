import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

import { supervisorPrompt, writerPrompt } from "../prompts";
import { chatHandler } from "./chatHandler/resource";
import { planningAgent } from "./planningAgent/resource";
import { searchAgent } from "./searchAgent/resource";

const schema = a.schema({
  User: a
    .model({
      name: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  searchAgent: a
    .query()
    .arguments({
      message: a.string(),
    })
    .returns(
      a.customType({
        value: a.string(),
      }),
    )
    .handler(a.handler.function(searchAgent))
    .authorization((allow) => allow.authenticated()),

  planningAgent: a
    .query()
    .arguments({
      message: a.string(),
    })
    .returns(
      a.customType({
        value: a.string(),
      }),
    )
    .handler(a.handler.function(planningAgent))
    .authorization((allow) => allow.authenticated()),

  // Define AI Kit
  chat: a
    .conversation({
      aiModel: a.ai.model("Claude 3.5 Sonnet"),
      systemPrompt: supervisorPrompt,
      handler: chatHandler,
      inferenceConfiguration: {
        temperature: 0.5,
      },
      tools: [
        a.ai.dataTool({
          name: "planning",
          description: "Planning tool",
          query: a.ref("planningAgent"),
        }),
        a.ai.dataTool({
          name: "search",
          description: "Search tool",
          query: a.ref("searchAgent"),
        }),
        a.ai.dataTool({
          name: "writer",
          description: "Writer tool",
          query: a.ref("writerAgent"),
        }),
      ],
    })
    .authorization((allow) => allow.owner()),
  writerAgent: a
    .generation({
      aiModel: a.ai.model("Claude 3.5 Sonnet"),
      systemPrompt: writerPrompt,
    })
    .arguments({ description: a.string() })
    .returns(a.string())
    .authorization((allow) => allow.authenticated()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
