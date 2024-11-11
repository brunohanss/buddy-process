// src/endpoints/baseModuleCreate.ts

import { Bool, OpenAPIRoute } from "chanfana";
import { BaseModuleSchema } from "../../../../../shared/src/queries/baseModule/schema";
import { z } from "zod";

export class BaseModuleCreate extends OpenAPIRoute {
  schema = {
    tags: ["BaseModules"],
    summary: "Create a new BaseModule",
    request: {
      body: {
        content: { "application/json": { schema: BaseModuleSchema.omit({ id: true, created_at: true, updated_at: true }) } },
      },
    },
    responses: {
      "200": {
        description: "Returns the created base module",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({ baseModule: BaseModuleSchema }),
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
    const moduleToCreate = { ...data.body, customer_id: customerId }; // Include customer_id
    const db = c.env.DB_BUDDY_PROCESS;

    await db.prepare(
      `INSERT INTO base_module (name, action_name, action_code, action_type, base_integration_id, module_actions, customer_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        moduleToCreate.name,
        moduleToCreate.action_name,
        moduleToCreate.action_code,
        moduleToCreate.action_type,
        moduleToCreate.base_integration_id,
        JSON.stringify(moduleToCreate.module_actions),
        customerId
      )
      .run();

    return Response.json({
      success: true,
      result: { baseModule: moduleToCreate },
    });
  }
}
