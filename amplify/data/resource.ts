import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Document: a
    .model({
      username: a.string(),
      filename: a.string(),
      uploadTimestamp: a.datetime(),
      fileSize: a.integer(),
      contentType: a.string(),
      claimId: a.string(), // Optional grouping field
    })
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});
