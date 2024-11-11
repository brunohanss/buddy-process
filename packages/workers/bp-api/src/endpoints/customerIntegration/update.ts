// src/endpoints/customerIntegrationUpdate.ts

import { Bool, OpenAPIRoute } from "chanfana";
import { CustomerIntegrationSchema } from "../../../../../shared/src/queries/customerIntegration/schema";
import { z } from "zod";

export class CustomerIntegrationUpdate extends OpenAPIRoute {
  schema = {
    tags: ["CustomerIntegrations"],
    summary: "Update an existing CustomerIntegration",
    request: {
      params: z.object({
        integrationId: z.number().int(),
      }),
      body: {
        content: {
          "application/json": {
            schema: CustomerIntegrationSchema.omit({ id: true, created_at: true, updated_at: true }).partial(),
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Returns the updated customer integration",
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
        description: "Customer integration not found",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              error: z.string(),
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

    console.log(c.req)
    const [,integrationId] = c.req.path.split('/customer-integrations/');
    const data = await this.getValidatedData<typeof this.schema>();
    console.log("data", data)
    const db = c.env.DB_BUDDY_PROCESS;

    // Update the integration in the database
    const updateResult = await db
      .prepare(
        `UPDATE customer_integration
         SET base_integration_id = COALESCE(?, base_integration_id),
             credentials = COALESCE(?, credentials),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND customer_id = ?`
      )
      .bind(
        data.body.base_integration_id,
        JSON.stringify(data.body.credentials),
        integrationId,
        customerId
      )
      .run();

    if (updateResult.changes === 0) {
      return Response.json({ success: false, error: "Customer integration not found" }, { status: 404 });
    }

    // Respond with the updated integration
    const updatedIntegration = {
      id: integrationId,
      customer_id: customerId,
      base_integration_id: data.body.base_integration_id,
      credentials: data.body.credentials,
      updated_at: new Date().toISOString(),
    };

    return Response.json({
      success: true,
      result: { customerIntegration: updatedIntegration },
    });
  }
}
