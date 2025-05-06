// components/UppyUploader.tsx
"use client";

import { useEffect, useState } from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import AwsS3 from "@uppy/aws-s3";

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";

export default function UppyUploader() {
  // Treat uppy as any so TS lets us call methods that
  // the current type definitions don’t expose.
  const [uppy, setUppy] = useState<any>(null);

  useEffect(() => {
    // ⚠️ Use `new Uppy(...)` here
    const uppyInstance: any = new Uppy({
      restrictions: { maxNumberOfFiles: 5 },
      autoProceed: true,
    });

    // Silence the strict plugin type mismatch
    // @ts-ignore
    uppyInstance.use(AwsS3, {
      async getUploadParameters(file: any) {
        const res = await fetch("/api/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
          }),
        });
        const { url } = await res.json();
        return {
          method: "PUT",
          url,
          headers: { "Content-Type": file.type },
        };
      },
    });

    setUppy(uppyInstance);

    return () => {
      // @ts-ignore
      uppyInstance.close();
    };
  }, []);

  if (!uppy) return null;

  return (
    <Dashboard
      uppy={uppy}
      proudlyDisplayPoweredByUppy={false}
      note="Drag & drop files here to upload"
    />
  );
}
