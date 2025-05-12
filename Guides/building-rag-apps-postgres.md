## [Front-End Web & Mobile](https://aws.amazon.com/blogs/mobile/)

# Building RAG-based applications with AWS Amplify AI Kit and Neon Postgres

by Michael Liendo on 22 NOV 2024 in [\*Post Types](https://aws.amazon.com/blogs/mobile/category/post-types/ "View all posts in *Post Types"), [Amazon Bedrock](https://aws.amazon.com/blogs/mobile/category/artificial-intelligence/amazon-machine-learning/amazon-bedrock/ "View all posts in Amazon Bedrock"), [Announcements](https://aws.amazon.com/blogs/mobile/category/post-types/announcements/ "View all posts in Announcements"), [AWS Amplify](https://aws.amazon.com/blogs/mobile/category/mobile-services/aws-amplify/ "View all posts in AWS Amplify"), [AWS AppSync](https://aws.amazon.com/blogs/mobile/category/mobile-services/aws-appsync/ "View all posts in AWS AppSync"), [Front-End Web & Mobile](https://aws.amazon.com/blogs/mobile/category/mobile-services/ "View all posts in Front-End Web & Mobile") [Permalink](https://aws.amazon.com/blogs/mobile/building-rag-based-applications-with-aws-amplify-ai-kit-and-neon-postgres/) [Share](#)

- [](https://www.facebook.com/sharer/sharer.php?u=https://aws.amazon.com/blogs/mobile/building-rag-based-applications-with-aws-amplify-ai-kit-and-neon-postgres/)
- [](https://twitter.com/intent/tweet/?text=Building%20RAG-based%20applications%20with%20AWS%20Amplify%20AI%20Kit%20and%20Neon%20Postgres&via=awscloud&url=https://aws.amazon.com/blogs/mobile/building-rag-based-applications-with-aws-amplify-ai-kit-and-neon-postgres/)
- [](https://www.linkedin.com/shareArticle?mini=true&title=Building%20RAG-based%20applications%20with%20AWS%20Amplify%20AI%20Kit%20and%20Neon%20Postgres&source=Amazon%20Web%20Services&url=https://aws.amazon.com/blogs/mobile/building-rag-based-applications-with-aws-amplify-ai-kit-and-neon-postgres/)
- [](mailto:?subject=Building%20RAG-based%20applications%20with%20AWS%20Amplify%20AI%20Kit%20and%20Neon%20Postgres&body=Building%20RAG-based%20applications%20with%20AWS%20Amplify%20AI%20Kit%20and%20Neon%20Postgres%0A%0Ahttps://aws.amazon.com/blogs/mobile/building-rag-based-applications-with-aws-amplify-ai-kit-and-neon-postgres/)
-

Modern application development has shifted to include not just tooling that offers a great developer experience (DX), but a sensible balance between simply getting started and the path to production. It is this very sentiment that inspired the release of [Amplify AI kit](https://docs.amplify.aws/react/ai/). This abstraction over common AI tasks like conversing with a large language model (LLM) and generating content from a prompt means developers have a faster time to market and avoid writing boilerplate code.

In this post, we’ll move beyond the getting-started experience and use a serverless Postgres database from [Neon](https://neon.tech/) to retrieve product data instead of the default database model from Amplify. In doing so, we’ll simplify the code needed to converse with an LLM using retrieval-augmented generation (RAG).

## Application Overview

A common appeal to application consumers is how AI is used to enhance an existing product, instead of competing with it. A simple and effective way of demonstrating that is to create a chatbot that customers can interact with. In a real-world scenario, this wouldn’t prevent a customer from shopping on their own, but provides guides them towards a purchase using natural language.

![chat conversation showing conversation between llm and user.](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2024/11/22/chat-overview-1024x832.png)

Architecturally speaking, whenever a user visits the application, they can chat with our LLM-powered bot. These models are trained on general data, though in our use case, we’d like it to know about our product data as well. Product information can change at any time, so it’s important to pull from the information in our database. This idea of choosing between general information or accessing specific data is powerful and accomplished with a [tool](https://docs.amplify.aws/react/ai/concepts/tools/) (also known as “function-calling”).

![diagram showing how a typical conversation wtih an llm interact](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2024/11/22/diagram-1-1024x786.png)

An important concept to keep in mind, is that when an LLM chooses to use a tool, it is not making a call to your data on your behalf. It is simply passing along what tool would work best given the user’s prompt. From there, applications decide what function they’d like invoke.

![diagram flow of data being sent to an llm that responds with a tool](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2024/11/22/diagram-2-1024x786.png)

The response from that function is then sent back to the LLM, and formatted as natural language to the end-user.

As one might imagine, orchestrating this pattern yourself can not only be tedious, but can lead to errors. Fortunately, this undifferentiated heavy-lifting is what Amplify AI kit provides by default.

Specifically, our project will use [Amazon Bedrock](https://aws.amazon.com/bedrock/?gclid=Cj0KCQiA0fu5BhDQARIsAMXUBOLnvCA39BdhL8SiYc4sR7x5z7kkRoXDtFL6kY4hTUzgHuvcte2UHyoaAnFcEALw_wcB&trk=0eaabb80-ee46-4e73-94ae-368ffb759b62&sc_channel=ps&ef_id=Cj0KCQiA0fu5BhDQARIsAMXUBOLnvCA39BdhL8SiYc4sR7x5z7kkRoXDtFL6kY4hTUzgHuvcte2UHyoaAnFcEALw_wcB:G:s&s_kwcid=AL!4422!3!692006004688!p!!g!!amazon%20bedrock!21048268554!159639952935) with the Claude 3.5 Haiku LLM since this model comes with tool support. Amplify will allow us to specify a tool that corresponds to one of our databases. In our case, that will be our Neon Postgres database containing our product information.

## Creating Serverless Postgres Databases with Neon

The ability to [connect to existing datasources](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/)means developers can use the power of Amplify’s schema introspection outside of [Amazon DynamoDB](https://aws.amazon.com/dynamodb/), the default database, to have CRUD operations generated on their behalf. Setting up a Neon database is straightforward. After creating an account, you’re prompted to create a project.

![project creation in Neon](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2024/11/22/neon1-1024x592.png)

Neon supports branch-based projects, similar to git. These are copies of the `main` branch. In my case, I have the option to create a branch called `dev/mtliendo` . This is recommended, but not required. In either case, you’ll want to make sure to copy the connection string for that branch as it will be important in the following sections.

![screenshot of neon interface that shows a partially hidden connection string](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2024/11/22/neon-2-1024x691.png)

Our default database is now set up, however it doesn’t yet contain any tables. More specifically, our table schema has yet to be defined. You’ll be saddened to find out that I don’t know how to write SQL. Fortunately, Neon solves this with their “Generate with AI” feature. By chatting with their LLM about what I’d like to do and a response will be generated for me.

In their SQL editor, I write the following:

> Create a table schema called “Products”. Each product has a random id, an “updated at” field that is a date-time, a “created at” field that is a date-time, a “price in cents” field that is a number, a “name”, and a “description”.

![screenshot of neon interface that displays the SQL Editor and using an LLM to generate a query](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2024/11/22/neon-3-1024x590.png)

After running the prompt, I’m presented with the following response:

    CREATE TABLE Products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        price_in_cents INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT
    );

From there, I have option to make changes to the code, and run the command once everything once I’m comfortable with the syntax.

To verify everything is setup as expected, clicking on the “Tables” link in the sidebar will allow us to verify the schema, as well as [populating our database](https://aws.amazon.com/blogs/mobile/new-in-aws-amplify-integrate-with-sql-databases-oidc-saml-providers-and-the-aws-cdk/).

![screenshot of Neon interface that allows records to be added](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2024/11/22/neon-4-1024x593.png)

> For this project, I’ve added several items to the database. Also, be sure to copy the connection string to our database since we’ll be needing that in following section. The connection string can be found in the “Overview” section of the sidebar.

## Enhancing Amplify Gen 2 with AI Kit

AWS Amplify is the easiest way to connect your frontend applications to a backend powered by AWS. Assuming an app using a JavaScript framework like NextJS has already been created, scaffold Amplify files by running the following command in the root of the project:

    npm create amplify

This will install Amplify’s dependencies as well as create an `amplify` directory. Before modifying the code in that directory, we’ll install a few other dependencies needed for Amplify AI kit:

    npm i @aws-amplify/ui-react @aws-amplify/ui-react-ai

These are UI components that we’ll make use of shortly.

Before doing so, we’ll let Amplify introspect our database with the `products` table so we can use that in our backend. The first step is to store our connection string as a secret. This secret is stored in a Parameter Store in [AWS Systems Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html). Fortunately, Amplify provides a simple way to doing so.

In your terminal, run the following command:

    npx ampx sandbox secret set SQL_CONNECTION_STRING

This sets a secret value of `SQL_CONNECTION_STRING` and prompts for the value. From here, paste in the connection string copied from Neon and press enter.

> This section assumes you already have AWS Amplify configured on your local machine. If you need to configuration Amplify, please refer to the [documentation](https://docs.amplify.aws/react/start/account-setup/) for instructions.

Once the secret is stored, we can instruct Amplify to introspect our database and create CRUD operations that we can make use of in our frontend application:

    npx ampx generate schema-from-database --connection-uri-secret SQL_CONNECTION_STRING --out amplify/data/schema.sql.ts

Running this command will create a `schema.sql.ts` file in the `amplify/data` folder. It’s important to not modify this file as it’s managed by Amplify. Once that command is ran, the file should look similar to the below screenshot:

![screenshot of code editor that display an examle schema configuration](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2024/11/22/codeshot-1-1024x795.png)

Amplify uses this file to map our Postgres database to a format that works with its `a.model` method.

> Check out the documentation if you want to learn [what Amplify does behind-the-scenes to make this work](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/#how-does-it-work).

    import { type ClientSchema, defineData, a } from '@aws-amplify/backend'
    import { schema as generatedSqlSchema } from './schema.sql'

    const sqlSchema = generatedSqlSchema.setAuthorization((models) => [
        models.items.authorization((allow) => [allow.authenticated().to(['read'])]),
    ])
    const schema = a.schema({
        chat: a
            .conversation({
                aiModel: a.ai.model('Claude 3.5 Haiku'),
                systemPrompt:
                    'You are a helpful assistant, that focuses on selling and upselling merchandise',
                tools: [
                    a.ai.dataTool({
                        name: 'MerchQuery',
                        description:
                            'Search for questions regarding merchandise, shopping apparel, and item prices.',
                        model: a.ref('items'), //! This refers to the name of our table
                        modelOperation: 'list',
                    }),
                ],
            })
            .authorization((allow) => allow.owner()),
    })

    const combinedSchema = a.combine([sqlSchema, schema])

    export type Schema = ClientSchema<typeof combinedSchema>

    export const data = defineData({ schema: combinedSchema })

Now that our Neon database is in our application, we can import that into the `amplify/data/resource.ts` file and combine it with the conversation capabilities of Amplify AI kit. Let’s breakdown what is happening in this file:

- **Line 4:** Here we are assigning authorization rules on our `products` table from Neon. In this case, only signed in users can perform `read` operations against it.
- **Line 8:** We create an identifier called `chat`. This is a [conversation](https://docs.amplify.aws/react/ai/conversation/) bot that takes in, at a minimum, the name of the LLM, and a prompt on how it should behave. Worth nothing that the model names are typed and are available in Intellisense.
- **Line 13:** We enhance our bot by giving it a tool. The name and description are up to us to define, whereas the `model` must refer to the name of our Neon database. Currently the only supported `modelOperation` is `list`.
- **Line 22:** This line offers insight into what is happening behind the scenes. A DynamoDB table keeps track of a signed in users conversation history.

By putting together all of these elements, we have a fully-managed solution for securely conversing with an LLM that is aware of the items in our database.

To test our solution, we’ll first deploy our AWS backend by running the following command:

    npx ampx sandbox

Once deployed, we can import our Amplify configuration and configure our client-side application to make use of the config, UI components, and hooks provided by Amplify:

    import { generateClient } from 'aws-amplify/api'
    import { Schema } from '@/amplify/data/resource'
    import { useEffect } from 'react'
    import { Amplify } from 'aws-amplify'
    import awsconfig from '@/amplify_outputs.json'
    import { withAuthenticator } from '@aws-amplify/ui-react'
    import { AIConversation, createAIHooks } from '@aws-amplify/ui-react-ai'
    import '@aws-amplify/ui-react/styles.css'

    Amplify.configure(awsconfig)

    const client = generateClient<Schema>()
    const { useAIConversation } = createAIHooks(client)

Once configured, the entire frontend with chat, conversational awareness, streaming, loading states and authentication, can be set up in around 20 lines of code:

    function Home() {
        const [
            {
                data: { messages },
                isLoading,
            },
            handleSendMessage,
        ] = useAIConversation('chat')

        return (
            <div className="flex justify-center items-center m-10 max-w-screen-md">
                <AIConversation
                    avatars={{ user: { username: 'Focus Otter' } }}
                    messages={messages}
                    handleSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    variant="bubble"
                    welcomeMessage="Hello! I'm your helpful storefront assistant. Feel free to ask me questions about my merch!"
                />
            </div>
        )
    }

    export default withAuthenticator(Home)

Feel free to compare the code above, with the first screenshot in this post. The new `AIConversation` component of Amplify AI kit provides a full chat UI while still exposing various props to further customize to your specific needs.

## Conclusion

In this post we discussed some of the complexities of building out fullstack applications that support conversing to an LLM using retrieval-augmented generation (RAG). We then saw how AWS Amplify’s new AI kit greatly simplifies this experience by abstracting away boilerplate allowing developers to focus on the parts that truly make the application different. As we saw, this ease in setup doesn’t come at the expense of extensibility. We proved that by creating a Postgres database from Neon and using that alongside our tool.

Amplify AI kit is yet another step forward in building scalable, secure fullstack applications. To get stared with Amplify AI kit in your own application, visit the [documentation](https://docs.amplify.aws/react/ai/set-up-ai/)and get started today.

TAGS: [AI/ML](https://aws.amazon.com/blogs/mobile/tag/ai-ml/), [Amplify](https://aws.amazon.com/blogs/mobile/tag/amplify/), [AppSync](https://aws.amazon.com/blogs/mobile/tag/appsync/), [aws-appsync](https://aws.amazon.com/blogs/mobile/tag/aws-appsync/)

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
