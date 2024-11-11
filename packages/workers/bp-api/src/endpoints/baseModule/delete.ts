// src/endpoints/baseModuleDelete.ts

import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";

export class BaseModuleDelete extends OpenAPIRoute {
  schema = {
    tags: ["BaseModules"],
    summary: "Delete a BaseModule",
    request: {
      params: z.object({ moduleId: Str({ description: "BaseModule ID" }) }),
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
        description: "BaseModule not found",
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

    // Delete base module by ID and customer ID
    const { success } = await db
      .prepare(`DELETE FROM base_module WHERE id = ? AND customer_id = ?`)
      .bind(moduleId, customerId)
      .run();

    if (!success) {
      return Response.json({ success: false, error: "BaseModule not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "BaseModule deleted successfully" });
  }
}
