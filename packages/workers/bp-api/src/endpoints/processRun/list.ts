// src/endpoints/processRun/list.ts

import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { ProcessRunSchema } from "../../../../../shared/src/queries/processRun/schema";

export class ProcessRunList extends OpenAPIRoute {
  schema = {
    tags: ["ProcessRuns"],
    summary: "List Process Runs",
    request: {},
    responses: {
      "200": {
        description: "Returns a list of process runs",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({ processRuns: ProcessRunSchema.array() }),
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
    const { results } = await db
      .prepare(`SELECT * FROM process_run WHERE customer_id = ? ORDER BY started_at DESC`)
      .bind(customerId)
      .all();

    return Response.json({
      success: true,
      result: { processRuns: results || [] },
    });
  }
}
