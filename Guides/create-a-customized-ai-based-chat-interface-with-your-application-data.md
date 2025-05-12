## [Front-End Web & Mobile](https://aws.amazon.com/blogs/mobile/)

# Create a Customized AI-Based Chat Interface With Your Application Data

by Erik Hanchett on 20 NOV 2024 in [Announcements](https://aws.amazon.com/blogs/mobile/category/post-types/announcements/ "View all posts in Announcements"), [AWS Amplify](https://aws.amazon.com/blogs/mobile/category/mobile-services/aws-amplify/ "View all posts in AWS Amplify"), [Front-End Web & Mobile](https://aws.amazon.com/blogs/mobile/category/mobile-services/ "View all posts in Front-End Web & Mobile") [Permalink](https://aws.amazon.com/blogs/mobile/create-a-customized-ai-based-chat-interface-with-your-application-data/) [Share](#)

- [](https://www.facebook.com/sharer/sharer.php?u=https://aws.amazon.com/blogs/mobile/create-a-customized-ai-based-chat-interface-with-your-application-data/)
- [](https://twitter.com/intent/tweet/?text=Create%20a%20Customized%20AI-Based%20Chat%20Interface%20With%20Your%20Application%20Data&via=awscloud&url=https://aws.amazon.com/blogs/mobile/create-a-customized-ai-based-chat-interface-with-your-application-data/)
- [](https://www.linkedin.com/shareArticle?mini=true&title=Create%20a%20Customized%20AI-Based%20Chat%20Interface%20With%20Your%20Application%20Data&source=Amazon%20Web%20Services&url=https://aws.amazon.com/blogs/mobile/create-a-customized-ai-based-chat-interface-with-your-application-data/)
- [](mailto:?subject=Create%20a%20Customized%20AI-Based%20Chat%20Interface%20With%20Your%20Application%20Data&body=Create%20a%20Customized%20AI-Based%20Chat%20Interface%20With%20Your%20Application%20Data%0A%0Ahttps://aws.amazon.com/blogs/mobile/create-a-customized-ai-based-chat-interface-with-your-application-data/)
-

Frontend developers face significant hurdles when creating persistent conversational AI chat experiences for their apps. They often how to deal with complex APIs, complicated real-time UI updates, and hard to configure permissions. Not to mention having to setup intricate cloud infrastructure. That’s why we are excited to show you [AWS Amplify AI kit](https://docs.amplify.aws/react/ai/set-up-ai/) and it’s conversational chat experience!

Now with just a few lines of code, you can use TypeScript to add conversational chat to your frontend application. No complicated cloud setup, or additional permissions needed. Each chat you create can connect to one of many Amazon Bedrock models. Each one will maintain it’s own persistent conversation history tied to your customers user accounts, and you’ll be able to customize that chat experience to fit your application’s needs.

This feature is powered by the new `conversation` API that creates a new route to your backend. You’ll have the option to specify a Large Language Model (LLM) model powered by Amazon Bedrock, and customize a system prompt crafted for your customers needs. Optionally, Amplify supports tool use, a way you can interact with external data and functions to deliver your responses exactly as needed.

On the frontend Amplify has released a new UI library that provides an `AIConversation` component and `useAIConversation` React hook. These APIs can be dropped into your React application with minimal configuration to display a chat window for your customers to start interacting with. You can then customize that experience to fit your applications look and feel. For example, you can update the avatar, display text, allow attachments and even create components for specific responses.

In this tutorial we’ll look at how you can add a conversation route to your application, and customize it.

## Prerequisites

If you like to follow along with this post you’ll need to set up [AWS Amplify Gen 2](https://docs.amplify.aws/react/start/manual-installation/) in your application. This can be as simple as running the create command in the root of your application.

    npm create amplify@latest

Bash

This will create a new `amplify` folder in the root of your project where you can start defining your backend resources. Before continuing on make sure to [enable the Amazon Bedrock models](https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started.html#getting-started-model-access) you’d like to use. In this tutorial we’ll be using Claude 3 Haiku. In addition, you can optionally follow the [Configure AWS for local development](https://docs.amplify.aws/react/start/account-setup/) guide. You’ll only need to follow this guide only once, afterwords you’ll be able to test locally with our [cloud sandbox environments](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/setup/).

If you haven’t already please take a look at our [launch blog post](https://aws.amazon.com/blogs/mobile/build-fullstack-ai-apps-in-minutes-with-the-new-amplify-ai-kit/) for Amplify AI kit to get started for more details! You can also see full examples of using all the features listed in this post and others by looking at our [Amplify AI Samples repository](https://github.com/aws-samples/amplify-ai-examples)!

## Adding a conversation route

Amplify AI kit is built on top of the Amplify [data](https://docs.amplify.aws/react/build-a-backend/data/) conventions. This convention allows you to create a data model to connect to any data source using a simple TypeScript enabled syntax. In this case, you’ll use the new `a.conversation` API in the schema definition located in the `data/resource.ts` file to build a chat conversation route.

To begin, let’s add to our data resource file and create a new conversation called `chat`.

    // data/resource.ts
    import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

    const schema = a.schema({
      chat: a.conversation({
        aiModel: a.ai.model("Claude 3 Haiku"),
        systemPrompt:
          "You are a travel advisor app. You help travelers find locations.",
      }).authorization(allow => allow.owner()),
    });

    export type Schema = ClientSchema<typeof schema>;

    export const data = defineData({
      schema,
      authorizationModes: {
        defaultAuthorizationMode: "userPool",
      },
    });

TypeScript

_To use the conversation API end users must be authenticated. This is by default and cannot by changed. By convention when setting up AWS Amplify Gen 2 it creates an Amazon Cognito User Pool via the [auth category](https://docs.amplify.aws/react/build-a-backend/auth/). If testing this yourself, I’d recommend setting up your frontend with the [Authenticator](https://ui.docs.amplify.aws/react/connected-components/authenticator) connected component that uses the Amplify auth category. This sets up a sign in and sign out UI component with just a few lines of code._

One of the most important parts of setting up chat is defining the `aiModel` and `systemPrompt` definitions. For the `aiModel` we have chosen `Claude 3 Haiku`. This is one of the latest Anthropic Claude 3 models and will act as our LLM to help answer questions for our users. Several models are available at launch for you to choose from including Claude 3 Opus, Claude 3 Haiku, Cohere, LLama, and Mistral.

The system prompt defines what you expect the LLM to do. In this post we have kept the prompt simple; however, depending on your use case you may want to try a more succinct one. You may consider using other [prompting](https://docs.amplify.aws/react/ai/concepts/prompting/) strategies, like few-shot prompting, which may yield better results.

Optionally, we can add an [inferenceConfiguration](https://docs.amplify.aws/react/ai/concepts/inference-configuration/) to set the model’s [tokens](https://docs.amplify.aws/react/ai/concepts/inference-configuration/#max-tokens), [temperature](https://docs.amplify.aws/react/ai/concepts/inference-configuration/#temperature) and [topP](https://docs.amplify.aws/react/ai/concepts/inference-configuration/#top-p). Another option is to add tools. Tool use, also sometimes known as function calling, allows capable models to interact with external functions or data. For example, you may want to use retrieval-augmented generation (RAG) with Amazon Bedrock Knowledge Base. This can be accomplished by adding it to the resource file with a custom resolver. We’ll be looking at more examples like this in future posts.

It’s worth noting that the `backend.ts` file, in the root amplify folder, will need no other additional configuration for this chat conversation API to be added. When starting with a new project `data` will be imported into the `defineBackend` function call. No further IAM policy updates are needed. Behind the scenes we’ll create the AWS Cloud Development Kit (CDK) code necessary to build the AWS AppSync resolvers, and AWS Lambdas functions that will interact directly with Amazon Bedrock. Amplify also creates the IAM policies needed, and sets the data source for Amazon DynamoDB to help save the persisted conversation history per user account.

## Testing locally with cloud sandbox

If you’re following along you can test locally by running the `npx ampx sandbox` command in the root of your application. This will read the `amplify` folder and provision your cloud resources to start testing.

## Updating the frontend

With the backend definition in place, we can now move onto adding the frontend code. We’ll assume you are using a React application with Vite or Next.js.

    npm i @aws-amplify/ui-react-ai

Bash

This library contains everything we need necessary to use Amplify’s new AI components.

Create a new `Chat.tsx` component and add the following code.

    // Chat.tsx
    import { generateClient } from "aws-amplify/data";
    import { createAIHooks, AIConversation } from '@aws-amplify/ui-react-ai';
    import type { Schema } from "../amplify/data/resource";

    const client = generateClient<Schema>({ authMode: 'userPool' });
    const { useAIConversation } = createAIHooks(client);

    export default function Chat() {
      const [
        {
          data: { messages },
        },
        sendMessage,
      ] = useAIConversation('chat');
      // 'chat' here should be the key in your schema

      return (
            <AIConversation
                messages={messages}
                handleSendMessage={sendMessage}
            />
        )
    }

TypeScript

Add this new component to your app’s entry point file. To test make sure your user is already signed in. I’d recommend surround your application with the [Authenticator](https://ui.docs.amplify.aws/react/connected-components/authenticator) component as well. This will make it so users will have to sign in and create an account before they can access chat.

After loading your main entry you’ll see a simple chat interface for you to use.

![Displays how conversational chat works](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2024/11/19/ai-travel.gif)

You may be wondering how we can add multiple chat conversations. Let’s take a closer look at the `useAIConversation` hook and add an optional id.

      const [
        {
          data: { messages },
          isLoading,
        },
        sendMessage,
      ] = useAIConversation("chat", { id: "123" });

TypeScript

By default users will only have one chat. By adding in an `id` you can create multiple separate chats for that user, based on that id. Each chat will be tied to the user who is logged into the system. At any time you can use the `generateClient` API to retrieve, delete, or even update conversations. For a full example on how to set this up see our [Amplify AI Examples](https://github.com/aws-samples/amplify-ai-examples) repo.

## Customizing the chat experience

The `AIConversation` connected component has several props that helps you customize the chat experience for your users. Let’s take a look at a few customizations that can enhance the user experience.

### Updating the Avatar

One of the most common requests when working with conversational chat is to change the avatars shown to the user. To update this you can add the `avatars` prop.

    import { Avatar, View } from "@aws-amplify/ui-react";
    ...
      <AIConversation
        messages={messages}
        handleSendMessage={sendMessage}
        avatars={{
          user: {
            avatar: <Avatar src="erik.jpg" />,
            username: "Erik",
          },
          ai: {
            avatar: <Avatar src="robot.jpg" />,
            username: "🤖",
          },
        }}
      />

TypeScript

The avatars prop takes a `user` and an `ai` object. You can then define the avatars and usernames that will be displayed for each in chat. In this example I’m using the `Avatar` component from the `@aws-amplify/ui-react` library to show a picture. As for the AI, I have changed the named to an emoji with a new avatar.

![Shows how the avatars look in chat](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2024/11/19/avatar-300x171.png)

### Response Component

The response component prop enables developers to create custom responses based on messages returned from the LLM. App developers can define the output for these messages by creating components and adding it to the `responseComponents` prop. For example, imagine a user asks for information on a vacation spot, the chat could display the name and description in a custom location card.

In the code below you can see a `LocationCard` component that will be used to create the card for the user.

    import { LocationCard } from './LocationCard.tsx';
    ...
      <AIConversation
        messages={messages}
        handleSendMessage={sendMessage}
        responseComponents={{
          LocationCard: {
            description: "Used to display a location to the user",
            component: LocationCard,
            props: {
              name: {
                type: "string",
                description: "The name of the location",
              },
              description: {
                type: "string",
                description: "The description of the location",
              },
            },
          },
        }}
      />

TypeScript

In this example we display the name and description of the location in a nicely formatted card.

![Chat response in card component](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2024/11/19/card-300x263.png)

The `responseComponents` prop can also work with external APIs that are connected to the conversation route via tools.

### Allowing attachments

If needed, you can attach files directly inside the chat window. To turn this feature on you must be using an LLM that accepts files. Add the `allowAttachments` prop to enable this feature.

    <AIConversation
        messages={messages}
        handleSendMessage={sendMessage}
        allowAttachments
    />

TypeScript

After adding this prop you’ll now see an attach file button at the bottom of the chat window.

![Shows chat with attachment](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2024/11/19/attachment-1024x188.png)

_Be aware all images that you upload are saved into Amazon DynamoDB. It has a 400KB limit, so only images 400KB are smaller can be added. After attaching the image you can then ask any question about it to get the LLM response._

### Message Renderer

The message renderer prop formats the text output. For example, let’s imagine you want your output to be in markdown. Most LLMs support this so it can be useful to render the markdown in a conversation message. You could accomplish this by installing a library like `react-markdown` and then use the `ReactMarkdown` component so all output is formatted properly.

    import ReactMarkdown from "react-markdown";
    ...
    <AIConversation
        messages={messages}
        handleSendMessage={sendMessage}
        messageRenderer={{
          text: ({ text }) => <ReactMarkdown>{text}</ReactMarkdown>,
        }}
    />

TypeScript

Combing `react-markdown` with other plugins like `rehypeHighlight` allows for additional code text highlighting.

Here is an example of a chat that is using the `rehypeHighlight` plugin with the `messageRenderer` to display texts of code.

![Chat window showing the message renderer for code](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2024/11/19/renderer-300x200.png)

## Cleanup

If you are running the sandbox, you can delete your sandbox and all the backend infrastructure that was created by running the following command in your terminal.

    npx ampx sandbox delete

Bash

## What’s next?

In this post we’ve looked at how you can securely add conversational chat to your application using Amplify AI kit. We’ve seen how simple it is to add the new Amplify AI UI library to create a custom chat experience for your users. In addition, we’ve seen how you can customize that chat experience by using response components, avatars, and message renderers to enhance the user experience further.

If you like to learn more take a look at our [starting guide for AI](https://docs.amplify.aws/react/ai/set-up-ai/). In it we go over in detail how to get started with Amplify AI kit. Also please check out our [Discord channel](https://discord.gg/amplify) to connect with us directly.

TAGS: [AI/ML](https://aws.amazon.com/blogs/mobile/tag/ai-ml/), [Amplify](https://aws.amazon.com/blogs/mobile/tag/amplify/), [General Availability](https://aws.amazon.com/blogs/mobile/tag/general-availability/)

[![](//d1.awsstatic.com/Digital%20Marketing/House/Editorial/other/SiteMerch-3066-Podcast_Editorial.65839609a8dda387937ed07dc8dc4f3c3b870546.png)

AWS Podcast

Subscribe for weekly AWS news and interviews

Learn more](https://aws.amazon.com/podcasts/aws-podcast/?sc_icampaign=aware_aws-podcast&sc_ichannel=ha&sc_icontent=awssm-2021&sc_iplace=blog_tile&trk=ha_awssm-2021)

[![](//d1.awsstatic.com/webteam/homepage/editorials/Site-Merch_APN_Editorial.12df33fb7e0299389b086fb48dba7b9deeef07df.png)

AWS Partner Network

Find an APN member to support your cloud business needs

Learn more](https://aws.amazon.com/partners/find/?sc_icampaign=aware_apn_recruit&sc_ichannel=ha&sc_icontent=awssm-2021&sc_iplace=blog_tile&trk=ha_awssm-2021)

[![](//d1.awsstatic.com/webteam/homepage/editorials/Site-Merch_Training_Editorial.5cc72ab0552ba66ef4e36a1a60ee742bc31113c7.png)

AWS Training & Certifications

Free digital courses to help you develop your skills

Learn more](https://aws.amazon.com/training/?sc_icampaign=aware_aws-training_blog&sc_ichannel=ha&sc_icontent=awssm-2021&sc_iplace=blog_tile&trk=ha_awssm-2021)
