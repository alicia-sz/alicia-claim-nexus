import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION = process.env.AWS_REGION!;
const BUCKET = process.env.AWS_BUCKET_NAME!;
const ACCESS_ID = process.env.AWS_ACCESS_KEY_ID!;
const SECRET = process.env.AWS_SECRET_ACCESS_KEY!;

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_ID,
    secretAccessKey: SECRET,
  },
});

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { filename, contentType } = JSON.parse(event.body || "{}");
  if (!filename || !contentType) {
    return { statusCode: 400, body: "Missing filename or contentType" };
  }

  try {
    const cmd = new PutObjectCommand({
      Bucket: BUCKET,
      Key: filename,
      ContentType: contentType,
    });
    const url = await getSignedUrl(s3, cmd, { expiresIn: 300 });
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ url }),
    };
  } catch (err: any) {
    console.error("Presign error", err);
    return { statusCode: 500, body: "Could not create URL" };
  }
};
