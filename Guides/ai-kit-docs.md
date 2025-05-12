TITLE: Configuring Tools for AI Assistant
DESCRIPTION: This code snippet demonstrates how to configure a tool for the AI assistant using the `toolConfiguration` argument. It defines a `generateRecipe` tool with a JSON schema for its input, specifying that it expects an array of ingredients.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/connect-your-frontend/index.mdx#_snippet_12

LANGUAGE: typescript
CODE:

```
const { data: message, errors } = await conversation.sendMessage({
  content: [
    {
      text: "I'd like to make a chocolate cake for my friend with a gluten intolerance. What ingredients do I need?",
    },
  ],
  toolConfiguration: {
    tools: {
      generateRecipe: {
        description: "List ingredients needed for a recipe",
        inputSchema: {
          json: {
            type: "object",
            properties: {
              ingredients: {
                type: "array",
                items: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
});
```

---

TITLE: Complete Next.js API route for Bedrock integration
DESCRIPTION: Full implementation of the API route that sends requests to Amazon Bedrock's Claude model and returns responses.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_21

LANGUAGE: js
CODE:

```
import {
  BedrockRuntimeClient,
  InvokeModelCommand
} from '@aws-sdk/client-bedrock-runtime';
import { Amplify, withSSRContext } from 'aws-amplify';
import type { NextApiRequest, NextApiResponse } from 'next';
import awsExports from '@/aws-exports';

Amplify.configure({
  ...awsExports,
  ssr: true
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);
  const SSR = withSSRContext({ req });
  const credentials = await SSR.Auth.currentCredentials();
  const bedrock = new BedrockRuntimeClient({
    serviceId: 'bedrock',
    region: 'us-east-1',
    credentials
  });

  // Anthropic's Claude model expects a chat-like string
  // of 'Human:' and 'Assistant:' responses separated by line breaks.
  // You should always end your prompt with 'Assistant:' and Claude
  // will respond. There are various prompt engineering techniques
  // and frameworks like LangChain you can use here too.
  const prompt = `Human:${body.input}\n\nAssistant:`;

  const result = await bedrock.send(
    new InvokeModelCommand({
      modelId: 'anthropic.claude-v2',
      contentType: 'application/json',
      accept: '*/*',
      body: JSON.stringify({
        prompt,
        // LLM costs are measured by Tokens, which are roughly equivalent
        // to 1 word. This option allows you to set the maximum amount of
        // tokens to return
        max_tokens_to_sample: 2000,
        // Temperature (1-0) is how 'creative' the LLM should be in its response
        // 1: deterministic, prone to repeating
        // 0: creative, prone to hallucinations
        temperature: 1,
        top_k: 250,
        top_p: 0.99,
        // This tells the model when to stop its response. LLMs
        // generally have a chat-like string of Human and Assistant message
        // This says stop when the Assistant (Claude) is done and expects
        // the human to respond
        stop_sequences: ['\n\nHuman:'],
        anthropic_version: 'bedrock-2023-05-31'
      })
    })
  );
  // The response is a Uint8Array of a stringified JSON blob
  // so you need to first decode the Uint8Array to a string
  // then parse the string.
  res.status(200).json(JSON.parse(new TextDecoder().decode(result.body)));
}
```

---

TITLE: Mixing Text and Image Content in a Message
DESCRIPTION: This code snippet shows how to combine text and image content within a single message to the AI assistant. It includes a text description alongside the image data.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/connect-your-frontend/index.mdx#_snippet_10

LANGUAGE: typescript
CODE:

```
const { data: message, errors } = await chat.sendMessage({
  content: [
    {
      text: 'describe the image in detail',
    },
    {
      image: {
        format: 'png',
        source: {
          bytes: new Uint8Array([1, 2, 3]),
        },
      },
    },
  ],
});
```

---

TITLE: Customizing the System Prompt for an Amplify AI Generation Route (TypeScript)
DESCRIPTION: This TypeScript snippet demonstrates how to define a custom system prompt for an Amplify AI generation route (`a.generation`). It specifies the AI model to use (Claude 3.5 Haiku via `a.ai.model`) and provides high-level instructions within the `systemPrompt` property to guide the LLM's behavior, defining its role as a helpful assistant for summarizing e-commerce reviews.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/concepts/prompting/index.mdx#_snippet_0

LANGUAGE: typescript
CODE:

```
reviewSummarizer: a.generation({
  aiModel: a.ai.model("Claude 3.5 Haiku"),
  systemPrompt: `
  You are a helpful assistant that summarizes reviews
  for an ecommerce site.
  `
})
```

---

TITLE: Sending Image Content to AI Assistant
DESCRIPTION: This code snippet demonstrates how to send an image to the AI assistant using the `chat.sendMessage` method. It specifies the image format as 'png' and provides the image data as a `Uint8Array`.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/connect-your-frontend/index.mdx#_snippet_9

LANGUAGE: typescript
CODE:

```
const { data: message, errors } = await chat.sendMessage({
  content: [
    {
      image: {
        format: 'png',
        source: {
          bytes: new Uint8Array([1, 2, 3]),
        },
      },
    },
  ],
});
```

---

TITLE: Setting up Next.js Static Site Generation for AI Documentation
DESCRIPTION: Defines metadata and static site generation functions for an AI documentation page, enabling platform-specific rendering across JavaScript frameworks.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/generation/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:

```
import { getCustomStaticPath } from "@/utils/getCustomStaticPath";

export const meta = {
  title: "Generation",
  description:
    "Learn how to use AI to generate data for your application.",
  platforms: [
    "javascript",
    "react-native",
    "angular",
    "nextjs",
    "react",
    "vue",
  ],
};

export const getStaticPaths = async () => {
  return getCustomStaticPath(meta.platforms);
};

export function getStaticProps(context) {
  return {
    props: {
      platform: context.params.platform,
      meta,
    },
  };
}
```

---

TITLE: Requesting AI-Generated Data with JavaScript Client
DESCRIPTION: Demonstrates how to request AI-generated content using the Amplify data client in JavaScript/TypeScript. The example shows making a recipe generation request and the expected response format.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/generation/index.mdx#_snippet_2

LANGUAGE: typescript
CODE:

```
const description = 'I would like to bake a birthday cake for my friend. She has celiac disease and loves chocolate.'
const { data, errors } = await client.generations
  .generateRecipe({ description })

/**
Example response:
{
  "name": "Gluten-Free Chocolate Birthday Cake",
  "ingredients": [
    "gluten-free all-purpose flour",
    "cocoa powder",
    "granulated sugar",
    "baking powder",
    "baking soda",
    "salt",
    "eggs",
    "milk",
    "vegetable oil",
    "vanilla extract"
  ],
  "instructions": "1. Preheat oven to 350°F. Grease and flour two 9-inch round baking pans.\n2. In a medium bowl, whisk together the gluten-free flour, cocoa powder, sugar, baking powder, baking soda and salt.\n3. In a separate bowl, beat the eggs. Then add the milk, oil and vanilla and mix well.\n4. Gradually add the wet ingredients to the dry ingredients and mix until just combined. Do not over mix.\n5. Divide the batter evenly between the prepared pans.\n6. Bake for 30-35 minutes, until a toothpick inserted in the center comes out clean.\n7. Allow cakes to cool in pans for 10 minutes, then transfer to a wire rack to cool completely.\n8. Frost with your favorite gluten-free chocolate frosting."
}
*/
```

---

TITLE: Subscribing to Assistant Responses
DESCRIPTION: This code snippet shows how to subscribe to assistant responses using the `.onStreamEvent()` method. It includes `next` and `error` callback functions to handle streamed text and potential errors.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/connect-your-frontend/index.mdx#_snippet_13

LANGUAGE: typescript
CODE:

```
const subscription = conversation.onStreamEvent({
  next: (event) => {
    console.log(event);
  },
  error: (error) => {
    console.error(error);
  },
});

// later...
subscription.unsubscribe();
```

---

TITLE: Defining a Generation Route for Typed Object Responses in TypeScript
DESCRIPTION: Creates an Amplify schema definition for a generation route that returns strongly typed objects. The example sets up a recipe generator using Claude 3.5 Haiku model with structured response types.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/generation/index.mdx#_snippet_1

LANGUAGE: typescript
CODE:

```
const schema = a.schema({
  generateRecipe: a.generation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: 'You are a helpful assistant that generates recipes.',
  })
    .arguments({ description: a.string() })
    .returns(
      a.customType({
        name: a.string(),
        ingredients: a.string().array(),
        instructions: a.string(),
      })
    )
    .authorization((allow) => allow.authenticated())
});
```

---

TITLE: Configuring AI Model using Friendly Name in Amplify Schema
DESCRIPTION: This snippet demonstrates how to define an AI schema for a summarizer using the friendly name method with a.ai.model() function. It specifies Claude 3.5 Haiku as the AI model for generation capabilities.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/concepts/models/index.mdx#_snippet_3

LANGUAGE: typescript
CODE:

```
const schema = a.schema({
  summarizer: a.generation({
    aiModel: a.ai.model("Claude 3.5 Haiku")
  })
})
```

---

TITLE: Defining Meta Information for Predictions Category Documentation
DESCRIPTION: Sets up the metadata for the Predictions category documentation page, including title, description, supported platforms, and routing information.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/predictions/index.mdx#_snippet_0

LANGUAGE: JavaScript
CODE:

```
export const meta = {
  title: 'AI/ML Predictions',
  description: 'The Predictions category enables you to integrate machine learning in your application without any prior machine learning experience. The Predictions category comes with built-in support for both online and offline use cases.',
  platforms: [
    'android',
    'angular',
    'javascript',
    'nextjs',
    'react',
    'swift',
    'vue'
  ],
  route: '/gen1/[platform]/build-a-backend/more-features/predictions'
};
```

---

TITLE: Combining Multiple Predictions Actions in a Single GraphQL Query with AWS Amplify (GraphQL)
DESCRIPTION: Defines a GraphQL query field speakTranslatedImageText that chains multiple @predictions actions: identifyText, translateText, and convertTextToSpeech. This enables a pipeline resolver that recognizes text in an image, translates the text, and converts it to speech. The input contains parameters for each action, facilitating a multi-step AI/ML workflow in a single API call.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/connect-machine-learning-services/index.mdx#_snippet_8

LANGUAGE: graphql
CODE:

```
type Query {
  speakTranslatedImageText: String
    @predictions(actions: [identifyText, translateText, convertTextToSpeech])
}
```

---

TITLE: Attaching AI Context to a Message
DESCRIPTION: This code snippet illustrates how to attach arbitrary data as AI context to a message. It includes user information (name) within the `aiContext` property.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/connect-your-frontend/index.mdx#_snippet_11

LANGUAGE: typescript
CODE:

```
const { data: message, errors } = await chat.sendMessage({
  content: [{ text: 'Hello, world!' }],
  aiContext: {
    user: {
      name: "Dan"
    }
  },
});
```

---

TITLE: Listing Conversations with Pagination and Limit in TypeScript
DESCRIPTION: Lists conversations with pagination using the `nextToken` value and limits the number of conversations returned using the `limit` parameter.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/connect-your-frontend/index.mdx#_snippet_5

LANGUAGE: typescript
CODE:

```
const { data: chat, errors } = await client.conversations.chat.list({
  limit: 10,
  nextToken: '...',
});
```

---

TITLE: Generating Scalar Responses in TypeScript Schema
DESCRIPTION: Defines an Amplify schema for a generation route that returns a scalar string type. This example creates a text summarization route using Claude 3.5 Haiku with guest authorization.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/generation/index.mdx#_snippet_4

LANGUAGE: typescript
CODE:

```
const schema = ({
  summarize: a.generation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: 'Provide an accurate, clear, and concise summary of the input provided'
  })
  .arguments({ input: a.string() })
  .returns(a.string())
  .authorization((allow) => allow.guest()),
});
```

---

TITLE: GraphQL Query Example for Sequential Predictions Actions: Identify, Translate, and Synthesize Speech (GraphQL)
DESCRIPTION: Illustrates how to call the combined speakTranslatedImageText query, passing a single input object with nested parameters per action. Inputs include the image S3 key for text recognition, source and target languages for translation, and voiceID for speech synthesis. Returns a presigned URL to audio of the translated speech.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/connect-machine-learning-services/index.mdx#_snippet_9

LANGUAGE: graphql
CODE:

```
query SpeakTranslatedImageText($input: SpeakTranslatedImageTextInput!) {
  speakTranslatedImageText(
    input: {
      identifyText: { key: "myimage.jpg" }
      translateText: { sourceLanguage: "en", targetLanguage: "es" }
      convertTextToSpeech: { voiceID: "Conchita" }
    }
  )
}
```

---

TITLE: Sending a POST request with data to the API
DESCRIPTION: Updated fetch call that sends a text prompt to the API endpoint.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_19

LANGUAGE: js
CODE:

```
fetch('/api/hello', {
  method: 'POST',
  body: JSON.stringify({ input: 'Who are you?' })
});
```

---

TITLE: Requesting Scalar AI-Generated Content
DESCRIPTION: Shows how to request an AI-generated scalar value (string) using the Amplify data client. This example demonstrates making a summarization request.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/generation/index.mdx#_snippet_5

LANGUAGE: typescript
CODE:

```
const { data: summary, errors } = await client.generations
  .summarize({ input })
```

---

TITLE: Invalid Model Reference Example in TypeScript
DESCRIPTION: Shows an invalid schema where a generation route attempts to reference a model type as its return type, which is not supported in Amplify's AI generation routes.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/generation/index.mdx#_snippet_7

LANGUAGE: typescript
CODE:

```
const schema = a.schema({
  Recipe: a.model({
    name: a.string(),
    ingredients: a.string().array(),
    instructions: a.string(),
  }),
  generateRecipe: a.generation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: 'You are a helpful assistant that generates recipes.',
  })
    .arguments({ description: a.string() })
    .returns(a.ref('Recipe')) // ❌ Invalid
    .authorization((allow) => allow.authenticated()),
});
```

---

TITLE: Implementing AI Generation in React with Hooks
DESCRIPTION: Shows how to use AI generation in React applications using the Amplify UI React AI hooks. This component demonstrates setting up the client, hook initialization, and making generation requests.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/generation/index.mdx#_snippet_3

LANGUAGE: tsx
CODE:

```
import { generateClient } from "aws-amplify/api";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>({ authMode: "userPool" });
const { useAIGeneration } = createAIHooks(client);

export default function Example() {
  // data is React state and will be populated when the generation is returned
  const [{ data, isLoading }, generateRecipe] =
    useAIGeneration("generateRecipe");

  const generateSummary = async () => {
    generateRecipe({
      description: 'I would like to bake a birthday cake for my friend. She has celiac disease and loves chocolate.',
    });
  };
}
```

---

TITLE: Deleting a Conversation with Conversations API in TypeScript
DESCRIPTION: Deletes a conversation using the `.delete()` method on the conversation route with the conversation's `id`. Deleting a conversation makes it unusable in the future, but it does not delete its associated messages.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/connect-your-frontend/index.mdx#_snippet_7

LANGUAGE: typescript
CODE:

```
const id = '123e4567-e89b-12d3-a456-426614174000';
const { data: chat, errors } = await client.conversations.chat.delete({ id });
```

---

TITLE: Sending a Message in a Conversation with TypeScript
DESCRIPTION: Sends a message to the AI assistant by calling the `.sendMessage()` method on a conversation instance. The simplest form just passes the message content as text.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/connect-your-frontend/index.mdx#_snippet_8

LANGUAGE: typescript
CODE:

```
const { data: message, errors } = await chat.sendMessage('Hello, world!');
```

---

TITLE: AI Conversation - Next.js App Router
DESCRIPTION: This Next.js App Router snippet implements an AI conversation. Similar to the React example and Next.js Pages Router, it leverages the `@aws-amplify/ui-react-ai` package and requires user authentication via Amplify's `Authenticator`. It uses `useAIConversation` to handle the messages and manage loading state. The `AIConversation` component renders the chat UI. The `'use client'` directive is used to indicate a client component. The 'chat' is based on the key for the conversation route.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_21

LANGUAGE: TypeScript
CODE:

```
'use client'
import { Authenticator } from "@aws-amplify/ui-react";
import { AIConversation } from '@aws-amplify/ui-react-ai';
import { useAIConversation } from "@/client";

export default function Page() {
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation('chat');
  // 'chat' is based on the key for the conversation route in your schema.

  return (
    <Authenticator>
      <AIConversation
        messages={messages}
        isLoading={isLoading}
        handleSendMessage={handleSendMessage}
      />
    </Authenticator>
  );
}
```

---

TITLE: Listing messages with pagination and limit
DESCRIPTION: Retrieves a limited number of messages for a conversation with pagination. The `limit` parameter specifies the maximum number of messages to return, and `nextToken` is used to paginate through the results.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/connect-your-frontend/index.mdx#_snippet_15

LANGUAGE: typescript
CODE:

```
const { data: messages, errors } = await conversation.listMessages({
  limit: 10,
  nextToken: '...',
});
```

---

TITLE: Adding Amplify Hosting via CLI
DESCRIPTION: Command to add Amplify Hosting to your project via the Amplify CLI.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_25

LANGUAGE: bash
CODE:

```
amplify add hosting
```

---

TITLE: Define AI Routes in Amplify Data Schema
DESCRIPTION: This code snippet defines AI routes in the Amplify Data schema using `a.conversation()` and `a.generation()`. It includes configurations for the AI model, system prompt, authorization, and arguments for recipe generation.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_2

LANGUAGE: typescript
CODE:

```
import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  // This will add a new conversation route to your Amplify Data backend.
  // highlight-start
  chat: a.conversation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: 'You are a helpful assistant',
  })
  .authorization((allow) => allow.owner()),
  // highlight-end

  // This adds a new generation route to your Amplify Data backend.
  // highlight-start
  generateRecipe: a.generation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: 'You are a helpful assistant that generates recipes.',
  })
  .arguments({
    description: a.string(),
  })
  .returns(
    a.customType({
      name: a.string(),
      ingredients: a.string().array(),
      instructions: a.string(),
    })
  )
  .authorization((allow) => allow.authenticated()),
  // highlight-end
});
```

---

TITLE: Initializing the Amazon Bedrock client
DESCRIPTION: Code to initialize the Bedrock client with the user's AWS credentials.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_20

LANGUAGE: js
CODE:

```
const bedrock = new BedrockRuntimeClient({
  serviceId: 'bedrock',
  region: 'us-east-1',
  credentials
});
```

---

TITLE: AI Conversation - Next.js Pages Router
DESCRIPTION: This Next.js Pages Router snippet implements an AI conversation, similar to the React example, using the `@aws-amplify/ui-react-ai` package. It requires the user to be logged in with Amplify auth via the `Authenticator` component. It uses the `useAIConversation` hook to manage the conversation state, messages, and loading status. The UI includes the `AIConversation` component to display and handle the chat interaction. The `chat` key is based on the key for the conversation route in the schema.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_20

LANGUAGE: TypeScript
CODE:

```
import { Authenticator } from "@aws-amplify/ui-react";
import { AIConversation } from '@aws-amplify/ui-react-ai';
import { useAIConversation } from "@/client";

export default function Page() {
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation('chat');
  // 'chat' is based on the key for the conversation route in your schema.

  return (
    <Authenticator>
      <AIConversation
        messages={messages}
        isLoading={isLoading}
        handleSendMessage={handleSendMessage}
      />
    </Authenticator>
  );
}
```

---

TITLE: Configuring Inference Parameters for AI Generation
DESCRIPTION: Demonstrates how to configure inference parameters like maxTokens, temperature, and topP to control the generation behavior of AI models in Amplify schema definitions.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/generation/index.mdx#_snippet_6

LANGUAGE: typescript
CODE:

```
const schema = a.schema({
  generateHaiku: a.generation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: 'You are a helpful assistant that generates haikus.',
    // highlight-start
    inferenceConfiguration: {
      maxTokens: 1000,
      temperature: 0.5,
      topP: 0.9,
    }
    // highlight-end
  }),
});
```

---

TITLE: Valid Custom Type Reference in TypeScript
DESCRIPTION: Demonstrates the correct approach of using a custom type reference as the return type for an AI generation route, which is supported in Amplify's AI features.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/generation/index.mdx#_snippet_8

LANGUAGE: typescript
CODE:

```
const schema = a.schema({
  Recipe: a.customType({
    name: a.string(),
    ingredients: a.string().array(),
    instructions: a.string(),
  }),
  generateRecipe: a.generation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: 'You are a helpful assistant that generates recipes.',
  })
    .arguments({ description: a.string() })
    .returns(a.ref('Recipe')) // ✅ Valid
    .authorization((allow) => allow.authenticated()),
});
```

---

TITLE: Amplify push output
DESCRIPTION: This output confirms the successful deployment of the Amplify backend environment to the cloud, listing the created Auth resource.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_7

LANGUAGE: bash
CODE:

```
✔ Successfully pulled backend environment dev from the cloud.

    Current Environment: dev

┌──────────┬──────────────────────┬───────────┬───────────────────┐
│ Category │ Resource name        │ Operation │ Provider plugin   │
├──────────┼──────────────────────┼───────────┼───────────────────┤
│ Auth     │ amplifyGenAi         │ Create    │ awscloudformation │
└──────────┴──────────────────────┴───────────┴───────────────────┘
```

---

TITLE: Getting an Existing Conversation with Conversations API in TypeScript
DESCRIPTION: Retrieves an existing conversation by calling the `.get()` method on the conversation route with the conversation's `id`. The example returns conversation data including the ID, creation timestamp, and update timestamp.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/connect-your-frontend/index.mdx#_snippet_3

LANGUAGE: typescript
CODE:

```
const id = '123e4567-e89b-12d3-a456-426614174000';
const { data: chat, errors } = await client.conversations.chat.get({ id });
```

---

TITLE: Installing Amplify Backend AI Package - npm
DESCRIPTION: This command installs the `@aws-amplify/backend-ai` package, which is required for defining and using custom Lambda tools within the AWS Amplify Backend AI conversation handler function.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/tools/index.mdx#_snippet_4

LANGUAGE: bash
CODE:

```
npm install @aws-amplify/backend-ai
```

---

TITLE: AI Conversation - JavaScript
DESCRIPTION: This JavaScript snippet demonstrates how to interact with an AI conversation. It uses the `client` object to create a conversation and send messages. The assistant messages are received via a websocket, and the example shows how to handle `next` and `error` events. User messages are sent using `sendMessage`. The conversation history is stored in DynamoDB and retrieved in Lambda. This is a demonstration of how to use the underlying API which can be used in different frameworks like Vue or Angular.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_22

LANGUAGE: TypeScript
CODE:

```
const { data: conversation } = await client.conversations.chat.create();

// Assistant messages come back as websocket events
// over a subscription
conversation.onStreamEvent({
  next: (event) => {
    console.log(event);
  },
  error: (error) => {
    console.log(error);
  }
});

// When sending user messages you only need to send
// the latest message, the conversation history
// is stored in DynamoDB and retrieved in Lambda
conversation.sendMessage({
  content: [{ text: "hello" }],
})
```

---

TITLE: AI Conversation - React
DESCRIPTION: This React snippet implements an AI conversation using the `@aws-amplify/ui-react-ai` package and requires the user to be logged in with Amplify auth via the `Authenticator` component. It uses the `useAIConversation` hook to manage the conversation state, messages, and loading status. The UI includes the `AIConversation` component to display and handle the chat interaction.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_19

LANGUAGE: TypeScript
CODE:

```
import { Authenticator } from "@aws-amplify/ui-react";
import { AIConversation } from '@aws-amplify/ui-react-ai';
import { useAIConversation } from './client';

export default function App() {
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation('chat');
  // 'chat' is based on the key for the conversation route in your schema.

  return (
    <Authenticator>
      <AIConversation
        messages={messages}
        isLoading={isLoading}
        handleSendMessage={handleSendMessage}
      />
    </Authenticator>
  );
}
```

---

TITLE: Creating GitHub repository with GitHub CLI
DESCRIPTION: Commands to create a new GitHub repository and push your local code to it using GitHub CLI.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_24

LANGUAGE: bash
CODE:

```
gh repo create
```

---

TITLE: Creating a Conversation with Conversations API in TypeScript
DESCRIPTION: Creates a new conversation using the `.create()` method on the conversation route. The example uses a route named `chat` and returns conversation data including the ID, creation timestamp, and update timestamp.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/connect-your-frontend/index.mdx#_snippet_1

LANGUAGE: typescript
CODE:

```
const { data: chat, errors } = await client.conversations.chat.create();
```

---

TITLE: Define Bedrock Function Handler in TypeScript
DESCRIPTION: Configures a TypeScript function handler for an Amplify custom query. This handler uses the AWS SDK v3 BedrockRuntimeClient to invoke a generative AI model (like Anthropic Claude) in Amazon Bedrock, passing the user's prompt and specific model parameters, then parses the model's response to return the generated haiku.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/custom-business-logic/connect-bedrock/index.mdx#_snippet_4

LANGUAGE: TypeScript
CODE:

```
import type { Schema } from "./resource";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput,
} from "@aws-sdk/client-bedrock-runtime";

// initialize bedrock runtime client
const client = new BedrockRuntimeClient();

export const handler: Schema["generateHaiku"]["functionHandler"] = async (
  event,
  context
) => {
  // User prompt
  const prompt = event.arguments.prompt;

  // Invoke model
  const input = {
    modelId: process.env.MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      system:
        "You are a an expert at crafting a haiku. You are able to craft a haiku out of anything and therefore answer only in haiku.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.5,
    }),
  } as InvokeModelCommandInput;

  const command = new InvokeModelCommand(input);

  const response = await client.send(command);

  // Parse the response and return the generated haiku
  const data = JSON.parse(Buffer.from(response.body).toString());

  return data.content[0].text;
};
```

---

TITLE: GraphQL Query Example to Recognize Text from Image via S3 Key Input using AWS Amplify (GraphQL)
DESCRIPTION: GraphQL query demonstrating how to invoke the recognizeTextFromImage resolver, passing an input object with an identifyText key pointing to an image stored in the S3 'public/' folder. The result returns recognized text as a string. This example shows the required input structure matching the schema defined by the @predictions directive.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/connect-machine-learning-services/index.mdx#_snippet_1

LANGUAGE: graphql
CODE:

```
query RecognizeTextFromImage($input: RecognizeTextFromImageInput!) {
  recognizeTextFromImage(input: { identifyText: { key: "myimage.jpg" } })
}
```

---

TITLE: Adding a button to trigger the API call
DESCRIPTION: JSX code for a button that calls the API when clicked.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_18

LANGUAGE: jsx
CODE:

```
<button onClick={callAPI}>Click me</button>
```

---

TITLE: Creating a client-side API call function
DESCRIPTION: JavaScript function to call the API endpoint from the client side.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_17

LANGUAGE: js
CODE:

```
const callAPI = () => {
  fetch('/api/hello');
};
```

---

TITLE: Configuring AI Model using Direct Model ID in Amplify Schema
DESCRIPTION: This snippet shows how to define an AI schema using the direct model ID method when a model is not yet supported in the a.ai.model() function. It specifies Meta's Llama 3 405B model by its resource path.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/concepts/models/index.mdx#_snippet_4

LANGUAGE: typescript
CODE:

```
const schema = a.schema({
  summarizer: a.generation({
    aiModel: {
      resourcePath: 'meta.llama3-1-405b-instruct-v1:0'
    }
  })
})
```

---

TITLE: Defining GraphQL Query to Recognize Text in Images using AWS Amplify @predictions Directive (GraphQL)
DESCRIPTION: Defines a GraphQL query field named recognizeTextFromImage that uses the @predictions directive with the identifyText action to recognize text from images stored in an S3 bucket. Requires the input key to be located in the 'public/' folder of the S3 bucket, which is automatically prefixed. This schema snippet serves as a foundation for text detection functionality within a GraphQL API backed by Amazon Rekognition.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/connect-machine-learning-services/index.mdx#_snippet_0

LANGUAGE: graphql
CODE:

```
type Query {
  recognizeTextFromImage: String @predictions(actions: [identifyText])
}
```

---

TITLE: Defining GraphQL Query to Synthesize Speech from Text using AWS Amplify @predictions Directive (GraphQL)
DESCRIPTION: Defines a GraphQL query field textToSpeech that uses the convertTextToSpeech action in the @predictions directive to generate synthesized speech audio from input text. The input specifies the voiceID chosen from supported Amazon Polly voices and the text to speak. The response returns a presigned URL to access the synthesized audio.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/connect-machine-learning-services/index.mdx#_snippet_6

LANGUAGE: graphql
CODE:

```
type Query {
  textToSpeech: String @predictions(actions: [convertTextToSpeech])
}
```

---

TITLE: Listing all messages in a conversation
DESCRIPTION: Retrieves all messages for a given conversation using the `listMessages()` method. The method returns a paginated list of messages, which are automatically persisted.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/connect-your-frontend/index.mdx#_snippet_14

LANGUAGE: typescript
CODE:

```
const { data: messages, errors } = await conversation.listMessages();
```

---

TITLE: Defining Page Metadata (JavaScript)
DESCRIPTION: Exports a constant `meta` object containing configuration details for the documentation page. This includes the display title, a description, a flag indicating if it's new, the base route pattern, and an array of supported platforms (e.g., 'angular', 'javascript').
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:

```
export const meta = {
  title: 'AI kit',
  description: 'The quickest way for fullstack developers to build web apps with AI capabilities such as chat, conversational search, and summarization',
  isNew: true,
  route: '/[platform]/ai',
  platforms: [
    'angular',
    'javascript',
    'nextjs',
    'react',
    'react-native',
    'vue'
  ]
};
```

---

TITLE: Updated client-side function to handle API response
DESCRIPTION: Enhanced fetch function that processes the JSON response from the API.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_22

LANGUAGE: js
CODE:

```
fetch('/api/hello', {
  method: 'POST',
  body: JSON.stringify({ input: 'Who are you?' })
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
  });
```

---

TITLE: Updating tsconfig.json to exclude Amplify directory
DESCRIPTION: TypeScript configuration to exclude the Amplify directory from type checking.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_26

LANGUAGE: js
CODE:

```
"exclude": ["node_modules","amplify"]
```

---

TITLE: Converting handler function to async for SSR Context
DESCRIPTION: Diff showing the change from synchronous to asynchronous handler function for server-side rendering.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_14

LANGUAGE: diff
CODE:

```
- export default function handler(
+ export default async function handler(
```

---

TITLE: Define AppSync JavaScript Resolver for Bedrock
DESCRIPTION: Provides the request and response mapping functions for an AppSync JavaScript resolver to invoke an Amazon Bedrock model via an HTTP data source. The `request` function constructs the HTTP POST request body and path using the model ID and prompt from the context, while the `response` function parses the JSON response body from Bedrock to extract the generated haiku.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/custom-business-logic/connect-bedrock/index.mdx#_snippet_5

LANGUAGE: JavaScript
CODE:

```
export function request(ctx) {

  // Define a system prompt to give the model a persona
  const system =
    "You are a an expert at crafting a haiku. You are able to craft a haiku out of anything and therefore answer only in haiku.";

  const prompt = ctx.args.prompt

  // Construct the HTTP request to invoke the generative AI model
  return {
    resourcePath: `/model/${ctx.env.MODEL_ID}/invoke`,
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        anthropic_version: "bedrock-2023-05-31",
        system,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },\n            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.5,
      },
    },
  };
}

// Parse the response and return the generated haiku
export function response(ctx) {
  const res = JSON.parse(ctx.result.body);
  const haiku = res.content[0].text;

  return haiku;
}
```

---

TITLE: Definition of AWS Amplify @predictions Directive and Supported Actions (GraphQL)
DESCRIPTION: Defines the custom @predictions directive for GraphQL schema, specifying supported actions such as identifyText, identifyLabels, convertTextToSpeech, and translateText. Each action maps to AWS services like Amazon Rekognition, Polly, and Translate. This enum enables declarative ML capabilities integrated within the GraphQL API schema.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/connect-machine-learning-services/index.mdx#_snippet_11

LANGUAGE: graphql
CODE:

```
directive @predictions(actions: [PredictionsActions!]!) on FIELD_DEFINITION
enum PredictionsActions {
  identifyText # uses Amazon Rekognition to detect text
  identifyLabels # uses Amazon Rekognition to detect labels
  convertTextToSpeech # uses Amazon Polly in a lambda to output a presigned url to synthesized speech
  translateText # uses Amazon Translate to translate text from source to target language
}
```

---

TITLE: Listing Conversations with Conversations API in TypeScript
DESCRIPTION: Lists all conversations for a user with the `.list()` method. Retrieved conversations are sorted by `updatedAt` in descending order, meaning the most recently used conversations are returned first.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/connect-your-frontend/index.mdx#_snippet_4

LANGUAGE: typescript
CODE:

```
const { data: chat, errors } = await client.conversations.chat.list();
```

---

TITLE: Defining a Custom Conversation Handler Function - TypeScript
DESCRIPTION: This code snippet defines a custom conversation handler function using `@aws-amplify/backend-ai`. It specifies the entry point, name, and associated AI models. The `chatHandler` is then used in the data schema to define a conversation with an AI model, system prompt, and authorization.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/tools/index.mdx#_snippet_5

LANGUAGE: typescript
CODE:

```
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { defineConversationHandlerFunction } from '@aws-amplify/backend-ai/conversation';

export const chatHandler = defineConversationHandlerFunction({
  entry: './chatHandler.ts',
  name: 'customChatHandler',
  models: [
    { modelId: a.ai.model("Claude 3.5 Haiku") }
  ]
});

const schema = a.schema({
  chat: a.conversation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: "You are a helpful assistant",
    handler: chatHandler,
  })
    .authorization((allow) => allow.owner()),
})
```

---

TITLE: Creating, Subscribing, and Sending Messages in a Conversation with Amplify Data
DESCRIPTION: This code demonstrates how to create a new conversation, subscribe to assistant responses using `onStreamEvent`, and send a message to the conversation using `sendMessage`. It utilizes the Amplify Data client to interact with the backend and handles both successful responses and potential errors.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/connect-your-frontend/index.mdx#_snippet_0

LANGUAGE: typescript
CODE:

```
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../amplify/data/resource'

const client = generateClient<Schema>();

// 1. Create a conversation
const { data: chat, errors } = await client.conversations.chat.create();

// 2. Subscribe to assistant responses
const subscription = chat.onStreamEvent({
  next: (event) => {
    // handle assistant response stream events
    console.log(event);
  },
  error: (error) => {
    // handle errors
    console.error(error);
  },
});

// 3. Send a message to the conversation
const { data: message, errors } = await chat.sendMessage('Hello, world!');
```

---

TITLE: Implementing getStaticPaths for Next.js Static Site Generation
DESCRIPTION: Defines the getStaticPaths function that returns the static paths for all supported platforms using a utility function.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/predictions/index.mdx#_snippet_1

LANGUAGE: JavaScript
CODE:

```
export const getStaticPaths = async () => {
  return getCustomStaticPath(meta.platforms);
};
```

---

TITLE: Loading Documentation Fragments for JavaScript Frameworks
DESCRIPTION: Imports the chatbot documentation MDX fragment for JavaScript and assigns it to all JavaScript-based frameworks. This enables reusing the same content across multiple platforms.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/interactions/chatbot/index.mdx#_snippet_3

LANGUAGE: javascript
CODE:

```
import js0 from '/src/fragments/lib/interactions/js/chatbot.mdx';

<Fragments
  fragments={{
    javascript: js0,
    angular: js0,
    nextjs: js0,
    react: js0,
    vue: js0
  }}
/>
```

---

TITLE: React Component Example Using AWS Amplify to Upload Image and Perform Combined Predictions Actions (JavaScript)
DESCRIPTION: A React functional component demonstrating client-side integration with AWS Amplify to upload an image to an S3 bucket, invoke the speakTranslatedImageText GraphQL operation combining text recognition, translation, and speech synthesis, and render both the uploaded image and the resulting synthesized speech audio. Uses Amplify Storage and API client, React hooks useState, and asynchronous functions. Shows practical usage of the multi-action @predictions pipeline in a user-facing app.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/connect-machine-learning-services/index.mdx#_snippet_10

LANGUAGE: javascript
CODE:

```
import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';
import config from './amplifyconfiguration.json';
import { speakTranslatedImageText } from './graphql/queries';

/* Configure Exports */
Amplify.configure(config);

const client = generateClient();

function SpeakTranslatedImage() {
  const [src, setSrc] = useState('');
  const [img, setImg] = useState('');

  function putS3Image(event) {
    const file = event.target.files[0];
    uploadData({
      key: file.name,
      data: file
    })
      .result.then(async (result) => {
        setSrc(await speakTranslatedImageTextOP(result.key));
        setImg((await getUrl({ key: result.key })).url.toString());
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="Text">
      <div>
        <h3>Upload Image</h3>
        <input
          type="file"
          accept="image/jpeg"
          onChange={(event) => {
            putS3Image(event);
          }}
        />
        <br />
        {img && <img src={img}></img>}
        {src && (
          <div>
            <audio id="audioPlayback" controls>
              <source id="audioSource" type="audio/mp3" src={src} />
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}

async function speakTranslatedImageTextOP(key) {
  const inputObj = {
    translateText: {
      sourceLanguage: 'en',
      targetLanguage: 'es'
    },
    identifyText: { key },
    convertTextToSpeech: { voiceID: 'Conchita' }
  };
  const response = await client.graphql({
    query: speakTranslatedImageText,
    variables: { input: inputObj }
  });
  return response.data.speakTranslatedImageText;
}

function App() {
  return (
    <div className="App">
      <h1>Speak Translated Image</h1>
      <SpeakTranslatedImage />
    </div>
  );
}
export default App;
```

---

TITLE: Implement React Component to Invoke Haiku Generator
DESCRIPTION: Creates a React functional component that utilizes Amplify Data to build a simple UI for the haiku generator. It includes state management for the input prompt and generated answer, configures Amplify, generates the client, handles form submission to call the `generateHaiku` query, and displays the result.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/custom-business-logic/connect-bedrock/index.mdx#_snippet_7

LANGUAGE: TSX
CODE:

```
import type { Schema } from '@/amplify/data/resource';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import outputs from '@/amplify_outputs.json';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [answer, setAnswer] = useState<string | null>(null);

  const sendPrompt = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { data, errors } = await client.queries.generateHaiku({
      prompt
    });

    if (!errors) {
      setAnswer(data);
      setPrompt('');
    } else {
      console.log(errors);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 dark:text-white">
      <div>
        <h1 className="text-3xl font-bold text-center mb-4">Haiku Generator</h1>
        <form className="mb-4 self-center max-w-[500px]" onSubmit={sendPrompt}>
          <input
            className="text-black p-2 w-full"
            placeholder="Enter a prompt..."
            name="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />
        </form>
        <div className="text-center">
          <pre>{answer}</pre>
        </div>
      </div>
    </main>
  );
}
```

---

TITLE: Importing Custom Utility and Defining Metadata for Amplify AI Kit Documentation in JavaScript
DESCRIPTION: This snippet imports a custom static path utility and defines a metadata object for the documentation page of the Amplify AI Kit. The metadata specifies the page title, description, and a list of supported platform strings. No dependencies are required beyond the utility "getCustomStaticPath" in the project. Meta information is intended to drive dynamic documentation routes and theming; no function parameters are involved here.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/concepts/architecture/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:

```
import { getCustomStaticPath } from "@/utils/getCustomStaticPath";

export const meta = {
  title: "Architecture",
  description:
    "Amplify AI Kit fullstack architecture",
  platforms: [
    "javascript",
    "react-native",
    "angular",
    "nextjs",
    "react",
    "vue",
  ],
};
```

---

TITLE: Configuring Amplify on the server-side
DESCRIPTION: Code to import and configure Amplify in your Next.js API route for server-side rendering.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_13

LANGUAGE: js
CODE:

```
import { Amplify } from 'aws-amplify';
import awsconfig from '@/aws-exports';

Amplify.configure({
  ...awsconfig,
  ssr: true
});
```

---

TITLE: Implementing a Custom Conversation Handler with Executable Tool - TypeScript
DESCRIPTION: This code snippet defines a custom conversation handler function with an executable tool (`calculator`). It uses `createExecutableTool` to define the tool with its name, description, JSON schema for input validation, and a handler function. The handler processes the conversation turn event and executes the defined tools.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/tools/index.mdx#_snippet_6

LANGUAGE: typescript
CODE:

```
import {
  ConversationTurnEvent,
  createExecutableTool,
  handleConversationTurnEvent
} from '@aws-amplify/backend-ai/conversation/runtime';

const jsonSchema = {
  json: {
    type: 'object',
    properties: {
      'operator': {
        'type': 'string',
        'enum': ['+', '-', '*', '/'],
        'description': 'The arithmetic operator to use'
      },
      'operands': {
        'type': 'array',
        'items': {
          'type': 'number'
        },
        'minItems': 2,
        'maxItems': 2,
        'description': 'Two numbers to perform the operation on'
      }
    },
    required: ['operator', 'operands']
  }
} as const;
// declare as const to allow the input type to be derived from the JSON schema in the tool handler definition.

const calculator = createExecutableTool(
  'calculator',
  'Returns the result of a simple calculation',
  jsonSchema,
  // input type is derived from the JSON schema
  (input) => {
    const [a, b] = input.operands;
    switch (input.operator) {
      case '+': return Promise.resolve({ text: (a + b).toString() });
      case '-': return Promise.resolve({ text: (a - b).toString() });
      case '*': return Promise.resolve({ text: (a * b).toString() });
      case '/':
        if (b === 0) throw new Error('Division by zero');
        return Promise.resolve({ text: (a / b).toString() });
      default:
        throw new Error('Invalid operator');
    }
  },
);

export const handler = async (event: ConversationTurnEvent) => {
  await handleConversationTurnEvent(event, {
    tools: [calculator],
  });
};
```

---

TITLE: Resuming Conversations with useAIConversation Hook (React/Next.js/React Native)
DESCRIPTION: This snippet demonstrates how to resume a specific conversation within a React, Next.js, or React Native component using the `useAIConversation` hook. It takes the conversation type ('chat') and the conversation ID as arguments, returning the messages and a function (`handleSendMessage`) to interact with the conversation.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/history/index.mdx#_snippet_3

LANGUAGE: tsx
CODE:

```
export function Chat({ id }) {
  const [
    data: { messages }
    handleSendMessage,
  ] = useAIConversation('chat', { id })
}
```

---

TITLE: Example Data Schema with DataTool Integration in TypeScript
DESCRIPTION: Defines a data schema with a Post model and a conversational AI channel that includes a data tool. The data tool references the Post model to allow the LLM to list and filter Post records, with authorization enforced based on owner strategy. This setup enables the AI to query data securely using the specified model and operation.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/tools/index.mdx#_snippet_0

LANGUAGE: TypeScript
CODE:

```
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.model({
    title: a.string(),
    body: a.string(),
  })
  .authorization(allow => allow.owner()),

  chat: a.conversation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: 'Hello, world!',
    tools: [
      a.ai.dataTool({
        // The name of the tool as it will be referenced in the message to the LLM
        name: 'PostQuery',
        // The description of the tool provided to the LLM.
        // Use this to help the LLM understand when to use the tool.
        description: 'Searches for Post records',
        // A reference to the `a.model()` that the tool will use
        model: a.ref('Post'),
        // The operation to perform on the model
        modelOperation: 'list',
      }),
    ],
  }),
})
```

---

TITLE: Generate Amplify Data Client with React Hooks (JS)
DESCRIPTION: This JavaScript code generates an Amplify data client and React hooks for AI interactions. It utilizes JSDoc to provide type hinting for the generated client. The hooks, `useAIConversation` and `useAIGeneration`, are created using `createAIHooks` from `@aws-amplify/ui-react-ai`.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_13

LANGUAGE: typescript
CODE:

```
import { generateClient } from "aws-amplify/api";
import { Schema } from "../amplify/data/resource";
import { createAIHooks } from "@aws-amplify/ui-react-ai";

/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */
export const client = generateClient({ authMode: "userPool" });
export const { useAIConversation, useAIGeneration } = createAIHooks(client);
```

---

TITLE: Creating a Conversation with Name and Metadata in TypeScript
DESCRIPTION: Creates a new conversation with an optional name and metadata attached. The metadata can be used to organize chats and group them into certain topics. There are no uniqueness constraints on conversation `name` or `metadata` values.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/connect-your-frontend/index.mdx#_snippet_2

LANGUAGE: typescript
CODE:

```
const { data: chat, errors } = await client.conversations.chat.create({
  name: 'My conversation',
  metadata: {
    value: '1234567890',
  },
});
```

---

TITLE: Generating Recipe - JavaScript
DESCRIPTION: This JavaScript snippet demonstrates recipe generation using a hypothetical `client` object with a `generations` namespace and `generateRecipe` method. It fetches data based on the description provided. The output is the generated recipe, assuming the `client` object and related methods are set up appropriately. It provides a simple example of how to call the API in other frameworks like Vue or Angular
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_18

LANGUAGE: TypeScript
CODE:

```
import { client } from './client';

const { data } = await client.generations.generateRecipe({
  description: 'A gluten free chocolate cake'
});
```

---

TITLE: Static Paths Generation
DESCRIPTION: This function, `getStaticPaths`, generates static paths for the documentation pages based on the supported platforms specified in the `meta.platforms` array. It utilizes the `getCustomStaticPath` utility function to create these paths. This allows the documentation to be pre-rendered for each platform.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/more-features/interactions/chatbot/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:

```
export const getStaticPaths = async () => {
  return getCustomStaticPath(meta.platforms);
};
```

---

TITLE: Schema Definition for Product Data Extraction in TypeScript
DESCRIPTION: Defines an AI schema for extracting product details from unstructured text, specifying data types and the AI model used for generation. Requires 'a' schema utilities and assumes authentication for protected access.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/generation/data-extraction/index.mdx#_snippet_0

LANGUAGE: typescript
CODE:

```
const schema = a.schema({
  ProductDetails: a.customType({
    name: a.string().required(),
    summary: a.string().required(),
    price: a.float().required(),
    category: a.string().required(),
  }),

  extractProductDetails: a.generation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: 'Extract the property details from the text provided',
  })
    .arguments({
      productDescription: a.string()
    })
    .returns(a.ref('ProductDetails'))
    .authorization((allow) => allow.authenticated()),
});
```

---

TITLE: Implement Angular Component to Invoke Haiku Generator
DESCRIPTION: Creates an Angular component that integrates with Amplify Data to build a UI for the haiku generator. It uses Angular's component structure, state properties (`prompt`, `answer`), configures Amplify, generates the client, defines a method (`sendPrompt`) to call the `generateHaiku` query upon form submission, and updates the UI with the result using an inline template.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/custom-business-logic/connect-bedrock/index.mdx#_snippet_8

LANGUAGE: TypeScript
CODE:

```
import type { Schema } from '../../../amplify/data/resource';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import outputs from '../../../amplify_outputs.json';

Amplify.configure(outputs);

const client = generateClient<Schema>();

@Component({
  selector: 'app-haiku',
  standalone: true,
  imports: [FormsModule],
  template: `
    <main
      class="flex min-h-screen flex-col items-center justify-center p-24 dark:text-white"
    >
      <div>
        <h1 class="text-3xl font-bold text-center mb-4">Haiku Generator</h1>
        <form class="mb-4 self-center max-w-[500px]" (ngSubmit)="sendPrompt()">
          <input
            class="text-black p-2 w-full"
            placeholder="Enter a prompt..."
            name="prompt"
            [(ngModel)]="prompt"
          />
        </form>
        <div class="text-center">
          <pre>{{ answer }}</pre>
        </div>
      </div>
    </main>
  `,
})
export class HaikuComponent {
  prompt: string = '';
  answer: string | null = null;

  async sendPrompt() {
    const { data, errors } = await client.queries.generateHaiku({
      prompt: this.prompt,
    });

    if (!errors) {
      this.answer = data;
      this.prompt = '';
    } else {
      console.log(errors);
    }
  }
}
```

---

TITLE: Importing Utility Functions (JavaScript)
DESCRIPTION: Imports utility functions `getChildPageNodes` and `getCustomStaticPath` from specified paths within the project. These functions are likely used later for static site generation tasks in Next.js.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:

```
import { getChildPageNodes } from '@/utils/getChildPageNodes';
import { getCustomStaticPath } from '@/utils/getCustomStaticPath';
```

---

TITLE: Defining GraphQL Query to Translate Text using AWS Amplify @predictions Directive (GraphQL)
DESCRIPTION: Creates a GraphQL query field named translate that applies the translateText action through the @predictions directive to translate input text from one language to another. It requires specifying source and target languages using supported language codes and accepts the text to translate as input. The output is a translated string.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/connect-machine-learning-services/index.mdx#_snippet_4

LANGUAGE: graphql
CODE:

```
type Query {
  translate: String @predictions(actions: [translateText])
}
```

---

TITLE: Customizing AIConversation Image Rendering (TSX)
DESCRIPTION: Demonstrates how to customize how image messages are displayed within the AIConversation component using the `messageRenderer.image` property. It includes a helper function, `convertBufferToBase64`, necessary to format the image data received as a byte array buffer into a displayable base64 string URL. Requires a method to handle binary data (like Node's `Buffer` or equivalent).
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/ai-conversation/index.mdx#_snippet_4

LANGUAGE: tsx
CODE:

```
// Note: the image in a message comes in as a byte array
// you will need to convert this to base64
function convertBufferToBase64(
  buffer: ArrayBuffer,
  format: 'png' | 'jpeg' | 'gif' | 'webp'
): string {
  const base64string = Buffer.from(new Uint8Array(buffer)).toString('base64');
  return `data:image/${format};base64,${base64string}`;
}

<AIConversation
  messageRenderer={{
    image: ({ image }) => (
      <img
        className="testing"
        width={200}
        height={200}
        src={convertBufferToBase64(image.source.bytes, image.format)}
        alt=""
      />
    ),
  }}
/>
```

---

TITLE: Translating Text with Amplify Java
DESCRIPTION: This Java code snippet demonstrates how to translate text using the Amplify Predictions API. It takes the input text "I like to eat spaghetti" and translates it to the default configured language. It uses callbacks to handle the success and failure cases. The `Amplify` object is the entry point for the Amplify library.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/android/translate.mdx#_snippet_0

LANGUAGE: java
CODE:

```
Amplify.Predictions.translateText("I like to eat spaghetti",
    result -> Log.i("MyAmplifyApp", result.getTranslatedText()),
    error -> Log.e("MyAmplifyApp", "Translation failed", error)
);
```

---

TITLE: Updating a Conversation with Conversations API in TypeScript
DESCRIPTION: Updates a conversation's `name` and `metadata` with the `.update()` method. This is useful if you want to update the conversation name based on the messages sent or attach arbitrary metadata at a later time.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/connect-your-frontend/index.mdx#_snippet_6

LANGUAGE: typescript
CODE:

```
const id = '123e4567-e89b-12d3-a456-426614174000';
const { data: chat, errors } = await client.conversations.chat.update({
  id,
  name: 'My updated conversation',
});
```

---

TITLE: Generating Static Paths with Next.js (JavaScript)
DESCRIPTION: Exports an asynchronous function `getStaticPaths` required by Next.js for dynamic routes using static generation. It calls the utility function `getCustomStaticPath`, passing the `platforms` array from the `meta` object, to generate the list of paths (one for each platform) that should be pre-rendered at build time.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/index.mdx#_snippet_2

LANGUAGE: javascript
CODE:

```
export const getStaticPaths = async () => {
  return getCustomStaticPath(meta.platforms);
};
```

---

TITLE: Importing and Rendering Platform-Specific Documentation Fragments
DESCRIPTION: Imports MDX fragments for JavaScript platforms and renders them conditionally based on the current platform using the Fragments component.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/predictions/index.mdx#_snippet_3

LANGUAGE: JSX
CODE:

```
import js0 from '/src/fragments/lib/predictions/js/intro.mdx';

<Fragments
  fragments={{
    javascript: js0,
    angular: js0,
    nextjs: js0,
    react: js0,
    vue: js0
  }}
/>
```

---

TITLE: Add Lambda Function and Permissions for Amazon Bedrock - TypeScript
DESCRIPTION: This code snippet demonstrates how to add a Lambda function to the backend and grant it permission to invoke a generative AI model in Amazon Bedrock. It imports necessary modules from `@aws-amplify/backend` and `aws-cdk-lib/aws-iam`. It also references a pre-defined `generateHaikuFunction` which is presumably defined in `amplify/data/resource.ts`.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/custom-business-logic/connect-bedrock/index.mdx#_snippet_0

LANGUAGE: typescript
CODE:

```
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data, MODEL_ID, generateHaikuFunction } from "./data/resource";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

export const backend = defineBackend({
  auth,
  data,
  generateHaikuFunction,
});

backend.generateHaikuFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["bedrock:InvokeModel"],
    resources: [
      `arn:aws:bedrock:*::foundation-model/${MODEL_ID}`,
    ],
  })
);
```

---

TITLE: Installing Amazon Bedrock SDK with npm
DESCRIPTION: Command to add the Amazon Bedrock SDK to your project dependencies.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_12

LANGUAGE: bash
CODE:

```
npm i --save @aws-sdk/client-bedrock-runtime
```

---

TITLE: Next.js app configuration prompts
DESCRIPTION: This snippet represents the interactive prompts displayed when creating a Next.js app using `create-next-app`. The user configures TypeScript, ESLint, Tailwind CSS, source directory, app directory, and import alias.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_1

LANGUAGE: bash
CODE:

```
✔ Would you like to use TypeScript with this project? … No / Yes
✔ Would you like to use ESLint with this project? … No / Yes
✔ Would you like to use Tailwind CSS with this project? … No / Yes
✔ Would you like to use `src/` directory with this project? … No / Yes
✔ Would you like to use experimental `app/` directory with this project? … No / Yes
✔ What import alias would you like configured? … @/*
```

---

TITLE: Creating IAM policy override for Bedrock access
DESCRIPTION: Code to override Amplify's IAM policies to grant authenticated users access to Amazon Bedrock's InvokeModel functionality.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_23

LANGUAGE: js
CODE:

```
import {
  AmplifyProjectInfo,
  AmplifyRootStackTemplate
} from '@aws-amplify/cli-extensibility-helper';

export function override(
  resources: AmplifyRootStackTemplate,
  amplifyProjectInfo: AmplifyProjectInfo
) {
  const authRole = resources.authRole;

  const basePolicies = Array.isArray(authRole.policies)
    ? authRole.policies
    : [authRole.policies];

  authRole.policies = [
    ...basePolicies,
    {
      policyName: '',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: 'bedrock:InvokeModel',
            Resource:
              'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2'
          }
        ]
      }
    }
  ];
}
```

---

TITLE: GraphQL Query Example to Translate Text using AWS Amplify (GraphQL)
DESCRIPTION: GraphQL query demonstrating usage of the translate field that requires input parameters including sourceLanguage, targetLanguage, and text to be translated. The query returns the translated string accordingly. Language codes must conform to supported AWS Translate codes.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/connect-machine-learning-services/index.mdx#_snippet_5

LANGUAGE: graphql
CODE:

```
query TranslateText($input: TranslateTextInput!) {
  translate(
    input: {
      translateText: {
        sourceLanguage: "en"
        targetLanguage: "de"
        text: "Translate me"
      }
    }
  )
}
```

---

TITLE: Enabling AIConversation Attachments Feature (TSX)
DESCRIPTION: Demonstrates how to enable the functionality allowing users to attach images to their messages. This is done by setting the `allowAttachments` prop to `true`. Note that this feature has specific file type and size limitations (png, jpg, gif, webp, max 400kb base64 encoded).
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/ai-conversation/index.mdx#_snippet_7

LANGUAGE: tsx
CODE:

```
<AIConversation
  //...
  allowAttachments
/>
```

---

TITLE: Adding Code Syntax Highlighting to AIConversation (TSX)
DESCRIPTION: Extends the text rendering customization by showing how to incorporate syntax highlighting for code blocks in markdown output. This is achieved by combining `react-markdown` with the `rehype-highlight` plugin within the `messageRenderer` prop. Requires `react-markdown` and `rehype-highlight`.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/ai-conversation/index.mdx#_snippet_3

LANGUAGE: tsx
CODE:

```
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

<AIConversation
  messageRenderer={{
    text: ({ text }) => (
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {text}
      </ReactMarkdown>
    )
  }}
/>
```

---

TITLE: Wrap app with Authenticator component
DESCRIPTION: This code wraps the `<Component />` with the `Authenticator` component from '@aws-amplify/ui-react', requiring users to authenticate before accessing the application. The Authenticator handles sign-in, sign-up, and password reset flows.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_11

LANGUAGE: javascript
CODE:

```
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';
import type { AppProps } from 'next/app';
import { Authenticator } from '@aws-amplify/ui-react';

Amplify.configure({
  ...awsconfig,
  // this lets you run Amplify code on the server-side in Next.js
  ssr: true
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator>
      <Component {...pageProps} />
    </Authenticator>
  );
}
```

---

TITLE: Resuming Conversations in Amplify AI (JS/Vue/Angular)
DESCRIPTION: This snippet outlines the process for resuming a conversation in JavaScript, Vue, or Angular applications. It first lists all conversations, retrieves a specific one using its ID via the `.get()` method, lists existing messages with `.listMessages()`, and finally sends a new message using `.sendMessage()`. Requires an authenticated user.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/history/index.mdx#_snippet_2

LANGUAGE: typescript
CODE:

```
// list all conversations a user has
// make sure the user has been authenticated with Amplify Auth
const conversationList = await client.conversations.conversation.list();

// Retrieve a specific conversation
const { data: conversation } = await client.conversations.chat.get({ id: conversationList[0].id });

// list the existing messages in the conversation
const { data: messages } = await conversation.listMessages();

// You can now send a message to the conversation
conversation.sendMessage({
  content: [
    {text: "hello"}
  ]
})
```

---

TITLE: Create a new Next.js app
DESCRIPTION: This command uses `create-next-app` to scaffold a new Next.js project. The user is prompted to select options such as TypeScript, ESLint, Tailwind CSS, a source directory, the app directory, and an import alias.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_0

LANGUAGE: bash
CODE:

```
npx create-next-app@14
```

---

TITLE: Defining GraphQL Query to Identify Labels in Images using AWS Amplify @predictions Directive (GraphQL)
DESCRIPTION: Defines a GraphQL query field named recognizeLabelsFromImage that uses the @predictions directive with the identifyLabels action to detect labels for images stored in the S3 bucket 'public/' folder. Returns an array of strings representing detected labels using Amazon Rekognition. This configuration enables label detection capabilities within the GraphQL API.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/connect-machine-learning-services/index.mdx#_snippet_2

LANGUAGE: graphql
CODE:

```
type Query {
  recognizeLabelsFromImage: [String] @predictions(actions: [identifyLabels])
}
```

---

TITLE: Paginating Conversation Lists in Amplify AI (TypeScript)
DESCRIPTION: This snippet shows how to implement pagination when listing user conversations. It retrieves the first page using `.list()`, checks for a `nextToken`, and uses it to fetch the subsequent page if available.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/history/index.mdx#_snippet_1

LANGUAGE: typescript
CODE:

```
const { data: conversations, nextToken } = await client.conversations.chat.list();

// retrieve next page
if (nextToken) {
  const { data: nextPageConversations } = await client.conversations.chat.list({
    nextToken
  });
}
```

---

TITLE: React Hook-Based Data Extraction from Product Description Using AWS Amplify
DESCRIPTION: Shows how to integrate AWS Amplify's AI generation capabilities into a React component using hooks for asynchronous data fetching. Utilizes '@aws-amplify/ui-react-ai' for creating a custom hook, manages loading state, and triggers data extraction on demand. Depends on React, AWS Amplify API, and the AI hooks library.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/generation/data-extraction/index.mdx#_snippet_2

LANGUAGE: typescript
CODE:

```
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { createAIHooks } from "@aws-amplify/ui-react-ai";

const client = generateClient<Schema>({ authMode: "userPool" });
const { useAIGeneration } = createAIHooks(client);

export default function Example() {
  const productDescription = `The NBA Official Game Basketball is a premium
  regulation-size basketball crafted with genuine leather and featuring
  official NBA specifications. This professional-grade ball offers superior grip
  and durability, with deep channels and a moisture-wicking surface that ensures
  consistent performance during intense game play. Priced at $159.99, this high-end
  basketball belongs in our Professional Sports Equipment category and is the same model
  used in NBA games.`

  // data is React state and will be populated when the generation is returned
  const [{ data, isLoading }, extractProductDetails] =
    useAIGeneration("extractProductDetails");

  const productDetails = async () => {
    extractProductDetails({
      productDescription
    });
  };
}

```

---

TITLE: Rendering Child Page Overview Section
DESCRIPTION: Renders a section titled 'Learn more' that displays an overview of child pages using the Overview component with child page nodes passed as props.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/predictions/index.mdx#_snippet_5

LANGUAGE: JSX
CODE:

```
## Learn more

<Overview childPageNodes={props.childPageNodes} />
```

---

TITLE: Customizing AIConversation Text Rendering (TSX)
DESCRIPTION: Illustrates how to customize the rendering of text messages within the AIConversation component using the `messageRenderer` prop. It specifically shows how to integrate `react-markdown` to enable markdown formatting in assistant responses. This allows for rich text display. Requires the `react-markdown` library.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/ai-conversation/index.mdx#_snippet_2

LANGUAGE: tsx
CODE:

```
import ReactMarkdown from 'react-markdown';

<AIConversation
  messageRenderer={{
    text: ({ text }) => <ReactMarkdown>{text}</ReactMarkdown>
  }}
/>
```

---

TITLE: Displaying Model Information with AWS Amplify UI Table (React)
DESCRIPTION: Demonstrates usage of `@aws-amplify/ui-react` components to render a structured HTML table. It defines the table structure including head and body, using `TableRow` and `TableCell` to list supported AI model providers, models, and their capabilities.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/concepts/models/index.mdx#_snippet_1

LANGUAGE: JSX
CODE:

```
<Table
  caption="Table with supported models for Amplify AI kit"
  highlightOnHover={false}
  style={{ border: '1.5px solid' }}>
  <TableHead>
    <TableRow>
      <TableCell as="th">Provider</TableCell>
      <TableCell as="th">Model</TableCell>
      <TableCell as="th">Conversation</TableCell>
      <TableCell as="th">Generation</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell><strong><a href="https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-ai21.html">AI21 Labs</a></strong></TableCell>
      <TableCell>Jurassic-2 Large</TableCell>
      <TableCell>✅</TableCell>
      <TableCell>❌</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong><a href="https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-ai21.html">AI21 Labs</a></strong></TableCell>
      <TableCell>Jurassic-2 Mini</TableCell>
      <TableCell>✅</TableCell>
      <TableCell>❌</TableCell>
    </TableRow>
    <TableRow style={{ borderTop: '1.5px solid' }}>
      <TableCell><strong><a href="https://aws.amazon.com/ai/generative-ai/nova/">Amazon</a></strong></TableCell>
      <TableCell>Amazon Nova Pro</TableCell>
      <TableCell>✅</TableCell>
      <TableCell>❌</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong><a href="https://aws.amazon.com/ai/generative-ai/nova/">Amazon</a></strong></TableCell>
      <TableCell>Amazon Nova Lite</TableCell>
      <TableCell>✅</TableCell>
      <TableCell>❌</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong><a href="https://aws.amazon.com/ai/generative-ai/nova/">Amazon</a></strong></TableCell>
      <TableCell>Amazon Nova Micro</TableCell>
      <TableCell>✅</TableCell>
      <TableCell>❌</TableCell>
    </TableRow>
    <TableRow style={{ borderTop: '1.5px solid' }}>
      <TableCell><strong><a href="https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-claude.html">Anthropic</a></strong></TableCell>
      <TableCell>Claude 3 Haiku</TableCell>
      <TableCell>✅</TableCell>
      <TableCell>✅</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong><a href="https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-claude.html">Anthropic</a></strong></TableCell>
      <TableCell>Claude 3.5 Haiku</TableCell>
      <TableCell>✅</TableCell>
      <TableCell>✅</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong><a href="https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-claude.html">Anthropic</a></strong></TableCell>
      <TableCell>Claude 3 Sonnet</TableCell>
      <TableCell>✅</TableCell>
      <TableCell>✅</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong><a href="https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-claude.html">Anthropic</a></strong></TableCell>
      <TableCell>Claude 3.5 Sonnet</TableCell>
      <TableCell>✅</TableCell>
      <TableCell>✅</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong><a href="https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-claude.html">Anthropic</a></strong></TableCell>
      <TableCell>Claude 3.5 Sonnet v2</TableCell>
      <TableCell>✅</TableCell>
      <TableCell>✅</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong><a href="https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-claude.html">Anthropic</a></strong></TableCell>
      <TableCell>Claude 3 Opus</TableCell>
      <TableCell>✅</TableCell>
      <TableCell>✅</TableCell>
    </TableRow>
    <TableRow style={{ borderTop: '1.5px solid' }}>
      <TableCell><strong><a href="https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-cohere.html">Cohere</a></strong></TableCell>
      <TableCell>Command R</TableCell>
      <TableCell>✅</TableCell>
      <TableCell>❌</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong><a href="https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-cohere.html">Cohere</a></strong></TableCell>
      <TableCell>Command R+</TableCell>
      <TableCell>✅</TableCell>
      <TableCell>❌</TableCell>
    </TableRow>
    <TableRow style={{ borderTop: '1.5px solid' }}>
      <TableCell><strong><a href="https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-meta.html">Meta</a></strong></TableCell>
      <TableCell>Llama 3.1</TableCell>
      <TableCell>✅</TableCell>
      <TableCell>❌</TableCell>
    </TableRow>
    <TableRow style={{ borderTop: '1.5px solid' }}>
      <TableCell><strong><a href="https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-mistral.html">Mistral AI</a></strong></TableCell>
      <TableCell>Large</TableCell>
      <TableCell>✅</TableCell>
      <TableCell>❌</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong><a href="https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-mistral.html">Mistral AI</a></strong></TableCell>
      <TableCell>Large 2</TableCell>
      <TableCell>✅</TableCell>
      <TableCell>❌</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

TITLE: GraphQL Query Example to Convert Text to Speech using AWS Amplify (GraphQL)
DESCRIPTION: Example query that calls textToSpeech with input parameters voiceID and text specifying the voice and content to synthesize. Returns a presigned URL string for the synthesized speech audio file. VoiceID must be one of the Amazon Polly supported voices.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/connect-machine-learning-services/index.mdx#_snippet_7

LANGUAGE: graphql
CODE:

```
query ConvertTextToSpeech($input: ConvertTextToSpeechInput!) {
  textToSpeech(
    input: {
      convertTextToSpeech: {
        voiceID: "Nicole"
        text: "Hello from AWS Amplify!"
      }
    }
  )
}
```

---

TITLE: Sending aiContext with AIConversation - React/Next.js
DESCRIPTION: This code snippet illustrates how to pass aiContext to the AIConversation component in React or Next.js. The aiContext is a function that returns an object containing the current time, ensuring the LLM receives the most up-to-date information.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/context/index.mdx#_snippet_2

LANGUAGE: tsx
CODE:

```
function Chat() {
  const [
    {
      data: { messages },
      isLoading,
    },
    sendMessage,
  ] = useAIConversation('chat');

  return (
    <AIConversation
      messages={messages}
      isLoading={isLoading}
      handleSendMessage={sendMessage}
      // This will let the LLM know about the current state of this application
      // so it can better respond to questions
      aiContext={() => {
        return {
          currentTime: new Date().toLocaleTimeString(),
        };
      }}
    />
  );
}
```

---

TITLE: Configuring Meta Information for Bot Interactions Documentation in JavaScript
DESCRIPTION: Defines metadata for the documentation page including title, description, and supported platforms. This information is used for page rendering and navigation.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/interactions/chatbot/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:

```
export const meta = {
  title: 'Interact with bots',
  description: 'Learn more about how to integrate chat bot interactions into your application using Amplify.',
  platforms: [
    'javascript',
    'react-native',
    'angular',
    'nextjs',
    'react',
    'vue'
  ]
};
```

---

TITLE: Conditionally Rendering Platform-Specific Content Using InlineFilter
DESCRIPTION: Uses the InlineFilter component to conditionally render content specifically for Android and Swift platforms, describing the Predictions category functionality and related AWS services.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/predictions/index.mdx#_snippet_4

LANGUAGE: JSX
CODE:

```
<InlineFilter filters={["android", "swift"]}>

The Predictions category enables you to integrate machine learning into your application without any prior machine learning experience. It supports translating text from one language to another, converting text to speech, text recognition from an image, entities recognition, labeling real world objects, interpretation of text, and uploading images for automatic training. This functionality is powered by AWS services including: [Amazon Translate](https://docs.aws.amazon.com/translate/latest/dg/what-is.html), [Amazon Polly](https://docs.aws.amazon.com/polly/latest/dg/what-is.html), [Amazon Transcribe](https://docs.aws.amazon.com/transcribe/latest/dg/what-is-transcribe.html), [Amazon Rekognition](https://docs.aws.amazon.com/rekognition/latest/dg/what-is.html), [Amazon Textract](https://docs.aws.amazon.com/textract/latest/dg/what-is.html), and [Amazon Comprehend](https://docs.aws.amazon.com/comprehend/latest/dg/what-is.html).

</InlineFilter>
```

---

TITLE: Using React Context to share data with response components
DESCRIPTION: Demonstrates how to create a React Context for sharing application state, update it within a custom component, and pass it to the AIConversation component using the aiContext callback. This setup enables response components to access and reflect current app state or previous responses, facilitating dynamic and context-aware UI rendering.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/response-components/index.mdx#_snippet_1

LANGUAGE: TypeScript
CODE:

```
// Create a context to share state across components
// highlight-start
const DataContext = React.createContext<{
  data: any;
  setData: (value: React.SetStateAction<any>) => void;
}>({ data: {}, setData: () => {} });

function WeatherCard({ city }: { city: string }) {
  const { setData } = React.useContext(DataContext);

  React.useEffect(() => {
    // fetch some weather data
    // set the data context
    setData({
      city,
      // weather info
    })
  },[city])

  return (
    <div>{city}</div>
  )
}
// highlight-start

function Chat() {
  const { data } = React.useContext(DataContext);
  const [
    {
      data: { messages },
      isLoading,
    },
    sendMessage,
  ] = useAIConversation('chat');

  return (
    <AIConversation
      messages={messages}
      isLoading={isLoading}
      handleSendMessage={sendMessage}
      responseComponents={{
        WeatherCard: {
          component: WeatherCard,
          description: "Used to display the weather to the user",
          props: {
            city: {
              type: "string",
              required: true,
              description: "The name of the city to display the weather for",
            },
          },
        }
      }}
      // highlight-start
      aiContext={() => {
        return {
          ...data,
        };
      }}
      // highlight-end
    />
  );
}

export default function Example() {
  const [data, setData] = React.useState({});
  return (
    <Authenticator>
      <DataContext.Provider value={{ data, setData }}>
        <Chat />
      </DataContext.Provider>
    </Authenticator>
  )
}

```

---

TITLE: Import Amplify modules and styles
DESCRIPTION: These imports add Amplify UI styles and import the Amplify library along with the aws-exports configuration file into the `_app.tsx` file. This enables use of Amplify and its UI components.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_9

LANGUAGE: javascript
CODE:

```
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';
```

---

TITLE: IAM Policy for LexV2 Access - JSON
DESCRIPTION: This JSON snippet defines an IAM policy that grants permissions for accessing Amazon Lex V2. It allows the actions `lex:RecognizeText` and `lex:RecognizeUtterance` on a specific Lex V2 bot alias. Replace `<Region>`, `<Account>`, `<BotId>`, and `<BotAliasId>` with your actual values.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/interactions/js/getting-started.mdx#_snippet_0

LANGUAGE: json
CODE:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["lex:RecognizeText", "lex:RecognizeUtterance"],
      "Resource": "arn:aws:lex:<Region>:<Account>:bot-alias/<BotId>/<BotAliasId>"
    }
  ]
}
```

---

TITLE: Unsupported Required Types in Generation Response Schema
DESCRIPTION: Illustrates types that cannot be used as required fields in AI generation response schemas, including email and date fields which are not supported as required fields.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/generation/index.mdx#_snippet_9

LANGUAGE: typescript
CODE:

```
const schema = a.schema({
  generateUser: a.generation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: 'You are a helpful assistant that generates users.',
  })
    .arguments({ description: a.string() })
    .returns(
      a.customType({
        name: a.string(),
        email: a.email().required(), // ❌ Required field with unsupported type
        dateOfBirth: a.date().required(), // ❌ Required field with unsupported type
      })
    )
    .authorization((allow) => allow.authenticated()),
});
```

---

TITLE: Add HTTP Data Source and Permissions for Amazon Bedrock - TypeScript
DESCRIPTION: This snippet configures an HTTP data source for Amazon Bedrock within the Amplify backend. It also grants the data source permissions to invoke a generative AI model. The `MODEL_ID` constant specifies the model to be used. It sets up authorization configuration for AppSync to sign the request to Bedrock. Environment variables are also set.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/custom-business-logic/connect-bedrock/index.mdx#_snippet_1

LANGUAGE: typescript
CODE:

```
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

export const backend = defineBackend({
  auth,
  data,
});

const MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0";

const bedrockDataSource = backend.data.addHttpDataSource(
  "BedrockDataSource",
  "https://bedrock-runtime.us-east-1.amazonaws.com",
  {
    authorizationConfig: {
      signingRegion: backend.data.stack.region,
      signingServiceName: "bedrock",
    },
  }
);

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["bedrock:InvokeModel"],
    resources: [
      `arn:aws:bedrock:${backend.data.stack.region}::foundation-model/${MODEL_ID}`,
    ],
  })
);

backend.data.resources.cfnResources.cfnGraphqlApi.environmentVariables = {
  MODEL_ID
}
```

---

TITLE: Generating Recipe - Next.js App Router
DESCRIPTION: This Next.js App Router snippet performs the same recipe generation functionality as the previous examples, but is configured to use the new Next.js App Router. It uses `useAIGeneration` to call the recipe generation API. It includes a text area for user input, a button to trigger the recipe generation and displays recipe details using components from `@aws-amplify/ui-react`. It also handles loading states using `<Loader>`. The `"use client"` directive is included to indicate this is a client component.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_16

LANGUAGE: TypeScript
CODE:

```
"use client";
import { useAIGeneration } from "@/client";
import {
  Button,
  Flex,
  Heading,
  Loader,
  Text,
  TextAreaField,
  View,
} from "@aws-amplify/ui-react";
import React from "react";

export default function Page() {
  const [description, setDescription] = React.useState("");
  const [{ data, isLoading, hasError }, generateRecipe] =
    useAIGeneration("generateRecipe");

  const handleClick = () => {
    generateRecipe({ description });
  };

  return (
    <Flex direction="column">
      <Flex direction="row">
        <TextAreaField
          autoResize
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label="Description"
        />
        <Button onClick={handleClick}>Generate recipe</Button>
      </Flex>
      {isLoading ? (
        <Loader variation="linear" />
      ) : (
        <>
          <Heading level={2}>{data?.name}</Heading>
          <View as="ul">
            {data?.ingredients?.map((ingredient) => (
              <Text as="li" key={ingredient}>
                {ingredient}
              </Text>
            ))}
          </View>
          <Text>{data?.instructions}</Text>
        </>
      )}
    </Flex>
  );
}
```

---

TITLE: Create Amplify Project
DESCRIPTION: This command initiates the Amplify project creation process, guiding the user through the setup and configuration of their AI backend.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_0

LANGUAGE: bash
CODE:

```
npm create amplify@latest
```

---

TITLE: Creating SSR context for server-side authentication
DESCRIPTION: Code to create a server-side rendering context for accessing Amplify functionality.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_15

LANGUAGE: js
CODE:

```
const SSR = withSSRContext({ req });
```

---

TITLE: Customizing AIConversation User and AI Avatars (TSX)
DESCRIPTION: Explains how to customize the visual representation (avatar) and display name (username) for both the user and the AI assistant within the conversation. This is achieved by providing an object to the `avatars` prop with `user` and `ai` properties, each containing `avatar` (a React Node) and `username` (a string). The example uses `<Avatar>` components (presumably from `@aws-amplify/ui-react` or similar).
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/ai-conversation/index.mdx#_snippet_8

LANGUAGE: tsx
CODE:

```
<AIConversation
  avatars={{
    user: {
      avatar: <Avatar src="/images/user.jpg" />,
      username: "danny",
    },
    ai: {
      avatar: <Avatar src="/images/ai.jpg" />,
      username: "Amplify assistant"
    }
  }}
/>
```

---

TITLE: Translating Text with Amplify RxJava
DESCRIPTION: This RxJava code snippet illustrates translating text using Amplify Predictions. It translates "I like to eat spaghetti" using the RxAmplify library. The `subscribe` method handles the success and failure scenarios, printing the translated text or logging an error. Requires RxAmplify dependency.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/android/translate.mdx#_snippet_3

LANGUAGE: java
CODE:

```
RxAmplify.Predictions.translateText("I like to eat spaghetti")
        .subscribe(
            result -> Log.i("MyAmplifyApp", result.getTranslatedText()),
            error -> Log.e("MyAmplifyApp", "Translation failed", error)
        );
```

---

TITLE: Translating Text with Amplify Kotlin Coroutines
DESCRIPTION: This Kotlin code snippet demonstrates text translation using Amplify Predictions with Coroutines. It translates the text "I like to eat spaghetti". It uses a `try-catch` block to handle potential `PredictionsException` errors. The `Amplify` object handles the translation call.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/android/translate.mdx#_snippet_2

LANGUAGE: kotlin
CODE:

```
val text = "I like to eat spaghetti"
try {
    val result = Amplify.Predictions.translateText(text)
    Log.i("MyAmplifyApp", result.translatedText)
} catch (error: PredictionsException) {
    Log.e("MyAmplifyApp", "Translation failed", error)
}
```

---

TITLE: Add authentication with Amplify
DESCRIPTION: This command adds authentication to the Amplify project using the Amplify CLI. The user is guided through configuring the authentication method, defaulting to email.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_4

LANGUAGE: bash
CODE:

```
amplify add auth
```

---

TITLE: Push Amplify project to cloud
DESCRIPTION: This command pushes the Amplify project to the cloud, deploying the configured resources, including the authentication resource, to the AWS environment.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_6

LANGUAGE: bash
CODE:

```
amplify push
```

---

TITLE: Define page metadata - JavaScript
DESCRIPTION: Defines metadata for the page, including the title, description, and supported platforms. This metadata is used for SEO and to generate static paths.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/concepts/streaming/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:

```
export const meta = {
  title: "Streaming",
  description:
    "Learn about how streaming works with LLMs and the Amplify AI kit",
  platforms: [
    "javascript",
    "react-native",
    "angular",
    "nextjs",
    "react",
    "vue",
  ],
};
```

---

TITLE: Configuring AWS Amplify Predictions with Translation, Speech, and Text Analytics in JavaScript
DESCRIPTION: This extensive configuration sets up the Amplify Predictions category with convert, identify, and interpret services. It defines parameters for text translation, speech generation, transcription, text identification, entity and label recognition, and text interpretation. Each service includes region, proxy flag, and defaults for languages, voice, formats, collections, and other options as applicable. The Auth section provides required identity pool and region information. This configuration enables use of AWS AI services such as Translate, Polly, Transcribe, Rekognition, Comprehend, and others via Amplify Predictions.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/client-configuration/js/js-configuration.mdx#_snippet_8

LANGUAGE: JavaScript
CODE:

```
Amplify.configure({
  Auth: {
    identityPoolId: 'us-east-1:xxx-xxx-xxx-xxx-xxx', // (required) - Amazon Cognito Identity Pool ID
    region: 'us-east-1' // (required)- Amazon Cognito Region
  },
  predictions: {
    convert: {
      translateText: {
        region: 'us-east-1',
        proxy: false,
        defaults: {
          sourceLanguage: 'en',
          targetLanguage: 'zh'
        }
      },
      speechGenerator: {
        region: 'us-east-1',
        proxy: false,
        defaults: {
          VoiceId: 'Ivy',
          LanguageCode: 'en-US'
        }
      },
      transcription: {
        region: 'us-east-1',
        proxy: false,
        defaults: {
          language: 'en-US'
        }
      }
    },
    identify: {
      identifyText: {
        proxy: false,
        region: 'us-east-1',
        defaults: {
          format: 'PLAIN'
        }
      },
      identifyEntities: {
        proxy: false,
        region: 'us-east-1',
        celebrityDetectionEnabled: true,
        defaults: {
          collectionId: 'identifyEntities8b89c648-test',
          maxEntities: 50
        }
      },
      identifyLabels: {
        proxy: false,
        region: 'us-east-1',
        defaults: {
          type: 'LABELS'
        }
      }
    },
    interpret: {
      interpretText: {
        region: 'us-east-1',
        proxy: false,
        defaults: {
          type: 'ALL'
        }
      }
    }
  }
});
```

---

TITLE: Install Amplify Client Libraries (JavaScript/Vue/Angular)
DESCRIPTION: This command installs the core Amplify client library for JavaScript, Vue, and Angular projects. The dependency is aws-amplify.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_4

LANGUAGE: bash
CODE:

```
npm add aws-amplify
```

---

TITLE: Integrating AIConversation with Amplify Backend (TSX)
DESCRIPTION: Provides a comprehensive example of integrating the AIConversation component with a full AWS Amplify backend. It shows how to configure Amplify, generate an API client, use the `createAIHooks` and `useAIConversation` hook to manage conversation state, and wrap the component with the `<Authenticator>` for user authentication. Requires `aws-amplify`, `@aws-amplify/ui-react`, and `@aws-amplify/ui-react-ai`.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/ai-conversation/index.mdx#_snippet_1

LANGUAGE: tsx
CODE:

```
import { Amplify } from 'aws-amplify';
import { generateClient } from "aws-amplify/api";
import { Authenticator } from "@aws-amplify/ui-react";
import { AIConversation, createAIHooks } from '@aws-amplify/ui-react-ai';
import '@aws-amplify/ui-react/styles.css';
import outputs from "../amplify_outputs.json";
import { Schema } from "../amplify/data/resource";

Amplify.configure(outputs);

const client = generateClient<Schema>({ authMode: "userPool" });
const { useAIConversation } = createAIHooks(client);

export default function App() {
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation('chat');
  // 'chat' is based on the key for the conversation route in your schema.

  return (
    <Authenticator>
      <AIConversation
        messages={messages}
        isLoading={isLoading}
        handleSendMessage={handleSendMessage}
      />
    </Authenticator>
  );
}
```

---

TITLE: Registering End of Chat Callback with AWS Amplify Interactions (TypeScript)
DESCRIPTION: This snippet illustrates registering a function via the onComplete() method to handle the end of a chatbot session in an application using AWS Amplify Interactions. The callback receives an optional error or a completion object, allowing developers to alert users or process results when the session concludes. Dependencies are @aws-amplify/interactions and a configured Amplify bot. Key parameters include botName and a callback function with error and completion arguments. Inputs are handled through the callback; outputs can trigger alerts or handle completion logic. Ensure the bot is properly configured in Amplify before use.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/add-aws-services/interactions/chatbot/index.mdx#_snippet_1

LANGUAGE: typescript
CODE:

```
import { Interactions } from '@aws-amplify/interactions';

Interactions.onComplete({
  botName: "TheBotName",
  callback: (error?: Error, completion?: {[key: string]: any}) => {
     if (error) {
        alert('bot conversation failed');
     } else if (completion) {
        console.debug('done: ' + JSON.stringify(completion, null, 2));
        alert('Trip booked. Thank you! What would you like to do next?');
     }
  }
});
```

---

TITLE: Static Props Configuration
DESCRIPTION: The `getStaticProps` function configures the static props for each documentation page. It receives the `context` object, extracts the platform parameter from `context.params`, and passes both the platform and the metadata to the page as props. This enables dynamic content rendering based on the selected platform.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/more-features/interactions/chatbot/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:

```
export function getStaticProps(context) {
  return {
    props: {
      platform: context.params.platform,
      meta
    }
  };
}
```

---

TITLE: Initialize Amplify project
DESCRIPTION: This command initializes an Amplify project in the current directory. The user is prompted to enter a name for the project and confirms the default configuration.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_2

LANGUAGE: bash
CODE:

```
amplify init
```

---

TITLE: Client Request to Extract Product Details from Text with AWS Amplify API
DESCRIPTION: Demonstrates how to instantiate a client and send a request to extract structured product details from a description string using the generated schema. Provides an example product description and the expected structured response, requiring 'aws-amplify/api' and type definitions.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/generation/data-extraction/index.mdx#_snippet_1

LANGUAGE: typescript
CODE:

```
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/api";

export const client = generateClient<Schema>();

const productDescription = `The NBA Official Game Basketball is a premium
regulation-size basketball crafted with genuine leather and featuring
official NBA specifications. This professional-grade ball offers superior grip
and durability, with deep channels and a moisture-wicking surface that ensures
consistent performance during intense game play. Priced at $159.99, this high-end
basketball belongs in our Professional Sports Equipment category and is the same model
used in NBA games.`

const { data, errors } = await client.generations
  .extractProductDetails({ productDescription })

/*
Example response:
{
  "name": "NBA Official Game Basketball",
  "summary": "Premium regulation-size NBA basketball made with genuine leather. Features official NBA specifications, superior grip, deep channels, and moisture-wicking surface for consistent game play performance.",
  "price": 159.99,
  "category": "Professional Sports Equipment"
}
*/
```

---

TITLE: Generate static paths - JavaScript
DESCRIPTION: Asynchronously generates static paths using the `getCustomStaticPath` function and the platforms defined in the `meta` object. This function is used during the build process to pre-render pages for each supported platform.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/concepts/streaming/index.mdx#_snippet_2

LANGUAGE: javascript
CODE:

```
export const getStaticPaths = async () => {
  return getCustomStaticPath(meta.platforms);
};
```

---

TITLE: Manually Configure AWS Amplify Predictions (JavaScript)
DESCRIPTION: JavaScript code demonstrating how to manually configure the AWS Amplify library to use existing AWS AI/ML resources for Predictions. This requires specifying resource details like region, Identity Pool ID, and service-specific parameters.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/js/getting-started.mdx#_snippet_6

LANGUAGE: javascript
CODE:

```
import { Amplify } from 'aws-amplify';

Amplify.configure({
  // To get the AWS Credentials, you need to configure
  // the Auth module with your Cognito Federated Identity Pool
  Auth: {
    identityPoolId: 'us-east-1:xxx-xxx-xxx-xxx-xxx',
    region: 'us-east-1'
  },
  Predictions: {
    convert: {
      translateText: {
        region: 'us-east-1',
        proxy: false,
        defaults: {
          sourceLanguage: 'en',
          targetLanguage: 'zh'
        }
      },
      speechGenerator: {
        region: 'us-east-1',
        proxy: false,
        defaults: {
          VoiceId: 'Ivy',
          LanguageCode: 'en-US'
        }
      },
      transcription: {
        region: 'us-east-1',
        proxy: false,
        defaults: {
          language: 'en-US'
        }
      }
    },
    identify: {
      identifyText: {
        proxy: false,
        region: 'us-east-1',
        defaults: {
          format: 'PLAIN'
        }
      },
      identifyEntities: {
        proxy: false,
        region: 'us-east-1',
        celebrityDetectionEnabled: true,
        defaults: {
          collectionId: 'identifyEntities8b89c648-test',
          maxEntities: 50
        }
      },
      identifyLabels: {
        proxy: false,
        region: 'us-east-1',
        defaults: {
          type: 'LABELS'
        }
      }
    },
    interpret: {
      interpretText: {
        region: 'us-east-1',
        proxy: false,
        defaults: {
          type: 'ALL'
        }
      }
    }
  }
});
```

---

TITLE: IAM Policy for LexV1 Access - JSON
DESCRIPTION: This JSON snippet defines an IAM policy that grants permissions for accessing Amazon Lex V1. It allows the actions `lex:PostText` and `lex:PostContent` on a specific Lex V1 bot alias. Replace `<Region>`, `<Account>`, `<BotName>`, and `<BotAlias>` with your actual values.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/interactions/js/getting-started.mdx#_snippet_4

LANGUAGE: json
CODE:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["lex:PostText", "lex:PostContent"],
      "Resource": "arn:aws:lex:<Region>:<Account>:bot:<BotName>:<BotAlias>"
    }
  ]
}
```

---

TITLE: Defining Knowledge Base Query and Chat Schema with AWS Amplify Backend in TypeScript
DESCRIPTION: Defines a backend schema using AWS Amplify's schema DSL that includes a 'knowledgeBase' query which accepts a string input and returns a string result. The query is connected to a custom handler resolver and requires authenticated access. Additionally, it defines a 'chat' conversational AI model named "Claude 3.5 Haiku" with a system prompt and integrates a data tool named 'searchDocumentation' that performs similarity searches by querying the 'knowledgeBase'. Required dependencies include '@aws-amplify/backend' and a custom resolver file.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/knowledge-base/index.mdx#_snippet_0

LANGUAGE: typescript
CODE:

```
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // highlight-start
  knowledgeBase: a
    .query()
    .arguments({ input: a.string() })
    .handler(
      a.handler.custom({
        dataSource: "KnowledgeBaseDataSource",
        entry: "./resolvers/kbResolver.js",
      }),
    )
    .returns(a.string())
    .authorization((allow) => allow.authenticated()),
  // highlight-end

  chat: a.conversation({
    aiModel: a.ai.model("Claude 3.5 Haiku"),
    systemPrompt: `You are a helpful assistant.`,
    // highlight-start
    tools: [
      a.ai.dataTool({
        name: 'searchDocumentation',
        description: 'Performs a similarity search over the documentation for ...',
        query: a.ref('knowledgeBase'),
      }),
    ]
    // highlight-end
  })
})
```

---

TITLE: Generating Recipe - Next.js Pages Router
DESCRIPTION: This Next.js Pages Router snippet demonstrates recipe generation, similar to the React example. It uses `useAIGeneration` to call the recipe generation API. It includes a text area for user input, a button to trigger the recipe generation and displays recipe details using components from `@aws-amplify/ui-react`. It also handles loading states using `<Loader>`. This example retrieves data from the client, and displays recipe information if available.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_15

LANGUAGE: TypeScript
CODE:

```
import { useAIGeneration } from "@/client";
import {
  Button,
  Flex,
  Heading,
  Loader,
  Text,
  TextAreaField,
  View,
} from "@aws-amplify/ui-react";
import React from "react";

export default function Page() {
  const [description, setDescription] = React.useState("");
  const [{ data, isLoading, hasError }, generateRecipe] =
    useAIGeneration("generateRecipe");

  const handleClick = async () => {
    generateRecipe({ description });
  };

  return (
    <Flex direction="column">
      <Flex direction="row">
        <TextAreaField
          autoResize
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label="Description"
        />
        <Button onClick={handleClick}>Generate recipe</Button>
      </Flex>
      {isLoading ? (
        <Loader variation="linear" />
      ) : (
        <>
          <Text fontWeight="bold">{data?.name}</Text>
          <View as="ul">
            {data?.ingredients?.map((ingredient) => (
              <View as="li" key={ingredient}>
                {ingredient}
              </View>
            ))}
          </View>
          <Text>{data?.instructions}</Text>
        </>
      )}
    </Flex>
  );
}
```

---

TITLE: Generating Recipe - React
DESCRIPTION: This React snippet shows how to generate a recipe based on a user-provided description using the `useAIGeneration` hook. The `description` state holds the user input. The `handleClick` function triggers the recipe generation. The UI includes a text area for description input, a button to trigger generation, and displays the recipe name, ingredients, and instructions when available. It utilizes components from `@aws-amplify/ui-react` for the UI elements.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_14

LANGUAGE: TypeScript
CODE:

```
import * as React from 'react';
import { Flex, TextAreaField, Loader, Text, View, Button } from "@aws-amplify/ui-react"
import { useAIGeneration } from "./client";

export default function App() {
  const [description, setDescription] = React.useState("");
  const [{ data, isLoading }, generateRecipe] =
    useAIGeneration("generateRecipe");

  const handleClick = async () => {
    generateRecipe({ description });
  };

  return (
    <Flex direction="column">
      <Flex direction="row">
        <TextAreaField
          autoResize
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label="Description"
        />
        <Button onClick={handleClick}>Generate recipe</Button>
      </Flex>
      {isLoading ? (
        <Loader variation="linear" />
      ) : (
        <>
          <Text fontWeight="bold">{data?.name}</Text>
          <View as="ul">
            {data?.ingredients?.map((ingredient) => (
              <View as="li" key={ingredient}>
                {ingredient}
              </View>
            ))}
          </View>
          <Text>{data?.instructions}</Text>
        </>
      )}
    </Flex>
  );
}
```

---

TITLE: Updating Backend Definition with Custom Handler - TypeScript
DESCRIPTION: This code snippet shows how to update the Amplify backend definition to include the newly defined `chatHandler` function. It imports the handler and includes it in the `defineBackend` configuration, along with other backend resources like `auth` and `data`.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/tools/index.mdx#_snippet_7

LANGUAGE: typescript
CODE:

```
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data, chatHandler } from './data/resource';

defineBackend({
  auth,
  data,
  chatHandler,
});
```

---

TITLE: Displaying Information Callout with AWS Amplify UI (React)
DESCRIPTION: Illustrates the use of the `@aws-amplify/ui-react` Callout component to display highlighted information within the document. The `type="info"` prop specifies the styling, and the content contains a crucial note about region availability with a relevant link.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/concepts/models/index.mdx#_snippet_2

LANGUAGE: JSX
CODE:

```
<Callout type="info">
  Your Amplify project must be deployed to a region where the foundation model you specify is available. See [Bedrock model support](https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html) for the supported regions per model.
</Callout>
```

---

TITLE: Detecting Text in a Browser File with AWS Amplify Predictions - JavaScript
DESCRIPTION: Detects text in an input image file provided by the browser using the Predictions.identify API from @aws-amplify/predictions. After importing Predictions, the snippet sends the file to the API and logs the results. Requires the Amplify backend to be initialized with appropriate predictions resources. The 'file' parameter is expected to be a browser File object; results include recognized text data structures depending on the enabled format.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/js/identify-text.mdx#_snippet_1

LANGUAGE: javascript
CODE:

```
import { Predictions } from '@aws-amplify/predictions';

const response = await Predictions.identify({
  text: {
    source: {
      file
    }
  }
});
console.log({ response });
```

---

TITLE: Amplify authentication configuration prompts
DESCRIPTION: These prompts configure authentication through the Amplify CLI. They determine the authentication provider (Cognito), sign-in method (email), and whether to configure advanced settings.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_5

LANGUAGE: bash
CODE:

```
Using service: Cognito, provided by: awscloudformation

 The current configured provider is Amazon Cognito.

 Do you want to use the default authentication and security configuration? _**Default configuration**_
 Warning: you will not be able to edit these selections.
 How do you want users to be able to sign in? _**Email**_
 Do you want to configure advanced settings? _**No, I am done.**_
```

---

TITLE: Defining responseComponents prop in AIConversation component
DESCRIPTION: Shows how to specify custom React components with descriptions and props for AI responses in a React application. The responseComponents object maps component names to their definitions, each including a description, the React component, and the expected props schema.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/response-components/index.mdx#_snippet_0

LANGUAGE: TypeScript
CODE:

```
<AIConversation
  // highlight-start
  responseComponents={{
    WeatherCard: {
      description: "Used to display the weather to the user",
      component: ({ city }) => {
        return (
          <div>{city}</div>
        )
      },
      props: {
        city: {
          type: "string",
          required: true,
          description: "The name of the city to display the weather for",
        },
      },
    },
  }}
  // highlight-end
/>
```

---

TITLE: Configuring Next.js Static Generation for Documentation Page
DESCRIPTION: This JavaScript code sets up metadata and static generation functions for a Next.js documentation page. It defines the page title, description, and supported platforms (`javascript`, `react-native`, etc.). It uses `getCustomStaticPath` to create paths for each platform and `getStaticProps` to pass platform-specific data and metadata to the page component.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/concepts/tools/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:

```
import { getCustomStaticPath } from "@/utils/getCustomStaticPath";

export const meta = {
  title: "Tools",
  description:
    "Amplify AI Concepts: Tool use",
  platforms: [
    "javascript",
    "react-native",
    "angular",
    "nextjs",
    "react",
    "vue",
  ],
};

export const getStaticPaths = async () => {
  return getCustomStaticPath(meta.platforms);
};

export function getStaticProps(context) {
  return {
    props: {
      platform: context.params.platform,
      meta,
    },
  };
}
```

---

TITLE: GraphQL Query Example for Label Detection from S3 Image using AWS Amplify (GraphQL)
DESCRIPTION: GraphQL query example for invoking label detection, passing an input object with the identifyLabels key pointing to an image stored at 'public/myimage.jpg' in the S3 bucket. Returns a list of recognized labels as strings from Amazon Rekognition. This query format corresponds to the schema defined using the @predictions directive.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/connect-machine-learning-services/index.mdx#_snippet_3

LANGUAGE: graphql
CODE:

```
query RecognizeLabelsFromImage($input: RecognizeLabelsFromImageInput!) {
  recognizeLabelsFromImage(input: { identifyLabels: { key: "myimage.jpg" } })
}
```

---

TITLE: Getting user authentication credentials on the server
DESCRIPTION: Code to retrieve the current user's authentication credentials using Amplify Auth.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_16

LANGUAGE: js
CODE:

```
const credentials = await SSR.Auth.currentCredentials();
```

---

TITLE: Importing Platform-Specific Documentation Fragments in JavaScript
DESCRIPTION: Imports markdown documentation fragments for each supported platform. These fragments contain the actual Delete API REST documentation specific to each platform's implementation.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/delete-data/index.mdx#_snippet_3

LANGUAGE: javascript
CODE:

```
import android_delete from '/src/fragments/lib/restapi/android/delete.mdx';
import flutter_delete from '/src/fragments/lib/restapi/flutter/delete.mdx';
import ios_delete from '/src/fragments/lib/restapi/ios/delete.mdx';
import js_delete from '/src/fragments/lib/restapi/js/delete.mdx';
```

---

TITLE: Defining Metadata in JavaScript
DESCRIPTION: Sets up the page's metadata including title, description, and supported platforms for the REST API Delete functionality in Amplify.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/delete-data/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:

```
export const meta = {
  title: 'Delete data',
  description: 'Using the Delete API REST in Amplify',
  platforms: [
    'javascript',
    'react-native',
    'flutter',
    'swift',
    'android',
    'angular',
    'nextjs',
    'react',
    'vue'
  ]
};
```

---

TITLE: Generating Static Paths for Platform-Specific Documentation in Next.js
DESCRIPTION: Implements the getStaticPaths function for Next.js static site generation. It calls a utility function to generate paths for each supported platform.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/interactions/chatbot/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:

```
export const getStaticPaths = async () => {
  return getCustomStaticPath(meta.platforms);
};
```

---

TITLE: Invoke Custom Query with Amplify Data Client in TypeScript
DESCRIPTION: Demonstrates how to call the `generateHaiku` custom query from a frontend application using the generated Amplify Data client. The client call is asynchronous and passes the user's `prompt` as an argument, returning the data and potential errors.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/custom-business-logic/connect-bedrock/index.mdx#_snippet_6

LANGUAGE: TypeScript
CODE:

```
const { data, errors } = await client.queries.generateHaiku({
  prompt: "Frank Herbert's Dune",
});
```

---

TITLE: Start Amplify Sandbox
DESCRIPTION: This command starts the Amplify sandbox environment, provisioning cloud resources defined in the amplify folder and watching for updates to redeploy them.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_1

LANGUAGE: bash
CODE:

```
npx ampx sandbox
```

---

TITLE: Translating Text with Amplify Kotlin Callbacks
DESCRIPTION: This Kotlin code snippet shows how to translate text using Amplify Predictions with callback functions. The input text "I like to eat spaghetti" is translated and the translated text is logged on success. Errors are logged to the console if the translation fails. The `Amplify` object is used for the API calls.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/android/translate.mdx#_snippet_1

LANGUAGE: kotlin
CODE:

```
Amplify.Predictions.translateText("I like to eat spaghetti",
    { Log.i("MyAmplifyApp", it.translatedText) },
    { Log.e("MyAmplifyApp", "Translation failed", it) }
)
```

---

TITLE: Handling Session Completion Events with AWS Lex V1 Bot - TypeScript
DESCRIPTION: This code registers a completion handler for AWS Lex V1 chatbot sessions using Amplify Interactions (Lex V1 path) in TypeScript. The onComplete method accepts botName and callback, where the callback distinguishes errors from successful completion. It shows alerts and logs accordingly. Required dependency is '@aws-amplify/interactions/lex-v1' and TypeScript support. Main inputs: botName and callback; outputs: error handling or completion info. Recommended for Lex V1 only; consider migrating to V2.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/interactions/js/chatbot.mdx#_snippet_3

LANGUAGE: typescript
CODE:

```
import { Interactions as InteractionsLexV1 } from '@aws-amplify/interactions/lex-v1';

InteractionsLexV1.onComplete({
  botName: "TheBotName",
  callback: (error?: Error, completion?: {[key: string]: any}) => {
     if (error) {
        alert('bot conversation failed');
     } else if (completion) {
        console.debug('done: ' + JSON.stringify(completion, null, 2));
        alert('Trip booked. Thank you! What would you like to do next?');
     }
  }
});
```

---

TITLE: Define Lambda Function and Custom Query for Amazon Bedrock - TypeScript
DESCRIPTION: This code snippet defines a Lambda function (`generateHaikuFunction`) using `@aws-amplify/backend` and sets up a custom GraphQL query named `generateHaiku` that leverages this function to interact with Amazon Bedrock. It uses the `a.handler.function()` modifier to associate the function with the query.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/custom-business-logic/connect-bedrock/index.mdx#_snippet_2

LANGUAGE: typescript
CODE:

```
import {
  type ClientSchema,
  a,
  defineData,
  defineFunction,
} from "@aws-amplify/backend";

export const MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0";

export const generateHaikuFunction = defineFunction({
  entry: "./generateHaiku.ts",
  environment: {
    MODEL_ID,
  },
});

const schema = a.schema({
  generateHaiku: a
    .query()
    .arguments({ prompt: a.string().required() })
    .returns(a.string())
    .authorization((allow) => [allow.publicApiKey()])
    .handler(a.handler.function(generateHaikuFunction)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
```

---

TITLE: Defining Drink Water Function with Natural Language (TypeScript)
DESCRIPTION: This snippet repeats the 'drinkSomeWater' function declaration, using natural language to define its schedule. The function is scheduled to run every 1 hour using `defineFunction`. It demonstrates the flexibility of using natural language for scheduling.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/functions/scheduling-functions/index.mdx#_snippet_6

LANGUAGE: TypeScript
CODE:

```
import { defineFunction } from "@aws-amplify/backend";

export const drinkSomeWater = defineFunction({
  name: "drink-some-water",
  schedule: "every 1h"
})
```

---

TITLE: Update IAM Policy for Amazon Lex access
DESCRIPTION: This JSON snippet shows the required IAM policy that grants Amplify Interactions the permissions to use Amazon Lex. It allows 'lex:RecognizeText' and 'lex:RecognizeUtterance' actions on the specified Lex bot resource. Replace the placeholders with the actual region, account ID, bot ID, and bot alias ID.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/add-aws-services/interactions/set-up-interactions/index.mdx#_snippet_0

LANGUAGE: json
CODE:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["lex:RecognizeText", "lex:RecognizeUtterance"],
      "Resource": "arn:aws:lex:<your-app-region>:<your-account-id>:bot-alias/<your-bot-id>/<your-bot-alias-id>"
    }
  ]
}
```

---

TITLE: Rendering Basic AIConversation Component (TSX)
DESCRIPTION: Demonstrates the minimal setup required to render the AIConversation component in React/TSX. It requires `messages` and `handleSendMessage` props, although in this mock example, they are empty or stubbed. This is useful for visual testing of the component's appearance without a live backend connection.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/ai-conversation/index.mdx#_snippet_0

LANGUAGE: tsx
CODE:

```
import { AIConversation } from '@aws-amplify/ui-react-ai';

export default function Chat() {
  return (
    <AIConversation
      messages={[]}
      handleSendMessage={() => {}}
    />
  )
}
```

---

TITLE: Import getCustomStaticPath function - JavaScript
DESCRIPTION: Imports the `getCustomStaticPath` function from the specified module. This function is likely used to generate static paths based on supported platforms.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/concepts/streaming/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:

```
import { getCustomStaticPath } from "@/utils/getCustomStaticPath";
```

---

TITLE: Sending aiContext with Message - React Native
DESCRIPTION: This code snippet shows how to send aiContext with a message in a React Native application using the useAIConversation hook. The aiContext includes the current time and is passed as part of the message object.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/context/index.mdx#_snippet_1

LANGUAGE: tsx
CODE:

```
export default function Chat() {
  const [
    {
      data: { messages },
      isLoading,
    },
    sendMessage,
  ] = useAIConversation('chat');

  function handleSendMessage(message) {
    sendMessage({
      ...message,
      // this can be any object that can be stringified
      aiContext: {
        currentTime: new Date().toLocaleTimeString()
      }
    })
  }

  return (
    //...
  )
}
```

---

TITLE: Detecting All Labels and Unsafe Content in an Image (JavaScript)
DESCRIPTION: This combined snippet demonstrates detecting multiple labels and unsafe content in a single API call. It sets the type to 'ALL', processes the labels array and unsafe boolean from the response, and requires '@aws-amplify/predictions'. It is useful for comprehensive image analysis in a single request.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/js/label-image.mdx#_snippet_3

LANGUAGE: JavaScript
CODE:

```
import { Predictions } from '@aws-amplify/predictions';

Predictions.identify({
  labels: {
    source: {
      file
    },
    type: 'ALL'
  }
})
  .then((response) => {
    const { labels } = response;
    const { unsafe } = response; // boolean
    labels.forEach((object) => {
      const { name, boundingBoxes } = object;
    });
  })
  .catch((err) => console.log({ err }));
```

---

TITLE: Generate Amplify Data Client with React Hooks (TS)
DESCRIPTION: This TypeScript code generates a type-safe Amplify data client and React hooks for AI interactions. It imports `generateClient`, the data schema, and `createAIHooks` from `@aws-amplify/ui-react-ai`. The client is configured for user pool authentication and the hooks are used for conversation and generation functionalities.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_12

LANGUAGE: typescript
CODE:

```
import { generateClient } from "aws-amplify/api";
import { Schema } from "../amplify/data/resource";
import { createAIHooks } from "@aws-amplify/ui-react-ai";

export const client = generateClient<Schema>({ authMode: "userPool" });
export const { useAIConversation, useAIGeneration } = createAIHooks(client);
```

---

TITLE: Generating Recipe - React Native
DESCRIPTION: This React Native snippet implements recipe generation, similar to the React example. It uses `useAIGeneration` to call the recipe generation API. It includes a text input for user description, and a button to trigger the recipe generation and displays recipe details in a similar format as the React examples using React Native components. It also handles loading states using `ActivityIndicator`. It is intended to be used in a React Native environment.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_17

LANGUAGE: TypeScript
CODE:

```
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useAIGeneration } from './client';

export default function Screen() {
  const [description, setDescription] = React.useState("");
  const [{ data, isLoading, hasError }, generateRecipe] =
    useAIGeneration("generateRecipe");

  const handleClick = () => {
    generateRecipe({ description });
  };

  return (
    <View>
        <TextInput
          autoResize
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label="Description"
        />
        <Button onClick={handleClick}>Generate recipe</Button>
      {isLoading ? (
        <Loader variation="linear" />
      ) : (
        <>
          <Heading level={2}>{data?.name}</Heading>
          <View as="ul">
            {data?.ingredients?.map((ingredient) => (
              <Text as="li" key={ingredient}>
                {ingredient}
              </Text>
            ))}
          </View>
          <Text>{data?.instructions}</Text>
        </>
      )}
    </Flex>
  );
}
```

---

TITLE: IAM Policy for AWS Amplify Predictions Services (JSON)
DESCRIPTION: Example AWS IAM policy document granting permissions for the various Amazon AI/ML services used by the Amplify Predictions category. This policy should be attached to the roles (e.g., authenticated users) that need to access these backend services.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/js/getting-started.mdx#_snippet_7

LANGUAGE: json
CODE:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "translate:TranslateText",
        "polly:SynthesizeSpeech",
        "transcribe:StartStreamTranscriptionWebSocket",
        "comprehend:DetectSentiment",
        "comprehend:DetectEntities",
        "comprehend:DetectDominantLanguage",
        "comprehend:DetectSyntax",
        "comprehend:DetectKeyPhrases",
        "rekognition:DetectFaces",
        "rekognition:RecognizeCelebrities",
        "rekognition:DetectLabels",
        "rekognition:DetectModerationLabels",
        "rekognition:DetectText",
        "rekognition:DetectLabel",
        "textract:AnalyzeDocument",
        "textract:DetectDocumentText",
        "textract:GetDocumentAnalysis",
        "textract:StartDocumentAnalysis",
        "textract:StartDocumentTextDetection",
        "rekognition:SearchFacesByImage"
      ],
      "Resource": ["*"]
    }
  ]
}
```

---

TITLE: Amplify project initialization prompts
DESCRIPTION: These prompts appear during the Amplify project initialization process. They gather necessary project settings, like project name, environment, editor, app type, framework, source/distribution paths, build command, and start command. Finally, the user must confirm these settings.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_3

LANGUAGE: bash
CODE:

```
? Enter a name for the project amplify-gen-ai
The following configuration will be applied:

Project information
| Name: amplify-gen-ai
| Environment: dev
| Default editor: Visual Studio Code
| App type: javascript
| Javascript framework: react
| Source Directory Path: src
| Distribution Directory Path: build
| Build Command: npm run-script build
| Start Command: npm run-script start
? Initialize the project with the above configuration? Yes
```

---

TITLE: Using OR Operator for Filtering in JavaScript Frameworks
DESCRIPTION: Demonstrates importing predicate snippets that utilize the 'or' logical operator to filter models with alternative conditions, across frameworks.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/datastore/native_common/data-access.mdx#_snippet_41

LANGUAGE: MDX
CODE:

```
import js26 from '/src/fragments/lib/datastore/lib/data-access/query-predicate-or-snippet.mdx';
```

---

TITLE: Interpreting Text (Sentiment) - Java Callbacks
DESCRIPTION: Shows how to use the `Amplify.Predictions.interpret` method in Java to analyze a given text string using asynchronous callbacks. The success callback extracts the sentiment value from the result and logs it, while the error callback logs any failure during the interpretation process. This method is suitable for integrating text analysis into Java applications, typically Android.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/android/interpret.mdx#_snippet_1

LANGUAGE: Java
CODE:

```
Amplify.Predictions.interpret(
        "I like to eat spaghetti",
        result -> Log.i("MyAmplifyApp", result.getSentiment().getValue().toString()),
        error -> Log.e("MyAmplifyApp", "Interpret failed", error)
);
```

---

TITLE: Configure Amplify with SSR support
DESCRIPTION: This code configures Amplify with the awsconfig and enables server-side rendering (SSR) support for Next.js. SSR: true allows Amplify code to run on the server.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_10

LANGUAGE: javascript
CODE:

```
Amplify.configure({
  ...awsconfig,
  // this lets you run Amplify code on the server-side in Next.js
  ssr: true
});
```

---

TITLE: Displaying AIConversation Welcome Message (TSX)
DESCRIPTION: Explains how to add a custom welcome message that appears when the AIConversation component is first loaded and there are no existing messages. The message is provided as a React Node via the `welcomeMessage` prop and disappears once a user sends a message. This allows for providing initial instructions or greetings. Requires `@aws-amplify/ui-react` components like `Card` and `Text` or any other React Node.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/ai-conversation/index.mdx#_snippet_5

LANGUAGE: tsx
CODE:

```
<AIConversation
  welcomeMessage={
    <Card variation="outlined">
      <Text>I am your virtual assistant, ask me any questions you like!</Text>
    </Card>
  }
/>
```

---

TITLE: Implementing getStaticProps for Next.js Static Site Generation
DESCRIPTION: Defines the getStaticProps function that retrieves child page nodes for the current route and returns them as props along with platform and meta information.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/predictions/index.mdx#_snippet_2

LANGUAGE: JavaScript
CODE:

```
export function getStaticProps(context) {
  const childPageNodes = getChildPageNodes(meta.route);
  return {
    props: {
      platform: context.params.platform,
      meta,
      childPageNodes
    }
  };
}
```

---

TITLE: Install Amplify Client Libraries (React/Next.js/React Native)
DESCRIPTION: This command installs the necessary Amplify client libraries for React, Next.js, and React Native projects, including UI components and AI integrations. Dependencies include aws-amplify, @aws-amplify/ui-react, and @aws-amplify/ui-react-ai.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_3

LANGUAGE: bash
CODE:

```
npm add aws-amplify @aws-amplify/ui-react @aws-amplify/ui-react-ai
```

---

TITLE: Fetching Static Props with Next.js (JavaScript)
DESCRIPTION: Exports a function `getStaticProps` used by Next.js to fetch data needed for pre-rendering the page at build time. It calls `getChildPageNodes` using the route from the `meta` object to fetch related page data and returns an object containing props (`meta` and `childPageNodes`) that will be passed to the page component.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/index.mdx#_snippet_3

LANGUAGE: javascript
CODE:

```
export function getStaticProps(context) {
  const childPageNodes = getChildPageNodes(meta.route);
  return {
    props: {
      meta,
      childPageNodes
    }
  };
}
```

---

TITLE: Identifying Plain Text in an Image with Amplify Predictions - JavaScript
DESCRIPTION: Extracts unstructured plain text from an image file using the Predictions.identify API in JavaScript. The 'format' parameter is set to 'PLAIN' to retrieve the detected lines, words, and their bounding coordinates, as well as the full recognized text. Dependencies include an initialized Amplify project with Predictions configured, and input must be a valid image file object. The output structure provides detailed positional metadata for lines and words.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/js/identify-text.mdx#_snippet_3

LANGUAGE: javascript
CODE:

```
import { Predictions } from '@aws-amplify/predictions';

const response = await Predictions.identify({
  text: {
    source: {
      file
    },
    format: 'PLAIN'
  }
});

const {
  text: {
    fullText, // String
    lines, // Array of String ordered from top to bottom
    linesDetailed /* Array of objects that contains
        text, // String
        boundingBox: {
          width, // ratio of overall image width
          height, // ratio of overall image height
          left, // left coordinate as a ratio of overall image width
          top // top coordinate as a ratio of overall image height
        },
        polygon // Array of { x, y } coordinates as a ratio of overall image width and height
        */,
    words // Array of objects that contains { text, boundingBox, polygon}
  }
} = response;
```

---

TITLE: Overriding Language with Amplify Kotlin Coroutines
DESCRIPTION: This Kotlin code snippet uses Coroutines for text translation with the Amplify Predictions API, overriding the default languages. It translates the input text "I like to eat spaghetti" from English to Russian using `ENGLISH` and `RUSSIAN` constants. Error handling is achieved using a `try-catch` block. Requires language constants to be defined.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/android/translate.mdx#_snippet_6

LANGUAGE: kotlin
CODE:

```
val text = "I like to eat spaghetti"
try {
    val result = Amplify.Predictions.translateText(text, ENGLISH, RUSSIAN)
    Log.i("MyAmplifyApp", result.translatedText)
} catch (error: PredictionsException) {
    Log.e("MyAmplifyApp", "Translation failed", error)
}
```

---

TITLE: Translation Output Example
DESCRIPTION: Sample console output showing the result of the translation from English to Italian. This shows what developers can expect when running the translation code.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/android/translate.mdx#_snippet_5

LANGUAGE: console
CODE:

```
I/MyAmplifyApp: Mi piace mangiare gli spaghetti
```

---

TITLE: IAM Policy for Amplify Predictions Services (JSON)
DESCRIPTION: Provides an example AWS IAM policy defining the permissions required for the various AI/ML services utilized by the Amplify Predictions category (e.g., Translate, Polly, Rekognition, Comprehend, Textract). This policy should be attached to the appropriate IAM Role (typically associated with a Cognito Identity Pool) when manually configuring Predictions or ensuring correct permissions. The `Resource` field can be scoped down for enhanced security.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/getting-started.mdx#_snippet_4

LANGUAGE: json
CODE:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "translate:TranslateText",
        "polly:SynthesizeSpeech",
        "transcribe:StartStreamTranscriptionWebSocket",
        "comprehend:DetectSentiment",
        "comprehend:DetectEntities",
        "comprehend:DetectDominantLanguage",
        "comprehend:DetectSyntax",
        "comprehend:DetectKeyPhrases",
        "rekognition:DetectFaces",
        "rekognition:RecognizeCelebrities",
        "rekognition:DetectLabels",
        "rekognition:DetectModerationLabels",
        "rekognition:DetectText",
        "rekognition:DetectLabel",
        "textract:AnalyzeDocument",
        "textract:DetectDocumentText",
        "textract:GetDocumentAnalysis",
        "textract:StartDocumentAnalysis",
        "textract:StartDocumentTextDetection",
        "rekognition:SearchFacesByImage"
      ],
      "Resource": ["*"]
    }
  ]
}
```

---

TITLE: Identifying Text from File: Amplify JavaScript
DESCRIPTION: Shows the basic JavaScript code using Amplify Predictions to detect text from an image file provided directly from the browser. It utilizes the `Predictions.identify` method with the `text` configuration, specifying the source as a local `file` object. The call returns a Promise that resolves with the identification results or rejects with an error.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/identify-text.mdx#_snippet_1

LANGUAGE: javascript
CODE:

```
Predictions.identify({
  text: {
    source: {
      file
    }
  }
})
.then(response => console.log({ response }))
.catch(err => console.log({ err }));
```

---

TITLE: Providing Static Props for Amplify Documentation Pages in JavaScript
DESCRIPTION: This function retrieves parameters from the Next.js context argument to provide necessary props for static documentation pages. It assigns the selected platform and page metadata as properties on the returned object, which will be injected into the page at build time. The function requires the incoming context to include URL parameters with a "platform" key; no external dependencies are required beyond previously defined items.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/concepts/architecture/index.mdx#_snippet_2

LANGUAGE: javascript
CODE:

```
export function getStaticProps(context) {
  return {
    props: {
      platform: context.params.platform,
      meta,
    },
  };
}
```

---

TITLE: Creating Amplify Predictions Backend (Bash)
DESCRIPTION: Initializes the Amplify Predictions category within your project using the Amplify CLI. This command interactively guides you through configuring AI/ML use cases and sets up the necessary backend resources, including Auth. Requires the Amplify CLI to be installed and configured.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/getting-started.mdx#_snippet_0

LANGUAGE: bash
CODE:

```
amplify add predictions
```

---

TITLE: Simulating a GET Request with Query Parameters - Amplify Mock - Console
DESCRIPTION: This example illustrates the HTTP verb and path required to test a GET method with a limit query parameter using the Amplify Mock tool. It is typically paired with mocking workflows, not an executable command by itself. No dependencies. Shown for context in integration testing.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/test-api/index.mdx#_snippet_5

LANGUAGE: console
CODE:

```
GET /todos?limit=10

```

---

TITLE: Registering Response Components in AIConversation - React TypeScript
DESCRIPTION: Demonstrates how to register a custom response component named WeatherCard with the AIConversation component in a React (TypeScript) application. The WeatherCard receives a city string prop and displays it within a Card component. The 'responseComponents' prop of AIConversation defines the component's description, expected props, and the render function. Requires the React framework and the Card component to be available. The city prop is required and must be a string; on rendering, the specified city is shown.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/ai-conversation/index.mdx#_snippet_9

LANGUAGE: TSX
CODE:

```
<AIConversation
  responseComponents={{
    WeatherCard: {
      description: 'Used to display the weather of a given city to the user',
      component: ({ city }) => {
        return <Card>{city}</Card>;
      },
      props: {
        city: {
          type: 'string',
          required: true,
        },
      },
    },
  }}
/>
```

---

TITLE: Listing User Conversations in Amplify AI (TypeScript)
DESCRIPTION: This snippet demonstrates how to retrieve a list of all conversations associated with the currently authenticated user using the Amplify client's `.list()` method. The conversations are sorted by `updatedAt` in descending order.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/history/index.mdx#_snippet_0

LANGUAGE: typescript
CODE:

```
const { data: conversations } = await client.conversations.chat.list()
```

---

TITLE: Providing a Fallback Response Component in AIConversation - React TypeScript
DESCRIPTION: Illustrates how to implement a fallback UI using the FallbackResponseComponent prop for the AIConversation component in React (TypeScript). If the AIConversation encounters a response component in the conversation history that is not registered, this fallback will render a Card component showing the failed props as formatted JSON. Requires React and the Card component. The fallback receives unknown props and converts them into a readable string; no assumptions are made about the prop structure.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/ai-conversation/index.mdx#_snippet_10

LANGUAGE: TSX
CODE:

```
<AIConversation
  FallbackResponseComponent={(props) => (
    <Card variation="outlined">{JSON.stringify(props, null, 2)}</Card>
  )}
/>
```

---

TITLE: Detect entities from ArrayBuffer (Amplify Predictions)
DESCRIPTION: This JavaScript snippet demonstrates how to use the `Predictions.identify()` method to detect entities from an image represented as an ArrayBuffer. It sends the ArrayBuffer object as the source, which is especially useful for handling base64 encoded images or data from webcam sources, and logs the response or any errors.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/identify-entity.mdx#_snippet_4

LANGUAGE: javascript
CODE:

```
Predictions.identify({
  entities: {
    source: {
      bytes: imageArrayBuffer,
    },
  }
})
.then((response) => console.log({ response }))
.catch(err => console.log({ err }));
```

---

TITLE: Configure Interactions - JavaScript
DESCRIPTION: This snippet configures the Interactions category, focusing on bot integrations. It covers both Lex V1 and V2 bots. For each bot version, it sets the bot-specific identifiers, and region settings for the associated Lex bot.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/tools/libraries/configure-categories/index.mdx#_snippet_7

LANGUAGE: javascript
CODE:

```
Amplify.configure({
  Interactions: {
    LexV1: {
      MyV1Bot: {
        alias: 'BotAlias',
        region: 'us-east-1'
      }
    },
    LexV2: {
      MyV2Bot: {
        botId: 'ABCDE12345',
        aliasId: 'BotAlias',
        localeId: 'localId',
        region: 'us-east-1'
      }
    }
  }
});
```

---

TITLE: Querying by Parent ID Predicate (Dart)
DESCRIPTION: Shows how to filter a list query to find all Post items associated with a specific Blog parent using a predicate. It constructs a ModelQueries.list request for Posts and filters them based on the BLOG attribute being equal to the parent Blog's ID.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/query-data/index.mdx#_snippet_32

LANGUAGE: Dart
CODE:

```
final blogId = blog.id;

final request = ModelQueries.list(
  Post.classType,
  where: Post.BLOG.eq(blogId),
);
final response = await Amplify.API.query(request: request).response;
final data = response.data?.items ?? <Post?>[];
```

---

TITLE: Configuring AWS Amplify Predictions Backend Using CLI Console Commands
DESCRIPTION: This snippet walks through CLI commands to initialize Amplify in the project, add authentication, and enable the Predictions category with the Interpret feature. It demonstrates selection choices required for enabling all text interpretation options (language, entity, keyphrase, sentiment, syntax) and setting access for auth and guest users. These commands prepare cloud resources and configuration files, including amplifyconfiguration.json, needed for the Predictions API.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/js/interpret.mdx#_snippet_0

LANGUAGE: console
CODE:

```
? What would you like to interpret? (Use arrow keys)
❯ Interpret Text
  Learn More

? What kind of interpretation would you like?
  Language
  Entity
  Keyphrase
  Sentiment
  Syntax
❯ All

? Who should have access? Auth and Guest users
```

---

TITLE: Identify Entities from Browser File (Amplify Predictions)
DESCRIPTION: This snippet shows how to use the `Predictions.identify` method to detect entities in an image provided as a browser `File` object. It requires the `@aws-amplify/predictions` library and returns a Promise resolving to the identification results.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/add-aws-services/predictions/identify-entity/index.mdx#_snippet_0

LANGUAGE: typescript
CODE:

```
import { Predictions } from '@aws-amplify/predictions';

const response = await Predictions.identify({
  entities: {
    source: {
      file,
    },
  }
});
```

---

TITLE: Configuring AWS Amplify Predictions for Label Detection and Unsafe Content Analysis
DESCRIPTION: This setup section details initializing AWS Amplify backend, adding prediction features, and updating configuration parameters to enable label detection and unsafe content identification. It emphasizes handling known issues and deploying resources via amplify push.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/js/label-image.mdx#_snippet_0

LANGUAGE: json
CODE:

```
"access": "auth | authAndGuest",
"type": "LABELS | UNSAFE | ALL"
```

---

TITLE: Setting up Translation Backend with Amplify CLI
DESCRIPTION: CLI commands to set up the Amplify Predictions translation backend. This creates a cloud resource that translates text from US English to Italian with access for both authenticated and guest users.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/android/translate.mdx#_snippet_0

LANGUAGE: console
CODE:

```
? Please select from one of the categories below
  `Convert`
? What would you like to convert? (Use arrow keys)
 `Translate text into a different language`
? Provide a friendly name for your resource
  translate
? What is the source language? (Use arrow keys)
  `US English`
? What is the target language? (Use arrow keys)
  `Italian`
? Who should have access? (Use arrow keys)
  `Auth and Guest users`
```

---

TITLE: Configure Amplify in Angular
DESCRIPTION: This code configures the Amplify library in an Angular application using the amplify_outputs.json file. The outputs file contains the necessary backend connection information, ensuring seamless communication between the frontend and backend.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_6

LANGUAGE: typescript
CODE:

```
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);
```

---

TITLE: Install Amplify UI React packages
DESCRIPTION: This command installs the necessary frontend packages for Amplify and Amplify UI React, enabling UI components and Amplify functionalities in the React application. Dependencies: @aws-amplify/ui-react, aws-amplify
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/gen-ai/index.mdx#_snippet_8

LANGUAGE: bash
CODE:

```
npm i --save @aws-amplify/ui-react aws-amplify
```

---

TITLE: Updating Backend with Amplify CLI
DESCRIPTION: This command pushes the locally configured backend, including the Interactions configuration, to the cloud. It creates or updates the necessary AWS resources for your chatbot.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/interactions/js/getting-started.mdx#_snippet_1

LANGUAGE: bash
CODE:

```
amplify push
```

---

TITLE: Lambda Function Handler for Custom `getWeather` Query in TypeScript
DESCRIPTION: Provides an example Lambda function implementation that handles the `getWeather` query, fetching weather data from an external API based on the city argument. It validates input, constructs the request with proper authorization headers, and returns the weather information in JSON format.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/tools/index.mdx#_snippet_2

LANGUAGE: TypeScript
CODE:

```
import { env } from "$amplify/env/getWeather";
import type { Schema } from "./resource";

export const handler: Schema["getWeather"]["functionHandler"] = async (
  event
) => {
  const { city } = event.arguments;
  if (!city) {
    throw new Error('City is required');
  }

  const url = `${env.API_ENDPOINT}?city=${encodeURIComponent(city)}`;
  const request = new Request(url, {
    headers: {
      Authorization: `Bearer ${env.API_KEY}`
    }
  });

  const response = await fetch(request);
  const weather = await response.json();
  return weather;
}
```

---

TITLE: Implementing Echo Lambda Handler (Node.js)
DESCRIPTION: Provides the Node.js code for the AWS Lambda function handler for the `echo` resolver. The handler receives the GraphQL `event` object, extracts the value of the `msg` argument from `event.arguments`, and returns it directly, implementing the echo functionality.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/lambda-graphql-resolvers/index.mdx#_snippet_2

LANGUAGE: javascript
CODE:

```
exports.handler = async (event) => {
  const response = event.arguments.msg;
  return response;
};
```

---

TITLE: Defining Metadata and Platforms for REST API Documentation in JavaScript
DESCRIPTION: This snippet declares a constant object 'meta' containing metadata about the REST API documentation, including its title, description, supported platforms, and route pattern. It serves as the central configuration used by other functions to generate platform-specific paths and content. Dependencies include the structure expected by the static generation strategy and platform identifiers used to produce paths dynamically.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/restapi/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:

```
export const meta = {
  title: 'API (REST)',
  description: 'A straightforward and secure solution for making HTTP requests using REST APIs',
  platforms: [
    'android',
    'angular',
    'flutter',
    'javascript',
    'nextjs',
    'react',
    'react-native',
    'swift',
    'vue'
  ],
  route: '/gen1/[platform]/prev/build-a-backend/restapi'
};
```

---

TITLE: Detect entities from file (Amplify Predictions)
DESCRIPTION: This JavaScript snippet demonstrates how to use the `Predictions.identify()` method to detect entities from an image file. It sends the file object as the source and logs the response or any errors to the console. This is the basic implementation for identifying entities in an image.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/identify-entity.mdx#_snippet_3

LANGUAGE: javascript
CODE:

```
Predictions.identify({
  entities: {
    source: {
      file,
    },
  }
})
.then((response) => console.log({ response }))
.catch(err => console.log({ err }));
```

---

TITLE: Handling Session Completion Events with AWS Lex V2 Bot - TypeScript
DESCRIPTION: This snippet shows registering an onComplete handler with AWS Amplify Interactions and AWS Lex V2 using TypeScript. It listens for session completion or error events, with a callback function that alerts users on errors or displays confirmation details upon success. Dependencies include '@aws-amplify/interactions' and TypeScript support. Key parameters are botName and callback. The callback receives optional error and completion objects. Limitations include requiring a proper Lex V2 configuration.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/interactions/js/chatbot.mdx#_snippet_1

LANGUAGE: typescript
CODE:

```
import { Interactions } from '@aws-amplify/interactions';

Interactions.onComplete({
  botName: "TheBotName",
  callback: (error?: Error, completion?: {[key: string]: any}) => {
     if (error) {
        alert('bot conversation failed');
     } else if (completion) {
        console.debug('done: ' + JSON.stringify(completion, null, 2));
        alert('Trip booked. Thank you! What would you like to do next?');
     }
  }
});
```

---

TITLE: Configuring Amplify Predictions for Text Identification via CLI
DESCRIPTION: Sets up the Amplify Predictions category using the Amplify CLI to enable text identification, including optional document analysis. This configures the backend resources (like Amazon Textract and Rekognition) necessary for the API calls.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/android/identify-text.mdx#_snippet_0

LANGUAGE: console
CODE:

```
? Please select from one of the categories below (Use arrow keys)
  `Identify`
? What would you like to identify? (Use arrow keys)
  `Identify Text`
? Provide a friendly name for your resource
  `identifyText`
? Would you also like to identify documents? (y/N)
  `Y`
? Who should have access? (Use arrow keys)
  `Auth and Guest users`
```

---

TITLE: Initializing Static Paths for Documentation Platforms Using Next.js in JavaScript
DESCRIPTION: This function uses the imported custom utility "getCustomStaticPath", passing the supported platforms from the page metadata to dynamically generate static paths for documentation routes. It is structured to be compatible with Next.js static generation and expects no parameters. The return value is asynchronously produced and depends on the implementation of "getCustomStaticPath".
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/concepts/architecture/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:

```
export const getStaticPaths = async () => {
  return getCustomStaticPath(meta.platforms);
};
```

---

TITLE: Lazy Loading Related Models with toArray (JavaScript)
DESCRIPTION: Queries a Post model by ID and then lazily loads its associated comments using the `toArray()` method on the relationship property. This method returns an array of the related models.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/datastore/js/relational/query-snippet.mdx#_snippet_1

LANGUAGE: JavaScript
CODE:

```
const post = await DataStore.query(Post, "YOUR_POST_ID");
const comments = await post.comments.toArray();
```

---

TITLE: Defining Page Meta Information for Static Rendering - JavaScript
DESCRIPTION: This snippet defines a JavaScript object containing page metadata, including title, description, and a list of target platforms. This metadata is utilized in static site rendering workflows to inject SEO-relevant tags and to drive platform-specific content injections elsewhere in the page. Dependencies: None. Inputs include a list of platforms as strings; outputs are used internally to configure static paths and props.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/auth/set-up-auth/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:

```
export const meta = {
  title: 'Set up Amplify Auth',
  description: 'Amplify uses Amazon Cognito as the main authentication provider. Learn how to handle user registration, authentication, account recovery, and other operations.',
  platforms: [
    'javascript',
    'flutter',
    'swift',
    'android',
    'react-native',
    'angular',
    'nextjs',
    'react',
    'vue'
  ]
};
```

---

TITLE: Sending aiContext with Message - JavaScript/Vue/Angular
DESCRIPTION: This code snippet demonstrates how to send aiContext with a user message to an LLM using the aws-amplify/data library. The aiContext can be any shape and is passed along with the message content.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/context/index.mdx#_snippet_0

LANGUAGE: typescript
CODE:

```
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>({ authMode: 'userPool' });

const { data: conversation } = await client.conversations.chat.create();

conversation.sendMessage({
  content: [{ text: "hello" }],
  // aiContext can be any shape
  aiContext: {
    username: "danny"
  }
})
```

---

TITLE: Generating Speech Audio Buffer with AWS Predictions in JavaScript
DESCRIPTION: Implements text-to-speech conversion by calling Predictions.convert() in JavaScript, passing in the text source, voice ID, and handling the promise to output either the generated result or error. Uses 'Amy' voice configured by default in aws-exports.js.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/text-speech.mdx#_snippet_1

LANGUAGE: JavaScript
CODE:

```
Predictions.convert({
  textToSpeech: {
    source: {
      text: textToGenerateSpeech
    },
    voiceId: "Amy" // default configured on aws-exports.js
    // list of different options are here https://docs.aws.amazon.com/polly/latest/dg/voicelist.html
  }
})
.then(result => console.log({ result }))
.catch(err => console.log({ err }));
```

---

TITLE: Using React Context with aiContext
DESCRIPTION: This code demonstrates how to use React context to manage and share state across components, then pass that state to the aiContext. This allows the LLM to access the current application state for more informed responses.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/context/index.mdx#_snippet_3

LANGUAGE: tsx
CODE:

```
// Create a context to share state across components
const DataContext = React.createContext<{
  data: any;
  setData: (value: React.SetStateAction<any>) => void;
}>({ data: {}, setData: () => {} });

// Create a component that updates the shared state
function Counter() {
  const { data, setData } = React.useContext(AIContext);
  const count = data.count ?? 0;
  return (
    <Button onClick={() => setData({ ...data, count: count + 1 })}>
      {count}
    </Button>
  );
}

// reference shared data in aiContext
function Chat() {
  const { data } = React.useContext(DataContext);
  const [
    {
      data: { messages },
      isLoading,
    },
    sendMessage,
  ] = useAIConversation('pirateChat');

  return (
    <AIConversation
      messages={messages}
      isLoading={isLoading}
      handleSendMessage={sendMessage}
      // This will let the LLM know about the current state of this application
      // so it can better respond to questions
      aiContext={() => {
        return {
          ...data,
          currentTime: new Date().toLocaleTimeString(),
        };
      }}
    />
  );
}

export default function Example() {
  const [data, setData] = React.useState({});
  return (
    <Authenticator>
      <DataContext.Provider value={{ data, setData }}>
        <Counter />
        <Chat />
      </DataContext.Provider>
    </Authenticator>
  )
}
```

---

TITLE: Specifying Redirect URIs for Amplify Auth Callbacks (Text Configuration)
DESCRIPTION: Provides example redirect URIs that need to be configured in the Amplify Auth resource, ensuring that after sign-in and sign-out processes complete via the Amazon Cognito Hosted UI, users are redirected correctly to Next.js API routes that handle token exchange and session cleanup. These URIs are supplied during Amplify CLI commands such as amplify add auth or amplify update auth.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/server-side-rendering/nextjs/index.mdx#_snippet_7

LANGUAGE: text
CODE:

```
// redirect signin URI:
https://myapp.com/api/auth/sign-in-callback

// redirect signout URI:
https://myapp.com/api/auth/sign-out-callback
```

---

TITLE: Detecting Text in an Amazon S3 Image with AWS Amplify Predictions - JavaScript
DESCRIPTION: Detects text in an image stored in an Amazon S3 bucket by specifying the S3 key in the Predictions.identify API call. The source 'key' parameter accepts the S3 object path, and 'level' can specify access ('guest', 'private', or 'protected'), defaulting to the configured Storage category. Requires proper IAM permissions and setup in Amplify backend. Outputs the text detection response, supporting the same formats as other Predictions API usages.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/js/identify-text.mdx#_snippet_2

LANGUAGE: javascript
CODE:

```
import { Predictions } from '@aws-amplify/predictions';

const response = await Predictions.identify({
  text: {
    source: {
      key: pathToPhoto,
      level?: 'guest' | 'private' | 'protected', //optional, default is configured on Storage category
    }
  }
})
console.log({ response });
```

---

TITLE: Setting Inference Configuration in Amplify
DESCRIPTION: This code snippet demonstrates how to set inference configuration parameters such as temperature, topP, and maxTokens when using generative AI routes in Amplify. It uses the 'a.generation' function with specific AI model and system prompt, including inference configuration as an optional parameter. Bedrock will use default values if these options are not provided.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/concepts/inference-configuration/index.mdx#_snippet_0

LANGUAGE: typescript
CODE:

```
a.generation({
  aiModel: a.ai.model("Claude 3.5 Haiku"),
  systemPrompt: `You are a helpful assistant`,
  inferenceConfiguration: {
    temperature: 0.2,
    topP: 0.2,
    maxTokens: 1000,
  }
})
```

---

TITLE: Simulating a GET Request with Query Parameters - API Gateway Console - Console
DESCRIPTION: This example documents the request path used for invoking the REST API with a limit parameter during API Gateway console testing. Not an executable command, but shown as the form input (GET /todos?limit=10). Used for GUI-based API Gateway testing.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/test-api/index.mdx#_snippet_9

LANGUAGE: console
CODE:

```
GET /todos?limit=10

```

---

TITLE: Deleting Data by ID using Model Mutations (Dart)
DESCRIPTION: Demonstrates how to delete a data object in Flutter by providing its ID using `Amplify.API.mutate` with `ModelMutations.deleteById`. This is useful when the full model object is not available in memory. Requires the Amplify library and defined models.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/mutate-data/index.mdx#_snippet_4

LANGUAGE: dart
CODE:

```
Future<void> deleteTodoById(Todo todoToDelete) async {
  final request = ModelMutations.deleteById(
    Todo.classType,
    TodoModelIdentifier(id: '8e0dd2fc-2f4a-4dc4-b47f-2052eda10775'),
  );
  final response = await Amplify.API.mutate(request: request).response;
  safePrint('Response: $response');
}
```

---

TITLE: Detecting Plain Text in Images using Amplify Predictions (Java)
DESCRIPTION: Demonstrates how to detect plain text from an image using the `Amplify.Predictions.identify` method in Java. It specifies `TextFormatType.PLAIN`, takes a `Bitmap` image as input, and casts the `IdentifyResult` to `IdentifyTextResult` to access the full text. Errors are logged to the console.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/android/identify-text.mdx#_snippet_1

LANGUAGE: java
CODE:

```
public void detectText(Bitmap image) {
  Amplify.Predictions.identify(
    TextFormatType.PLAIN,
    image,
    result -> {
      IdentifyTextResult identifyResult = (IdentifyTextResult) result;
      Log.i("MyAmplifyApp", identifyResult.getFullText());
    },
    error -> Log.e("MyAmplifyApp", "Identify text failed", error)
  );
}
```

---

TITLE: Get static props - JavaScript
DESCRIPTION: Defines a function to get static props for the page. It retrieves the platform from the context params and includes the `meta` object as a prop. These props are then passed to the page component during rendering.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/concepts/streaming/index.mdx#_snippet_3

LANGUAGE: javascript
CODE:

```
export function getStaticProps(context) {
  return {
    props: {
      platform: context.params.platform,
      meta,
    },
  };
}
```

---

TITLE: Detecting Both Labels and Unsafe Content Simultaneously in JavaScript
DESCRIPTION: This snippet demonstrates how to call Predictions.identify with type 'ALL' to receive both label detection and unsafe content analysis in a single request. It processes labels and checks the unsafe flag from the response, handling errors appropriately.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/label-image.mdx#_snippet_2

LANGUAGE: JavaScript
CODE:

```
Predictions.identify({
  labels: {
    source: {
      file,
    },
    type: "ALL"
  }
})
.then(response => {
  const { labels } = response;
  const { unsafe } = response; // boolean
  labels.forEach(object => {
    const { name, boundingBoxes } = object
  });
})
.catch(err => console.log({ err }));
```

---

TITLE: Identify Entities from Browser ArrayBuffer (Amplify Predictions)
DESCRIPTION: This snippet demonstrates detecting entities from image data supplied as an `ArrayBuffer`. This is useful for binary image data like from a webcam or base64 strings. It requires `@aws-amplify/predictions` and returns a Promise with the results.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/add-aws-services/predictions/identify-entity/index.mdx#_snippet_1

LANGUAGE: typescript
CODE:

```
import { Predictions } from '@aws-amplify/predictions';

const response = await Predictions.identify({
  entities: {
    source: {
      bytes: imageArrayBuffer,
    },
  }
});
```

---

TITLE: Embedding JavaScript and Cross-Platform Interpretation Documentation Fragment
DESCRIPTION: Includes a shared documentation fragment for interpretation features across JavaScript, React Native, Angular, Next.js, React, and Vue, promoting code reuse and consistency.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/more-features/predictions/interpret-sentiment/index.mdx#_snippet_7

LANGUAGE: MDX
CODE:

```
import interpretJs from '/src/fragments/lib-v1/predictions/js/interpret.mdx';

<Fragments
  fragments={{
    javascript: interpretJs,
    'react-native': interpretJs,
    angular: interpretJs,
    nextjs: interpretJs,
    react: interpretJs,
    vue: interpretJs
  }}
/>
```

---

TITLE: Manually Configuring Amplify Predictions with Existing Backend (JavaScript)
DESCRIPTION: Demonstrates manual configuration of Amplify Predictions to connect with existing AWS AI/ML resources, bypassing the Amplify CLI backend generation. Requires explicitly defining Auth configuration (Cognito Identity Pool) and detailed settings for each Predictions capability (convert, identify, interpret) including region, proxy settings, and defaults. Suitable for integrating existing backend infrastructure.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/getting-started.mdx#_snippet_3

LANGUAGE: javascript
CODE:

```
import { Amplify } from 'aws-amplify';

Amplify.configure({
  // To get the AWS Credentials, you need to configure
  // the Auth module with your Cognito Federated Identity Pool
  Auth: {
    identityPoolId: 'us-east-1:xxx-xxx-xxx-xxx-xxx',
    region: 'us-east-1'
  },
  predictions: {
    convert: {
      translateText: {
        region: 'us-east-1',
        proxy: false,
        defaults: {
          sourceLanguage: 'en',
          targetLanguage: 'zh'
        }
      },
      speechGenerator: {
        region: 'us-east-1',
        proxy: false,
        defaults: {
          VoiceId: 'Ivy',
          LanguageCode: 'en-US'
        }
      },
      transcription: {
        region: 'us-east-1',
        proxy: false,
        defaults: {
          language: 'en-US'
        }
      }
    },
    identify: {
      identifyText: {
        proxy: false,
        region: 'us-east-1',
        defaults: {
          format: 'PLAIN'
        }
      },
      identifyEntities: {
        proxy: false,
        region: 'us-east-1',
        celebrityDetectionEnabled: true,
        defaults: {
          collectionId: 'identifyEntities8b89c648-test',
          maxEntities: 50
        }
      },
      identifyLabels: {
        proxy: false,
        region: 'us-east-1',
        defaults: {
          type: 'LABELS'
        }
      }
    },
    interpret: {
      interpretText: {
        region: 'us-east-1',
        proxy: false,
        defaults: {
          type: 'ALL'
        }
      }
    }
  }
});
```

---

TITLE: Configuring Text Interpretation with Amplify CLI (Console)
DESCRIPTION: This console snippet shows the interactive process of using the AWS Amplify CLI to configure the Predictions category. It demonstrates selecting 'Interpret Text' and 'All' interpretation types, and setting access permissions for auth and guest users. This command sets up the backend resources required for text analysis.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/interpret.mdx#_snippet_0

LANGUAGE: console
CODE:

```
? What would you like to interpret? (Use arrow keys)
› Interpret Text
  Learn More

? What kind of interpretation would you like?
  Language
  Entity
  Keyphrase
  Sentiment
  Syntax
› All

? Who should have access? Auth and Guest users
```

---

TITLE: Demonstration of Translation Output in Console
DESCRIPTION: Shows an example of printed output after executing a translation request, illustrating how the translated text appears in the console or log output. It ensures developers understand what result to expect and confirms successful integration.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/native_common/getting-started/common.mdx#_snippet_7

LANGUAGE: Bash
CODE:

````
```console
Me gusta comer espaguetis
````

```

----------------------------------------

TITLE: Filtering Models with a Single Condition in JavaScript Frameworks
DESCRIPTION: Demonstrates importing a predicate snippet to filter 'Post' models with a 'rating' greater than 4, across multiple JavaScript frameworks, enabling precise data queries.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/datastore/native_common/data-access.mdx#_snippet_31

LANGUAGE: MDX
CODE:
```

import js18 from '/src/fragments/lib/datastore/lib/data-access/query-predicate-snippet.mdx';

```

----------------------------------------

TITLE: Implementing Python Lambda Function Handler (Python)
DESCRIPTION: This Python code defines the `handler` function for the Lambda. It retrieves the current time, constructs a JSON body containing a 'Hello' message with the time, and returns a standard API Gateway proxy response object with a 200 status code and CORS headers.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/python-api/index.mdx#_snippet_2

LANGUAGE: python
CODE:
```

import json
import datetime

def handler(event, context):

current_time = datetime.datetime.now().time()

body = {
'message': 'Hello, the current time is ' + str(current_time)
}

response = {
'statusCode': 200,
'body': json.dumps(body),
'headers': {
'Content-Type': 'application/json',
'Access-Control-Allow-Origin': '\*'
},
}

return response

```

----------------------------------------

TITLE: Using Fetched Props in a React Component (JSX)
DESCRIPTION: Demonstrates rendering an `Overview` component within the page structure. It passes the `childPageNodes` data, previously fetched by `getStaticProps` and made available via the `props` object, as a prop to the `Overview` component.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/index.mdx#_snippet_4

LANGUAGE: jsx
CODE:
```

<Overview childPageNodes={props.childPageNodes} />
```

---

TITLE: Configuring Next.js Static Generation for Amplify Predictions Docs
DESCRIPTION: This snippet configures static site generation for the Amplify Predictions documentation using Next.js. It imports utility functions, defines page metadata (title, description, route, platforms), generates static paths for each platform using `getCustomStaticPath`, and fetches child page data and passes metadata via `getStaticProps`. Dependencies include `@/utils/getChildPageNodes` and `@/utils/getCustomStaticPath`.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/add-aws-services/predictions/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:

```
import { getChildPageNodes } from '@/utils/getChildPageNodes';
import { getCustomStaticPath } from '@/utils/getCustomStaticPath';

export const meta = {
  title: 'AI/ML Predictions',
  description: 'Learn how to set up AI/ML Predictions',
  route: "/[platform]/build-a-backend/add-aws-services/predictions",
  platforms: [
    'angular',
    'javascript',
    'nextjs',
    'react',
    'react-native',
    'vue',
  ]
};

export async function getStaticPaths() {
  return getCustomStaticPath(meta.platforms);
}

export function getStaticProps(context) {
  const childPageNodes = getChildPageNodes(meta.route);
  return {
    props: {
      meta,
      childPageNodes
    }
  };
}
```

---

TITLE: Identifying Plain Text from File: Amplify JavaScript
DESCRIPTION: Illustrates how to specifically request plain text detection from an image file using the `format: "PLAIN"` option. The response object provides structured data including the `fullText` string, an array of `lines` (strings), detailed `linesDetailed` with bounding box and polygon information, and an array of `words` with similar details. Dependencies: Configured Predictions category.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/identify-text.mdx#_snippet_3

LANGUAGE: javascript
CODE:

```
Predictions.identify({
  text: {
    source: {
      file
    },
    format: "PLAIN",
  }
})
.then(response => {
  const {
    text: {
      fullText, // String
      lines, // Array of String ordered from top to bottom
      linesDetailed: [
        {
          /* array of
          text, // String
          boundingBox: {
            width, // ratio of overall image width
            height, // ratio of overall image height
            left, // left coordinate as a ratio of overall image width
            top // top coordinate as a ratio of overall image height
          },
          polygon // Array of { x, y } coordinates as a ratio of overall image width and height
          */
        }
      ],
      words // Array of objects that contains { text, boundingBox, polygon}
    }
  } = response
})
.catch(err => console.log({ err }));
```

---

TITLE: Querying Post with Comments - Java
DESCRIPTION: This code snippet demonstrates how to query a Post model and its associated comments using the AWS Amplify API in Java. It handles both LoadedModelList and LazyModelList scenarios. If the comments are already loaded, it retrieves them directly; otherwise, it fetches them asynchronously. The post is identified by the ID "123".
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/relational-models/index.mdx#_snippet_0

LANGUAGE: java
CODE:

```
Amplify.API.query(
    ModelQuery.get(Post.class, new Post.PostIdentifier("123")),
    response -> {
        Post post = response.getData();
        ModelList<Comment> commentsModelList = post.getComments();

        if (commentsModelList instanceof LoadedModelList) {
            List<Comment> comments =
                ((LoadedModelList<Comment>) commentsModelList).getItems();
            Log.i("MyAmplifyApp", "Loaded " + comments.size() + " comments.");
        } else if (commentsModelList instanceof LazyModelList) {
            ((LazyModelList<Comment>) commentsModelList).fetchPage(
                page -> {
                    List<Comment> comments = page.getItems();
                    Log.i("MyAmplifyApp", "Loaded " + comments.size() + " comments.");
                },
                failure -> Log.e("MyAmplifyApp, ", "Failed to fetch comments", failure)
            );
        }
    },
    failure -> Log.e("MyAmplifyApp", "Failed to query post.", failure)
);
```

---

TITLE: Define Custom Query with Custom Resolver for Amazon Bedrock - TypeScript
DESCRIPTION: This code defines a custom GraphQL query `generateHaiku` and connects it to Amazon Bedrock using a custom resolver. The `a.handler.custom()` modifier is used to specify the data source (`BedrockDataSource`) and the entry point for the resolver (`./generateHaiku.js`).
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/custom-business-logic/connect-bedrock/index.mdx#_snippet_3

LANGUAGE: typescript
CODE:

```
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  generateHaiku: a
    .query()
    .arguments({ prompt: a.string().required() })
    .returns(a.string())
    .authorization((allow) => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "BedrockDataSource",
        entry: "./generateHaiku.js",
      })
    ),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
```

---

TITLE: Basic Translation in Kotlin with Callbacks
DESCRIPTION: Kotlin implementation using callbacks for text translation with configured language settings. This code translates the English phrase to Italian based on the backend configuration and logs the result.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/android/translate.mdx#_snippet_2

LANGUAGE: kotlin
CODE:

```
Amplify.Predictions.translateText("I like to eat spaghetti",
  { Log.i("MyAmplifyApp", it.translatedText) },
  { Log.e("MyAmplifyApp", "Translation failed", it) }
)
```

---

TITLE: Interpreting Text (Sentiment) - Kotlin Coroutines
DESCRIPTION: Demonstrates an alternative way to call the `Amplify.Predictions.interpret` function in Kotlin using coroutines for a more synchronous-looking asynchronous code style. It uses a `try-catch` block to handle potential `PredictionsException` errors. The sentiment result is directly accessible after the suspended `interpret` call.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/android/interpret.mdx#_snippet_3

LANGUAGE: Kotlin
CODE:

```
val text = "I like to eat spaghetti"
try {
    val result = Amplify.Predictions.interpret(text)
    Log.i("MyAmplifyApp", "${result.sentiment?.value}")
} catch (error: PredictionsException) {
    Log.e("MyAmplifyApp", "Interpret failed", error)
}
```

---

TITLE: Defining Page Metadata for Entity Identification in JavaScript
DESCRIPTION: Defines a 'meta' object containing the documentation title, description, and supported platforms. This object is used throughout the file to pass metadata into page generation and rendering, providing context for both static path creation and content rendering. This snippet does not perform logic but establishes configuration data.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/predictions/identify-entity/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:

```
export const meta = {
  title: 'Identify entities from images',
  description: 'Learn how to identify entities from an image using Amplify.',
  platforms: [
    'javascript',
    'swift',
    'android',
    'angular',
    'nextjs',
    'react',
    'vue'
  ]
};
```

---

TITLE: Configure Amplify in Next.js (App Router) - Client Component
DESCRIPTION: This code configures Amplify in a Next.js application using the app router, specifically within a client component. It imports Amplify and the configuration file, then calls Amplify.configure() to initialize Amplify with the configuration.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_9

LANGUAGE: typescript
CODE:

```
"use client";

import { Amplify } from "aws-amplify";
import config from "@/../amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(config);

export const ConfigureAmplify = () => {
  return null;
};
```

---

TITLE: Sending Messages to AWS Lex V1 Bot - JavaScript
DESCRIPTION: This example illustrates sending a text message to an AWS Lex V1 chatbot using AWS Amplify Interactions (Lex V1 path) in JavaScript. The InteractionsLexV1.send() method takes a botName and message, returns a promise with the chatbot response, and logs the response. The dependency is '@aws-amplify/interactions/lex-v1'. Both input parameters are required; the output is the chatbot's textual response. This mirrors the V2 API for migration ease.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/interactions/js/chatbot.mdx#_snippet_2

LANGUAGE: javascript
CODE:

```
import { Interactions as InteractionsLexV1 } from '@aws-amplify/interactions/lex-v1';

let userInput = "I want to reserve a hotel for tonight";

(async () => {
  // Provide a bot name and user input
  const response = await InteractionsLexV1.send({
    botName: "TheBotName",
    message: userInput
  });

  // Log chatbot response
  console.log(response.message);
})()
```

---

TITLE: Generate Amplify Data Client (JS/Vue/Angular)
DESCRIPTION: This code generates a type-safe frontend client using the Amplify libraries for JavaScript, Vue, and Angular projects. It imports `generateClient` from `aws-amplify/api` and the data schema from `../amplify/data/resource`, then creates a client configured for user pool authentication.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_11

LANGUAGE: typescript
CODE:

```
import { generateClient } from "aws-amplify/api";
import { Schema } from "../amplify/data/resource";

export const client = generateClient<Schema>({ authMode: "userPool" });
```

---

TITLE: Translating Text using AWS Amplify Predictions API in JavaScript
DESCRIPTION: This JavaScript snippet demonstrates using the `Predictions.convert` method from the `@aws-amplify/predictions` library to translate text. It requires the source text (`textToTranslate`) and optionally allows specifying the source and target languages, otherwise defaulting to configurations in `amplifyconfiguration.json`. The asynchronous operation returns a promise that resolves with the translation result or rejects with an error, both of which are logged to the console.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/js/translate.mdx#_snippet_1

LANGUAGE: javascript
CODE:

```
import { Predictions } from '@aws-amplify/predictions';

Predictions.convert({
  translateText: {
    source: {
      text: textToTranslate,
      // language : "es" // defaults configured on amplifyconfiguration.json
    },
    // targetLanguage: "en"
  }
})
.then(result => console.log({ result }))
.catch(err => console.log({ err }));
```

---

TITLE: Installing Microphone Stream Dependency for Speech-to-Text
DESCRIPTION: Command to install the microphone-stream NPM package, which is required for the speech-to-text functionality using Amazon Transcribe with Predictions.convert().
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/sample.mdx#_snippet_0

LANGUAGE: bash
CODE:

```
npm install microphone-stream
```

---

TITLE: Configuring Amplify Predictions for Label and Unsafe Content Recognition in JavaScript
DESCRIPTION: This snippet demonstrates how to call Predictions.identify with different types to detect labels, unsafe content, or both in an image file. It manages promise responses to process the detection results, extracting labels and bounding boxes or unsafe flags, and includes error handling.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/label-image.mdx#_snippet_0

LANGUAGE: JavaScript
CODE:

```
Predictions.identify({
  labels: {
    source: {
      file,
    },
    type: "LABELS"
  }
})
.then(response => {
  const { labels } = response;
  labels.forEach(object => {
    const { name, boundingBoxes } = object
  });
})
.catch(err => console.log({ err }));
```

---

TITLE: Defining Meta Information for Documentation Pages in JavaScript
DESCRIPTION: This snippet creates a meta object containing the documentation page title, description, and a list of supported platforms. It is used throughout the static generation process to provide consistent metadata and to determine which platform documentation to present. No external dependencies are required.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/predictions/interpret-sentiment/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:

```
export const meta = {
  title: 'Interpret sentiment',
  description: 'Learn how to determine key phrases, sentiment, language, syntax, and entities from text using Amplify.',
  platforms: [
    'javascript',
    'swift',
    'android',
    'angular',
    'nextjs',
    'react',
    'vue'
  ]
};
```

---

TITLE: Deleting Data Asynchronously with Amplify API (JavaScript)
DESCRIPTION: This snippet shows an asynchronous function that uses `API.del()` for deleting data from an API endpoint using AWS Amplify. It employs `async/await` for cleaner code and easier error handling, awaiting the result of the `API.del()` function. The `apiName` and `path` variables should be replaced with your API name and the resource path respectively. `myInit` can include request headers.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/restapi/js/delete.mdx#_snippet_1

LANGUAGE: javascript
CODE:

```
async function deleteData() {
  const apiName = 'MyApiName';
  const path = '/path';
  const myInit = {
    headers: {} // OPTIONAL
  };
  return await API.del(apiName, path, myInit);
}

deleteData();
```

---

TITLE: Configuring Amplify Predictions: Identify Text Console Setup
DESCRIPTION: Provides the console commands and interactive prompts/answers required to configure the AWS Amplify Predictions category specifically for text identification. This setup leverages Amazon Rekognition and Textract behind the scenes. Prerequisites include having run `amplify init` and `amplify add auth`.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/identify-text.mdx#_snippet_0

LANGUAGE: console
CODE:

```
? What would you like to identify? (Use arrow keys)
❯ Identify Text
  Identify Entities
  Identify Labels
  Learn More

? Would you also like to identify documents? Yes
? Who should have access? Auth and Guest users
```

---

TITLE: Example IAM Policy for Kinesis (Javascript)
DESCRIPTION: This snippet provides an example IAM policy for enabling Kinesis `PutRecords` access. It uses JSON format to define the `Allow` effect and specifies the `kinesis:PutRecords` action for a specific resource. The `Resource` field uses a template field for a stream ARN. This example illustrates the minimal IAM policy required to allow data to be sent to the Kinesis stream. The output creates a valid IAM policy.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/add-aws-services/analytics/streaming-data/index.mdx#_snippet_4

LANGUAGE: javascript
CODE:

````
```javascript
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "kinesis:PutRecords",
    "Resource": "arn:aws:kinesis:<your-aws-region>:<your-aws-account-id>:stream/<your-stream-name>" // replace the template fields
  }]
}
````

```

----------------------------------------

TITLE: Generating Static Paths for Platform-Specific Documentation
DESCRIPTION: Creates static paths for each supported platform using the getCustomStaticPath utility function and the platforms defined in the meta object.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/analytics/app-uninstall/index.mdx#_snippet_1

LANGUAGE: JavaScript
CODE:
```

export const getStaticPaths = async () => {
return getCustomStaticPath(meta.platforms);
};

```

----------------------------------------

TITLE: Configure Amplify with Interactions (JavaScript)
DESCRIPTION: This JavaScript snippet configures AWS Amplify, including the Interactions feature with specific Amazon Lex V2 bot details.  It imports Amplify, the parseAmplifyConfig utility, and outputs from amplify_outputs.json.  It then configures the Interactions section with the bot alias ID, bot ID, locale ID, and region.  Replace placeholders with your actual bot values.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/add-aws-services/interactions/set-up-interactions/index.mdx#_snippet_3

LANGUAGE: javascript
CODE:
```

import { Amplify } from 'aws-amplify';
import { parseAmplifyConfig } from "aws-amplify/utils";
import outputs from '../amplify_outputs.json';

const amplifyConfig = parseAmplifyConfig(outputs);

Amplify.configure({
...amplifyConfig,
Interactions: {
LexV2: {
'<your-bot-name>': {
aliasId: '<your-bot-alias-id>',
botId: '<your-bot-id>',
localeId: '<your-bot-locale-id>',
region: '<your-bot-region>'
}
}
}
});

```

----------------------------------------

TITLE: Generating Static Paths for Multiple Platforms in JavaScript
DESCRIPTION: Creates static paths for each supported platform to enable server-side rendering. It uses a utility function that generates paths based on the platforms array from the metadata.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/delete-data/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```

export const getStaticPaths = async () => {
return getCustomStaticPath(meta.platforms);
};

```

----------------------------------------

TITLE: Getting Post from Comment - Java
DESCRIPTION: This Java code shows how to retrieve a Post from a Comment using ModelReference. It handles both LoadedModelReference and LazyModelReference. If the Post is already loaded, it gets it directly. Otherwise, it fetches it asynchronously using a callback.  Error handling is included for the asynchronous fetch.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/relational-models/index.mdx#_snippet_3

LANGUAGE: java
CODE:
```

void getPostFromComment(Comment comment) {
ModelReference<Post> postReference = comment.getPost();
if (postReference instanceof LoadedModelReference) {
LoadedModelReference<Post> loadedPost = ((LoadedModelReference<Post>) postReference);
Post post = loadedPost.getValue();
Log.i("MyAmplifyApp", "Post: " + post);
} else if (postReference instanceof LazyModelReference) {
LazyModelReference<Post> lazyPost = ((LazyModelReference<Post>) postReference);
lazyPost.fetchModel(
post -> Log.i("MyAmplifyApp", "Post: $post"),
error -> Log.e("MyAmplifyApp", "Failed to fetch post", error)
);
}
}

```

----------------------------------------

TITLE: Create Auth Challenge Lambda Trigger for CAPTCHA in JavaScript
DESCRIPTION: JavaScript AWS Lambda handler implementing the Create Auth Challenge trigger to present a CAPTCHA challenge during custom authentication. It sets a CAPTCHA image URL and expected answer in the challenge parameters if there is no existing challenge session. Intended to be used with AWS Cognito Lambda triggers. The event input contains authentication session info and is modified to define challenge data.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/auth/switch-auth/index.mdx#_snippet_4

LANGUAGE: JavaScript
CODE:
```

export const handler = async (event) => {
if (
!Array.isArray(event?.request?.session) ||
event?.request?.session?.length
) {
event.response.publicChallengeParameters = {
captchaUrl: 'url/123.jpg'
};
event.response.privateChallengeParameters = {
answer: '5'
};
event.response.challengeMetadata = 'CAPTCHA_CHALLENGE';
}
return event;
};

```

----------------------------------------

TITLE: Configuring Next.js Static Page Generation with Metadata
DESCRIPTION: Exports standard Next.js page configuration objects and functions used for static site generation. The `meta` object defines page metadata and supported platforms, `getStaticPaths` generates static routes based on platforms, and `getStaticProps` fetches route parameters to pass as component props.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/concepts/models/index.mdx#_snippet_0

LANGUAGE: JavaScript
CODE:
```

export const meta = {
title: "Models",
description:
"Learn about foundation models provided by Amazon Bedrock used for generative AI",
platforms: [
"javascript",
"react-native",
"angular",
"nextjs",
"react",
"vue",
],
};

```

LANGUAGE: JavaScript
CODE:
```

export const getStaticPaths = async () => {
return getCustomStaticPath(meta.platforms);
};

```

LANGUAGE: JavaScript
CODE:
```

export function getStaticProps(context) {
return {
props: {
platform: context.params.platform,
meta,
},
};
}

```

----------------------------------------

TITLE: Configure Amplify Predictions Identify Text Parameters (JSON)
DESCRIPTION: Example JSON snippet for the `parameters.json` file specific to the Identify Text resource. This configuration is sometimes required manually due to known issues and controls document analysis features and access levels.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/js/getting-started.mdx#_snippet_2

LANGUAGE: json
CODE:
```

"identifyDoc": true,
"access": "auth | authAndGuest",
"format": "PLAIN | FORM | TABLE | ALL"

```

----------------------------------------

TITLE: Defining Page Metadata for Amplify Prediction Docs (JavaScript)
DESCRIPTION: This code defines a meta object with title, description, and a list of supported platforms for the documentation page. The object is later used for SEO purposes and to facilitate correct fragment imports and static path generation. All fields must be strings or arrays; the platforms list should match the keys for fragment mapping.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/predictions/identify-text/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```

export const meta = {
title: 'Identify text',
description: 'Learn how to identify text from images and documents in your application using AWS Amplify.',
platforms: [
'javascript',
'swift',
'android',
'angular',
'nextjs',
'react',
'vue'
]
};

```

----------------------------------------

TITLE: Handling DynamoDB Global Secondary Index Deployment Errors - Console
DESCRIPTION: This snippet represents a typical error message encountered when attempting to mutate more than one Global Secondary Index (GSI) in a single Amplify CLI deployment. It is intended to inform users about the concurrency limitations when performing multiple GSI updates and directs enabling iterative GSI updates through configuration.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/troubleshooting/index.mdx#_snippet_1

LANGUAGE: console
CODE:
```

Attempting to mutate more than 1 global secondary index at the same time.

```

----------------------------------------

TITLE: Get Static Paths - JavaScript
DESCRIPTION: Asynchronously generates static paths based on the platforms defined in the meta object. This is used for static site generation.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/restapi/delete-data/index.mdx#_snippet_2

LANGUAGE: javascript
CODE:
```

export const getStaticPaths = async () => {
return getCustomStaticPath(meta.platforms);
};

```

----------------------------------------

TITLE: Create Auth Challenge Lambda Trigger for CAPTCHA in TypeScript
DESCRIPTION: Defines an AWS Lambda handler in TypeScript that creates a CAPTCHA challenge as part of the custom authentication flow. The function sets public challenge parameters with a CAPTCHA image URL and private parameters with the expected answer when no previous session exists. This is used in Cognito's Create Auth Challenge trigger. Requires the 'aws-lambda' types and environment. The event argument contains request and response objects manipulated to define the challenge.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/auth/switch-auth/index.mdx#_snippet_3

LANGUAGE: TypeScript
CODE:
```

import { Handler } from 'aws-lambda';

export const handler: Handler = async (event) => {
if (!event?.request?.session || event?.request?.session?.length === 0) {
event.response.publicChallengeParameters = {
captchaUrl: 'url/123.jpg'
};
event.response.privateChallengeParameters = {
answer: '5'
};
event.response.challengeMetadata = 'CAPTCHA_CHALLENGE';
}
return event;
};

```

----------------------------------------

TITLE: Importing Common Getting Started Fragment - JavaScript
DESCRIPTION: This imports a common getting-started fragment for the REST API. This component contains common content shared across multiple platforms. The fragment is imported from a specific path, and is likely a markdown file containing instructions and code examples. It uses the `common_getting_started` variable to reference the content.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/set-up-rest-api/index.mdx#_snippet_4

LANGUAGE: javascript
CODE:
```

import common_getting_started from '/src/fragments/lib/restapi/native_common/getting-started/common.mdx';

```

----------------------------------------

TITLE: Create Auth Challenge Lambda Trigger with CAPTCHA (JavaScript)
DESCRIPTION: Defines an AWS Lambda handler for creating a CAPTCHA challenge in a Cognito authentication flow using JavaScript. Sets public and private challenge parameters, including a captcha URL and expected answer. Prerequisites include providing the captcha URL and expected answer dynamically. Outputs an event with challenge data.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/auth/android/signin_with_custom_flow/50_custom_challenge.mdx#_snippet_9

LANGUAGE: JavaScript
CODE:
```

export const handler = async (event) => {
if (!event.request.session || event.request.session.length === 0) {
event.response.publicChallengeParameters = {
captchaUrl: <captcha url>,
};
event.response.privateChallengeParameters = {
answer: <expected answer>,
};
event.response.challengeMetadata = "CAPTCHA_CHALLENGE";
}
return event;
};

```

----------------------------------------

TITLE: Generating Static Paths Based on Platforms using JavaScript
DESCRIPTION: Defines an asynchronous function that returns a list of static paths by invoking getCustomStaticPath with the supported platforms. This allows for static generation of documentation pages for each specified platform. It requires meta.platforms as input and outputs a Promise resolving to the path array.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/logging/change-log-levels/index.mdx#_snippet_2

LANGUAGE: javascript
CODE:
```

export const getStaticPaths = async () => {
return getCustomStaticPath(meta.platforms);
};

```

----------------------------------------

TITLE: Removing API Key Output from Lambda Backend Config (JSON)
DESCRIPTION: Provides the JSON example to identify and remove the `GraphQLAPIKeyOutput` attribute from attribute arrays in the `amplify/backend/backend-config.json` file. This change ensures Lambda functions no longer depend on the API key output when it is disabled. The before snippet shows the attribute included and the after snippet shows the attribute removed. It must be done for every Lambda function referencing the API key.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/troubleshooting/apikey-not-found/index.mdx#_snippet_2

LANGUAGE: json
CODE:
```

{
"attributes": [
"GraphQLAPIIdOutput",
"GraphQLAPIEndpointOutput",
"GraphQLAPIKeyOutput"
]
}

```

LANGUAGE: json
CODE:
```

{
"attributes": [
"GraphQLAPIIdOutput",
"GraphQLAPIEndpointOutput"
]
}

```

----------------------------------------

TITLE: Sign-In with Web UI - Dart
DESCRIPTION: This Dart code snippet demonstrates how to launch sign-in with web UI using the `Amplify.Auth.signInWithWebUI()` function. It handles potential `AuthException` errors during the sign-in process and prints the result or error message using `safePrint`.  The expected input is none; the output is a result from the authentication process or an error message.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/auth/sign-in-with-web-ui/index.mdx#_snippet_2

LANGUAGE: Dart
CODE:
```

Future<void> signInWithWebUI() async {
try {
final result = await Amplify.Auth.signInWithWebUI();
safePrint('Sign in result: $result');
} on AuthException catch (e) {
safePrint('Error signing in: ${e.message}');
}
}

```

----------------------------------------

TITLE: Loading Documentation Fragments for React Native
DESCRIPTION: Imports and assigns the chatbot documentation MDX fragment specifically for React Native. Although it uses the same source as other JavaScript frameworks, it's conditionally rendered only for React Native.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/interactions/chatbot/index.mdx#_snippet_4

LANGUAGE: javascript
CODE:
```

import reactnative0 from '/src/fragments/lib/interactions/js/chatbot.mdx';

<Fragments fragments={{ 'react-native': reactnative0 }} />

```

----------------------------------------

TITLE: Detecting All Text, Forms, and Tables in an Image with Amplify Predictions - JavaScript
DESCRIPTION: Performs comprehensive extraction of plain text, form fields, and tables from an image file using Amplify Predictions with 'format' set to 'ALL'. This option consolidates the outputs of PLAIN, FORM, and TABLE formats into a single response, enabling detection for any supported content type in the image. Prerequisites include a correctly-configured Amplify Predictions backend with Textract. Suitable for cases where the image content type is heterogeneous or unknown.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/js/identify-text.mdx#_snippet_6

LANGUAGE: javascript
CODE:
```

import { Predictions } from '@aws-amplify/predictions';

const response = await Predictions.identify({
text: {
source: {
file
},
format: 'ALL'
}
});

const {
text: {
// same as PLAIN + FORM + TABLE
}
} = response;

```

----------------------------------------

TITLE: Initializing Map with Element Reference
DESCRIPTION: This snippet demonstrates an alternative way to initialize a map by passing an element reference instead of an ID. It gets the element by class name, and then passes it to the `createMap` function. This is helpful if you want to customize the map initialization process further or work with the map in situations where you do not want to or cannot use an ID.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/add-aws-services/geo/maps/index.mdx#_snippet_3

LANGUAGE: javascript
CODE:
```

const element = document.getElementsByClassName("class")[0];

const map = await createMap({
container: element,
...
})

```

----------------------------------------

TITLE: Listening with Capturing Regex - AWS Amplify Hub - Javascript
DESCRIPTION: Demonstrates using 'Hub.listen' with a regular expression '/user(.*)/' that includes a capturing group. The callback receives message data and a 'patternInfo' array with regex capture results.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/utilities/js/hub.mdx#_snippet_6

LANGUAGE: Javascript
CODE:
```

Hub.listen(/user(.\*)/, (data) => {
console.log('A USER event has been found matching the pattern: ', data.payload.message);
console.log('patternInfo:', data.patternInfo);
})

```

----------------------------------------

TITLE: Detecting Unsafe Content in an Image Using Amplify Predictions in TypeScript
DESCRIPTION: This TypeScript snippet shows how to asynchronously identify unsafe content (such as explicit or inappropriate material) within an image file using Amplify Predictions. It uses an async/await pattern calling Predictions.identify with type set to 'UNSAFE'. The snippet requires @aws-amplify/predictions and a valid image file.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/add-aws-services/predictions/label-image/index.mdx#_snippet_1

LANGUAGE: typescript
CODE:
```

import { Predictions } from '@aws-amplify/predictions';

const { unsafe } = await Predictions.identify({
labels: {
source: {
file
},
type: 'UNSAFE'
}
})

```

----------------------------------------

TITLE: Example of an Invalid Amplify GraphQL Schema (GraphQL)
DESCRIPTION: Demonstrates a GraphQL type definition ('Tag') with an intentional syntax error: the directive '@model' is misspelled as '@mode'. This type of error will cause the schema validation or transformation process to fail, leading to an `amplify push` failure. Running `amplify api gql-compile` would detect such errors locally.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/tools/cli/project/troubleshooting/index.mdx#_snippet_9

LANGUAGE: GraphQL
CODE:
```

type Tag @mode { /** @mode is an invalid directive **/
id : ID!
tag: String
topics: [Topic]
}

```

----------------------------------------

TITLE: Sending Text Messages to Chatbot with AWS Amplify (JavaScript)
DESCRIPTION: This JavaScript snippet demonstrates how to send a text message to a chatbot using the `Interactions.send()` method from the `aws-amplify` library. It takes user input and a bot name as parameters. It returns a promise that resolves with the bot's response.  The output is a message from the chatbot to the console.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/interactions/js/chatbot.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```

import { Interactions } from 'aws-amplify';

let userInput = "I want to reserve a hotel for tonight";

// Provide a bot name and user input
const response = await Interactions.send("BookTrip", userInput);

// Log chatbot response
console.log(response.message);

```

----------------------------------------

TITLE: Defining IAM Policy for Kinesis Access (JavaScript)
DESCRIPTION: This JavaScript code defines an IAM policy granting permission to put records into an Amazon Kinesis stream. It specifies the allowed action (`kinesis:PutRecords`) and the resource (Kinesis stream ARN).  The `<Region>`, `<AccountId>`, and `<StreamName>` template fields need to be replaced with the actual values. This policy is a prerequisite for the application to interact with the Kinesis stream.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/analytics/js/streaming.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```

{
"Version": "2012-10-17",
"Statement": [{
"Effect": "Allow",
"Action": "kinesis:PutRecords",
"Resource": "arn:aws:kinesis:<Region>:<AccountId>:stream/<StreamName>" // replace the template fields
}]
}

```

----------------------------------------

TITLE: Configuring amplify/backend/identify-text-resource/parameters.json for Predictions Identify - JSON
DESCRIPTION: Specifies necessary parameters to enable document identification, user access, and format selection in the Amplify Predictions Identify resource. This configuration must be updated due to a known Amplify CLI issue. Set "identifyDoc" to true to enable document analysis, configure "access" for the allowed user roles ("auth", "authAndGuest"), and set the "format" to a supported value: PLAIN, FORM, TABLE, or ALL. This JSON is inserted into the resource parameters file before running "amplify push".
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/js/identify-text.mdx#_snippet_0

LANGUAGE: json
CODE:
```

"identifyDoc": true,
"access": "auth | authAndGuest",
"format": "PLAIN | FORM | TABLE | ALL"

```

----------------------------------------

TITLE: Detecting Unsafe Content in an Image Using AWS Amplify Predictions in JavaScript
DESCRIPTION: This snippet shows how to invoke Predictions.identify with type 'UNSAFE' to detect unsafe or inappropriate content in an image. It extracts a boolean unsafe flag from the response and logs errors if any occur.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/label-image.mdx#_snippet_1

LANGUAGE: JavaScript
CODE:
```

Predictions.identify({
labels: {
source: {
file,
},
type: "UNSAFE"
}
})
.then(response => {
const { unsafe } = response; // boolean
})
.catch(err => console.log({ err }));

```

----------------------------------------

TITLE: Process Face Detection Results (Amplify Predictions)
DESCRIPTION: This snippet demonstrates how to iterate through the results of `Predictions.identify` to access detected faces, their `boundingBox`, and `landmarks` (eyes, mouth, nose). The structure of the results is shown regardless of the input source type used for the identification call.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/add-aws-services/predictions/identify-entity/index.mdx#_snippet_3

LANGUAGE: typescript
CODE:
```

import { Predictions } from '@aws-amplify/predictions';

const { entities } = await Predictions.identify({
entities: {
source: {
file,
},
}
})
for (const { boundingBox, landmarks } of entities) {
const {
width, // ratio of overall image width
height, // ratio of overall image height
left, // left coordinate as a ratio of overall image width
top // top coordinate as a ratio of overall image height
} = boundingBox;

for (const landmark of landmarks) {
const {
type, // string "eyeLeft", "eyeRight", "mouthLeft", "mouthRight", "nose"
x, // ratio of overall image width
y // ratio of overall image height
} = landmark;
}
}

```

----------------------------------------

TITLE: Override API Auth Type for HostedUI (JSON)
DESCRIPTION: Provides a JSON snippet demonstrating how to configure the `awsAPIPlugin` in `amplifyconfiguration.json`. It sets the `authorizationType` for a specific REST endpoint to "NONE", which is a necessary workaround for using a custom interceptor with the ID token when the default `AMAZON_COGNITO_USER_POOLS` type causes issues with HostedUI.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/auth/admin-actions/index.mdx#_snippet_12

LANGUAGE: JSON
CODE:
```

{
"awsAPIPlugin": {
"[YOUR-RESTENDPOINT-NAME]": {
"endpointType": "REST",
"endpoint": "[YOUR-REST-ENDPOINT]",
"region": "[REGION]",
"authorizationType": "NONE"
}
}
}

```

----------------------------------------

TITLE: Interacting with the API using curl
DESCRIPTION: Shows how to interact with the deployed API using a curl command.  Replace <api-id>, <api-region>, and <your-env-name> with the appropriate values.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/go-api/index.mdx#_snippet_4

LANGUAGE: sh
CODE:
```

curl https://<api-id>.execute-api.<api-region>.amazonaws.com/<your-env-name>/hello

```

----------------------------------------

TITLE: Defining Page Metadata and Supported Platforms using JavaScript
DESCRIPTION: Declares a metadata object containing the page's title, description, and an array of supported frameworks. This structure is used for route generation and to dynamically reference the correct documentation per platform when statically generating the website. Inputs include the frameworks list, while outputs are used in subsequent generation steps. No external dependencies required.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/graphqlapi/offline/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```

export const meta = {
title: 'Working with caching and offline scenarios',
description: "Learn more about how to support offline scenarios with Amplify's GraphQL API category",
platforms: [
'flutter',
'swift',
'android',
'javascript',
'react-native',
'angular',
'nextjs',
'react',
'vue'
]
};

```

----------------------------------------

TITLE: Configuring Function Handler for Text Extraction in TypeScript
DESCRIPTION: This code defines a function handler that analyzes an image and extracts text using the Amazon Rekognition DetectText service. It constructs a POST request to the Rekognition API with the image details from an S3 bucket and processes the response to extract detected text lines.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/custom-business-logic/connect-amazon-rekognition/index.mdx#_snippet_3

LANGUAGE: typescript
CODE:
```

export function request(ctx) {
return {
method: "POST",
resourcePath: "/",
params: {
body: {
Image: {
S3Object: {
Bucket: ctx.env.S3_BUCKET_NAME,
Name: ctx.arguments.path,
},
},
},
headers: {
"Content-Type": "application/x-amz-json-1.1",
"X-Amz-Target": "RekognitionService.DetectText",
},
},
};
}

export function response(ctx) {
return JSON.parse(ctx.result.body)
.TextDetections.filter((item) => item.Type === "LINE")
.map((item) => item.DetectedText)
.join("\n")
.trim();
}

```

----------------------------------------

TITLE: Removing Files with Key (Deprecated) - JavaScript
DESCRIPTION: This snippet shows the deprecated method for removing a file using the `key` parameter. It requires specifying the `accessLevel` within the `options` object. The `key` parameter is considered legacy and may be removed in future versions; using `path` is strongly recommended. The operation includes error handling.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/storage/remove/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```

import { remove } from 'aws-amplify/storage';

try {
await remove({
key: 'album/2024/1.jpg',
options: {
accessLevel: 'guest' // defaults to `guest` but can be 'private' | 'protected' | 'guest'
}
});
} catch (error) {
console.log('Error ', error);
}

```

----------------------------------------

TITLE: Setting up Text Interpretation Backend - Amplify CLI
DESCRIPTION: Demonstrates the interactive steps required when running `amplify add predictions` in the AWS Amplify CLI to configure text interpretation capabilities. It shows selecting the `Interpret` category, `Interpret Text` type, naming the resource, choosing `All` interpretation types, and setting access permissions for Auth and Guest users. This command provisions the necessary AWS resources (like Amazon Comprehend) in the cloud.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/android/interpret.mdx#_snippet_0

LANGUAGE: Console
CODE:
```

? Please select from one of the categories below (Use arrow keys)
`Interpret`
? What would you like to interpret? (Use arrow keys)
`Interpret Text`
? Provide a friendly name for your resource
`interpretText`
? What kind of interpretation would you like? (Use arrow keys)
`All`
? Who should have access? (Use arrow keys)
`Auth and Guest users`

```

----------------------------------------

TITLE: Embedding Android Maintenance Documentation Fragment
DESCRIPTION: Includes an Android-specific maintenance documentation fragment, aiding in platform-tailored documentation management.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/more-features/predictions/interpret-sentiment/index.mdx#_snippet_5

LANGUAGE: MDX
CODE:
```

import android_maintenance from '/src/fragments/lib-v1/android-maintenance.mdx';

<Fragments fragments={{ android: android_maintenance }} />

```

----------------------------------------

TITLE: Rendering Code Fragments for Amplify Documentation
DESCRIPTION: This code renders JavaScript code fragments related to cancelling API requests. The `<Fragments>` component displays code snippets based on the selected platform.  The `javascript` code, along with other frameworks are pulled from the same mdx file. Dependencies include the Fragments component.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/restapi/cancel-api-requests/index.mdx#_snippet_2

LANGUAGE: javascript
CODE:
```

<Fragments
fragments={{
    javascript: js0,
    angular: js0,
    nextjs: js0,
    react: js0,
    vue: js0
  }}
/>

```

----------------------------------------

TITLE: Lazy Loading Related Models with Async Iterators (JavaScript)
DESCRIPTION: Queries a Post model by ID and then iterates over its associated comments using an `for await...of` loop. This allows processing related models one by one as they are loaded.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/datastore/js/relational/query-snippet.mdx#_snippet_3

LANGUAGE: JavaScript
CODE:
```

const post = await DataStore.query(Post, "YOUR_POST_ID");
for await (const comment of post.comments) {
console.log(comment)
};

```

----------------------------------------

TITLE: Setting Static Props for Platform-Specific Documentation in Next.js
DESCRIPTION: Implements the getStaticProps function that provides the selected platform and metadata as props to the page component. This enables platform-specific content rendering.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/interactions/chatbot/index.mdx#_snippet_2

LANGUAGE: javascript
CODE:
```

export function getStaticProps(context) {
return {
props: {
platform: context.params.platform,
meta
}
};
}

```

----------------------------------------

TITLE: Defining a Custom Query with Authorization in TypeScript
DESCRIPTION: Creates a custom function called `getWeather` for retrieving weather data, with proper environment variables and a Lambda handler that fetches weather info based on a city input. The schema includes a query tool referencing this custom function, enabling the LLM to obtain weather data with authenticated access, enforcing authorization at the query level.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/tools/index.mdx#_snippet_1

LANGUAGE: TypeScript
CODE:
```

import { type ClientSchema, a, defineData, defineFunction } from "@aws-amplify/backend";

export const getWeather = defineFunction({
name: 'getWeather',
entry: './getWeather.ts',
environment: {
API_ENDPOINT: 'MY_API_ENDPOINT',
API_KEY: secret('MY_API_KEY'),
},
});

const schema = a.schema({
getWeather: a.query()
.arguments({ city: a.string() })
.returns(a.customType({
value: a.integer(),
unit: a.string()
}))
.handler(a.handler.function(getWeather))
.authorization((allow) => allow.authenticated()),

chat: a.conversation({
aiModel: a.ai.model('Claude 3.5 Haiku'),
systemPrompt: 'You are a helpful assistant',
tools: [
a.ai.dataTool({
// The name of the tool as it will be referenced in the LLM prompt
name: 'get_weather',
// The description of the tool provided to the LLM.
// Use this to help the LLM understand when to use the tool.
description: 'Gets the weather for a given city',
// A reference to the `a.query()` that the tool will invoke.
query: a.ref('getWeather'),
}),
]
})
.authorization((allow) => allow.owner()),
});

```

----------------------------------------

TITLE: Migrate Auth.signUp Legacy Input to V6 JavaScript
DESCRIPTION: Illustrates how to refactor the legacy positional parameter calling pattern used in older versions of Amplify v5 `Auth.signUp` to the standard named parameter structure required by the functional `signUp` API in v6. Essential user attributes previously passed positionally are now included within the `options.userAttributes` object.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/auth/auth-migration-guide/index.mdx#_snippet_8

LANGUAGE: javascript
CODE:
```

import { signUp } from 'aws-amplify/auth';

const handleSignUp = async ({
username,
password,
email,
phone_number,
validationData
}) => {
const {
isSignUpComplete,
userId,
nextStep
} = await signUp({
username,
password,
options: {
userAttributes: {
email,
phone_number
}
}
});
}

```

----------------------------------------

TITLE: Configuring ignore patterns for dependency directories in hooks-config.json
DESCRIPTION: JSON configuration for specifying directories and files that should be ignored when using command hooks, following the .gitignore specification.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/tools/cli/project/command-hooks/index.mdx#_snippet_6

LANGUAGE: json
CODE:
```

{
"ignore": ["node_modules", "build"]
}

```

----------------------------------------

TITLE: Example CLI Prompts for `amplify import auth`
DESCRIPTION: Shows the initial prompt from the `amplify import auth` command, asking the user whether they want to import a Cognito User Pool and Identity Pool or only a User Pool.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/auth/set-up-auth/index.mdx#_snippet_11

LANGUAGE: console
CODE:
```

? What type of auth resource do you want to import?
Cognito User Pool and Identity Pool
Cognito User Pool only

```

----------------------------------------

TITLE: Querying Post with Comments - Kotlin Coroutines
DESCRIPTION: This Kotlin code snippet uses coroutines to query a Post and its comments. It handles both LazyModelList and LoadedModelList.  The post is identified by ID "123".  The code uses a try-catch block to handle potential ApiException errors during the query or fetch operations.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/relational-models/index.mdx#_snippet_2

LANGUAGE: kotlin
CODE:
```

try {
val response =
Amplify.API.query(ModelQuery[Post::class.java, Post.PostIdentifier("123")])
val post = response.data
val comments = when (val commentsModelList = post.comments) {
is LoadedModelList -> {
commentsModelList.items
}
is LazyModelList -> {
commentsModelList.fetchPage().items
}
}
Log.i("MyAmplifyApp", "Fetched ${comments.size} comments")
} catch (error: ApiException) {
Log.e("MyAmplifyApp", "Failed to fetch post and its comments", error)
}

```

----------------------------------------

TITLE: Identifying Image Labels Using AWS Amplify Predictions in JavaScript
DESCRIPTION: This snippet demonstrates how to detect objects or labels within an image file using AWS Amplify's Predictions.identify method. It uses Promises to handle the asynchronous call, extracting label names and their bounding boxes from the response. The snippet requires @aws-amplify/predictions and a file input representing the image to analyze.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/add-aws-services/predictions/label-image/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```

import { Predictions } from '@aws-amplify/predictions';

Predictions.identify({
labels: {
source: {
file
},
type: 'LABELS'
}
})
.then((response) => {
const { labels } = response;
labels.forEach((object) => {
const { name, boundingBoxes } = object;
});
})
.catch((err) => console.log({ err }));

```

----------------------------------------

TITLE: Interpreting Text Using AWS Amplify Predictions in JavaScript
DESCRIPTION: This JavaScript snippet demonstrates how to use the AWS Amplify Predictions category to interpret text input. It imports Predictions from '@aws-amplify/predictions' and calls Predictions.interpret with a configuration specifying the source text and a type of 'ALL', which requests comprehensive analysis including key phrases, sentiment, syntax, and entities. The result is an object containing the interpretation data. It requires prior Amplify backend setup and configuration.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/js/interpret.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```

import { Predictions } from '@aws-amplify/predictions';

const result = await Predictions.interpret({
text: {
source: {
text: textToInterpret,
},
type: 'ALL'
}
})
console.log({ result });

```

----------------------------------------

TITLE: HTML Implementation of Element Event Tracking with Data Attributes
DESCRIPTION: This HTML example demonstrates how to implement automatic event tracking on a button element using data attributes. It shows how to specify the event type, event name, and custom attributes to be captured when the button is clicked.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/analytics/js/autotrack/page-tracking.mdx#_snippet_3

LANGUAGE: html
CODE:
```

<!-- you want to track this button and send an event when it is clicked -->

<button
  data-amplify-analytics-on="click"
  data-amplify-analytics-name="click"
  data-amplify-analytics-attrs="attr1:attr1_value,attr2:attr2_value"
/>

```

----------------------------------------

TITLE: Configure Amplify in React/React Native
DESCRIPTION: This code configures Amplify using the amplify_outputs.json file within a React or React Native application.  The Amplify configuration is applied where the React application is mounted to ensure that it is available throughout the application.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_7

LANGUAGE: typescript
CODE:
```

import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

```

----------------------------------------

TITLE: Lambda Authorizer Function Response Example - JSON
DESCRIPTION: This snippet shows the example response JSON object that is returned by the Lambda Authorizer. It includes a boolean `isAuthorized` field, a `resolverContext` object, an optional `deniedFields` array, and an optional `ttlOverride` integer.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/customize-authz/custom-data-access-patterns/index.mdx#_snippet_5

LANGUAGE: json
CODE:
```

{
// required
"isAuthorized": true, // if "false" then an UnauthorizedException is raised, access is denied
"resolverContext": { "banana": "very yellow" }, // JSON object visible as $ctx.identity.resolverContext in VTL resolver templates

// optional
"deniedFields": ["TypeName.FieldName"], // Forces the fields to "null" when returned to the client
"ttlOverride": 10 // The number of seconds that the response should be cached for. Overrides default specified in "amplify update api"
}

```

----------------------------------------

TITLE: Configuring Amplify Predictions for Transcription via CLI
DESCRIPTION: Illustrates the interactive command-line prompts presented when running 'amplify add predictions' to set up the transcription feature. It shows selecting 'Transcribe text from audio' and allowing access for both authenticated and guest users.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/transcribe.mdx#_snippet_0

LANGUAGE: console
CODE:
```

? What would you like to convert? (Use arrow keys)
Translate text into a different language
Generate speech audio from text

> Transcribe text from audio

? Who should have access? Auth and Guest users

```

----------------------------------------

TITLE: Customizing AIConversation Timestamp Format (TSX)
DESCRIPTION: Details how to customize the format of the message timestamp displayed next to each message's username. This is done by providing a function to `displayText.getMessageTimestampText` prop, which receives a `Date` object and should return a formatted string. The example uses `Intl.DateTimeFormat` for short time formatting.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/ai-conversation/index.mdx#_snippet_6

LANGUAGE: tsx
CODE:
```

<AIConversation
displayText={{
    getMessageTimestampText: (date) => new Intl.DateTimeFormat('en-US', {
      timeStyle: 'short',
      hour12: true,
      timeZone: 'UTC'
    }).format(date)
  }}
/>

```

----------------------------------------

TITLE: Detect Entities with Amplify - File Input
DESCRIPTION: This code snippet demonstrates how to use the Amplify Predictions API to detect entities in an image uploaded from the browser, using a File object as input. It uses the `Predictions.identify` function and expects a `file` object representing the image.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/js/identify-entity.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```

import { Predictions } from '@aws-amplify/predictions';

const response = await Predictions.identify({
entities: {
source: {
file,
},
}
});
console.log({ response });

```

----------------------------------------

TITLE: Adding Interactions via Amplify CLI
DESCRIPTION: This command adds the Interactions category to your Amplify project, allowing you to configure a chatbot. It prompts you to choose between a sample chatbot or creating one from scratch and guides you through defining intents and slots.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/interactions/js/getting-started.mdx#_snippet_0

LANGUAGE: bash
CODE:
```

amplify add interactions

```

----------------------------------------

TITLE: Importing documentation fragment for multiple JavaScript frameworks
DESCRIPTION: Imports a markdown documentation fragment used across various frameworks and assigns it to different platform keys for rendering framework-specific documentation components.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/storage/autotrack/index.mdx#_snippet_3

LANGUAGE: JavaScript
CODE:
```

import js0 from '/src/fragments/lib-v1/storage/js/autotrack.mdx';

<Fragments
fragments={{
    javascript: js0,
    angular: js0,
    nextjs: js0,
    react: js0,
    vue: js0
  }}
/>

```

----------------------------------------

TITLE: Querying AWS Amplify DataStore with Combined OR Predicates in JavaScript
DESCRIPTION: This JavaScript snippet demonstrates querying the AWS Amplify DataStore's 'Post' model using combined predicates within an OR logical operator. It filters posts to return those with a rating greater than 4 or a status equal to 'ACTIVE'. The snippet requires AWS Amplify DataStore dependencies and assumes the existence of a 'Post' model with 'rating' and 'status' fields, and a 'PostStatus' enumeration. The query lambda function uses 'c.or' to combine the predicates, enabling flexible and compound filtering. The output is an array of 'Post' items matching either condition.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/datastore/js/data-access/query-predicate-or-snippet.mdx#_snippet_0

LANGUAGE: JavaScript
CODE:
```

const posts = await DataStore.query(Post, (c) =>
c.or(c => [
c.rating.gt(4),
c.status.eq(PostStatus.ACTIVE)
]));

```

----------------------------------------

TITLE: Rendering Platform-Specific Fragments with JSX
DESCRIPTION: Uses the Fragments component to conditionally render the appropriate documentation based on the user's platform. It maps each platform identifier to the corresponding imported documentation fragment.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/delete-data/index.mdx#_snippet_4

LANGUAGE: javascript
CODE:
```

<Fragments
fragments={{
    android: android_delete,
    flutter: flutter_delete,
    swift: ios_delete,
    javascript: js_delete,
    angular: js_delete,
    nextjs: js_delete,
    react: js_delete,
    vue: js_delete,
    'react-native': js_delete
  }}
/>

```

----------------------------------------

TITLE: Configuring Amplify Predictions: Identify Entities Console Setup
DESCRIPTION: Provides the console commands and interactive prompts/answers for configuring the AWS Amplify Predictions category for basic entity identification using the default configuration. This setup typically uses Amazon Rekognition. Prerequisites include having run `amplify init` and `amplify add auth`.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/identify-text.mdx#_snippet_7

LANGUAGE: console
CODE:
```

? What would you like to identify?
Identify Text
❯ Identify Entities
Identify Labels
Learn More

? Would you like use the default configuration? Default Configuration

? Who should have access? Auth and Guest users

```

----------------------------------------

TITLE: Renaming Data Models (TypeScript)
DESCRIPTION: This code snippet demonstrates how to rename auto-inferred data models using the `renameModels()` modifier. It improves the API ergonomics by allowing more idiomatic naming conventions for frontend code. It builds upon an existing 'generatedSqlSchema' object.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/index.mdx#_snippet_9

LANGUAGE: typescript
CODE:
```

// Rename models or fields to be more idiomatic for frontend code
const sqlSchema = generatedSqlSchema.authorization(allow => allow.guest())
// highlight-start
.renameModels(() => [
//⌄⌄⌄⌄⌄ existing model name based on table name
['event', 'Event']
// ^^^^^^ renamed data model name
])
// highlight-end

```

----------------------------------------

TITLE: JavaScript: Create CAPTCHA Challenge Lambda Trigger
DESCRIPTION: Lambda function to set CAPTCHA challenge details, such as URL and answer, to be used in the authentication challenge for custom flows.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/auth/js/switch-auth.mdx#_snippet_3

LANGUAGE: JavaScript
CODE:
```

export const handler = async (event) => {
if (!Array.isArray(event?.request?.session) || event?.request?.session?.length) {
event.response.publicChallengeParameters = {
captchaUrl: 'url/123.jpg',
};
event.response.privateChallengeParameters = {
answer: '5',
};
event.response.challengeMetadata = 'CAPTCHA_CHALLENGE';
}
return event;
};

```

----------------------------------------

TITLE: Handling Chatbot Session Completion with AWS Amplify (JavaScript)
DESCRIPTION: This JavaScript snippet shows how to use the `Interactions.onComplete()` method to register a function to handle errors or confirmations after the chatbot session ends. The `handleComplete` function processes errors and confirmation messages, then displays a message using `alert()`. The function takes error and confirmation as parameters. The output is a message after successful session.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/interactions/js/chatbot.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```

const handleComplete = function (err, confirmation) {
if (err) {
alert('bot conversation failed');
return;
}
alert('done: ' + JSON.stringify(confirmation, null, 2));

    return 'Trip booked. Thank you! What would you like to do next?';

}

Interactions.onComplete(botName, handleComplete );

```

----------------------------------------

TITLE: Converting Text-to-Speech in Android Java (Callbacks)
DESCRIPTION: This Java snippet demonstrates how to use the Amplify Predictions API to convert text to speech using a callback-based approach within an Android Activity's onCreate method. It includes a helper method to play the resulting audio stream via Android's MediaPlayer after saving it to a temporary file.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/android/text-speech.mdx#_snippet_1

LANGUAGE: Java
CODE:
```

private final MediaPlayer mp = new MediaPlayer();

@Override
protected void onCreate(Bundle savedInstanceState) {
super.onCreate(savedInstanceState);
setContentView(R.layout.activity_main);

Amplify.Predictions.convertTextToSpeech(
"I like to eat spaghetti",
result -> playAudio(result.getAudioData()),
error -> Log.e("MyAmplifyApp", "Conversion failed", error)
);
}

private void playAudio(InputStream data) {
File mp3File = new File(getCacheDir(), "audio.mp3");

try (OutputStream out = new FileOutputStream(mp3File)) {
byte[] buffer = new byte[8 * 1_024];
int bytesRead;
while ((bytesRead = data.read(buffer)) != -1) {
out.write(buffer, 0, bytesRead);
}  
 mp.reset();
mp.setOnPreparedListener(MediaPlayer::start);
mp.setDataSource(new FileInputStream(mp3File).getFD());
mp.prepareAsync();
} catch (IOException error) {
Log.e("MyAmplifyApp", "Error writing audio file", error);
}
}

```

----------------------------------------

TITLE: Basic Translation in Java
DESCRIPTION: Java implementation for text translation using the configured language settings in Amplify. This code translates the English phrase to Italian based on the backend configuration and logs the result.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/android/translate.mdx#_snippet_1

LANGUAGE: java
CODE:
```

Amplify.Predictions.translateText("I like to eat spaghetti",
result -> Log.i("MyAmplifyApp", result.getTranslatedText()),
error -> Log.e("MyAmplifyApp", "Translation failed", error)
);

```

----------------------------------------

TITLE: Deleting cover art image from storage and dissociating from song in React using AWS Amplify (JavaScript)
DESCRIPTION: This function removes the cover art association from the song record, deletes the image file from S3 storage, and updates local state. It ensures both the record and storage are synchronized.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/graphqlapi/js/working-with-files.mdx#_snippet_25

LANGUAGE: JavaScript
CODE:
```

async function deleteImageForCurrentSong() {
if (!currentSong) return;

try {
const response = await API.graphql({
query: queries.getSong,
variables: { id: currentSong.id }
});

    const song = response?.data?.getSong;

    // If the record has no associated file, we can return early.
    if (!song?.coverArtKey) return;

    const songDetails = {
      id: song.id,
      coverArtKey: null // Set the file association to `null`
    };

    // Remove associated file from record:
    const updatedSong = await API.graphql({
      query: mutations.updateSong,
      variables: { input: songDetails }
    });

    // Delete the file from S3:
    await Storage.remove(song.coverArtKey);

    // Update local state with new record:
    setCurrentSong(updatedSong?.data?.updateSong);
    setCurrentImageUrl(updatedSong?.data?.updateSong?.coverArtKey);

} catch (error) {
console.error('Error deleting image: ', error);
}
}

```

----------------------------------------

TITLE: Querying with Less Than Predicate (Dart)
DESCRIPTION: Illustrates filtering a list query for Post items using a 'less than' predicate. It constructs a ModelQueries.list request and applies a filter to return only those Posts where the RATING attribute is strictly less than a specified numerical value.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/query-data/index.mdx#_snippet_33

LANGUAGE: Dart
CODE:
```

const rating = 5;

final request = ModelQueries.list(
Post.classType,
where: Post.RATING.lt(rating),
);
final response = await Amplify.API.query(request: request).response;

final data = response.data?.items ?? <Post?>[];

```

----------------------------------------

TITLE: Handling fallback for missing response components
DESCRIPTION: Provides an example of how to specify a fallback response component for situations where a response component has been removed or undefined in the current code but exists in conversation history stored in a database. The fallback renders JSON stringified props for debugging or basic fallback display.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/response-components/index.mdx#_snippet_2

LANGUAGE: TypeScript
CODE:
```

<AIConversation
// highlight-start
FallBackResponseComponent={(props) => {
return <>{JSON.stringify(props)}</>
}}
// highlight-end
/>

```

----------------------------------------

TITLE: Identifying Image Labels using Amplify Predictions in Java (Callbacks)
DESCRIPTION: Demonstrates how to use the `Amplify.Predictions.identify` method in Java with `LabelType.LABELS` to detect objects within a `Bitmap` image. It utilizes an asynchronous callback pattern to handle the `IdentifyLabelsResult`, logging the name of the first identified label upon success, or logging an error upon failure.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/android/label-image.mdx#_snippet_1

LANGUAGE: java
CODE:
```

public void detectLabels(Bitmap image) {
Amplify.Predictions.identify(
LabelType.LABELS,
image,
result -> {
IdentifyLabelsResult identifyResult = (IdentifyLabelsResult) result;
Label label = identifyResult.getLabels().get(0);
Log.i("MyAmplifyApp", label.getName());
},
error -> Log.e("MyAmplifyApp", "Label detection failed", error)
);
}

```

----------------------------------------

TITLE: Transcribing Audio Bytes to Text using Amplify Predictions API (JavaScript)
DESCRIPTION: Demonstrates using the Amplify JavaScript library's `Predictions.convert` method to transcribe audio data provided as a byte buffer (`bytes`). The function returns a promise that resolves with the transcription result, specifically extracting the `fullText`. Error handling is included via `.catch`. An optional `language` parameter (commented out) can be used to specify the source audio language.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/transcribe.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```

Predictions.convert({
transcription: {
source: {
bytes
}
// language: "en-US",
}
})
.then(({ transcription: { fullText } }) => console.log({ fullText }))
.catch((err) => console.log({ err }));

```

----------------------------------------

TITLE: Implementing a Basic Node.js Lambda Handler (JavaScript)
DESCRIPTION: Defines an asynchronous Node.js Lambda function handler (`exports.handler`) intended for the file `amplify/backend/function/greetingfunction/src/index.js`. It constructs and returns a standard API Gateway response object with a 200 status code, a JSON body containing '{ "message": "Hello from Lambda" }', and an 'Access-Control-Allow-Origin: *' header for CORS.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/nodejs-api/index.mdx#_snippet_2

LANGUAGE: javascript
CODE:
```

exports.handler = async (event) => {
const body = {
message: 'Hello from Lambda'
};
const response = {
statusCode: 200,
body: JSON.stringify(body),
headers: {
'Access-Control-Allow-Origin': '\*'
}
};
return response;
};

```

----------------------------------------

TITLE: Incorrect HTML Link Syntax
DESCRIPTION: This example demonstrates the incorrect way to create links using HTML tags within markdown documents. It's against the current documentation linting rules, which enforce the use of Markdown syntax for creating hyperlinks.
SOURCE: https://github.com/aws-amplify/docs/blob/main/STYLEGUIDE.md#_snippet_4

LANGUAGE: html
CODE:
```

<a href="/some-link">Use html link tags</a>

```

----------------------------------------

TITLE: Querying Comments by Parent Post ID with Nested Predicates in AWS Amplify DataStore (JavaScript)
DESCRIPTION: This code demonstrates querying Comment models that are related to a particular Post by filtering using a nested predicate on post.id. The snippet uses JavaScript and the AWS Amplify DataStore API. Required dependencies are proper model definitions for Post and Comment, and an Amplify DataStore setup. The function accepts a post ID and returns a filtered array of comments whose post.id matches the given string. Useful for direct retrieval of all comments for a post without loading the entire post object.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/datastore/js/relational/query-snippet.mdx#_snippet_4

LANGUAGE: JavaScript
CODE:
```

const comments = await DataStore.query(Comment, c => c.post.id.eq('YOUR_POST_ID'));

```

----------------------------------------

TITLE: API Gateway Resource Structure Tree - AWS Console - Console
DESCRIPTION: This snippet displays the hierarchy and available methods for the API resources as shown in the API Gateway console. It outlines /todos as the main resource, lists the methods (ANY, OPTIONS), and describes proxy patterns. Useful for context when selecting and testing specific routes in the console UI.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/test-api/index.mdx#_snippet_10

LANGUAGE: console
CODE:
```

/  
 |_ /todos Main resource. Eg: /todos
ANY Includes methods: DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT
OPTIONS Allow pre-flight requests in CORS by browser
|_ /{proxy+} Proxy resource. Eg: /todos/, /todos/id, todos/object/{id}
ANY Includes methods: DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT
OPTIONS Allow pre-flight requests in CORS by browser

```

----------------------------------------

TITLE: Rendering Platform-Specific Fragments - JavaScript
DESCRIPTION: This code uses a `<Fragments>` component and a `fragments` object to dynamically render platform-specific content. The `fragments` object associates platform names with the `common_getting_started` content, providing a mechanism to display identical content across multiple platforms. This component presumably handles rendering the appropriate content based on the selected platform.  The keys in the fragments object specifies a platform, while the value is the fragment itself.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/set-up-rest-api/index.mdx#_snippet_5

LANGUAGE: javascript
CODE:
```

<Fragments
fragments={{
    android: common_getting_started,
    flutter: common_getting_started,
    swift: common_getting_started,
    javascript: common_getting_started,
    angular: common_getting_started,
    nextjs: common_getting_started,
    react: common_getting_started,
    vue: common_getting_started,
    'react-native': common_getting_started
  }}
/>

```

----------------------------------------

TITLE: Deleting Todo by ID with Amplify API (Dart)
DESCRIPTION: Deletes a Todo object by its ID using `Amplify.API.mutate`. It requires the Todo class type and the ID of the Todo to delete. This is useful when the Todo instance is not readily available in memory. The function sends a GraphQL mutation request to delete the Todo by ID in the backend and prints the response.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/graphqlapi/flutter/mutate-data.mdx#_snippet_2

LANGUAGE: dart
CODE:
```

// or delete by ID, ideal if you do not have the instance in memory, yet
Future<void> deleteTodoById(Todo todoToDelete) async {
final request = ModelMutations.deleteById(Todo.classType, '8e0dd2fc-2f4a-4dc4-b47f-2052eda10775');
final response = await Amplify.API.mutate(request: request).response;
safePrint('Response: $response');
}

```

----------------------------------------

TITLE: Paginating Query Results in JavaScript Frameworks
DESCRIPTION: Demonstrates importing pagination snippets for JavaScript-based frameworks, allowing retrieval of limited data sets via page number and limit.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/datastore/native_common/data-access.mdx#_snippet_50

LANGUAGE: MDX
CODE:
```

import js34 from '/src/fragments/lib/datastore/lib/data-access/query-pagination-snippet.mdx';

```

----------------------------------------

TITLE: JavaScript: Delete Image and Dissociate from Song Record
DESCRIPTION: This async function retrieves the current song, removes its associated cover art image file from storage, and updates the record to reflect the removal. It handles errors and updates the local UI state upon success.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/working-with-files/index.mdx#_snippet_41

LANGUAGE: JavaScript
CODE:
```

async function deleteImageForCurrentSong() {
if (!currentSong) return;
try {
const response = await client.models.Song.get({
id: currentSong.id,
});
const song = response?.data;
if (!song?.coverArtPath) return;
await remove({ path: song.coverArtPath });
const updatedSong = await client.models.Song.update({
id: song.id,
coverArtPath: null,
});
setCurrentSong(updatedSong.data);
setCurrentImageUrl(updatedSong.data?.coverArtPath);
} catch (error) {
console.error("Error deleting image: ", error);
}
}

```

----------------------------------------

TITLE: amplify-meta.json category metadata structure
DESCRIPTION: Shows a sample structure for category metadata within the `amplify-meta.json` file. This file is used internally by the CLI core and the plugins. It exemplifies how metadata is structured for categories with multiple services (e.g., interactions category with multiple bots).
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/tools/cli/reference/files/index.mdx#_snippet_1

LANGUAGE: json
CODE:
```

{
"<category>": {
"<service1>": {
//service1 metadata
},
"<service2>": {
//service2 metadata
}
}
}

```

----------------------------------------

TITLE: Identifying Both Labels and Unsafe Content in Images Using Amplify Predictions in TypeScript
DESCRIPTION: This snippet illustrates how to simultaneously detect both labels (objects) and unsafe content in a single call to AWS Amplify Predictions. Using async/await, the identify method is called with the type 'ALL', returning an object containing both 'labels' and 'unsafe' properties. The snippet requires an image file input and the @aws-amplify/predictions library.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/add-aws-services/predictions/label-image/index.mdx#_snippet_2

LANGUAGE: typescript
CODE:
```

import { Predictions } from '@aws-amplify/predictions';

const { labels, unsafe } = await Predictions.identify({
labels: {
source: {
file
},
type: 'ALL'
}
})

```

----------------------------------------

TITLE: Detecting Unsafe Content in an Image Using AWS Amplify Predictions (JavaScript)
DESCRIPTION: This code illustrates using AWS Amplify Predictions to assess an image for unsafe content, returning a boolean flag. It utilizes the same Predictions API but sets the type to 'UNSAFE'. It requires the '@aws-amplify/predictions' library and captures the unsafe content status from the response.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/js/label-image.mdx#_snippet_2

LANGUAGE: JavaScript
CODE:
```

import { Predictions } from '@aws-amplify/predictions';

Predictions.identify({
labels: {
source: {
file
},
type: 'UNSAFE'
}
})
.then((response) => {
const { unsafe } = response; // boolean
})
.catch((err) => console.log({ err }));

```

----------------------------------------

TITLE: Querying Post Comments with toArray in AWS Amplify DataStore (TypeScript)
DESCRIPTION: This snippet demonstrates how to query a single Post model by its ID and then load all related Comment models by calling the toArray() function on the post.comments association. The code uses async/await syntax and TypeScript's type safety. Dependencies include the DataStore API from AWS Amplify and a properly configured DataStore schema with Post and Comment models. The input is a string representing the post ID, and the output is an array of comment objects related to the post. This method lazily loads related comments for the retrieved post instance.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/datastore/js/relational/query-snippet.mdx#_snippet_0

LANGUAGE: TypeScript
CODE:
```

const post = await DataStore.query(Post, "YOUR_POST_ID")
if (post) {
const comments = await post.comments.toArray()
}

```

----------------------------------------

TITLE: Defining AppSync Resolver Stack Mapping in transform.conf.json
DESCRIPTION: Shows the JSON structure required within the `transform.conf.json` file to configure `StackMapping`. This allows mapping specific AppSync resolver logical IDs to custom CloudFormation stack names, helping to avoid stack resource limits in large GraphQL schemas. Replace `<Resolver logical ID>` with the actual ID obtained from `amplify api gql-compile`.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/modify-amplify-generated-resources/index.mdx#_snippet_20

LANGUAGE: json
CODE:
```

{
"Version": 5,
"ElasticsearchWarning": true,
"StackMapping": {
"<Resolver logical ID>": "Custom stack name"
}
}

```

----------------------------------------

TITLE: Sending Messages to Bot with AWS Amplify Interactions (JavaScript)
DESCRIPTION: This snippet demonstrates how to send a text message to a configured chatbot using the AWS Amplify Interactions library in a JavaScript or TypeScript React app. It imports the required Interactions module, uses the send() method with parameters for botName and user input message, and logs the response from the bot. Dependencies include @aws-amplify/interactions and a configured Amplify project. The expected input is a string message and the bot's name; the output is the chatbot's response message. The send() method returns a Promise and must be awaited.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/add-aws-services/interactions/chatbot/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```

import { Interactions } from '@aws-amplify/interactions';

const userInput = "I want to reserve a hotel for tonight";

// Provide a bot name and user input
const response = await Interactions.send({
botName: "TheBotName",
message: userInput
});

// Log chatbot response
console.log(response.message);

```

----------------------------------------

TITLE: Define Auth Challenge Lambda Trigger (CAPTCHA) - JavaScript
DESCRIPTION: This JavaScript code defines a Lambda trigger for defining the custom CAPTCHA challenge flow. It checks the session length and determines whether to send a `CUSTOM_CHALLENGE` or issue tokens. This Lambda function requires access to the `event` object provided by AWS Lambda.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/auth/ios/signin_with_custom_flow/50_custom_challenge.mdx#_snippet_5

LANGUAGE: javascript
CODE:
```

export const handler = async (event) => {
if (!event.request.session || event.request.session.length === 0) {
// If we don't have a session or it is empty then send a CUSTOM_CHALLENGE
event.response.challengeName = "CUSTOM_CHALLENGE";
event.response.failAuthentication = false;
event.response.issueTokens = false;
} else if (event.request.session.length === 1 && event.request.session[0].challengeResult === true) {
// If we passed the CUSTOM_CHALLENGE then issue token
event.response.failAuthentication = false;
event.response.issueTokens = true;
} else {
// Something is wrong. Fail authentication
event.response.failAuthentication = true;
event.response.issueTokens = false;
}

    return event;

};

```

----------------------------------------

TITLE: Amplify CLI Configuration for Identify Entities
DESCRIPTION: This code snippet demonstrates the command-line configuration steps to enable the 'Identify Entities' feature using AWS Amplify Predictions.  It shows the interactive prompts and expected answers to configure the feature with default and advanced options, including enabling celebrity detection and indexing images from a collection.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/identify-entity.mdx#_snippet_0

LANGUAGE: console
CODE:
```

? What would you like to identify?
Identify Text
❯ Identify Entities
Identify Labels
Learn More

? Would you like use the default configuration? Default Configuration

? Who should have access? Auth and Guest users

```

----------------------------------------

TITLE: Embedding Restaurants Component in Main HTML (`src/app/app.component.html`)
DESCRIPTION: Replaces the default app component content with the `<app-restaurants>` selector to render the restaurants component within the main application template.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/start/getting-started/angular/data-model.mdx#_snippet_11

LANGUAGE: HTML
CODE:
```

<app-restaurants></app-restaurants>

```

----------------------------------------

TITLE: Configuring Amplify Predictions for Text Interpretation via CLI
DESCRIPTION: Demonstrates the interactive command-line process using `amplify add predictions` to configure the Predictions category for interpreting text features like language, entities, key phrases, sentiment, and syntax. It shows selecting 'Interpret Text', choosing 'All' interpretation types, and allowing access for 'Auth and Guest users'. Requires `amplify init` and `amplify add auth` to be run beforehand. The subsequent `amplify push` command deploys these resources.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/ios/interpret.mdx#_snippet_0

LANGUAGE: console
CODE:
```

? Please select from one of the categories below
Identify
Convert
❯ Interpret
Infer
Learn More

? What would you like to interpret? (Use arrow keys)
❯ Interpret Text

? Provide a friendly name for your resource
<Enter a friendly name here>

? What kind of interpretation would you like?
Language
Entity
Keyphrase
Sentiment
Syntax
❯ All

? Who should have access?
Auth users only
❯ Auth and Guest users

```

----------------------------------------

TITLE: Generating Static Paths for Multi-Platform Support
DESCRIPTION: This asynchronous function imports a utility to generate custom static paths based on the supported platforms specified in the metadata. It facilitates static site generation for different frameworks.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/more-features/in-app-messaging/set-up-in-app-messaging/index.mdx#_snippet_1

LANGUAGE: JavaScript
CODE:
```

export const getStaticPaths = async () => {
return getCustomStaticPath(meta.platforms);
};

```

----------------------------------------

TITLE: TypeScript: Create CAPTCHA Challenge Lambda Trigger
DESCRIPTION: Lambda function to generate CAPTCHA challenge parameters, including challenge image URL and answer, during the CreateAuthChallenge step in custom authentication workflows.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/auth/js/switch-auth.mdx#_snippet_2

LANGUAGE: TypeScript
CODE:
```

import { Handler } from 'aws-lambda';

export const handler: Handler = async (event) => {
if (!event?.request?.session || event?.request?.session?.length === 0) {
event.response.publicChallengeParameters = {
captchaUrl: 'url/123.jpg',
};
event.response.privateChallengeParameters = {
answer: '5',
};
event.response.challengeMetadata = 'CAPTCHA_CHALLENGE';
}
return event;
};

```

----------------------------------------

TITLE: getStaticPaths Function
DESCRIPTION: This asynchronous function generates static paths for each platform specified in the `meta.platforms` array.  It utilizes the `getCustomStaticPath` utility function, passing the platforms array as an argument to generate the paths.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/troubleshooting/index.mdx#_snippet_2

LANGUAGE: javascript
CODE:
```

export const getStaticPaths = async () => {
return getCustomStaticPath(meta.platforms);
};

```

----------------------------------------

TITLE: Configuring Metadata for Image Labeling Documentation - JavaScript
DESCRIPTION: Declares the meta object containing the documentation title, description, and supported platforms for the image labeling guide. This object is later used to drive static generation and provide context to other parts of the application. No external dependencies are required except for where this metadata is consumed.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/more-features/predictions/label-image/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```

export const meta = {
title: 'Label objects in an image',
description: 'Learn more about how to detect labels in an image using Amplify. For example, you can detect if an image has objects such as chairs or desks.',
platforms: [
'swift',
'android',
'javascript',
'react-native',
'angular',
'nextjs',
'react',
'vue'
]
};

```

----------------------------------------

TITLE: Text-to-Speech Conversion with Amplify Predictions
DESCRIPTION: This JavaScript snippet demonstrates how to use the AWS Amplify Predictions API to convert text to speech. It imports the Predictions module, then calls the convert method with a configuration object that specifies the text to convert and the voice ID. The result is an audio buffer that can be used for playback.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/js/text-speech.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```

import { Predictions } from '@aws-amplify/predictions';

Predictions.convert({
textToSpeech: {
source: {
text: textToGenerateSpeech
},
voiceId: "Amy" // default configured on amplifyconfiguration.json
}
})
.then(result => console.log({ result }))
.catch(err => console.log({ err }));

```

----------------------------------------

TITLE: Defining Metadata
DESCRIPTION: This code defines a constant object `meta` that contains metadata such as the page title, description, and supported platforms.  This metadata is used to manage and describe the page's content, likely for SEO purposes and/or UI display. The `platforms` array specifies the supported frameworks or environments.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-ui/uibuilder/theming/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```

export const meta = {
title: 'Theming',
description: 'Configure your Amplify-generated UI components to match your brand using the Amplify Theme Editor Figma plugin',
platforms: [
'javascript',
'react',
'nextjs'
]
};

```

----------------------------------------

TITLE: Defining Metadata for Documentation Pages in JavaScript
DESCRIPTION: This snippet exports a metadata object containing the title, description, route, and supported platforms for documentation pages, facilitating consistent page information and routing.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/reference/index.mdx#_snippet_0

LANGUAGE: JavaScript
CODE:
```

export const meta = {
title: 'Reference',
description: 'Overview of available references.',
route: '/[platform]/reference',
platforms: [
'android',
'angular',
'flutter',
'javascript',
'nextjs',
'react',
'react-native',
'swift',
'vue'
]
};

```

----------------------------------------

TITLE: Defining Page Metadata - JavaScript
DESCRIPTION: Defines and exports the `meta` constant object containing key information for the page, such as title, description, supported platforms (Angular, React, Vue, etc.), and the base route path. This metadata drives the static generation process.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/interactions/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```

export const meta = {
title: 'Interactions',
description:
'Automate customer workflows by enlisting the help of conversational chatbots powered by deep learning technologies',
platforms: [
'angular',
'javascript',
'nextjs',
'react',
'react-native',
'vue'
],
route: '/gen1/[platform]/build-a-backend/more-features/interactions'
};

```

----------------------------------------

TITLE: Translating Text using Amplify Predictions - Swift (Combine)
DESCRIPTION: This Swift code snippet translates text from English to Italian using the Amplify Predictions category and Combine framework. It defines a function that takes a string as input. Inside the function, it uses `Amplify.Publisher.create` to handle asynchronous operations and `sink` to subscribe to the publisher. It prints the translated text or an error message to the console. The code requires the Amplify framework and Combine to be imported. It utilizes the `translateText` method and handles completion and values using `sink`.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/ios/translate.mdx#_snippet_1

LANGUAGE: swift
CODE:
```

func translateText(text: String) -> AnyCancellable {
Amplify.Publisher.create {
try await Amplify.Predictions.convert(
.translateText(text, from: .english, to: .italian)
)
}
.sink(receiveCompletion: { completion in
if case let .failure(error) = completion {
print("Error translating text: \(error)")
}
}, receiveValue: { value in
print("Translated text: \(value.text)")
})
}

```

----------------------------------------

TITLE: Confirming USER_AUTH Sign-in with WEB_AUTHN in Java
DESCRIPTION: Demonstrates how to confirm the USER_AUTH sign-in flow in Java after the user has selected a factor, specifically showing the confirmation for WEB_AUTHN. Requires providing the challenge response (derived from the selected factor) and options including the calling Activity. Handles success and error outcomes using callbacks.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/auth/connect-your-frontend/switching-authentication-flows/index.mdx#_snippet_15

LANGUAGE: Java
CODE:
```

AuthConfirmSignInOptions options = AWSCognitoAuthConfirmSignInOptions.builder()
.callingActivity(activity)
.build();
Amplify.Auth.confirmSignIn(
AuthFactorType.WEB_AUTHN.getChallengeResponse(),
options,
result -> Log.i("AuthQuickStart", "Next step for sign in is " + result.getNextStep()),
error -> Log.e("AuthQuickStart", "Failed to confirm sign in", error)
);

```

----------------------------------------

TITLE: Amplify Add API Interactive Prompts (Console)
DESCRIPTION: Shows the sequence of interactive prompts and example answers required when running 'amplify add api'. The user selects REST, provides endpoint paths and Lambda configuration, and specifies access settings. Required dependencies include the AWS Amplify CLI, and the output defines API resource configuration in the project. Inputs include resource names, endpoints, Lambda options, and access settings.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/restapi/js/getting-started/11_amplifyInit.mdx#_snippet_1

LANGUAGE: console
CODE:
```

? Please select from one of the below mentioned services:
`REST`
? Provide a friendly name for your resource to be used as a label for this category in the project:
`todoApi`
? Provide a path (e.g., /book/{isbn}):
`/todo`
? Choose a Lambda source
`Create a new Lambda function`
? Provide the AWS Lambda function name:
`todoFunction`
? Choose the function runtime that you want to use:
`NodeJS`
? Choose the function template that you want to use:
`Serverless ExpressJS function (Integration with API Gateway)`
? Do you want to access other resources created in this project from your Lambda function?
`No`
? Do you want to invoke this function on a recurring schedule?
`No`
? Do you want to edit the local lambda function now?
`No`
? Restrict API access
`No`
? Do you want to add another path?
`No`

```

----------------------------------------

TITLE: Querying Echo Resolver (GraphQL)
DESCRIPTION: Provides an example GraphQL query to test the `echo` resolver implemented by the Lambda function. It calls the `echo` query with the argument `msg: "Hello world!"`, demonstrating how a client would invoke this specific operation.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/lambda-graphql-resolvers/index.mdx#_snippet_9

LANGUAGE: graphql
CODE:
```

query echo {
echo(msg: "Hello world!")
}

```

----------------------------------------

TITLE: Configuring AWS Role Policy for Lambda Functions in TypeScript
DESCRIPTION: Shows how to update the backend stack to include appropriate AWS IAM permissions for Lambda functions that call external services, ensuring secure and authorized access to AWS resources required by the custom query Lambda functions.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/tools/index.mdx#_snippet_3

LANGUAGE: TypeScript
CODE:
```

import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { getWeather } from "./functions/getWeather/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
auth,
data,
getWeather
});

backend.getWeather.resources.lambda.addToRolePolicy(
new PolicyStatement({
resources: ["[resource arn]"],
actions: ["[action]"]
})
);

```

----------------------------------------

TITLE: Making a DELETE Request with Amplify API (TypeScript)
DESCRIPTION: Demonstrates how to delete an item using the `del` function from `aws-amplify/api`. It specifies the target API name ('myRestApi') and the path to the resource ('items/1'). The code includes basic error handling using a try-catch block to log success or failure, parsing the error response body if the call fails.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/add-aws-services/rest-api/delete-data/index.mdx#_snippet_0

LANGUAGE: typescript
CODE:
```

import { del } from 'aws-amplify/api';

async function deleteItem() {
try {
const restOperation = del({
apiName: 'myRestApi',
path: 'items/1',
});
await restOperation.response;
console.log('DELETE call succeeded');
} catch (e) {
console.log('DELETE call failed: ', JSON.parse(e.response.body));
}
}

```

----------------------------------------

TITLE: Identifying Tables from File: Amplify JavaScript
DESCRIPTION: Demonstrates how to request structured table detection from an image file using the `format: "TABLE"` option. The response includes a `tables` array, where each object represents a detected table. It contains the table's `size` (rows, columns) and a `table` matrix providing details for each cell (text, location, selection status, row/column span). Dependencies: Configured Predictions category.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/identify-text.mdx#_snippet_5

LANGUAGE: javascript
CODE:
```

Predictions.identify({
text: {
source: {
file
},
format: "TABLE",
}
})
.then(response => {
const {
text: {
// same as PLAIN +
tables : [
{
size: { rows, columns },
table // Matrix Array[ Array ] of size rows
// each element of the array contains { text, boundingBox, polygon, selected, rowSpan, columnSpan}
}
]
}  
 } = response
})
.catch(err => console.log({ err }));

```

----------------------------------------

TITLE: Defining Page Metadata for Documentation - JavaScript
DESCRIPTION: Creates a metadata object containing the title, description, and a list of supported platforms for the page. This object is referenced by other functions in the file and drives dynamic rendering and routing. No external dependencies are required for defining this object, but it is used by other utilities to configure static paths and properties.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/more-features/datastore/authz-rules-setup/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```

export const meta = {
title: 'Set up authorization rules',
description: 'Learn how to apply authorization rules to your models with the @auth directive',
platforms: [
'flutter',
'swift',
'android',
'javascript',
'react-native',
'angular',
'nextjs',
'react',
'vue'
]
};

```

----------------------------------------

TITLE: Importing and Rendering Fragment Components for Multiple Frameworks
DESCRIPTION: This snippet imports a sample MDX fragment and renders it across various frameworks via the 'Fragments' component, mapping framework names to the same fragment. It demonstrates multi-platform component embedding within a single page structure, ensuring consistent content across different environments.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/more-features/predictions/example-app/index.mdx#_snippet_3

LANGUAGE: JavaScript
CODE:
```

import sampleJs from '/src/fragments/lib-v1/predictions/js/sample.mdx';

<Fragments
fragments={{
    javascript: sampleJs,
    'react-native': sampleJs,
    angular: sampleJs,
    nextjs: sampleJs,
    react: sampleJs,
    vue: sampleJs
  }}
/>

```

----------------------------------------

TITLE: Importing and Rendering Fragments for Android (Javascript)
DESCRIPTION: This snippet imports a markdown fragment (android_maintenance) and renders it using the Fragments component for android.  The Fragments component receives an object with one key, 'android', and the value, the android_maintenance content, allowing the component to target the correct platform.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/graphqlapi/api-graphql-concepts/index.mdx#_snippet_4

LANGUAGE: javascript
CODE:
```

<Fragments fragments={{ android: android_maintenance }} />

```

----------------------------------------

TITLE: Generating Speech from Text Using Amplify Predictions TextToSpeech in React (JavaScript)
DESCRIPTION: This React component lets users enter text and convert it to speech using Amplify Predictions convert API's textToSpeech feature. It manages state for input text and response messages, asynchronously makes the API call for speech generation, decodes the returned audio stream, and plays it using the Web Audio API. The voiceId can be configured, with 'Amy' as the default. It handles errors and displays status messages to the user.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/js/sample.mdx#_snippet_7

LANGUAGE: javascript
CODE:
```

function TextToSpeech() {
const [response, setResponse] = useState('...')
const [textToGenerateSpeech, setTextToGenerateSpeech] = useState('write to generate audio');

const generateTextToSpeech = async () => {
setResponse('Generating audio...');

    try {
      const result = await Predictions.convert({
        textToSpeech: {
          source: {
            text: textToGenerateSpeech,
          },
          voiceId: 'Amy' // default configured on amplifyconfiguration.json
          // list of different options are here https://docs.aws.amazon.com/polly/latest/dg/voicelist.html
        }
      });

      let AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const source = audioCtx.createBufferSource();
      audioCtx.decodeAudioData(result.audioStream, (buffer) => {
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start(0);
      }, (err) => console.log({ err }));

      setResponse('Generation completed');
    } catch(err: unknown) {
      setResponse(JSON.stringify(err, null, 2));
    }

}

const setText = (event) => {
setTextToGenerateSpeech(event.target.value);
}

return (
<div>
<div>
<h3>Text To Speech</h3>
<input type="text" value={textToGenerateSpeech} onChange={setText}></input>
<button onClick={generateTextToSpeech}>Text to Speech</button>
<h3>{response}</h3>
</div>
</div>
);
}

```

----------------------------------------

TITLE: Amplify CLI: Configuration Prompts for JavaScript
DESCRIPTION: Illustrates expected user input in the console when pushing Amplify project with JavaScript. Includes choices for code generation, language target and file name patterns.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/start/getting-started/data-model/index.mdx#_snippet_10

LANGUAGE: console
CODE:
```

✔ Are you sure you want to continue? (Y/n) · yes
...
? Do you want to generate code for your newly created GraphQL API Yes
? Choose the code generation language target javascript
? Enter the file name pattern of graphql queries, mutations and subscriptions src/graphql/\*_/_.js
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions Yes
? Enter maximum statement depth [increase from default if your schema is deeply nested] 2
? Enter the file name for the generated code src/API.js

```

----------------------------------------

TITLE: Configuring IAM Policies and ML Predictions Backend with AWS CDK in TypeScript
DESCRIPTION: This snippet defines a backend configuration using AWS Amplify's backend definition utilities combined with AWS CDK's IAM PolicyStatement to attach necessary permissions for multiple ML services to the unauthenticated Cognito Identity Pool role. It includes actions for Amazon Translate, Polly, Transcribe, Comprehend, Rekognition, and Textract, enabling all supported ML features. The snippet also adds a custom output configuration that defines default settings (e.g., languages, voice IDs) and regions for predictions services. Dependencies include aws-cdk-lib/aws-iam, @aws-amplify/backend, and a local auth resource module. It expects integration with Amplify's backend setup and IAM roles.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/add-aws-services/predictions/set-up-predictions/index.mdx#_snippet_0

LANGUAGE: typescript
CODE:
```

import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";

const backend = defineBackend({
auth,
});

// Configure a policy for the required use case.
// The actions included below cover all supported ML capabilities
backend.auth.resources.unauthenticatedUserIamRole.addToPrincipalPolicy(
new PolicyStatement({
actions: [
"translate:TranslateText",
"polly:SynthesizeSpeech",
"transcribe:StartStreamTranscriptionWebSocket",
"comprehend:DetectSentiment",
"comprehend:DetectEntities",
"comprehend:DetectDominantLanguage",
"comprehend:DetectSyntax",
"comprehend:DetectKeyPhrases",
"rekognition:DetectFaces",
"rekognition:RecognizeCelebrities",
"rekognition:DetectLabels",
"rekognition:DetectModerationLabels",
"rekognition:DetectText",
"rekognition:DetectLabel",
"rekognition:SearchFacesByImage",
 "textract:AnalyzeDocument",
"textract:DetectDocumentText",
"textract:GetDocumentAnalysis",
"textract:StartDocumentAnalysis",
"textract:StartDocumentTextDetection",
],
resources: ["*"],
})
);

backend.addOutput({
custom: {
Predictions: {
convert: {
translateText: {
defaults: {
sourceLanguage: "en",
targetLanguage: "es",
},
proxy: false,
region: backend.auth.stack.region,
},
speechGenerator: {
defaults: {
voiceId: "Ivy",
},
proxy: false,
region: backend.auth.stack.region,
},
transcription: {
defaults: {
language: "en-US",
},
proxy: false,
region: backend.auth.stack.region,
},
},
identify: {
identifyEntities: {
defaults: {
collectionId: "default",
maxEntities: 10,
},
celebrityDetectionEnabled: true,
proxy: false,
region: backend.auth.stack.region,
},
identifyLabels: {
defaults: {
type: "ALL",
},
proxy: false,
region: backend.auth.stack.region,
},
identifyText: {
defaults: {
format: "ALL",
},
proxy: false,
region: backend.auth.stack.region,
},
},
interpret: {
interpretText: {
defaults: {
type: "ALL",
},
proxy: false,
region: backend.auth.stack.region,
},
},
},
},
});

```

----------------------------------------

TITLE: Configuring AWS Amplify Interactions with Bots in JavaScript
DESCRIPTION: This snippet illustrates setting up AWS Amplify Interactions with a bot named 'BookTrip' in a specific AWS region. It includes authentication via Cognito identity pool and defining bots with their alias and region. It facilitates creating chat interfaces linked to AWS Lex bots or similar services.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/client-configuration/js/js-configuration.mdx#_snippet_12

LANGUAGE: JavaScript
CODE:
```

Amplify.configure({
Auth: {
identityPoolId: 'us-east-1:xxx-xxx-xxx-xxx-xxx', // (required) Identity Pool ID
region: 'us-east-1' // (required) Identity Pool region
},
Interactions: {
bots: {
BookTrip: {
name: 'BookTrip',
alias: '$LATEST',
region: 'us-east-1'
}
}
}
});

```

----------------------------------------

TITLE: Lazy Loading Related Models with toArray (TypeScript)
DESCRIPTION: Queries a Post model by ID and then lazily loads its associated comments using the `toArray()` method on the relationship property. This method returns an array of the related models.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/datastore/js/relational/query-snippet.mdx#_snippet_0

LANGUAGE: TypeScript
CODE:
```

const post = await DataStore.query(Post, "YOUR_POST_ID")
if (post) {
const comments = await post.comments.toArray()
}

```

----------------------------------------

TITLE: Amplify mock interactive resource selection prompt - console
DESCRIPTION: Displays the interactive console prompt shown when executing 'amplify mock' in a project with multiple mockable resource categories. The prompt allows the user to choose which category or categories to mock locally, helping to configure local testing environments more precisely.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/tools/cli/usage/mock/index.mdx#_snippet_9

LANGUAGE: console
CODE:
```

? Select the category … (Use arrow keys or type to filter)
❟● GraphQL API
○ Function
○ Storage

```

----------------------------------------

TITLE: Defining a Single-Field Custom Identifier in TypeScript
DESCRIPTION: Shows how to define a `Todo` model with a custom single-field identifier named `todoId` using the `.identifier(['todoId'])` method in the schema definition. The `todoId` field is explicitly defined as `a.id().required()`.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/data-modeling/identifiers/index.mdx#_snippet_3

LANGUAGE: typescript
CODE:
```

const schema = a.schema({
Todo: a.model({
todoId: a.id().required(),
content: a.string(),
completed: a.boolean(),
})
.identifier(['todoId'])
.authorization(allow => [allow.publicApiKey()]),
});

```

----------------------------------------

TITLE: Configure Amplify in Next.js (App Router) - Root Layout
DESCRIPTION: This code snippet demonstrates how to render the Amplify configuration component in the root layout of a Next.js application using the app router. It imports the ConfigureAmplify component and renders it within the root layout to initialize Amplify for the entire application.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_10

LANGUAGE: typescript
CODE:
```

import { ConfigureAmplify } from "./ConfigureAmplify";

export default function RootLayout({
children,
}: Readonly<{ children: React.ReactNode; }>) {
return (
<html lang="en">
<body>
<ConfigureAmplify />
{children}
</body>
</html>
);
}

```

----------------------------------------

TITLE: Creating REST API endpoint with new Lambda function - Console Output
DESCRIPTION: This console output shows the prompts and selections made when creating a REST API endpoint that triggers a new Lambda function using the Amplify CLI.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/configure-rest-api/index.mdx#_snippet_10

LANGUAGE: console
CODE:
```

? Please select from one of the below mentioned services REST
? Provide a friendly name for your resource to be used as a label for this category in the project: itemsApi
? Provide a path (e.g., /book/\{isbn}) /items
? Choose a Lambda source Create a new Lambda function
? Provide a friendly name for your resource to be used as a label for this category in the project: itemsLambda
? Provide the AWS Lambda function name: itemsLambda
? Choose the function template that you want to use:
CRUD function for Amazon DynamoDB
❯ Serverless ExpressJS function

```

----------------------------------------

TITLE: Defining Metadata for Responding to Interaction Events in JavaScript
DESCRIPTION: Defines and exports a metadata object containing the documentation page title, description, and supported platform list used to customize static paths and content rendering.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/in-app-messaging/respond-interaction-events/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```

export const meta = {
title: 'Respond to interaction events',
description: 'Learn how to respond with additional behavior to your users interacting with in-app messages by adding interaction event listeners.',
platforms: [
'javascript',
'react-native',
'angular',
'nextjs',
'react',
'vue'
]
};

```

----------------------------------------

TITLE: Define Meta Data - JavaScript
DESCRIPTION: Defines metadata for the document, including the title, description, and supported platforms. This metadata is used for generating static paths and props.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/restapi/delete-data/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```

export const meta = {
title: 'Delete data',
description: 'Using the Delete API REST in Amplify',
platforms: [
'flutter',
'swift',
'android',
'javascript',
'react-native',
'angular',
'nextjs',
'react',
'vue'
]
};

```

----------------------------------------

TITLE: Querying and Deleting an Item by ID using Amplify DataStore (Java)
DESCRIPTION: This Java snippet demonstrates querying for a specific 'Post' object using its identifier ('123'). It first constructs QueryOptions using Where.identifier, handling potential AmplifyExceptions. If successful, it queries the DataStore and, upon finding a match, deletes the Post using nested callbacks for success and failure logging.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/datastore/android/relational/delete-snippet.mdx#_snippet_0

LANGUAGE: java
CODE:
```

QueryOptions queryOptions = null;
try {
queryOptions = Where.identifier(Post.class, "123");
} catch (AmplifyException e) {
Log.e("MyAmplifyApp", "Failed to construct QueryOptions with provided values for Where.identifier", e);
}

if (queryOptions != null) {
Amplify.DataStore.query(Post.class, queryOptions,
match -> {
if (match.hasNext()) {
Post post = match.next();
Amplify.DataStore.delete(post,
deleted -> Log.i("MyAmplifyApp", "Post deleted."),
failure -> Log.e("MyAmplifyApp", "Delete failed.", failure)
);
}
},
failure -> Log.e("MyAmplifyApp", "Query failed.", failure)
);
}

```

----------------------------------------

TITLE: Uploading Image for Entity Indexing: Amplify JavaScript
DESCRIPTION: Shows how application users can upload images to an S3 bucket configured for advanced entity identification using Amplify Storage. The `customPrefix` option is crucial here to ensure the uploaded image is placed in the specific S3 location ('protected/predictions/index-faces/') that triggers the Lambda function for indexing faces into the Rekognition collection. Dependencies: Configured Storage and Predictions with advanced entity indexing.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/identify-text.mdx#_snippet_9

LANGUAGE: javascript
CODE:
```

Storage.put('test.jpg', file, {
level: 'protected',
customPrefix: {
protected: 'protected/predictions/index-faces/',
}
});

```

----------------------------------------

TITLE: Generating Static Paths
DESCRIPTION: Defines a function to generate static paths based on the supported platforms specified in the `meta` object. It uses the `getCustomStaticPath` utility function.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/auth/app-uninstall/index.mdx#_snippet_1

LANGUAGE: typescript
CODE:
```

export const getStaticPaths = async () => {
return getCustomStaticPath(meta.platforms);
};

```

----------------------------------------

TITLE: Setting Up Amplify Backend for Speech-to-Text | Console
DESCRIPTION: Provides command-line steps to initialize an Amplify project, add user authentication, and configure the Predictions category for speech-to-text conversion using the Amplify CLI. Specifies selecting 'Transcribe text from audio' and enabling 'Auth and Guest users' access.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/ios/transcribe.mdx#_snippet_0

LANGUAGE: console
CODE:
```

? What would you like to convert?
Translate text into a different language
Generate speech audio from text
❯ Transcribe text from audio

? Provide a friendly name for your resource
<Enter a friendly name here>

? What is the source language? (Use arrow keys)
<Select your default source language>

? Who should have access?
Auth users only
❯ Auth and Guest users

```

----------------------------------------

TITLE: Configuring Page Metadata and Supported Platforms in JavaScript
DESCRIPTION: Defines a metadata object for the documentation page, specifying its title, description, and the array of supported platforms. This object is referenced throughout the page for consistent metadata injection. No external dependencies are required beyond the file context.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/start/project-setup/use-existing-resources/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```

export const meta = {
title: 'Use existing AWS resources',
description: 'Add existing AWS resources to an application without the CLI.',
platforms: ['swift', 'android']
};

```

----------------------------------------

TITLE: Defining Documentation Page Metadata - JS/TS
DESCRIPTION: Defines and exports a constant object `meta` containing essential information for the documentation page. This includes the page title, description, and an array of supported platforms used for navigation and static generation purposes within the documentation site.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/reference/iam-policy/index.mdx#_snippet_1

LANGUAGE: JavaScript
CODE:
```

export const meta = {
title: 'IAM policy',
description: 'Learn more about the IAM policy required by Amplify.',
platforms: [
'android',
'angular',
'flutter',
'javascript',
'nextjs',
'react',
'react-native',
'swift',
'vue'
]
};

```

----------------------------------------

TITLE: Defining Meta Object for Documentation Page in JavaScript
DESCRIPTION: Declares a meta object containing the page title, description, and supported platforms. This object is intended for use in static site generation or SEO metadata handling. The platforms field allows for dynamic documentation rendering based on target environments.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/logging/change-log-levels/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```

export const meta = {
title: 'Change log levels',
description: 'Change log levels by categories and users',
platforms: ['swift', 'android']
};

```

----------------------------------------

TITLE: Text Translation Output Example - Console
DESCRIPTION: This showcases the expected console output after successfully translating text using Amplify Predictions. In this scenario, the translated sentence 'Me gusta comer espaguetis' is printed. This output is indicative of the translation process working as intended and may vary based on input parameters provided within the application’s translation request.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/native_common/getting-started/common.mdx#_snippet_3

LANGUAGE: console
CODE:
```

Me gusta comer espaguetis

```

----------------------------------------

TITLE: Configure REST API and Lambda Function via Amplify CLI Prompts (Console)
DESCRIPTION: Illustrates the interactive prompts following `amplify add api` for configuring a REST API. This example sets up a `/todo` path, creates a new Node.js Lambda function named `todo` using the 'Serverless ExpressJS function' template, and grants full CRUD access to both authenticated and guest users.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/restapi/android/getting-started/11_amplifyInit.mdx#_snippet_1

LANGUAGE: console
CODE:
```

? Please select from one of the below mentioned services:
`REST`
? Provide a friendly name for your resource to be used as a label for this category in the project:
`api`
? Provide a path (e.g., /book/{isbn}):
`/todo`
? Choose a Lambda source
`Create a new Lambda function`
? Provide an AWS Lambda function name:
`todo`
? Choose the runtime that you want to use:
`NodeJS`
? Choose the function template that you want to use:
`Serverless ExpressJS function (Integration with API Gateway)`
? Do you want to configure advanced settings?
`No`
? Do you want to edit the local lambda function now?
`No`
? Restrict API access
`Yes`
? Who should have access?
`Authenticated and Guest users`
? What kind of access do you want for Authenticated users?
`create, read, update, delete`
? What kind of access do you want for Guest users?
`create, read, update, delete`
Successfully added auth resource locally.
? Do you want to add another path?
`No`

```

----------------------------------------

TITLE: Using AWS Amplify Predictions to Interpret Text in TypeScript
DESCRIPTION: Demonstrates how to utilize the AWS Amplify Predictions module to analyze a text string, extracting key phrases, sentiment, language, syntax, and entities. The code invokes Predictions.interpret method with appropriate parameters and expects an asynchronous result containing analyzed insights.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/add-aws-services/predictions/interpret-sentiment/index.mdx#_snippet_1

LANGUAGE: TypeScript
CODE:
```

import { Predictions } from '@aws-amplify/predictions';

const result = await Predictions.interpret({
text: {
source: {
text: textToInterpret,
},
type: 'ALL'
}
})

```

----------------------------------------

TITLE: Importing Platform-Specific Documentation Fragments in JavaScript
DESCRIPTION: Imports documentation fragments for JavaScript, iOS (Swift), and Android code examples relating to entity identification with Amplify. These imports are used to serve targeted, framework-specific instructions or code samples based on the current platform. This organization enables dynamic assignment to documentation rendering components.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/predictions/identify-entity/index.mdx#_snippet_4

LANGUAGE: javascript
CODE:
```

import identifyEntityJs from '/src/fragments/lib/predictions/js/identify-entity.mdx';
import identifyEntityIOS from '/src/fragments/lib/predictions/ios/identify-entity.mdx';
import identifyEntityAndroid from '/src/fragments/lib/predictions/android/identify-entity.mdx';

```

----------------------------------------

TITLE: Sending Messages to AWS Lex V2 Bot - JavaScript
DESCRIPTION: This snippet demonstrates how to send a text message from a user to an AWS Lex V2 chatbot using AWS Amplify Interactions in JavaScript. It relies on the '@aws-amplify/interactions' dependency and requires specifying the bot name and user message. The response from the chatbot is retrieved asynchronously and logged to the console. Inputs include botName and message; output is the chatbot's response message. The send() command returns a promise; proper async/await usage is required.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/interactions/js/chatbot.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```

import { Interactions } from '@aws-amplify/interactions';

let userInput = "I want to reserve a hotel for tonight";

(async () => {
// Provide a bot name and user input
const response = await Interactions.send({
botName: "TheBotName",
message: userInput
});

// Log chatbot response
console.log(response.message);
})()

```

----------------------------------------

TITLE: Define Auth Challenge Lambda Trigger for CAPTCHA (JavaScript)
DESCRIPTION: Implements a Cognito Lambda trigger to define custom CAPTCHA challenges in JavaScript. Examines the user's session, assigns 'CUSTOM_CHALLENGE' and controls authentication and token issuance based on prior challenges. Used as part of Cognito custom authentication Lambda configuration.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/auth/android/signin_with_custom_flow/50_custom_challenge.mdx#_snippet_10

LANGUAGE: JavaScript
CODE:
```

export const handler = async (event) => {
if (!event.request.session || event.request.session.length === 0) {
// If we don't have a session or it is empty then send a CUSTOM_CHALLENGE
event.response.challengeName = "CUSTOM_CHALLENGE";
event.response.failAuthentication = false;
event.response.issueTokens = false;
} else if (event.request.session.length === 1 && event.request.session[0].challengeResult === true) {
// If we passed the CUSTOM_CHALLENGE then issue token
event.response.failAuthentication = false;
event.response.issueTokens = true;
} else {
// Something is wrong. Fail authentication
event.response.failAuthentication = true;
event.response.issueTokens = false;
}

    return event;

};

```

----------------------------------------

TITLE: .gitignore file content appended by Amplify CLI
DESCRIPTION: Demonstrates the entries that are appended to the `.gitignore` file by Amplify when a new project is initialized. These entries prevent tracking of sensitive or auto-generated files, such as backend configurations, logs, and build artifacts.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/tools/cli/reference/files/index.mdx#_snippet_4

LANGUAGE: text
CODE:
```

#amplify-do-not-edit-begin
amplify/\#current-cloud-backend
amplify/.config/local-_
amplify/logs
amplify/mock-data
amplify/backend/amplify-meta.json
amplify/backend/awscloudformation
amplify/backend/.temp
build/
dist/
node_modules/
aws-exports.js
awsconfiguration.json
amplifyconfiguration.json
amplifyconfiguration.dart
amplify-build-config.json
amplify-gradle-config.json
amplifytools.xcconfig
.secret-_
#amplify-do-not-edit-end

```

----------------------------------------

TITLE: Displaying Monorepo Project Structure in Console
DESCRIPTION: Shows the basic directory structure of a monorepo project with React and Angular applications.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/tools/cli/project/monorepo/index.mdx#_snippet_1

LANGUAGE: console
CODE:
```

> monorepo-amplify
> react
> angular

```

----------------------------------------

TITLE: Identifying All Text Formats from File: Amplify JavaScript
DESCRIPTION: Shows how to request detection of plain text, forms, and tables simultaneously from an image file using the `format: "ALL"` option. The response object will contain all properties available from the `PLAIN`, `FORM`, and `TABLE` formats combined. Dependencies: Configured Predictions category.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/identify-text.mdx#_snippet_6

LANGUAGE: javascript
CODE:
```

Predictions.identify({
text: {
source: {
file
},
format: "ALL",
}
})
.then(response => {
const {
text: {
// same as PLAIN + FORM + TABLE
}  
 } = response
})
.catch(err => console.log({ err }));

```

----------------------------------------

TITLE: Exporting Page Metadata for Documentation in JavaScript
DESCRIPTION: Defines and exports a `meta` object containing page title, description, route path, and supported platform identifiers. This metadata helps configure the documentation page content, routing, and platform-specific configurations for rendering and navigation.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/connect-to-existing-data-sources/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```

export const meta = {
title: 'Connect to existing data sources',
description: 'Learn how to connect your Data API to existing DynamoDB tables, MySQL databases, or PostgreSQL databases.',
route: "/[platform]/build-a-backend/data/connect-to-existing-data-sources",
platforms: [
'android',
'angular',
'flutter',
'javascript',
'nextjs',
'react',
'react-native',
'swift',
'vue'
]
};

```

----------------------------------------

TITLE: Overriding Language with Amplify Java
DESCRIPTION: This Java code snippet demonstrates how to override the default language settings for translation. It translates "I like to eat spaghetti" from English to Russian.  `LanguageType.ENGLISH` and `LanguageType.RUSSIAN` are used to specify source and target languages respectively.  Uses callbacks for handling the results.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/android/translate.mdx#_snippet_4

LANGUAGE: java
CODE:
```

Amplify.Predictions.translateText(
"I like to eat spaghetti", LanguageType.ENGLISH, LanguageType.RUSSIAN,
result -> Log.i("MyAmplifyApp", result.getTranslatedText()),
error -> Log.e("MyAmplifyApp", "Translation failed", error)
);

```

----------------------------------------

TITLE: Subscribing to API Mutations (Swift)
DESCRIPTION: Sets up a subscription using Amplify API to listen for new `Comment` model creations (`.onCreate`). In older versions of the codegen, the selection set implicitly included connected models like `Post`, which allowed decoding in previous app versions receiving mutations from newer versions.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/tools/cli/migration/lazy-load-custom-selection-set/index.mdx#_snippet_14

LANGUAGE: Swift
CODE:
```

let subscription = Amplify.API.subscribe(request: .onCreate(Comment.self))

```

----------------------------------------

TITLE: Deleting Data Using Combine with AWS Amplify REST API in Swift
DESCRIPTION: This Swift code example demonstrates the use of the Combine framework to perform a delete operation on a REST API endpoint ("/todo") with AWS Amplify. Dependencies include the Amplify and Combine frameworks, and an initialized REST API. The "deleteTodo" function creates a publisher that invokes the delete operation asynchronously, processes the data response as a UTF-8 string, and properly handles API errors. The function returns an AnyCancellable for subscription management, and prints outputs to the console.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/restapi/ios/delete.mdx#_snippet_1

LANGUAGE: Swift
CODE:
```

func deleteTodo() -> AnyCancellable {
let request = RESTRequest(path: "/todo")
let sink = Amplify.Publisher.create {
try await Amplify.API.delete(request: request)
}
.sink {
if case let .failure(apiError) = $0 {
print("Failed", apiError)
}
}
receiveValue: { data in
let str = String(decoding: data, as: UTF8.self)
print("Success \(str)")
}
return sink
}

```

----------------------------------------

TITLE: Configure Amplify in Vue
DESCRIPTION: This code configures the Amplify library using the amplify_outputs.json file within a Vue.js application.  The outputs file contains backend connection information. The configuration is done in the src/main.ts file.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_5

LANGUAGE: typescript
CODE:
```

import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

createApp(App).mount("#app");

```

----------------------------------------

TITLE: Generating static paths for platform-specific documentation using Next.js
DESCRIPTION: Creates static paths for the documentation page based on the platforms defined in metadata, using a custom utility function.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/storage/query-transfers/index.mdx#_snippet_1

LANGUAGE: JavaScript
CODE:
```

export const getStaticPaths = async () => {
return getCustomStaticPath(meta.platforms);
};

```

----------------------------------------

TITLE: Defining GraphQL Schema for Batch Creation
DESCRIPTION: This GraphQL schema defines the data model and the mutation for batch creation of Todo objects. The schema includes a `Todo` type with `id`, `name`, and `description` fields. The `Mutation` type defines a `batchCreateTodo` mutation, which accepts a list of `BatchCreateTodo` input objects.  This allows the client to create multiple todo objects at once.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/best-practice/batch-put-custom-resolver/index.mdx#_snippet_0

LANGUAGE: graphql
CODE:
```

type Todo @model {
id: ID!
name: String!
description: String
}

type Mutation {
batchCreateTodo(todos: [BatchCreateTodo]): [Todo]
}

input BatchCreateTodo {
id: ID
name: String!
description: String
}

```

----------------------------------------

TITLE: Importing Path Generation Helper Function - JavaScript
DESCRIPTION: Imports the `getCustomStaticPath` function from a utility file. This function is likely used by the static site generator to dynamically determine the possible URL paths for the page based on configured platforms.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/logging/remote-configuration/index.mdx#_snippet_0

LANGUAGE: JavaScript
CODE:
```

import { getCustomStaticPath } from '@/utils/getCustomStaticPath';

```

----------------------------------------

TITLE: Detecting Plain Text in Image - Kotlin (Coroutines)
DESCRIPTION: This Kotlin snippet demonstrates the use of coroutines to identify plain text from an image using the Amplify Predictions API. It calls the `identify` method, passing `TextFormatType.PLAIN` and the image `Bitmap`.  It then uses a try-catch block to handle the result and any potential exceptions during the process. The `IdentifyTextResult` contains the full text.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/android/identify-text.mdx#_snippet_2

LANGUAGE: kotlin
CODE:
```

suspend fun detectText(image: Bitmap) {
try {
val result = Amplify.Predictions.identify(PLAIN, image)
val identifyResult = result as IdentifyTextResult
Log.i("MyAmplifyApp", identifyResult.fullText)
} catch (error: PredictionsResult) {
Log.e("MyAmplifyApp", "Identify text failed", error)
}
}

```

----------------------------------------

TITLE: Implementing define-auth-challenge Lambda Handler in TypeScript
DESCRIPTION: This handler manages the state machine for the authentication challenges based on the session steps. It denies authentication by default and grants progression through SRP, password verification, and finally to the custom reCAPTCHA challenge. Upon successful captcha challenge, it issues tokens and finalizes authentication. Input: event with session array detailing previous challenges; Output: updated event response controlling the auth flow. Dependency: aws-lambda trigger handler types.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/functions/examples/google-recaptcha-challenge/index.mdx#_snippet_3

LANGUAGE: typescript
CODE:
```

import type { DefineAuthChallengeTriggerHandler } from "aws-lambda"

export const handler: DefineAuthChallengeTriggerHandler = async (event) => {
const { response } = event
const [srp, password, captcha] = event.request.session

// deny by default
response.issueTokens = false
response.failAuthentication = true

if (srp?.challengeName === "SRP_A") {
response.failAuthentication = false
response.challengeName = "PASSWORD_VERIFIER"
}

if (
password?.challengeName === "PASSWORD_VERIFIER" &&
password.challengeResult === true
) {
response.failAuthentication = false
response.challengeName = "CUSTOM_CHALLENGE"
}

if (
captcha?.challengeName === "CUSTOM_CHALLENGE" &&
// check for the challenge metadata set in "create-auth-challenge"
captcha?.challengeMetadata === "CAPTCHA_CHALLENGE" &&
captcha.challengeResult === true
) {
response.issueTokens = true
response.failAuthentication = false
}

return event
}

```

----------------------------------------

TITLE: Importing Platform-Specific Authorization Documentation Fragments in JavaScript
DESCRIPTION: This snippet imports markdown (.mdx) fragments containing authorization documentation for multiple targeted platforms. The imports include common fragments for native platforms like Android and Swift, Flutter-specific content, and JavaScript-based frameworks. These imported fragments are later used to map content dynamically depending on the selected platform.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/customize-authz/index.mdx#_snippet_3

LANGUAGE: javascript
CODE:
```

import common_authz from '/src/fragments/lib/restapi/native_common/authz/common.mdx';
import flutter_authz from '/src/fragments/lib/restapi/flutter/authz.mdx';
import js_authz from '/src/fragments/lib/restapi/js/authz.mdx';

```

----------------------------------------

TITLE: Configuring Amplify Predictions: Identify Entities Advanced Setup
DESCRIPTION: Provides the console commands and interactive prompts/answers for updating the Amplify Predictions category for advanced entity identification features, including celebrity detection and identifying entities from a collection of images with user upload capability. This requires selecting 'Advanced Configuration'. Prerequisites: Configured Amplify project with Predictions (potentially needing `amplify update predictions` if already added).
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/identify-text.mdx#_snippet_8

LANGUAGE: console
CODE:
```

? What would you like to identify? Identify Entities
? Would you like use the default configuration? Advanced Configuration
? Would you like to enable celebrity detection? Yes
? Would you like to identify entities from a collection of images? Yes
? How many entities would you like to identify 50
? Would you like to allow users to add images to this collection? Yes
? Who should have access? Auth and Guest users
? The CLI would be provisioning an S3 bucket to store these images please provide bucket name: mybucket

```

----------------------------------------

TITLE: Translating Text with Combine using Amplify Predictions (Swift)
DESCRIPTION: This Swift code snippet demonstrates how to translate text from English to Spanish using AWS Amplify's Predictions category and Combine for handling asynchronous results. It takes a string as input (in this case, "I like to eat spaghetti"), specifies the source and target languages, and uses a Combine publisher to process the result, printing either the translated text or an error message. It requires iOS 13+.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/ios/getting-started/50_translate.mdx#_snippet_1

LANGUAGE: swift
CODE:
```

func translateText() -> AnyCancellable {
Amplify.Predictions.convert(
textToTranslate: "I like to eat spaghetti",
language: .english,
targetLanguage: .spanish
)
.resultPublisher
.sink {
if case let .failure(error) = $0 {
print("Error: \(error)")
}
}
receiveValue: { result in
print(result.text)
}
}

```

----------------------------------------

TITLE: Configuring AWS Amplify Predictions Backend via Console CLI
DESCRIPTION: Shows the step-by-step console commands and options required to add and configure the AWS Amplify Predictions backend feature for identifying labels in images. Includes prompts for selecting identify categories, resource names, configuration types, and access permissions. This setup is prerequisite for running the identification APIs.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/android/label-image.mdx#_snippet_0

LANGUAGE: console
CODE:
```

? Please select from one of the categories below (Use arrow keys)\n `Identify`\n? What would you like to identify? (Use arrow keys)\n `Identify Labels`\n? Provide a friendly name for your resource\n `labelObjects`\n? Would you like use the default configuration? (Use arrow keys)\n `Default Configuration`\n? Who should have access? (Use arrow keys)\n `Auth and Guest users`

```

----------------------------------------

TITLE: Defining 'deletePost' mutation with custom HTTP handler in TypeScript
DESCRIPTION: Implements deletion of a post based on 'id', invoking the external REST API via a custom resolver script. Uses HTTP DELETE method, with 'id' as a required argument, and processes the response accordingly.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/custom-business-logic/connect-http-datasource/index.mdx#_snippet_5

LANGUAGE: TypeScript
CODE:
```

import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
Post: a.customType({
title: a.string(),
content: a.string(),
author: a.string(),
}),
// highlight-start
deletePost: a
.mutation()
.arguments({ id: a.id().required() })
.returns(a.ref("Post"))
.authorization(allow => [allow.publicApiKey()])
.handler(
a.handler.custom({
dataSource: "HttpDataSource",
entry: "./deletePost.js",
})
),
// highlight-end
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
schema,
authorizationModes: {
defaultAuthorizationMode: 'apiKey',
apiKeyAuthorizationMode: {
expiresInDays: 30,
},
},
});

```

----------------------------------------

TITLE: Querying Post Comments with toArray in AWS Amplify DataStore (JavaScript)
DESCRIPTION: This snippet illustrates fetching a specific post by ID and retrieving its related comments array by calling toArray on the comments property. Written in JavaScript, it requires the AWS Amplify DataStore and defined Post and Comment models. The function expects a post ID and returns an array of associated comments. This option performs lazy loading of related models and is useful for simple retrieval scenarios.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/datastore/js/relational/query-snippet.mdx#_snippet_1

LANGUAGE: JavaScript
CODE:
```

const post = await DataStore.query(Post, "YOUR_POST_ID");
const comments = await post.comments.toArray();

```

----------------------------------------

TITLE: Generating Static Paths for Platform-Specific Documentation
DESCRIPTION: Asynchronous function that generates static paths for each supported platform using a custom utility function.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/start/getting-started/generate-model/index.mdx#_snippet_1

LANGUAGE: JavaScript
CODE:
```

export const getStaticPaths = async () => {
return getCustomStaticPath(meta.platforms);
};

```

----------------------------------------

TITLE: Configuring Amplify Predictions for Text Translation via CLI
DESCRIPTION: This snippet shows the interactive prompts within the Amplify CLI (`amplify add predictions`) to configure the Predictions category specifically for text translation, allowing access for both authenticated and guest users. This configuration step is necessary before using the Predictions API for translation.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/js/translate.mdx#_snippet_0

LANGUAGE: console
CODE:
```

? What would you like to convert? (Use arrow keys)
❯ Convert text into a different language
Generate speech audio from text
Transcribe text from audio

? Who should have access? Auth and Guest users

```

----------------------------------------

TITLE: Grouping Authentication Trigger Functions with Auth Resources
DESCRIPTION: This example demonstrates how to resolve circular dependencies by grouping an authentication trigger function with auth resources. By setting the resourceGroupName to 'auth', the function becomes part of the auth stack, breaking potential circular dependencies.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/troubleshooting/circular-dependency/index.mdx#_snippet_1

LANGUAGE: typescript
CODE:
```

export const preSignUpTrigger = defineFunction({
name: 'pre-sign-up',
resourceGroupName: 'auth',
});

```

----------------------------------------

TITLE: Translating Text with AWS Amplify Predictions API using RxJava
DESCRIPTION: Implementation of text translation from English to Spanish using AWS Amplify's Predictions API with RxJava. The code uses reactive programming patterns and should be added to the onCreate() method of MainActivity.java.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/android/getting-started/50_translate.mdx#_snippet_3

LANGUAGE: java
CODE:
```

RxAmplify.Predictions.translateText(
"I like to eat spaghetti",
LanguageType.ENGLISH,
LanguageType.SPANISH)
.subscribe(
result -> Log.i("MyAmplifyApp", result.getTranslatedText()),
error -> Log.e("MyAmplifyApp", "Translation failed", error)
);

```

----------------------------------------

TITLE: Deleting Data Using Async/Await with AWS Amplify REST API in Swift
DESCRIPTION: This Swift code snippet demonstrates how to asynchronously delete a resource at the "/todo" endpoint using AWS Amplify's REST API client with the async/await pattern. It requires the Amplify framework and an initialized REST API setup. The "deleteTodo" function constructs a RESTRequest, performs a delete operation, and processes the response by decoding it as a UTF-8 string, with handling for both API-specific and unexpected errors. No input parameters are directly required, and output is logged to the console.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/restapi/ios/delete.mdx#_snippet_0

LANGUAGE: Swift
CODE:
```

func deleteTodo() async {
let request = RESTRequest(path: "/todo")
do {
let data = try await Amplify.API.delete(request: request)
let str = String(decoding: data, as: UTF8.self)
print("Success: \(str)")
} catch let error as APIError {
print("Failed due to API error: ", error)
} catch {
print("Unexpected error: \(error)")
}
}

```

----------------------------------------

TITLE: Deleting Item by ID with Amplify DataStore (Java Callbacks)
DESCRIPTION: Queries for a Post object with a specific ID ("123") using `Where.identifier` and deletes it if found using `Amplify.DataStore.delete`. Uses standard Amplify callbacks for asynchronous results and error handling via `Log.e`. Requires Amplify DataStore setup and a `Post` model.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/datastore/android/data-access/delete-snippet.mdx#_snippet_0

LANGUAGE: java
CODE:
```

QueryOptions queryOptions = null;
try {
queryOptions = Where.identifier(Post.class, "123");
} catch (AmplifyException e) {
Log.e("MyAmplifyApp", "Failed to construct QueryOptions with provided values for Where.identifier", e);
}

if (queryOptions != null) {
Amplify.DataStore.query(Post.class, queryOptions,
matches -> {
if (matches.hasNext()) {
Post post = matches.next();
Amplify.DataStore.delete(post,
deleted -> Log.i("MyAmplifyApp", "Deleted a post."),
failure -> Log.e("MyAmplifyApp", "Delete failed.", failure)
);
}
},
failure -> Log.e("MyAmplifyApp", "Query failed.", failure)
);
}

```

----------------------------------------

TITLE: Defining Page Metadata for Documentation - JavaScript
DESCRIPTION: This snippet defines a constant meta object that stores the title, description, and supported platforms for the troubleshooting documentation page. These properties are typically used for SEO enhancement, structured rendering, and platform-specific filtering. The object is expected to be referenced by other parts of the documentation rendering pipeline.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/tools/cli/project/troubleshooting/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```

export const meta = {
title: 'Troubleshooting',
description: 'Information to troubleshoot common Amplify CLI project errors.',
platforms: [
'android',
'angular',
'flutter',
'javascript',
'nextjs',
'react',
'react-native',
'swift',
'vue'
]
};

```

----------------------------------------

TITLE: Creating Multiple Related DataStore Models (Java)
DESCRIPTION: Illustrates the creation of instances for a simple relational data model (`Post`, `User`, `PostEditor`) using the builder pattern. These models are used in subsequent examples to demonstrate the challenges of handling sequential asynchronous operations with callbacks.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/project-setup/android/async/async.mdx#_snippet_1

LANGUAGE: java
CODE:
```

Post post = Post.builder()
.title("My First Post")
.build();

User editor = User.builder()
.username("Nadia")
.build();

PostEditor postEditor = PostEditor.builder()
.post(post)
.user(editor)
.build();

```

----------------------------------------

TITLE: Defining Meta Information for Documentation Page in JavaScript
DESCRIPTION: This block exports a meta object containing title, description, and a list of supported platforms. It is used elsewhere to tailor static generation and display information for documentation pages. The platforms array enumerates all frontend technologies supported by this guide; no runtime dependencies are required.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/tools/console/authz/permissions/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```

export const meta = {
title: 'Access control',
description: 'Set up authorization rules',
platforms: [
'android',
'angular',
'flutter',
'javascript',
'nextjs',
'react',
'react-native',
'swift',
'vue'
]
};

```

----------------------------------------

TITLE: Kotlin - Detect Pre-Determined Entities in Image Using Coroutines with AWS Amplify Predictions
DESCRIPTION: Performs entity match detection from a Rekognition collection asynchronously with coroutines, logging the external image ID of the first match. Requires proper configuration of collection parameters.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/android/identify-entity.mdx#_snippet_6

LANGUAGE: Kotlin
CODE:
```

suspend fun detectEntities(image: Bitmap) {
try {
val result = Amplify.Predictions.identify(IdentifyActionType.DETECT_ENTITIES, image)
val identifyResult = result as IdentifyEntityMatchesResult
val imageId = identifyResult.entityMatches.firstOrNull()?.externalImageId
Log.i("MyAmplifyApp", "$imageId")
} catch (error: PredictionsException) {
Log.e("MyAmplifyApp", "Identify failed", error)
}
}

```

----------------------------------------

TITLE: Querying AWS Amplify DataStore Posts in JavaScript
DESCRIPTION: This snippet asynchronously queries the Post model from AWS Amplify DataStore and logs the retrieved posts upon success. It uses a try-catch block to handle potential errors during the query operation. The snippet requires AWS Amplify and DataStore to be properly configured with a Post model defined. No input parameters are passed to the query, which fetches all Post entries. On success, it outputs a formatted JSON string of posts, and on failure, it logs the error. The primary focus is to illustrate a basic DataStore read operation with error handling.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/datastore/js/getting-started/70_querySnippet.mdx#_snippet_0

LANGUAGE: JavaScript
CODE:
```

try {
const posts = await DataStore.query(Post);
console.log('Posts retrieved successfully!', JSON.stringify(posts, null, 2));
} catch (error) {
console.log('Error retrieving posts', error);
}

```

----------------------------------------

TITLE: Kotlin - Detect Entities in Image Using Coroutines with AWS Amplify Predictions
DESCRIPTION: Performs entity detection asynchronously with Kotlin coroutines, mapping results to IdentifyEntitiesResult, and logging the first entity's bounding box. Uses suspend functions and try-catch for error handling.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/android/identify-entity.mdx#_snippet_2

LANGUAGE: Kotlin
CODE:
```

suspend fun detectEntities(image: Bitmap) {
try {
val result = Amplify.Predictions.identify(IdentifyActionType.DETECT_ENTITIES, image)
val identifyResult = result as IdentifyEntitiesResult
val value = identifyResult.entities.firstOrNull()?.box?.toShortString()
Log.i("MyAmplifyApp", "$value")
} catch (error: PredictionsException) {
Log.e("MyAmplifyApp", "Entity detection failed", error)
}
}

```

----------------------------------------

TITLE: Defining Metadata - JavaScript
DESCRIPTION: This snippet defines a constant object named `meta` which stores metadata about the page. The object includes a title, description, and an array of supported platforms. No dependencies are required for this snippet; it serves as a data structure. This data likely supports the page's content and user experience.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/tools/cli/start/set-up-cli/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```

export const meta = {
title: 'Set up Amplify CLI',
description: 'How to install and configure Amplify CLI',
platforms: [
'android',
'angular',
'flutter',
'javascript',
'nextjs',
'react',
'react-native',
'swift',
'vue'
]
};

```

----------------------------------------

TITLE: Configure Amplify in Next.js (Pages Router)
DESCRIPTION: This code snippet configures Amplify within a Next.js application using the pages router. It imports the necessary Amplify libraries and configuration file, and then calls Amplify.configure() to initialize Amplify with the configuration. This is performed in the _app.tsx file.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/set-up-ai/index.mdx#_snippet_8

LANGUAGE: typescript
CODE:
```

import "@/styles/app.css";
import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

export default function App({ Component, pageProps }: AppProps) {
return <Component {...pageProps} />;
}

```

----------------------------------------

TITLE: Overriding Language with Amplify RxJava
DESCRIPTION: This RxJava code snippet demonstrates how to override the default translation language settings, translating 'I like to eat spaghetti' from English to Russian.  It uses the `RxAmplify.Predictions.translateText()` method and subscribes to the result. Requires RxAmplify and language type dependencies.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/android/translate.mdx#_snippet_7

LANGUAGE: java
CODE:
```

RxAmplify.Predictions.translateText("I like to eat spaghetti",
LanguageType.ENGLISH,
LanguageType.RUSSIAN)
.subscribe(
result -> Log.i("MyAmplifyApp", result.getTranslatedText()),
error -> Log.e("MyAmplifyApp", "Translation failed", error)
);

```

----------------------------------------

TITLE: Detecting Plain Text in Image - Java
DESCRIPTION: This Java snippet demonstrates how to detect plain text in an image using the Amplify Predictions API.  It takes a `Bitmap` as input, calls the `identify` method with `TextFormatType.PLAIN`, and logs the extracted text. It uses a callback to handle the result or any potential errors during the text identification process. The `IdentifyTextResult` contains the full text which is extracted and displayed.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/android/identify-text.mdx#_snippet_0

LANGUAGE: java
CODE:
```

public void detectText(Bitmap image) {
Amplify.Predictions.identify(
TextFormatType.PLAIN,
image,
result -> {
IdentifyTextResult identifyResult = (IdentifyTextResult) result;
Log.i("MyAmplifyApp", identifyResult.getFullText());
},
error -> Log.e("MyAmplifyApp", "Identify text failed", error)
);
}

```

----------------------------------------

TITLE: Deleting Post and Comments by ID with Amplify DataStore
DESCRIPTION: This function deletes a post with a specified ID and its associated comments using Amplify DataStore. It queries for the post, then deletes it, which also removes associated comments due to the DataStore's cascading delete behavior. Error handling is included to catch any DataStoreException.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/datastore/flutter/relational/delete-snippet.mdx#_snippet_0

LANGUAGE: Dart
CODE:
```

import 'package:amplify_flutter/amplify_flutter.dart';

import 'models/ModelProvider.dart';

Future<void> deletePostWithID123AndItsComments(String id) async {
try {
final post = (await Amplify.DataStore.query(
Post.classType,
where: Post.ID.eq(id),
))
.first;

    // DataStore also deletes all associated comments with this operation
    await Amplify.DataStore.delete(post);

} on DataStoreException catch (e) {
safePrint('Something went wrong deleting models: ${e.message}');
}
}

```

----------------------------------------

TITLE: Defining Page Metadata - JavaScript
DESCRIPTION: Exports a constant object `meta` containing information about the documentation page. This includes the page title, description, and a list of platforms (Swift, Android) for which this content is relevant. This metadata is used by the static site generation functions.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/logging/remote-configuration/index.mdx#_snippet_1

LANGUAGE: JavaScript
CODE:
```

export const meta = {
title: 'Remotely change log levels',
description: 'Setup logging to fetch remote log levels',
platforms: [
'swift',
'android'
]
};

```

----------------------------------------

TITLE: Responding to Amplify CLI Prompts When Adding Predictions - Console
DESCRIPTION: This snippet details a typical interactive session with the Amplify CLI when provisioning the Predictions category. It includes choices for conversion type, authentication setup, sign-in methods, and target/source language selection. Users must select options matching their application's requirements; responses directly influence the configuration of backend ML resources and set defaults that may later be overridden in application code.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/native_common/getting-started/common.mdx#_snippet_2

LANGUAGE: console
CODE:
```

? Please select from one of the categories below
`Convert`
? You need to add auth (Amazon Cognito) to your project in order to add storage for user files. Do you want to add auth now? (Y/n)
`Y`
? Do you want to use the default authentication and security configuration?
`Default configuration`
? How do you want users to be able to sign in?
`Email`
? Do you want to configure advanced settings?
`No, I am done.`
? What would you like to convert?
`Translate text into a different language`
? Provide a friendly name for your resource
`transTextSample`
? What is the source language?
`English`
? What is the target language?
`Italian`
? Who should have access?
` Auth and Guest users`

```

----------------------------------------

TITLE: Deleting DataStore Model by ID in Amplify using Dart
DESCRIPTION: This snippet queries the Amplify DataStore for a 'Post' model with a specific 'id' ('123'). It retrieves the first matching instance found and then attempts to delete it. A try-catch block is used to handle potential DataStoreException errors during the deletion process.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/datastore/flutter/data-access/delete-snippet.mdx#_snippet_0

LANGUAGE: Dart
CODE:
```

import 'package:amplify_flutter/amplify_flutter.dart';

import 'models/ModelProvider.dart';

Future<void> deletePostsWithId() async {
final postToDelete = (await Amplify.DataStore.query(
Post.classType,
where: Post.ID.eq('123'),
))
.first;

try {
await Amplify.DataStore.delete(postToDelete);
} on DataStoreException catch (e) {
safePrint('Something went wrong deleting model: ${e.message}');
}
}

```

----------------------------------------

TITLE: Embedding Android Interpretation Documentation Fragment
DESCRIPTION: Includes a fragment detailing Android platform's interpretation features for sentiment analysis, serving as part of platform-specific docs.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/more-features/predictions/interpret-sentiment/index.mdx#_snippet_6

LANGUAGE: MDX
CODE:
```

import android2 from '/src/fragments/lib-v1/predictions/android/interpret.mdx';

<Fragments fragments={{ android: android2 }} />

```

----------------------------------------

TITLE: Deleting Item by ID with Amplify DataStore (Kotlin Coroutines)
DESCRIPTION: Uses Kotlin Flow and Coroutines to query for a Post object with a specific ID ("123") via `Where.identifier`. It then attempts to delete the found item using `Amplify.DataStore.delete`, logging results and handling errors asynchronously with `catch` and `collect`. Requires Amplify DataStore, Kotlin Coroutines support, and a `Post` model.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/datastore/android/data-access/delete-snippet.mdx#_snippet_2

LANGUAGE: kotlin
CODE:
```

Amplify.DataStore.query(Post::class, Where.identifier(Post::class.java, "123"))
.catch { Log.e("MyAmplifyApp", "Query failed", it) }
.onEach { Amplify.DataStore.delete(it) }
.catch { Log.e("MyAmplifyApp", "Delete failed", it) }
.collect { Log.i("MyAmplifyApp", "Deleted a post") }

```

----------------------------------------

TITLE: Example ECMAScript Module Error Message (text)
DESCRIPTION: Demonstrates an error message that occurs when using CommonJS modules in an environment expecting ECMAScript (ESM) modules. This helps developers identify misconfiguration and offers insight into compatibility issues. The error message should be used for troubleshooting module type errors in Node.js projects.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/start/manual-installation/index.mdx#_snippet_5

LANGUAGE: text
CODE:
```

The current file is a CommonJS module whose imports will produce 'require' calls; however, the referenced file is an ECMAScript module and cannot be imported with 'require'. Consider writing a dynamic 'import("@aws-amplify/backend")' call instead.

```

----------------------------------------

TITLE: Initializing Text-to-Speech Conversion with Callbacks using AWS Amplify Predictions in Java
DESCRIPTION: This Java snippet demonstrates how to integrate AWS Amplify Predictions in an Android MainActivity to convert text to speech asynchronously using callbacks. It instantiates a MediaPlayer and invokes convertTextToSpeech with success and failure handlers. The success callback receives the audio InputStream, which is written to a temporary mp3 file in the cache directory before playback. Error handling includes logging conversion failures and IOExceptions when writing the audio file. This implementation requires Amplify SDK configured in the project and permissions for audio playback.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/android/text-speech.mdx#_snippet_1

LANGUAGE: Java
CODE:
```

private final MediaPlayer mp = new MediaPlayer();\n\n@Override\nprotected void onCreate(Bundle savedInstanceState) {\n super.onCreate(savedInstanceState);\n setContentView(R.layout.activity_main);\n\n Amplify.Predictions.convertTextToSpeech(\n "I like to eat spaghetti",\n result -> playAudio(result.getAudioData()),\n error -> Log.e("MyAmplifyApp", "Conversion failed", error)\n );\n}\n\nprivate void playAudio(InputStream data) {\n File mp3File = new File(getCacheDir(), "audio.mp3");\n\n try (OutputStream out = new FileOutputStream(mp3File)) {\n byte[] buffer = new byte[8 * 1_024];\n int bytesRead;\n while ((bytesRead = data.read(buffer)) != -1) {\n out.write(buffer, 0, bytesRead);\n }\n mp.reset();\n mp.setOnPreparedListener(MediaPlayer::start);\n mp.setDataSource(new FileInputStream(mp3File).getFD());\n mp.prepareAsync();\n } catch (IOException error) {\n Log.e("MyAmplifyApp", "Error writing audio file", error);\n }\n}

```

----------------------------------------

TITLE: Generating Static Paths for Platforms in TypeScript
DESCRIPTION: Asynchronously exports a function to generate static paths for the supported platforms by calling a utility function with the platform list from the meta object. This enables static site generators to build pages per platform.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/more-features/in-app-messaging/clear-messages/index.mdx#_snippet_1

LANGUAGE: typescript
CODE:
```

export const getStaticPaths = async () => {
return getCustomStaticPath(meta.platforms);
};

```

----------------------------------------

TITLE: Generating Static Paths for Next.js
DESCRIPTION: Creates static paths for the Next.js page based on the supported platforms defined in the metadata, using a utility function.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/push-notifications/remote-media/index.mdx#_snippet_1

LANGUAGE: JavaScript
CODE:
```

export const getStaticPaths = async () => {
return getCustomStaticPath(meta.platforms);
};

```

----------------------------------------

TITLE: Translating Text with AWS Amplify Predictions API in Kotlin using Coroutines
DESCRIPTION: Implementation of text translation from English to Spanish using AWS Amplify's Predictions API in Kotlin with coroutines. The code uses try-catch blocks for error handling and should be added to the onCreate() method of MainActivity.kt.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/android/getting-started/50_translate.mdx#_snippet_2

LANGUAGE: kotlin
CODE:
```

val text = "I like to eat spaghetti"
try {
val result = Amplify.Predictions.translateText(text, ENGLISH, SPANISH)
Log.i("MyAmplifyApp", result.translatedText)
} catch (error: PredictionsException) {
Log.e("MyAmplifyApp", "Translation failed", error)
}

```

----------------------------------------

TITLE: Install aws-lambda types via npm
DESCRIPTION: This command installs the `@types/aws-lambda` package as a development dependency. This package provides TypeScript definitions for AWS Lambda functions, enabling type checking and autocompletion when writing Lambda handler code.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/functions/examples/email-domain-filtering/index.mdx#_snippet_0

LANGUAGE: bash
CODE:
```

npm add --save-dev @types/aws-lambda

```

----------------------------------------

TITLE: Filtering Posts with Rating Greater Than 4 across frameworks
DESCRIPTION: Example snippet demonstrating filtering of Post models where 'rating' exceeds 4. The predicate is imported and used across multiple frameworks for consistent filter application.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/datastore/native_common/data-access.mdx#_snippet_8

LANGUAGE: JavaScript
CODE:
```

import js18 from '/src/fragments/lib-v1/datastore/js/data-access/query-predicate-snippet.mdx';

```

----------------------------------------

TITLE: Detecting Entities from Images using AWS Amplify Predictions (Async/Await, Swift)
DESCRIPTION: This Swift snippet defines an async function to detect entities within an image using AWS Amplify Predictions. It utilizes the async/await syntax with try/await for recognizing entities from either the Rekognition collection (if configured) or standard facial/landmark detection. Requires Amplify CLI setup with predictions and authentication categories, and a configured amplifyconfiguration.json file (optionally specifying collectionId and maxEntities). The function takes an image URL as input, returns an array of Predictions.Entity, and includes robust error handling for Amplify and general errors. Results are printed and returned to the caller. The method operates asynchronously and is designed for use in iOS projects integrating Amplify.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/ios/identify-entity.mdx#_snippet_0

LANGUAGE: swift
CODE:
```

func detectEntities(\_ image: URL) async throws -> [Predictions.Entity] {
do {
let result = try await Amplify.Predictions.identify(.entities, in: image)
print("Identified entities: \(result.entities)")
return result.entities
} catch let error as PredictionsError {
print("Error identifying entities: \(error)")
throw error
} catch {
print("Unexpected error: \(error)")
throw error
}
}
}

```

----------------------------------------

TITLE: Example API Routes
DESCRIPTION: This shows example routes implemented by the Serverless ExpressJS function template, including routes for listing, loading, creating, updating, and deleting items.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/configure-rest-api/index.mdx#_snippet_5

LANGUAGE: console
CODE:
```

GET /items List all items
GET /items/1 Load an item by id
POST /items Create an item
PUT /items Update an item
DELETE /items/1 Delete an item by id

```

----------------------------------------

TITLE: Querying and Deleting an Item by ID using Amplify DataStore (Kotlin Callbacks)
DESCRIPTION: This Kotlin snippet shows how to query for a 'Post' by its identifier ('123') using Where.identifier directly within the Amplify.DataStore.query function. It utilizes lambda expressions as callbacks to handle the query result. If a Post is found (it.hasNext()), it proceeds to delete the Post, again using callbacks for success and failure logging.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/datastore/android/relational/delete-snippet.mdx#_snippet_1

LANGUAGE: kotlin
CODE:
```

Amplify.DataStore.query(Post::class.java, Where.identifier(Post::class.java, "123"),
{
if (it.hasNext()) {
val post = it.next()
Amplify.DataStore.delete(post,
{ Log.i("MyAmplifyApp", "Post deleted") },
{ Log.e("MyAmplifyApp", "Delete failed") }
)
}
},
{ Log.e("MyAmplifyApp", "Query failed", it) }
)

```

----------------------------------------

TITLE: Setting up metadata for page routing in Next.js
DESCRIPTION: Sets up page metadata and generates static paths based on supported platforms. This enables proper routing and platform-specific content delivery in the documentation site.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/add-aws-services/logging/flush-logs/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```

import { getCustomStaticPath } from '@/utils/getCustomStaticPath';

export const meta = {
title: 'Flush logs',
description: 'Learn how to force flush logs',
platforms: [
'swift',
'android'
]
};

export const getStaticPaths = async () => {
return getCustomStaticPath(meta.platforms);
};

export function getStaticProps(context) {
return {
props: {
platform: context.params.platform,
meta
}
};
}

```

----------------------------------------

TITLE: Importing JavaScript/Web Auth Overview Fragment - JavaScript
DESCRIPTION: Imports an MDX file (`overview.mdx`) located at `/src/fragments/lib/auth/js/`. This file contains documentation content specific to JavaScript and web-based platforms (javascript, angular, nextjs, react, vue). The imported content is assigned to the variable `js0` to be used as a fragment within the documentation page.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/auth/under-the-hood/index.mdx#_snippet_4

LANGUAGE: javascript
CODE:
```

import js0 from '/src/fragments/lib/auth/js/overview.mdx';

```

----------------------------------------

TITLE: Importing Static Path Helper in JavaScript
DESCRIPTION: This line imports the `getCustomStaticPath` function from a local utility file. This function is likely used to generate static paths for the page based on supported platforms.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/auth/set-up-auth/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```

import { getCustomStaticPath } from '@/utils/getCustomStaticPath';

```

----------------------------------------

TITLE: Translating Text with AWS Amplify Predictions API in Java
DESCRIPTION: Implementation of text translation from English to Spanish using AWS Amplify's Predictions API in Java. The code should be added to the onCreate() method of MainActivity.java and includes success and error handling via callbacks.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/android/getting-started/50_translate.mdx#_snippet_0

LANGUAGE: java
CODE:
```

Amplify.Predictions.translateText(
"I like to eat spaghetti",
LanguageType.ENGLISH,
LanguageType.SPANISH,
result -> Log.i("MyAmplifyApp", result.getTranslatedText()),
error -> Log.e("MyAmplifyApp", "Translation failed", error)
);

```

----------------------------------------

TITLE: Deleting Item using GraphQL Mutation (JavaScript)
DESCRIPTION: Demonstrates how to delete a data item using the AWS Amplify client's `graphql` method with a mutation. It requires importing `generateClient` and mutation definitions. The item to be deleted is identified by its `id` within the `variables.input` object.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/mutate-data/index.mdx#_snippet_0

LANGUAGE: js
CODE:
```

import { generateClient } from 'aws-amplify/api';
import \* as mutations from './graphql/mutations';

const client = generateClient();

const todoDetails = {
id: 'some_id'
};

const deletedTodo = await client.graphql({
query: mutations.deleteTodo,
variables: { input: todoDetails }
});

```

----------------------------------------

TITLE: Defining Page Metadata in Javascript
DESCRIPTION: This code defines a constant `meta` object. It contains metadata for the page, including the title, description, route, and supported platforms. This metadata is used for various purposes within the application, such as generating the page title, description, and handling routing and platform-specific configurations. The platforms array specifies which platforms the component is designed to support.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/ai/conversation/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```

export const meta = {
title: "Conversation",
description:
"Learn about conversational AI patterns and how to implement them in Amplify.",
route: '/[platform]/ai/conversation',
platforms: [
"javascript",
"react-native",
"angular",
"nextjs",
"react",
"vue",
],
};

```

----------------------------------------

TITLE: Mapping Documentation Fragments to Platforms in Fragments Component (JavaScript)
DESCRIPTION: This snippet demonstrates the use of the Fragments component to map imported documentation fragments to their respective platforms. The mapping ensures that the correct set of instructions for identifying text with AWS Amplify is rendered based on the user's selected platform or framework. This requires all mapped fragments to have been previously imported and a Fragments component to be available in scope.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/predictions/identify-text/index.mdx#_snippet_5

LANGUAGE: javascript
CODE:
```

<Fragments
fragments={{
    javascript: identifyTextJs,
    angular: identifyTextJs,
    nextjs: identifyTextJs,
    react: identifyTextJs,
    vue: identifyTextJs,
    swift: identifyTextIOS,
    android: identifyTextAndroid
  }}
/>

```

----------------------------------------

TITLE: Import utility function - JavaScript
DESCRIPTION: Imports the getCustomStaticPath function from '@/utils/getCustomStaticPath'. This function is used to generate static paths for different platforms.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/restapi/delete-data/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```

import { getCustomStaticPath } from '@/utils/getCustomStaticPath';

```

----------------------------------------

TITLE: Defining Page Metadata in JavaScript
DESCRIPTION: Exports metadata object for the documentation page, including title, description, and supported platforms for model file generation.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/start/getting-started/generate-model/index.mdx#_snippet_0

LANGUAGE: JavaScript
CODE:
```

export const meta = {
title: 'Generate model files',
description: 'Getting Started with Amplify Libraries - Generate model files',
platforms: ['android', 'flutter', 'swift']
};

```

----------------------------------------

TITLE: File Path Example - Incorrect
DESCRIPTION: This snippet demonstrates the incorrect ways to represent a file path in the Amplify documentation, specifically how not to format the placeholder text.
SOURCE: https://github.com/aws-amplify/docs/blob/main/STYLEGUIDE.md#_snippet_1

LANGUAGE: Text
CODE:
```

- `amplify/backend/api/~apiname~/schema.graphql`
- `amplify/backend/api/YOUR-API-NAME/schema.graphql`
- `amplify/backend/api/<YOUR_API_NAME>/schema.graphql`
- `amplify/backend/api/<your_api_name>/schema.graphql`
- `amplify/backend/api/<your api name>/schema.graphql`
- `amplify/backend/api/{yourAPIname}/schema.graphql`

```

----------------------------------------

TITLE: Removing Files with Path (v6.2.0+) - JavaScript
DESCRIPTION: This snippet demonstrates how to remove a stored file using the recommended `path` parameter introduced in Amplify Storage v6.2.0+. It requires providing the full S3 object path, including the access level prefix (e.g., 'public/', 'protected/{identityId}/', 'private/{identityId}/'). The operation is wrapped in a try/catch block for error handling.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/storage/remove/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```

import { remove } from 'aws-amplify/storage';

try {
await remove({
path: 'public/album/2024/1.jpg',
// Alternatively, path: ({identityId}) => `protected/${identityId}/album/2024/1.jpg`
});
} catch (error) {
console.log('Error ', error);
}

```

----------------------------------------

TITLE: Complete `RestaurantsComponent` with Realtime Capabilities
DESCRIPTION: This final code combines data fetching, real-time subscription, and cleanup logic for the `RestaurantsComponent`, enabling it to display restaurants, add new ones, and stay synchronized with backend updates for a seamless user experience.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/start/getting-started/angular/data-model.mdx#_snippet_18

LANGUAGE: TypeScript
CODE:
```

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { generateClient } from 'aws-amplify/api';
import { Restaurant, ListRestaurantsQuery } from '../../API';
import _ as queries from '../../graphql/queries';
import _ as mutations from '../../graphql/mutations';
import \* as subscriptions from '../../graphql/subscriptions';

@Component({
selector: 'app-restaurants',
templateUrl: './restaurants.component.html',
styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit, OnDestroy {
public createForm: FormGroup;
public client: ReturnType<typeof generateClient>;
public restaurants: ListRestaurantsQuery['listRestaurants'];
private subscription: any = null;

constructor(private fb: FormBuilder) {
this.createForm = this.fb.group({
name: ['', Validators.required],
description: ['', Validators.required],
city: ['', Validators.required]
});

    this.client = generateClient();

}

async ngOnInit() {
try {
const res = await this.client.graphql({
query: queries.listRestaurants
});
console.log(res);
this.restaurants = res.data.listRestaurants;
} catch (e) {
console.log(e);
}

    this.subscription = this.client
      .graphql({
        query: subs.onCreateRestaurant
      })
      .subscribe((event: any) => {
        console.log(event);
        const newRestaurant = event.data.onCreateRestaurant;
        this.restaurants.items = [newRestaurant, ...this.restaurants.items];
      });

}

ngOnDestroy() {
if (this.subscription) {
this.subscription.unsubscribe();
}
this.subscription = null;
}

public async onCreate(restaurant: Restaurant) {
try {
const res = await this.client.graphql({
query: mutations.createRestaurant,
variables: {
input: restaurant
}
});
console.log('item created!', res);
this.createForm.reset();
} catch (e) {
console.log('error creating restaurant...', e);
}
}
}

```

----------------------------------------

TITLE: Rendering Fragments by Platform in JavaScript
DESCRIPTION: Renders the 'Fragments' component, mapping platform identifiers to their associated imported fragments. This assigns the correct code example to each supported framework for presentation in the documentation UI. Depends on a 'Fragments' React component and the imported fragment modules; expects to run in a React (or Next.js) environment.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/predictions/identify-entity/index.mdx#_snippet_5

LANGUAGE: javascript
CODE:
```

<Fragments
fragments={{
    javascript: identifyEntityJs,
    angular: identifyEntityJs,
    nextjs: identifyEntityJs,
    react: identifyEntityJs,
    vue: identifyEntityJs,
    swift: identifyEntityIOS,
    android: identifyEntityAndroid
  }}
/>

```

----------------------------------------

TITLE: Defining Meta Information for App Uninstallation Documentation
DESCRIPTION: Sets up the metadata for the documentation page, including title, description, and supported platforms (Swift and Android).
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/analytics/app-uninstall/index.mdx#_snippet_0

LANGUAGE: JavaScript
CODE:
```

export const meta = {
title: 'Uninstalling the app',
description:
'Understand how to handle persistent data on a device when a user uninstalls the app.',
platforms: ['swift', 'android']
};

```

----------------------------------------

TITLE: Detecting Unsafe Content using Amplify Predictions in Kotlin (Coroutines)
DESCRIPTION: Illustrates checking for unsafe content within a Kotlin Coroutine using a `suspend` function. It calls `Amplify.Predictions.identify` with `LabelType.MODERATION_LABELS` and uses a try-catch block to log the `isUnsafeContent` boolean result or handle potential `PredictionsException`.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/android/label-image.mdx#_snippet_7

LANGUAGE: kotlin
CODE:
```

suspend fun detectLabels(image: Bitmap) {
try {
val result = Amplify.Predictions.identify(MODERATION_LABELS, image)
val identifyResult = result as IdentifyLabelsResult
Log.i("MyAmplifyApp", identifyResult.isUnsafeContent)
} catch (error: PredictionsException) {
Log.e("MyAmplifyApp", "Identify failed", error)
}
}

```

----------------------------------------

TITLE: Detecting Unsafe Content using Amplify Predictions in Java (Callbacks)
DESCRIPTION: Shows how to use `Amplify.Predictions.identify` in Java with `LabelType.MODERATION_LABELS` to check if a `Bitmap` image contains potentially unsafe content. The callback logs the boolean result from `identifyResult.isUnsafeContent()` on success or logs an error on failure.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/android/label-image.mdx#_snippet_5

LANGUAGE: java
CODE:
```

public void detectLabels(Bitmap image) {
Amplify.Predictions.identify(
LabelType.MODERATION_LABELS,
image,
result -> {
IdentifyLabelsResult identifyResult = (IdentifyLabelsResult) result;
Log.i("MyAmplifyApp", Boolean.toString(identifyResult.isUnsafeContent()));
},
error -> Log.e("MyAmplifyApp", "Identify failed", error)
);
}

```

----------------------------------------

TITLE: Amplify Predictions Setup
DESCRIPTION: These commands initialize an AWS Amplify project, add authentication using the default configuration, and add the Predictions category with the 'Convert' option. It configures text-to-speech functionality, granting access to authenticated and guest users.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/js/text-speech.mdx#_snippet_0

LANGUAGE: console
CODE:
```

? What would you like to convert? (Use arrow keys)
Translate text into a different language

> Generate speech audio from text
> Transcribe text from audio

? Who should have access? Auth and Guest users

```

----------------------------------------

TITLE: Signing in with Microsoft Entra ID - Kotlin (Coroutines)
DESCRIPTION: This Kotlin snippet leverages `signInWithSocialWebUI` from `Amplify.Auth` with coroutines for asynchronous sign-in using the `MicrosoftEntraIDSAML` provider. It uses a try-catch block to handle potential `AuthException` errors. Success logs the result, while failure logs the error.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/auth/examples/microsoft-entra-id-saml/index.mdx#_snippet_7

LANGUAGE: Kotlin
CODE:
```

try {
val result = Amplify.Auth.signInWithSocialWebUI(AuthProvider.custom("MicrosoftEntraIDSAML"), this)
Log.i("AuthQuickstart", "Sign in OK: $result")
} catch (error: AuthException) {
Log.e("AuthQuickstart", "Sign in failed", error)
}

```

----------------------------------------

TITLE: Querying Post and Its Comments with AWS Amplify in Java
DESCRIPTION: Fetches a Post by its identifier along with the first page of its Comments, specifying includes on the comments relationship to eagerly load the connected models. Returns a Post object with a LoadedModelList of Comments, avoiding additional network requests for Comments. Uses Amplify API with ModelQuery in Java and handles response and failure with callbacks.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/relational-models/index.mdx#_snippet_23

LANGUAGE: Java
CODE:
```

Amplify.API.query(
ModelQuery.<Post, PostPath>get(
Post.class,
new Post.PostIdentifier("p1"),
(postPath -> includes(postPath.getComments()))
),
response -> {
Post post = response.getData();
ModelList<Comment> commentsModelList = post.getComments();
if (commentsModelList instanceof LoadedModelList) {
List<Comment> comments = ((LoadedModelList<Comment>) commentsModelList).getItems();
Log.i("MyAmplifyApp", "Comments: " + comments);
}
},
failure -> Log.e("MyAmplifyApp", "Failed to fetch post", failure)
);

```

----------------------------------------

TITLE: JavaScript: Remove Image from Song Record and Delete File
DESCRIPTION: This function updates a song record to remove its cover art path, effectively dissociating the image from the song, but does not delete the image file itself. It relies on Amplify's client models for data manipulation and manages UI state accordingly.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/working-with-files/index.mdx#_snippet_40

LANGUAGE: JavaScript
CODE:
```

async function removeImageFromSong() {
if (!currentSong) return;
try {
const response = await client.models.Song.get({
id: currentSong.id,
});
const song = response?.data;
if (!song?.coverArtPath) return;
const updatedSong = await client.models.Song.update({
id: song.id,
coverArtPath: null,
});
setCurrentSong(updatedSong.data);
setCurrentImageUrl(updatedSong.data?.coverArtPath);
} catch (error) {
console.error("Error removing image from song: ", error);
}
}

```

----------------------------------------

TITLE: Generating Static Paths for Platforms JavaScript
DESCRIPTION: Generates static file paths for the documentation page based on the list of platforms defined in the `meta` object. This enables the documentation site to build a separate page for each supported platform.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/auth/manage-users/with-amplify-console/index.mdx#_snippet_2

LANGUAGE: javascript
CODE:
```

export function getStaticPaths() {
return getCustomStaticPath(meta.platforms);
}

```

----------------------------------------

TITLE: Sending Text for Sentiment Interpretation Using AWS Amplify Predictions API - Kotlin Coroutines
DESCRIPTION: This snippet provides a coroutine-based approach in Kotlin for running AWS Amplify Predictions text interpretation synchronously within a try/catch block. It requires Amplify configured with Predictions, Android coroutines support, and exception handling for PredictionsException. The input parameter is the target string for analysis, while the output (sentiment value) is logged; exceptions are logged as errors.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/android/interpret.mdx#_snippet_2

LANGUAGE: Kotlin
CODE:
```

val text = "I like to eat spaghetti"
try {
val result = Amplify.Predictions.interpret(text)
Log.i("MyAmplifyApp", "${result.sentiment?.value}")
} catch (error: PredictionsException) {
Log.e("MyAmplifyApp", "Interpret failed", error)
}

```

----------------------------------------

TITLE: Testing REST API (POST) with curl on Windows - Bash
DESCRIPTION: This snippet demonstrates a Windows-compatible curl command to post a JSON object to a REST API. The -H flag sets the Content-Type header, and the -d flag passes the JSON data, with escape sequences for double quotes, as needed on Windows shells. Replace <your-api-endpoint> and <your-api-stage> with actual server details. The result, depending on API response, will be printed to the terminal.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/add-aws-services/rest-api/test-api/index.mdx#_snippet_3

LANGUAGE: bash
CODE:
```

curl -H "Content-Type: application/json" -d {\"name\":\"item-1\"} <your-api-endpoint>/<your-api-stage>/items

```

----------------------------------------

TITLE: REST API Endpoint Example
DESCRIPTION: This shows an example of the REST API endpoint URL after deployment, following the pattern `https://{restapi-id}.execute-api.{region}.amazonaws.com/{environment}/{path}`.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/configure-rest-api/index.mdx#_snippet_6

LANGUAGE: console
CODE:
```

REST API endpoint: https://a5b4c3d2e1.execute-api.eu-west-2.amazonaws.com/dev

```

----------------------------------------

TITLE: Configuring Predictions with Amazon Polly using Amplify CLI
DESCRIPTION: Guides through setting up predictions feature in AWS Amplify to enable text-to-speech conversion using Amazon Polly. Includes CLI commands for initial setup, selection of conversion type, access control options, and deployment with amplify push.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/text-speech.mdx#_snippet_0

LANGUAGE: console
CODE:
```

amplify init
amplify add auth
amplify add predictions

? What would you like to convert? (Use arrow keys)
Translate text into a different language

> Generate speech audio from text
> Transcribe text from audio

? Who should have access? Auth and Guest users

amplify push

```

----------------------------------------

TITLE: Calling Delete Todo from Template (HTML)
DESCRIPTION: Modifies the Angular template (`.html`) for the todos list. It adds a click event handler (`(click)`) to each list item (`<li>`) that calls the `deleteTodo` method from the component, passing the `todo.id` as an argument.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/start/quickstart/index.mdx#_snippet_28

LANGUAGE: html
CODE:
```

...

  <ul>
    <li *ngFor="let todo of todos;" (click)="deleteTodo(todo.id)">
        {{ todo.content }}
    </li>
  </ul>
...
```

---

TITLE: Add AWS Amplify Predictions Category (Bash)
DESCRIPTION: Run this command in your project's root directory to add the Predictions category using the Amplify CLI. It initiates a guided setup process for selecting AI/ML use cases and configuring backend resources.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/js/getting-started.mdx#_snippet_0

LANGUAGE: bash
CODE:

```
amplify add predictions
```

---

TITLE: Granting Private Access via IAM Policy for Custom Prefix (JSON)
DESCRIPTION: Shows an example AWS IAM policy statement in JSON format designed for custom private prefixes. It grants `Allow` permission for `s3:GetObject`, `s3:PutObject`, and `s3:DeleteObject` actions specifically for objects under a path constructed with `myPrivatePrefix/` followed by the user's Cognito Identity ID (`${cognito-identity.amazonaws.com:sub}/*`). This ensures only the authenticated user can access their files within that custom private path.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/storage/configure-access/index.mdx#_snippet_4

LANGUAGE: json
CODE:

```
"Statement": [
  {
    "Effect": "Allow",
    "Action": [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject"
    ],
    "Resource": [
      "arn:aws:s3:::your-s3-bucket/myPrivatePrefix/${cognito-identity.amazonaws.com:sub}/*"
    ]
  }
]
```

---

TITLE: Importing Platform-Specific Update Documentation Fragments in JavaScript
DESCRIPTION: This snippet imports markdown documentation fragments for different platforms from local source paths. These fragments contain platform-specific instructions or code relating to REST API data updates using Amplify.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/restapi/update-data/index.mdx#_snippet_3

LANGUAGE: javascript
CODE:

```
import android_update from '/src/fragments/lib/restapi/android/update.mdx';
import flutter_update from '/src/fragments/lib/restapi/flutter/update.mdx';
import ios_update from '/src/fragments/lib/restapi/ios/update.mdx';
import js_fetch from '/src/fragments/lib/restapi/js/update.mdx';
```

---

TITLE: Empty tag value in tags.json
DESCRIPTION: Illustrates how to define a tag with an empty value in the tags.json file. Tag values are not required.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/tools/cli/project/tags/index.mdx#_snippet_3

LANGUAGE: json
CODE:

```
[
  {
    "Key": "MY_TAG_KEY",
    "Value": ""
  }
]
```

---

TITLE: Identifying Forms from File: Amplify JavaScript
DESCRIPTION: Shows how to request structured form detection from an image file using the `format: "FORM"` option. In addition to plain text data, the response includes a `keyValues` array. Each entry in `keyValues` represents a form field, containing the detected `key` (label), `value` (field content, including text and selection status), and its location (`polygon`, `boundingBox`). Dependencies: Configured Predictions category.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/identify-text.mdx#_snippet_4

LANGUAGE: javascript
CODE:

```
Predictions.identify({
  text: {
    source: {
      file
    },
    format: "FORM",
  }
})
.then(response => {
  const {
    text: {
      // same as PLAIN +
      keyValues  // Array of { key (String), value: { text (String), selected (boolean)}, polygon, boundingBox }
    }
  } = response
})
.catch(err => console.log({ err }));
```

---

TITLE: Kotlin - Detect Celebrities in Image Using Coroutines with AWS Amplify Predictions
DESCRIPTION: Performs celebrity detection asynchronously with coroutines, logging the first celebrity's name. Uses try-catch for error handling and requires configuration.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/android/identify-entity.mdx#_snippet_10

LANGUAGE: Kotlin
CODE:

```
suspend fun detectCelebs(image: Bitmap) {
  try {
    val result = Amplify.Predictions.identify(IdentifyActionType.DETECT_CELEBRITIES, image)
    val identifyResult = result as IdentifyCelebritiesResult
    val celebrityName = identifyResult.celebrities.firstOrNull()?.celebrity?.name
    Log.i("MyAmplifyApp", "$celebrityName")
  } catch (error: PredictionsException) {
    Log.e("MyAmplifyApp", "Identify failed", error)
  }
}
```

---

TITLE: Tracking a Specific Amplify Storage Action (JavaScript)
DESCRIPTION: Demonstrates how to track a single AWS Amplify Storage action, such as a `get` operation for the file 'welcome.png', by passing `{ track: true }` in the options object for that specific call. This allows for granular event tracking for individual API calls, sending the event details (e.g., Method > Get) to Amazon Pinpoint.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/storage/js/autotrack.mdx#_snippet_1

LANGUAGE: javascript
CODE:

```
Storage.get('welcome.png', { track: true });
```

---

TITLE: Exporting Project Metadata for Figma-to-Code Integration in JavaScript
DESCRIPTION: This snippet exports a constant object named 'meta' containing project metadata including the title, description, and supported platforms. It serves as centralized configuration data used for dynamic routing and descriptive information. The metadata includes the target platforms: 'javascript', 'react', and 'nextjs'. There are no external dependencies for this snippet as it is a static object export.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-ui/uibuilder/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:

```
export const meta = {
  title: 'Figma-to-Code',
  description: 'Generate clean React code from Figma design files with Amplify Studio.',
  platforms: [
    'javascript',
    'react',
    'nextjs'
  ]
};
```

---

TITLE: Importing Utility for Static Path Generation in Next.js – JavaScript
DESCRIPTION: This snippet imports a custom utility function, getCustomStaticPath, from the local utils directory. The utility is expected to generate static paths for documentation pages based on specified platforms. The import path uses absolute alias referencing, which implies project-level configuration. The prerequisite is the existence of a properly implemented getCustomStaticPath function in the specified location.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/auth/existing-resources/index.mdx#_snippet_0

LANGUAGE: javascript
CODE:

```
import { getCustomStaticPath } from '@/utils/getCustomStaticPath';
```

---

TITLE: POST Request using aws-amplify/api in JavaScript
DESCRIPTION: This snippet demonstrates how to use the `aws-amplify/api` library to make a POST request to a specified API endpoint. It imports the `post` function from the library, defines an asynchronous function `postTodo` to encapsulate the request logic, specifies the API name and path, and sets the request body. The code then handles the response, logging success or failure messages and the response body to the console. It also includes error handling to catch and log any errors during the API call.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/restapi/js/getting-started/40_postTodo.mdx#_snippet_0

LANGUAGE: javascript
CODE:

```
import { post } from 'aws-amplify/api';

async function postTodo() {
  try {
    const restOperation = post({
      apiName: 'todoApi',
      path: '/todo',
      options: {
        body: {
          message: 'Mow the lawn'
        }
      }
    });

    const { body } = await restOperation.response;
    const response = await body.json();

    console.log('POST call succeeded');
    console.log(response);
  } catch (e) {
    console.log('POST call failed: ', JSON.parse(e.response.body));
  }
}
```

---

TITLE: Deleting Image Files and Clearing Association from a Photo Album (AWS Amplify, GraphQL, JavaScript)
DESCRIPTION: This function deletes all image files linked to a photo album, clears their association in the backend record, and updates the frontend state to reflect removal.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/graphqlapi/js/working-with-files.mdx#_snippet_30

LANGUAGE: JavaScript
CODE:

```
// Fetch album to access image keys:
const response = await client.graphql({
  query: queries.getPhotoAlbum,
  variables: { id: currentPhotoAlbum.id },
});
const photoAlbum = response.data.getPhotoAlbum;

// Remove file associations from record:
const photoAlbumDetails = {
  id: photoAlbum.id,
  imageKeys: null,
};

// Update record in backend:
const updateResponse = await client.graphql({
  query: mutations.updatePhotoAlbum,
  variables: { input: photoAlbumDetails },
});

// Delete each file from storage:
await Promise.all(
  photoAlbum.imageKeys.map(async (imageKey) => {
    if (!imageKey) return;
    await remove({ key: imageKey });
  })
);

// Update local state to null images:
setCurrentPhotoAlbum(updateResponse.data.updatePhotoAlbum);
setCurrentImages(null);
```

---

TITLE: Expected Logcat Output after Creating Todo in Android
DESCRIPTION: Shows the expected log message in Android Logcat indicating a successful Todo creation via the Amplify API mutation.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/set-up-data/index.mdx#_snippet_9

LANGUAGE: console
CODE:

```
com.example.MyAmplifyApp I/MyAmplifyApp: Added Todo with id: SOME_TODO_ID
```

---

TITLE: Importing Documentation Fragments for Multiple Frameworks and Platforms
DESCRIPTION: Imports MDX fragments for getting-started guides tailored to JavaScript, native platforms, and frameworks. Used to embed relevant documentation snippets based on platform requirements.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/more-features/predictions/set-up-predictions/index.mdx#_snippet_3

LANGUAGE: JavaScript
CODE:

```
import gettingStartedJs from '/src/fragments/lib/predictions/js/getting-started.mdx';
import gettingStartedCommon from '/src/fragments/lib/predictions/native_common/getting-started/common.mdx';
```

---

TITLE: Configuring Amplify with Auto-Generated Settings (JavaScript)
DESCRIPTION: Demonstrates initializing the Amplify library in a JavaScript application using the `aws-exports.js` file generated by the Amplify CLI. This file contains configuration details for backend resources, including the REST API endpoint. It imports `Amplify` and `API` modules and passes the configuration object to `Amplify.configure()`.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/restapi/js/getting-started.mdx#_snippet_3

LANGUAGE: javascript
CODE:

```
import { Amplify, API } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
```

---

TITLE: Deleting Todo by ID using Amplify API (Flutter)
DESCRIPTION: This Dart code shows how to delete a Todo item by its ID using the Amplify API. It constructs a `ModelMutations.deleteById` request, providing the `Todo.classType` and a `TodoModelIdentifier` containing the ID. The `Amplify.API.mutate` method then executes the GraphQL mutation. The response is printed with `safePrint`. This method is useful if you only have the ID of the object to delete. Requires the `Amplify` library and `Todo` class, `TodoModelIdentifier` class.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/graphqlapi/flutter/mutate-data.mdx#_snippet_2

LANGUAGE: Dart
CODE:

```
Future<void> deleteTodoById(Todo todoToDelete) async {
  final request = ModelMutations.deleteById(
    Todo.classType,
    TodoModelIdentifier(id: '8e0dd2fc-2f4a-4dc4-b47f-2052eda10775'),
  );
  final response = await Amplify.API.mutate(request: request).response;
  safePrint('Response: $response');
}
```

---

TITLE: Translating Text using Amplify Predictions - Swift (Async/Await)
DESCRIPTION: This Swift code snippet demonstrates translating text from English to Italian using the Amplify Predictions category with async/await. It takes a string as input, attempts to translate it, and prints the translated text to the console upon success or prints an error message if the translation fails. It requires the Amplify framework to be initialized and configured with predictions. It uses the `convert` method to perform the translation, specifying the source and target languages.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/ios/translate.mdx#_snippet_0

LANGUAGE: swift
CODE:

```
func translateText(text: String) async throws -> String {
  do {
    let result = try await Amplify.Predictions.convert(
        .translateText(text, from: .english, to: .italian)
    )
    print("Translated text: \(result.text)")
    return result.text
  } catch let error as PredictionsError {
      print("Error translating text: \(error)")
      throw error
  } catch {
      print("Unexpected error: \(error)")
      throw error
  }
}
```

---

TITLE: Generating static paths for platform-specific documentation
DESCRIPTION: Asynchronous function that generates static paths for each supported platform using a custom utility function.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/more-features/datastore/real-time/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:

```
export const getStaticPaths = async () => {
  return getCustomStaticPath(meta.platforms);
};
```

---

TITLE: Listening with Multiple Capturing Groups Regex - AWS Amplify Hub - Javascript
DESCRIPTION: Provides another example of using 'Hub.listen' with a regex '/user ([^ ]+) ([^ ]+) (.\*)/' containing multiple capturing groups, showing how 'patternInfo' contains results for each group.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/utilities/js/hub.mdx#_snippet_7

LANGUAGE: Javascript
CODE:

```
Hub.listen(/user ([^ ]+) ([^ ]+) (.*)/, (data) => {
  console.log('A USER event has been found matching the pattern: ', data.payload.message);
  console.log('patternInfo:', data.patternInfo);
})
```

---

TITLE: Calling deleteGeofences API with AWS Amplify Geo JavaScript
DESCRIPTION: Provides an example of how to use the `Geo.deleteGeofences` method to delete multiple geofences by their IDs. It includes error handling for the function call itself and demonstrates how to check the returned `response` object for API-specific errors and success counts. Requires an array of geofence IDs.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/add-aws-services/geo/geofences/index.mdx#_snippet_4

LANGUAGE: javascript
CODE:

```
let response;
try {
  response = await Geo.deleteGeofences(
    [
      "geofence1",
      "geofence2",
      "geofence3",
    ]
  )
} catch (error) {
  // error handling from logic and validation issues within `deleteGeofences`
  throw error;
}

if(response.errors.length > 0){
  // error handling that are from the underlying API calls
  console.log(`Success count: ${response.successes.length}`);
  console.log(`Error count: ${response.errors.length}`);
}
```

---

TITLE: Removing cover art association from a song record in React using AWS Amplify (JavaScript)
DESCRIPTION: This function disassociates an image from a song record by setting the coverArtKey to null via GraphQL, updating the record, and maintaining local state, without deleting the actual file from storage.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/graphqlapi/js/working-with-files.mdx#_snippet_24

LANGUAGE: JavaScript
CODE:

```
async function removeImageFromSong() {
  if (!currentSong) return;

  try {
    const response = await API.graphql({
      query: queries.getSong,
      variables: { id: currentSong.id }
    });

    const song = response?.data?.getSong;

    // If the record has no associated file, we can return early.
    if (!song?.coverArtKey) return;

    const songDetails = {
      id: song.id,
      coverArtKey: null
    };

    const updatedSong = await API.graphql({
      query: mutations.updateSong,
      variables: { input: songDetails }
});

    // Update local state:
    setCurrentSong(updatedSong?.data?.updateSong);
    setCurrentImageUrl(updatedSong?.data?.updateSong?.coverArtKey);
  } catch (error) {
    console.error('Error removing image from song: ', error);
  }
}
```

---

TITLE: Generating Static Paths for Documentation Pages Using Next.js in JavaScript
DESCRIPTION: Implements an async function getStaticPaths to generate static site paths based on meta.platforms. It leverages the getCustomStaticPath utility, ensuring documentation routes for all supported platforms. This is intended for use with frameworks like Next.js that support static site generation.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/restapi/customize-authz/index.mdx#_snippet_2

LANGUAGE: javascript
CODE:

```
export const getStaticPaths = async () => {
  return getCustomStaticPath(meta.platforms);
};
```

---

TITLE: GraphQL Todo Model Definition
DESCRIPTION: Defines a simple Todo model with an ID and title field. This serves as the original model that will be renamed using the `@mapsTo` directive.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/schema-evolution/index.mdx#_snippet_0

LANGUAGE: graphql
CODE:

```
type Todo @model {
  id: ID!
  title: String!
}
```

---

TITLE: Detect Celebrities (Amplify Predictions)
DESCRIPTION: This snippet shows how to enable and process celebrity-specific detection results by setting the `celebrityDetection` option to `true`. Detected celebrity entities include `metadata` like name and related URLs in the response.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/add-aws-services/predictions/identify-entity/index.mdx#_snippet_4

LANGUAGE: typescript
CODE:

```
import { Predictions } from '@aws-amplify/predictions';

const { entities } = await Predictions.identify({
  entities: {
    source: {
      file,
    },
    celebrityDetection: true // boolean. It will only show detected celebrities
  }
})

for (const { boundingBox, landmarks, metadata } of entities) {
  const {
    name,
    urls
  } = metadata; // celebrity info

  // ...
}
.catch(err => console.log({ err }));
```

---

TITLE: Getting Comments for Post - Java
DESCRIPTION: This Java code retrieves comments for a Post using ModelList. It handles both LoadedModelList and LazyModelList. If the comments are already loaded, it retrieves them. If they are lazy-loaded, it calls a helper method to fetch all pages recursively. A helper method `fetchComments` is used to recursively load pages.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/build-a-backend/graphqlapi/relational-models/index.mdx#_snippet_6

LANGUAGE: java
CODE:

```
void getCommentsForPost(Post post) {
    ModelList<Comment> commentsModelList = post.getComments();
    if (commentsModelList instanceof LoadedModelList) {
        LoadedModelList<Comment> loadedComments = ((LoadedModelList<Comment>) commentsModelList);
        // Eager loading loads the 1st page only.
        loadedComments.getItems();
    } else if (commentsModelList instanceof LazyModelList) {
        LazyModelList<Comment> lazyComments = ((LazyModelList<Comment>) commentsModelList);
        fetchComments(lazyComments, null);
    }
}

void fetchComments(LazyModelList<Comment> lazyComments, PaginationToken token) {
    lazyComments.fetchPage(
        token,
        page -> {
            List<Comment> comments = page.getItems();
            Log.i("MyAmplifyApp", "Page of comments: " + comments);
            if (page.getHasNextPage()) {
                PaginationToken nextToken = page.getNextToken();
                fetchComments(lazyComments, nextToken); // recursively fetch next page
            }
        },
        error -> Log.e("MyAmplifyApp", "Failed to fetch comments page", error)
    );
}
```

---

TITLE: Shorthand Predicate Expression for Sync in AWS Amplify DataStore - JavaScript
DESCRIPTION: Demonstrates a concise shorthand form of defining a syncExpression when no additional logic is needed by returning the predicate directly from the callback. Simplifies simple filtering expressions.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/datastore/js/sync/50-selectiveSync.mdx#_snippet_5

LANGUAGE: JavaScript
CODE:

```
DataStore.configure({
  syncExpressions: [syncExpression(Post, (post) => post.rating.gt(5))]
});
```

---

TITLE: Configuring Amplify for Lex V1 Bot
DESCRIPTION: This JavaScript snippet demonstrates how to manually configure AWS Amplify to connect to an existing Amazon Lex V1 bot. It requires specifying the identity pool ID, region, bot name, and alias in the Amplify configuration.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/interactions/js/getting-started.mdx#_snippet_2

LANGUAGE: javascript
CODE:

```
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    identityPoolId: 'us-east-1:xxx-xxx-xxx-xxx-xxx',
    region: 'us-east-1'
  },
  Interactions: {
    bots: {
      BookTrip: {
        name: 'BookTrip',
        alias: '$LATEST',
        region: 'us-east-1'
      }
    }
  }
});
```

---

TITLE: Removing file association from a record in AWS Amplify (JavaScript)
DESCRIPTION: This code performs similar functionality as the TypeScript version, fetching the record, checking for a file association, and updating the record to remove it. It relies on Amplify's API and Storage modules, with queries and mutations predefined.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/graphqlapi/js/working-with-files.mdx#_snippet_1

LANGUAGE: JavaScript
CODE:

```
const response = await API.graphql({
  query: queries.getSong,
  variables: { id: currentSong.id }
});

const song = response?.data?.getSong;

// If the record has no associated file, we can return early.
if (!song?.coverArtKey) return;

const songDetails = {
  id: song.id,
  coverArtKey: null
};

const updatedSong = await API.graphql({
  query: mutations.updateSong,
  variables: { input: songDetails }
});
```

---

TITLE: Generating Static Paths for Platform-Specific Documentation Pages
DESCRIPTION: Creates static paths for all supported platforms using a custom utility function to enable platform-specific routing in a static site generation context.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/more-features/in-app-messaging/display-messages/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:

```
export const getStaticPaths = async () => {
  return getCustomStaticPath(meta.platforms);
};
```

---

TITLE: Configuring Amplify for LexV2 - JavaScript
DESCRIPTION: This JavaScript snippet shows how to configure AWS Amplify to use Amazon Lex V2. It imports the necessary modules from `aws-amplify`, parses the amplify configuration, and sets the `Interactions.LexV2` configuration with the bot's aliasId, botId, localeId, and region. Replace the placeholder values within the LexV2 object with the appropriate values from your Lex V2 bot.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/interactions/js/getting-started.mdx#_snippet_1

LANGUAGE: javascript
CODE:

```
import { Amplify } from 'aws-amplify';
import { parseAmplifyConfig } from "aws-amplify/utils";
import amplifyconfig from './amplifyconfiguration.json';

Amplify.configure({
  ...parseAmplifyConfig(amplifyconfig),
  Interactions: {
    LexV2: {
      '<V2BotName>': {
        aliasId: '<V2BotAliasId>',
        botId: '<V2BotBotId>',
        localeId: '<V2BotLocaleId>',
        region: '<V2BotRegion>'
      }
    }
  }
});
```

---

TITLE: Exporting IAM Roles and MFA Metadata for Amplify Documentation in JavaScript
DESCRIPTION: Defines and exports a metadata object containing the page title, description, and supported platforms for the IAM roles and MFA documentation. This metadata supports rendering platform-specific Amplify docs. The platforms array lists supported frameworks and platforms relevant to the Amplify CLI documentation context.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/tools/cli/reference/iam-roles-mfa/index.mdx#_snippet_0

LANGUAGE: JavaScript
CODE:

```
export const meta = {
  title: 'IAM roles and MFA',
  description: "Configure the Amplify CLI to assume an IAM role by defining a profile for the role in the shared '~/.aws/config' file.",
  platforms: [
    'android',
    'angular',
    'flutter',
    'javascript',
    'nextjs',
    'react',
    'react-native',
    'swift',
    'vue'
  ]
};
```

---

TITLE: Illustrating Cognito SAML Redirect URL Pattern (Text)
DESCRIPTION: Explains the standard URL format used by Amazon Cognito for handling SAML provider interactions, specifically for redirect and assertion consumer service endpoints. It shows the structure, including the base domain and the `/saml2/<action>` path.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/auth/examples/microsoft-entra-id-saml/index.mdx#_snippet_2

LANGUAGE: text
CODE:

```
https://<some-hash>.auth.<aws-region>.amazoncognito.com/saml2/<action>
```

---

TITLE: Sample Output from Auth Function Logs in Amplify Sandbox
DESCRIPTION: Example console output showing the streaming logs from various authentication-related Lambda functions, including pre-sign-up, post-confirmation, pre-authentication, and post-authentication triggers with execution details.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/functions/streaming-logs/index.mdx#_snippet_3

LANGUAGE: console
CODE:

```
> npx ampx sandbox --stream-function-logs --logs-filter auth
...

✨  Total time: 158.44s

[Sandbox] Watching for file changes...
File written: amplify_outputs.json
[auth-pre-sign-up] 3:36:34 PM INIT_START Runtime Version: nodejs:18.v30	Runtime Version ARN: arn:aws:lambda:us-east-1::runtime:f89c264158db39a1cfcbb5f9b3741413df1cfce4d550c9a475a67d923e19e2f4
[auth-pre-sign-up] 3:36:34 PM START RequestId: 685be2bd-5df1-4dd5-9eb1-24f5f6337f91 Version: $LATEST
[auth-pre-sign-up] 3:36:34 PM END RequestId: 685be2bd-5df1-4dd5-9eb1-24f5f6337f91
[auth-pre-sign-up] 3:36:34 PM REPORT RequestId: 685be2bd-5df1-4dd5-9eb1-24f5f6337f91	Duration: 4.12 ms	Billed Duration: 5 ms	Memory Size: 512 MB	Max Memory Used: 67 MB	Init Duration: 173.67 ms
[auth-post-confirmation] 3:38:40 PM INIT_START Runtime Version: nodejs:18.v30	Runtime Version ARN: arn:aws:lambda:us-east-1::runtime:f89c264158db39a1cfcbb5f9b3741413df1cfce4d550c9a475a67d923e19e2f4
[auth-post-confirmation] 3:38:40 PM START RequestId: fce69b9f-b257-4af8-8a6e-821f84a39ce7 Version: $LATEST
[auth-post-confirmation] 3:38:41 PM 2024-07-19T22:38:41.209Z	fce69b9f-b257-4af8-8a6e-821f84a39ce7	INFO	processed 412f8911-acfa-41c7-9605-fa0c40891ea9
[auth-post-confirmation] 3:38:41 PM END RequestId: fce69b9f-b257-4af8-8a6e-821f84a39ce7
[auth-post-confirmation] 3:38:41 PM REPORT RequestId: fce69b9f-b257-4af8-8a6e-821f84a39ce7	Duration: 264.38 ms	Billed Duration: 265 ms	Memory Size: 512 MB	Max Memory Used: 93 MB	Init Duration: 562.19 ms
[auth-pre-authentication] 3:38:41 PM INIT_START Runtime Version: nodejs:18.v30	Runtime Version ARN: arn:aws:lambda:us-east-1::runtime:f89c264158db39a1cfcbb5f9b3741413df1cfce4d550c9a475a67d923e19e2f4
[auth-pre-authentication] 3:38:41 PM START RequestId: 9210ca3a-1351-4826-8544-123684765710 Version: $LATEST
[auth-pre-authentication] 3:38:41 PM END RequestId: 9210ca3a-1351-4826-8544-123684765710
[auth-pre-authentication] 3:38:41 PM REPORT RequestId: 9210ca3a-1351-4826-8544-123684765710	Duration: 3.47 ms	Billed Duration: 4 ms	Memory Size: 512 MB	Max Memory Used: 67 MB	Init Duration: 180.24 ms
[auth-post-authentication] 3:38:42 PM INIT_START Runtime Version: nodejs:18.v30	Runtime Version ARN: arn:aws:lambda:us-east-1::runtime:f89c264158db39a1cfcbb5f9b3741413df1cfce4d550c9a475a67d923e19e2f4
[auth-post-authentication] 3:38:42 PM START RequestId: 60c1d680-ea24-4a8b-93de-02d085859140 Version: $LATEST
[auth-post-authentication] 3:38:42 PM END RequestId: 60c1d680-ea24-4a8b-93de-02d085859140
[auth-post-authentication] 3:38:42 PM REPORT RequestId: 60c1d680-ea24-4a8b-93de-02d085859140	Duration: 4.61 ms	Billed Duration: 5 ms	Memory Size: 512 MB	Max Memory Used: 68 MB	Init Duration: 172.66 ms
```

---

TITLE: Providing Static Properties for Platform Pages - JavaScript
DESCRIPTION: Exports a function to obtain static properties for the documentation page by extracting the platform parameter from the context. The function is compatible with static site frameworks and uses the context parameter to dynamically inject data for page rendering. The returned object provides both the platform and meta information as props.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/more-features/datastore/authz-rules-setup/index.mdx#_snippet_2

LANGUAGE: javascript
CODE:

```
export function getStaticProps(context) {
  return {
    props: {
      platform: context.params.platform,
      meta
    }
  };
}
```

---

TITLE: Adding Restaurant Creation Form (HTML Template)
DESCRIPTION: This form captures the restaurant's name, description, and city, then triggers the `onCreate()` method on submission to add a new restaurant to the database.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/start/getting-started/angular/data-model.mdx#_snippet_13

LANGUAGE: HTML
CODE:

```
<div class="form-body">
  <form
    autocomplete="off"
    [formGroup]="createForm"
    (ngSubmit)="onCreate(createForm.value)"
  >
    <div>
      <label>Name: </label>
      <input type="text" formControlName="name" autocomplete="off" />
    </div>
    <div>
      <label>Description: </label>
      <input type="text" formControlName="description" autocomplete="off" />
    </div>
    <div>
      <label>City: </label>
      <input type="text" formControlName="city" autocomplete="off" />
    </div>
    <button type="submit">Submit</button>
  </form>
</div>
```

---

TITLE: Generating Static Paths for Authentication - JavaScript
DESCRIPTION: This code generates static paths for the authentication documentation page based on the supported platforms defined in the metadata. It uses the `getCustomStaticPath` utility function to create the paths.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/auth/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:

```
export async function getStaticPaths() {
  return getCustomStaticPath(meta.platforms);
}
```

---

TITLE: Push Updates to Amplify Backend - Bash
DESCRIPTION: This bash command is used to push the local backend configuration, including the newly added Interactions category, to the AWS cloud using the Amplify CLI. This creates or updates the backend resources defined in your Amplify project.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/interactions/js/getting-started.mdx#_snippet_3

LANGUAGE: bash
CODE:

```
amplify push
```

---

TITLE: Define Custom Mutation and Function
DESCRIPTION: This code defines a custom mutation named `convertTextToSpeech` and a function using `defineFunction`. The mutation allows clients to request text-to-speech conversion, and the function handles the actual conversion logic. It configures the function entry point and associates it with the mutation handler.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/custom-business-logic/connect-amazon-polly/index.mdx#_snippet_4

LANGUAGE: typescript
CODE:

```
import {
  type ClientSchema,
  a,
  defineData,
  defineFunction,
} from "@aws-amplify/backend";

export const convertTextToSpeech = defineFunction({
  entry: "./convertTextToSpeech.ts",
});

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization(allow => [allow.publicApiKey()]),
  convertTextToSpeech: a
    .mutation()
    .arguments({
      text: a.string().required(),
    })
    .returns(a.string().required())
    .authorization(allow => [allow.publicApiKey()])
    .handler(a.handler.function(convertTextToSpeech)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for allow.publicApiKey() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

```

---

TITLE: Running Expo Prebuild Command
DESCRIPTION: Command to generate platform-specific folders for calling native libraries in Expo.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/auth/set-up-auth/index.mdx#_snippet_18

LANGUAGE: bash
CODE:

```
npx expo prebuild
```

---

TITLE: Tags after push
DESCRIPTION: Shows the resulting tags after the amplify push command, with the predefined variables replaced by the actual project name and environment.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/tools/cli/project/tags/index.mdx#_snippet_2

LANGUAGE: json
CODE:

```
[
  {
    "Key": "myawesomekey",
    "Value": "myvalue-myamplifyproject-dev"
  }
]
```

---

TITLE: Handling Errors When Loading Split GraphQL Schema Files
DESCRIPTION: This console message indicates that Amplify Studio does not support loading multiple split schema files and suggests the need to combine them into a single schema.graphql file. It helps users troubleshoot schema loading issues caused by schema separation.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/tools/console/data/data-model/index.mdx#_snippet_4

LANGUAGE: console
CODE:

```
Your schema file could not be loaded
The schema.graphql file in your project could not be loaded. This may be because the file was moved, or because you are using a split schema, which is not supported.
```

---

TITLE: Calling Text Interpretation API with Amplify JS
DESCRIPTION: This JavaScript code snippet demonstrates how to use the AWS Amplify Predictions module to analyze text. It calls the `Predictions.interpret` method with the source text and specifies 'ALL' for the interpretation type. The snippet includes promise handling for processing the result or catching potential errors.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib-v1/predictions/js/interpret.mdx#_snippet_1

LANGUAGE: js
CODE:

```
Predictions.interpret({
  text: {
    source: {
      text: textToInterpret,
    },
    type: "ALL"
  }
})
.then(result => console.log({ result }))
.catch(err => console.log({ err }));
```

---

TITLE: Configuring Amplify Predictions Resource using CLI
DESCRIPTION: These commands configure the Amplify Predictions resource using the Amplify CLI. It initializes the project, adds authentication, and sets up the Predictions resource to identify text in images and documents, allowing access to both authenticated and guest users.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/fragments/lib/predictions/ios/identify-text.mdx#_snippet_0

LANGUAGE: console
CODE:

```
? Please select from one of the categories below
❯ Identify
  Convert
  Interpret
  Infer
  Learn More

? What would you like to identify? (Use arrow keys)
❯ Identify Text
  Identify Entities
  Identify Labels

? Provide a friendly name for your resource
    <Enter a friendly name here>

? Would you also like to identify documents?
    <Enter 'y'>

? Who should have access?
  Auth users only
❯ Auth and Guest users
```

---

TITLE: JavaScript: Delete Song Record and Associated Image
DESCRIPTION: This function deletes a song record from the API and its associated cover art image file from storage, then clears local React state to reflect the deletion.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/[platform]/build-a-backend/data/working-with-files/index.mdx#_snippet_42

LANGUAGE: JavaScript
CODE:

```
async function deleteCurrentSongAndImage() {
  if (!currentSong) return;
  try {
    const response = await client.models.Song.get({
      id: currentSong.id,
    });
    const song = response.data;
    if (!song?.coverArtPath) return;
    await remove({ path: song.coverArtPath });
    await client.models.Song.delete({ id: song.id });
    clearLocalState();
  } catch (error) {
    console.error("Error deleting song: ", error);
  }
}
```

---

TITLE: Defining Page Meta Data for Amplify REST API Documentation in JavaScript
DESCRIPTION: Defines a meta object containing the page title, description, and a list of supported platforms. This metadata is utilized in generating platform-specific documentation and for SEO purposes. It requires no external dependencies; all fields are plain JavaScript data types.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/restapi/customize-authz/index.mdx#_snippet_1

LANGUAGE: javascript
CODE:

```
export const meta = {
  title: 'Define authorization rules',
  description: "Learn more about how to define authorization rules for Amplify's REST API capabilities",
  platforms: [
    'flutter',
    'swift',
    'android',
    'javascript',
    'react-native',
    'angular',
    'nextjs',
    'react',
    'vue'
  ]
};
```

---

TITLE: Configuring Metadata and Platforms in TypeScript
DESCRIPTION: Defines a metadata object containing the page title, description, and array of supported platforms. This acts as a configuration source for static path generation and identifying platform-specific content variants.
SOURCE: https://github.com/aws-amplify/docs/blob/main/src/pages/gen1/[platform]/prev/build-a-backend/more-features/in-app-messaging/clear-messages/index.mdx#_snippet_0

LANGUAGE: typescript
CODE:

```
export const meta = {
  title: 'Clear messages',
  description: "Learn more about how to clear synced in-app messages from the user's device.",
  platforms: [
    'javascript',
    'react-native',
    'angular',
    'nextjs',
    'react',
    'vue'
  ]
};
```
