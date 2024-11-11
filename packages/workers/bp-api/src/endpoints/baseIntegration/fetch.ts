// src/endpoints/baseIntegration/fetch.ts

import { Bool, OpenAPIRoute, Str } from "chanfana";
import { BaseIntegrationSchema } from "@brux/shared/src/queries/baseIntegration/schema";
import { z } from "zod";

export class BaseIntegrationFetch extends OpenAPIRoute {
  schema = {
    tags: ["BaseIntegrations"],
    summary: "Fetch a Base Integration by ID",
    request: { params: z.object({ baseIntegrationId: Str({ description: "Base Integration ID" }) }) },
    responses: {
      "200": {
        description: "Returns the requested base integration",
        content: { "application/json": { schema: z.object({ success: Bool(), result: z.object({ baseIntegration: BaseIntegrationSchema }) }) } },
      },
      "404": { description: "Base Integration not found", content: { "application/json": { schema: z.object({ success: Bool(), error: Str() }) } } },
    },
  };

  async handle(c) {
    const customerId = c.req.header("X-User-Buddy-Process");
    if (!customerId) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const data = await this.getValidatedData<typeof this.schema>();
    const db = c.env.DB_BUDDY_PROCESS;

    const result = await db.prepare(`SELECT * FROM base_integration WHERE id = ?`).bind(data.params.baseIntegrationId).first();
    if (!result) return Response.json({ success: false, error: "Base Integration not found" }, { status: 404 });

    return Response.json({ success: true, result: { baseIntegration: result } });
  }
}
