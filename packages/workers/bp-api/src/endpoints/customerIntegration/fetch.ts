// src/endpoints/customerIntegrationFetch.ts

import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { CustomerIntegrationSchema } from "../../../../../shared/src/queries/customerIntegration/schema";

export class CustomerIntegrationFetch extends OpenAPIRoute {
  schema = {
    tags: ["CustomerIntegrations"],
    summary: "Fetch a CustomerIntegration by ID",
    request: {
      params: z.object({ integrationId: Str({ description: "CustomerIntegration ID" }) }),
    },
    responses: {
      "200": {
        description: "Returns the requested customer integration",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({ customerIntegration: CustomerIntegrationSchema }),
            }),
          },
        },
      },
      "404": {
        description: "CustomerIntegration not found",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              error: Str(),
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

    const data = await this.getValidatedData<typeof this.schema>();
    const { integrationId } = data.params;
    const db = c.env.DB_BUDDY_PROCESS;

    const result = await db
      .prepare(`SELECT * FROM customer_integration WHERE id = ? AND customer_id = ?`)
      .bind(integrationId, customerId)
      .first();

    if (!result) {
      return Response.json({ success: false, error: "CustomerIntegration not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      result: { customerIntegration: result },
    });
  }
}
