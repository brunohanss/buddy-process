// src/endpoints/customerIntegrationList.ts

import { Bool, OpenAPIRoute } from "chanfana";
import { CustomerIntegrationSchema } from "../../../../../shared/src/queries/customerIntegration/schema";
import { z } from "zod";

export class CustomerIntegrationList extends OpenAPIRoute {
  schema = {
    tags: ["CustomerIntegrations"],
    summary: "List CustomerIntegrations",
    request: {}, // No pagination or query parameters
    responses: {
      "200": {
        description: "Returns a list of customer integrations",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({ customerIntegrations: CustomerIntegrationSchema.array() }),
            }),
          },
        },
      },
    },
  };

  async handle(c) {
    const customerId = c.req.header("X-User-Buddy-Process");
    if (!customerId) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const db = c.env.DB_BUDDY_PROCESS;

    // Fetch customer integrations associated with the customer ID
    const { results } = await db
      .prepare(`SELECT * FROM customer_integration WHERE customer_id = ? ORDER BY created_at DESC`)
      .bind(customerId)
      .all();

    return Response.json({
      success: true,
      result: { customerIntegrations: results || [] },
    });
  }
}
