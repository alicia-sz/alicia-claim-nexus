import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import config from "@/amplify_outputs.json";
import { cookies } from "next/headers";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth/server";

const { runWithAmplifyServerContext } = createServerRunner({
  config,
});

export const getFetchUserAttributes = async () => {
  try {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => fetchUserAttributes(contextSpec),
    });
    return currentUser;
  } catch (err) {
    console.log(err);
    return false;
  }
};
