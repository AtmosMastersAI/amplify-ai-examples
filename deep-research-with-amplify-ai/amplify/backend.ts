import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

import { auth } from './auth/resource';
import { chatHandler } from './data/chatHandler/resource';
import { planningAgent } from './data/planningAgent/resource';
import { data } from './data/resource';
import { searchAgent } from './data/searchAgent/resource';

const backend = defineBackend({
  auth,
  data,
  planningAgent,
  searchAgent,
  chatHandler,
});

backend.planningAgent.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['bedrock:InvokeModel'],
    resources: ['*'],
  })
);

backend.searchAgent.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['bedrock:InvokeModel'],
    resources: ['*'],
  })
);
