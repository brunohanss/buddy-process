// src/endpoints/baseIntegration/create.ts

import { Bool, OpenAPIRoute } from "chanfana";
import { BaseIntegrationSchema } from "@brux/shared/src/queries/baseIntegration/schema";
import { z } from "zod";

export class BaseIntegrationCreate extends OpenAPIRoute {
  schema = {
    tags: ["BaseIntegrations"],
    summary: "Create a new Base Integration",
    request: {
      body: { content: { "application/json": { schema: BaseIntegrationSchema.omit({ id: true, created_at: true, updated_at: true }) } } },
    },
    responses: {
      "200": {
        description: "Returns the created base integration",
        content: {
          "application/json": { schema: z.object({ success: Bool(), result: z.object({ baseIntegration: BaseIntegrationSchema }) }) },
        },
      },
    },
  };

  async handle(c) {
    const customerId = c.req.header("X-User-Buddy-Process");
    if (!customerId) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const data = await this.getValidatedData<typeof this.schema>();
    const db = c.env.DB_BUDDY_PROCESS;

    await db.prepare(`INSERT INTO base_integration (integration_name, setup_data, logo_url, short_description, description, tags)
       VALUES (?, ?, ?, ?, ?, ?)`)
      .bind(
        data.body.integration_name,
        JSON.stringify(data.body.setup_data),
        data.body.logo_url,
        data.body.short_description,
        JSON.stringify(data.body.description),
        JSON.stringify(data.body.tags)
      ).run();

    return Response.json({ success: true, result: { baseIntegration: data.body } });
  }
}
