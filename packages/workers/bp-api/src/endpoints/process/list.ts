// src/endpoints/processList.ts

import { Bool, OpenAPIRoute } from "chanfana";
import { ProcessSchema } from "../../../../../shared/src/queries/process/schema";
import { z } from "zod";

export class ProcessList extends OpenAPIRoute {
  schema = {
    tags: ["Processes"],
    summary: "List Processes",
    request: {}, // No pagination or query parameters
    responses: {
      "200": {
        description: "Returns a list of processes",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({ processes: ProcessSchema.array() }),
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

    // Fetch processes associated with the customer ID
    const { results } = await db
      .prepare(`SELECT * FROM process WHERE customer_id = ? ORDER BY created_at DESC`)
      .bind(customerId)
      .all();

    return Response.json({
      success: true,
      result: { processes: results || [] },
    });
  }
}
