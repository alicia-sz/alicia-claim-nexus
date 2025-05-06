// pages/api/upload-url.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { NextApiRequest, NextApiResponse } from "next";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end("Only POST allowed");
  const { filename, contentType } = req.body as {
    filename: string;
    contentType: string;
  };
  if (!filename || !contentType) return res.status(400).end("Bad request");

  const cmd = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: filename,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3, cmd, { expiresIn: 300 });
  res.status(200).json({ url });
}
