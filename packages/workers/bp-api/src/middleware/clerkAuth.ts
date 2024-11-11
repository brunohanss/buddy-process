// src/middleware/clerkAuth.ts
import { createClerkClient } from "@clerk/backend";
import { MiddlewareHandler } from "hono";

export const clerkAuth: MiddlewareHandler = async (c, next) => {
  const req = c.req.raw;
  const authHeader = req.headers?.["Authorization"];
  const clerkClient = createClerkClient({
    secretKey: c.env.CLERK_SECRET_KEY,
    publishableKey: c.env.CLERK_PUBLISHABLE_KEY,
  });
  // Authenticate the request using Clerk
  const authResult = await clerkClient.authenticateRequest(req, {
    jwtKey: authHeader,
    authorizedParties: ["http://localhost:1420"], // Replace with your domain
  });

  // If the user is not authenticated, return a 401 Unauthorized response
  if (!authResult?.isSignedIn) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Proceed to the next middleware or route handler
  await next();
};
