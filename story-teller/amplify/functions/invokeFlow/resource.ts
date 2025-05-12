import { defineFunction } from "@aws-amplify/backend";

export const REGION = "us-east-1";
export const FLOW_IDENTIFIER = "A123456789";
export const FLOW_ALIAS_IDENTIFIER = "A12345678";

export const invokeFlow = defineFunction({
  name: "invokeFlow",
  entry: "./handler.ts",
  timeoutSeconds: 500,
  environment: {
    REGION,
    FLOW_IDENTIFIER,
    FLOW_ALIAS_IDENTIFIER,
  },
});
