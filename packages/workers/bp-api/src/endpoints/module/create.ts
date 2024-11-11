// src/endpoints/module/create.ts

import { Bool, OpenAPIRoute } from "chanfana";
import { ModuleSchema } from "../../../../../shared/src/queries/module/schema";
import { z } from "zod";

export class ModuleCreate extends OpenAPIRoute {
  schema = {
    tags: ["Modules"],
    summary: "Create a new Module",
    request: {
      body: {
        content: { "application/json": { schema: ModuleSchema.omit({ id: true, created_at: true, updated_at: true }) } },
      },
    },
    responses: {
      "200": {
        description: "Returns the created module",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({ module: ModuleSchema }),
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
    const moduleToCreate = data.body;
    const db = c.env.DB_BUDDY_PROCESS;

    await db.prepare(
      `INSERT INTO module (name, description, action_type, customer_integration_id, base_module_id, setup_data)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(
        moduleToCreate.name,
        moduleToCreate.description,
        moduleToCreate.action_type,
        moduleToCreate.customer_integration_id,
        moduleToCreate.base_module_id,
        JSON.stringify(moduleToCreate.setup_data)
      )
      .run();

    return Response.json({
      success: true,
      result: { module: moduleToCreate },
    });
  }
}
