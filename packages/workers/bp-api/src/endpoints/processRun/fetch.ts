// src/endpoints/processRun/fetch.ts

import { Bool, OpenAPIRoute, Str } from "chanfana";
import { ProcessRunSchema } from "../../../../../shared/src/queries/processRun/schema";
import { z } from "zod";

export class ProcessRunFetch extends OpenAPIRoute {
  schema = {
    tags: ["ProcessRuns"],
    summary: "Fetch a Process Run by ID",
    request: {
      params: z.object({ processRunId: Str({ description: "Process Run ID" }) }),
    },
    responses: {
      "200": {
        description: "Returns the requested process run",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({ processRun: ProcessRunSchema }),
            }),
          },
        },
      },
      "404": {
        description: "Process Run not found",
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
    const { processRunId } = data.params;
    const db = c.env.DB_BUDDY_PROCESS;

    const result = await db
      .prepare(`SELECT * FROM process_run WHERE id = ? AND customer_id = ?`)
      .bind(processRunId, customerId)
      .first();

    if (!result) {
      return Response.json({ success: false, error: "Process Run not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      result: { processRun: result },
    });
  }
}
