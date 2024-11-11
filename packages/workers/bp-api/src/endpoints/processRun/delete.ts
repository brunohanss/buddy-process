// src/endpoints/processRun/delete.ts

import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";

export class ProcessRunDelete extends OpenAPIRoute {
  schema = {
    tags: ["ProcessRuns"],
    summary: "Delete a Process Run",
    request: {
      params: z.object({ processRunId: Str({ description: "Process Run ID" }) }),
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

    const { success } = await db
      .prepare(`DELETE FROM process_run WHERE id = ? AND customer_id = ?`)
      .bind(processRunId, customerId)
      .run();

    if (!success) {
      return Response.json({ success: false, error: "Process Run not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "Process Run deleted successfully" });
  }
}
