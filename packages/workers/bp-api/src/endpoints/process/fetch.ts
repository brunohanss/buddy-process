// src/endpoints/processFetch.ts

import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { ProcessSchema } from "../../../../../shared/src/queries/process/schema";

export class ProcessFetch extends OpenAPIRoute {
  schema = {
    tags: ["Processes"],
    summary: "Fetch a Process by ID",
    request: {
      params: z.object({ processId: Str({ description: "Process ID" }) }),
    },
    responses: {
      "200": {
        description: "Returns the requested process",
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
    const { processId } = data.params;
    const db = c.env.DB_BUDDY_PROCESS;

    const result = await db
      .prepare(`SELECT * FROM process WHERE id = ? AND customer_id = ?`)
      .bind(processId, customerId)
      .first();

    if (!result) {
      return Response.json({ success: false, error: "Process not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      result: { process: result },
    });
  }
}
