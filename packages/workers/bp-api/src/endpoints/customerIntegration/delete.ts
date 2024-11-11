// src/endpoints/customerIntegrationDelete.ts

import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";

export class CustomerIntegrationDelete extends OpenAPIRoute {
  schema = {
    tags: ["CustomerIntegrations"],
    summary: "Delete a CustomerIntegration",
    request: {
      params: z.object({ integrationId: Str({ description: "CustomerIntegration ID" }) }),
    },
    responses: {
      "200": {
        description: "Confirmation of deletion",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              message: Str(),
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

    const { success } = await db
      .prepare(`DELETE FROM customer_integration WHERE id = ? AND customer_id = ?`)
      .bind(integrationId, customerId)
      .run();

    if (!success) {
      return Response.json({ success: false, error: "CustomerIntegration not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "CustomerIntegration deleted successfully" });
  }
}
