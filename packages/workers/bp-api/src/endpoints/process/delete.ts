// src/endpoints/processDelete.ts

import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";

export class ProcessDelete extends OpenAPIRoute {
  schema = {
    tags: ["Processes"],
    summary: "Delete a Process",
    request: {
      params: z.object({ processId: Str({ description: "Process ID" }) }),
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

    const { success } = await db
      .prepare(`DELETE FROM process WHERE id = ? AND customer_id = ?`)
      .bind(processId, customerId)
      .run();

    if (!success) {
      return Response.json({ success: false, error: "Process not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "Process deleted successfully" });
  }
}
