import { defineFunction, secret } from "@aws-amplify/backend";

export const generatePresignedUrl = defineFunction({
  name: "generatePresignedUrl",
  entry: "./handler.ts",
  environment: {
    AWS_BUCKET_NAME: secret("AWS_BUCKET_NAME"),
    AWS_REGION: secret("AWS_REGION"),
    AWS_ACCESS_KEY_ID: secret("AWS_ACCESS_KEY_ID"),
    AWS_SECRET_ACCESS_KEY: secret("AWS_SECRET_ACCESS_KEY"),
  },
});
