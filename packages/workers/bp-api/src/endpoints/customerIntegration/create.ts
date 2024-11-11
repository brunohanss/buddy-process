// src/endpoints/customerIntegrationCreate.ts

import { Bool, OpenAPIRoute } from "chanfana";
import { CustomerIntegrationSchema } from "../../../../../shared/src/queries/customerIntegration/schema";
import { z } from "zod";

export class CustomerIntegrationCreate extends OpenAPIRoute {
  schema = {
    tags: ["CustomerIntegrations"],
    summary: "Create a new CustomerIntegration",
    request: {
      body: {
        content: { "application/json": { schema: CustomerIntegrationSchema.omit({ id: true, created_at: true, updated_at: true }) } },
      },
    },
    responses: {
      "200": {
        description: "Returns the created customer integration",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({ customerIntegration: CustomerIntegrationSchema }),
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
    const integrationToCreate = { ...data.body, customer_id: customerId };
    console.log("New customer integration", integrationToCreate)
    const db = c.env.DB_BUDDY_PROCESS;

    // Adjust SQL to match updated schema
    const result = await db
      .prepare(
        `INSERT INTO customer_integration (customer_id, base_integration_id, credentials) 
         VALUES (?, ?, ?)`
      )
      .bind(
        customerId,
        integrationToCreate.base_integration_id,
        JSON.stringify(integrationToCreate.credentials)
      )
      .run();

    // Retrieve the last inserted id and prepare a response object
    const createdIntegration = {
      id: result.lastInsertRowid,
      customer_id: customerId,
      base_integration_id: integrationToCreate.base_integration_id,
      credentials: integrationToCreate.credentials,
      created_at: new Date().toISOString(), // Assumes the DB sets this
      updated_at: new Date().toISOString(), // Assumes the DB sets this
    };

    return Response.json({
      success: true,
      result: { customerIntegration: createdIntegration },
    });
  }
}
