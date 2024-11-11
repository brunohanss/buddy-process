import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { ModuleSchema } from "../../../../../shared/src/queries/module/schema";

export class ModuleList extends OpenAPIRoute {
  schema = {
    tags: ["Modules"],
    summary: "List Modules",
    request: {},
    responses: {
      "200": {
        description: "Returns a list of modules",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({ modules: ModuleSchema.array() }),
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
      .prepare(`SELECT * FROM module WHERE customer_integration_id = ? ORDER BY created_at DESC`)
      .bind(customerId)
      .all();

    return Response.json({
      success: true,
      result: { modules: results || [] },
    });
  }
}