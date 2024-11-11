// src/endpoints/baseIntegration/list.ts

import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { BaseIntegrationSchema } from "../../../../../shared/src/queries/baseIntegration/schema";

export class BaseIntegrationList extends OpenAPIRoute {
  schema = {
    tags: ["BaseIntegrations"],
    summary: "List Base Integrations",
    request: {},
    responses: {
      "200": {
        description: "Returns a list of base integrations",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({ baseIntegrations: BaseIntegrationSchema.array() }),
            }),
          },
        },
      },
    },
  };

  async handle(c) {
    const customerId = c.req.header("X-User-Buddy-Process");
    console.log("customerId", customerId)
    if (!customerId) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const db = c.env.DB_BUDDY_PROCESS;
    const { results } = await db.prepare(`SELECT * FROM base_integration ORDER BY created_at DESC`).all();

    return Response.json({ success: true, result: { baseIntegrations: results || [] } });
  }
}
