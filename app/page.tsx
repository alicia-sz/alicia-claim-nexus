"use client";

import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import UppyUploader from "@/components/UppyUploader";
import { Authenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "aws-amplify/auth";
import { StorageBrowser } from "@/components/StorageBrowser";
import type { UserAttributeKey } from "aws-amplify/auth";
import "./app.css";

Amplify.configure(outputs);

export default function App() {
  const [userAttrs, setUserAttrs] = useState<Partial<
    Record<UserAttributeKey, string>
  > | null>(null);

  useEffect(() => {
    fetchUserAttributes()
      .then(setUserAttrs)
      .catch(() => setUserAttrs(null));
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Welcome {userAttrs?.email ?? user?.username}</h1>
          <button onClick={signOut}>Sign out</button>

          <h2>Upload Your Files</h2>
          <UppyUploader />

          <h2>Your Files</h2>
          <StorageBrowser />
        </main>
      )}
    </Authenticator>
  );
}
