// src/endpoints/processRun/create.ts

import { Bool, OpenAPIRoute } from "chanfana";
import { ProcessRunSchema } from "../../../../../shared/src/queries/processRun/schema";
import { z } from "zod";

export class ProcessRunCreate extends OpenAPIRoute {
  schema = {
    tags: ["ProcessRuns"],
    summary: "Create a new Process Run",
    request: {
      body: {
        content: { "application/json": { schema: ProcessRunSchema.omit({ id: true, completed_at: true, started_at: true }) } },
      },
    },
    responses: {
      "200": {
        description: "Returns the created process run",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({ processRun: ProcessRunSchema }),
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
    const db = c.env.DB_BUDDY_PROCESS;

    const startedAt = new Date().toISOString();
    await db.prepare(
      `INSERT INTO process_run (process_id, customer_id, status, result, started_at)
       VALUES (?, ?, ?, ?, ?)`
    )
      .bind(
        data.body.process_id,
        customerId,
        data.body.status,
        JSON.stringify(data.body.result),
        startedAt
      )
      .run();

    const processRun = { ...data.body, customer_id: customerId, started_at: startedAt };
    return Response.json({
      success: true,
      result: { processRun },
    });
  }
}
