// src/endpoints/module/delete.ts

import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";

export class ModuleDelete extends OpenAPIRoute {
  schema = {
    tags: ["Modules"],
    summary: "Delete a Module",
    request: {
      params: z.object({ moduleId: Str({ description: "Module ID" }) }),
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
        description: "Module not found",
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
    const { moduleId } = data.params;
    const db = c.env.DB_BUDDY_PROCESS;

    const { success } = await db
      .prepare(`DELETE FROM module WHERE id = ? AND customer_integration_id = ?`)
      .bind(moduleId, customerId)
      .run();

    if (!success) {
      return Response.json({ success: false, error: "Module not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "Module deleted successfully" });
  }
}
