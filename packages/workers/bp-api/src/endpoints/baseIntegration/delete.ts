// src/endpoints/baseIntegration/delete.ts

import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";

export class BaseIntegrationDelete extends OpenAPIRoute {
  schema = {
    tags: ["BaseIntegrations"],
    summary: "Delete a Base Integration",
    request: { params: z.object({ baseIntegrationId: Str({ description: "Base Integration ID" }) }) },
    responses: {
      "200": {
        description: "Confirmation of deletion",
        content: { "application/json": { schema: z.object({ success: Bool(), message: Str() }) } },
      },
      "404": { description: "Base Integration not found", content: { "application/json": { schema: z.object({ success: Bool(), error: Str() }) } } },
    },
  };

  async handle(c) {
    const customerId = c.req.header("X-User-Buddy-Process");
    if (!customerId) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const data = await this.getValidatedData<typeof this.schema>();
    const db = c.env.DB_BUDDY_PROCESS;

    const { success } = await db.prepare(`DELETE FROM base_integration WHERE id = ?`).bind(data.params.baseIntegrationId).run();
    if (!success) return Response.json({ success: false, error: "Base Integration not found" }, { status: 404 });

    return Response.json({ success: true, message: "Base Integration deleted successfully" });
  }
}
