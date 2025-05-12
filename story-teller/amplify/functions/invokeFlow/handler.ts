import type { Schema } from "../../data/resource";
import {
  BedrockAgentRuntimeClient,
  InvokeFlowCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import { env } from "$amplify/env/invokeFlow";

// For more details see https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-agent-runtime_example_bedrock-agent-runtime_InvokeFlow_section.html

const REGION = env.REGION;
const FLOW_IDENTIFIER = env.FLOW_IDENTIFIER;
const FLOW_ALIAS_IDENTIFIER = env.FLOW_ALIAS_IDENTIFIER;

export const handler: Schema["invokeFlow"]["functionHandler"] = async (
  event
) => {
  try {
    const client = new BedrockAgentRuntimeClient({
      region: REGION,
      maxAttempts: 3,
    });

    console.log("Attempting to invoke flow with:", {
      flowId: FLOW_IDENTIFIER,
      aliasId: FLOW_ALIAS_IDENTIFIER,
      input: event.arguments.document,
    });

    const command = new InvokeFlowCommand({
      flowAliasIdentifier: FLOW_ALIAS_IDENTIFIER,
      flowIdentifier: FLOW_IDENTIFIER,
      inputs: [
        {
          content: {
            document: event.arguments.document || "",
          },
          nodeName: "FlowInputNode",
          nodeOutputName: "document",
        },
      ],
      enableTrace: true,
    });

    let responseText = "";

    const response = await client.send(command);

    console.log(" FINAL Response", response);

    if (response.responseStream) {
      console.log(" FINAL responseStream", response.responseStream);
      for await (const chunkEvent of response.responseStream!) {
        const { flowOutputEvent } = chunkEvent;
        if (flowOutputEvent?.content?.document) {
          responseText += flowOutputEvent.content.document;
        }
      }
    }
    // Ensure we have a valid response
    if (!responseText) {
      responseText = "No response received from the flow.";
    }

    console.log(" FINAL output", responseText);
    return {
      title: responseText.split(" ").slice(0, 10).join(" ") as string,
      description: responseText.split(" ").slice(10).join(" ") as string,
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
