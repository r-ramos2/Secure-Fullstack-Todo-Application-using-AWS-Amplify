import { defineData, a, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Todo: a.model({
    content: a.string().required(), // Ensure content is required
    isDone: a.boolean().default(false), // Default to false
  }).authorization(allow => [allow.owner()]), // Owner-based authorization rule
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool', // Use the Cognito user pool for authorization
  },
});
