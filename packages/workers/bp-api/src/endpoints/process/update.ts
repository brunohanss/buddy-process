// src/endpoints/processUpdate.ts

import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { ProcessSchema } from "../../../../../shared/src/queries/process/schema";

export class ProcessUpdate extends OpenAPIRoute {
  schema = {
    tags: ["Processes"],
    summary: "Update an existing Process",
    request: {
      params: z.object({ id: z.number() }),
      body: {
        content: { "application/json": { schema: ProcessSchema.omit({ id: true, customer_id: true, created_at: true, updated_at: true }) } },
      },
    },
    responses: {
      "200": {
        description: "Returns the updated process",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({ process: ProcessSchema }),
            }),
          },
        },
      },
      "404": {
        description: "Process not found",
      },
    },
  };

  async handle(c) {
    const customerId = c.req.header("X-User-Buddy-Process");
    if (!customerId) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = c.req.params;
    const data = await this.getValidatedData<typeof this.schema>();
    const processToUpdate = { ...data.body, updated_at: new Date().toISOString() };
    const db = c.env.DB_BUDDY_PROCESS;

    // Check if the process exists and belongs to the customer
    const existingProcess = await db.prepare(
      `SELECT * FROM process WHERE id = ? AND customer_id = ?`
    ).bind(id, customerId).first();

    if (!existingProcess) {
      return Response.json({ success: false, error: "Process not found" }, { status: 404 });
    }

    // Update the process
    await db.prepare(
      `UPDATE process 
       SET user_id = ?, name = ?, description = ?, node_data = ?, edge_data = ?, updated_at = ? 
       WHERE id = ? AND customer_id = ?`
    )
      .bind(
        processToUpdate.user_id,
        processToUpdate.name,
        processToUpdate.description || null,
        JSON.stringify(processToUpdate.node_data),
        JSON.stringify(processToUpdate.edge_data),
        processToUpdate.updated_at,
        id,
        customerId
      )
      .run();

    return Response.json({
      success: true,
      result: { process: { ...existingProcess, ...processToUpdate } },
    });
  }
}
