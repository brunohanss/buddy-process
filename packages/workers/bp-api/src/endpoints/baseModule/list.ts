// src/endpoints/baseModuleList.ts

import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { BaseModuleSchema } from "../../../../../shared/src/queries/baseModule/schema";

export class BaseModuleList extends OpenAPIRoute {
  schema = {
    tags: ["BaseModules"],
    summary: "List BaseModules",
    request: {}, // No pagination or query parameters
    responses: {
      "200": {
        description: "Returns a list of base modules",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({ baseModules: BaseModuleSchema.array() }),
            }),
          },
        },
      },
    },
  };

  async handle(c) {
    const customerId = c.req.header("X-User-Buddy-Process"); // Get user ID from header
    if (!customerId) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const db = c.env.DB_BUDDY_PROCESS;

    // Fetch base modules associated with the customer ID
    const { results } = await db
      .prepare(`SELECT * FROM base_module WHERE customer_id = ? ORDER BY created_at DESC`)
      .bind(customerId)
      .all();

    return Response.json({
      success: true,
      result: { baseModules: results || [] },
    });
  }
}
