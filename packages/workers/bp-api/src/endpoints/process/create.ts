// src/endpoints/processCreate.ts

import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { ProcessSchema } from "../../../../../shared/src/queries/process/schema";

export class ProcessCreate extends OpenAPIRoute {
  schema = {
    tags: ["Processes"],
    summary: "Create a new Process",
    request: {
      body: {
        content: { "application/json": { schema: ProcessSchema.omit({ id: true, created_at: true, updated_at: true }) } },
      },
    },
    responses: {
      "200": {
        description: "Returns the created process",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({ process: ProcessSchema }),
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
    const processToCreate = { ...data.body, customer_id: customerId }; // Include customer_id
    const db = c.env.DB_BUDDY_PROCESS;

    await db.prepare(
      `INSERT INTO process (customer_id, user_id, name, description, node_data, edge_data) 
      VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(
        customerId,
        processToCreate.user_id,
        processToCreate.name,
        processToCreate.description || null,
        JSON.stringify(processToCreate.node_data),
        JSON.stringify(processToCreate.edge_data)
      )
      .run();

    return Response.json({
      success: true,
      result: { process: processToCreate },
    });
  }
}