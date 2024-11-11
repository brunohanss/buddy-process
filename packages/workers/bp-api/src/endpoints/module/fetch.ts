// src/endpoints/module/fetch.ts

import { Bool, OpenAPIRoute, Str } from "chanfana";
import { ModuleSchema } from "../../../../../shared/src/queries/module/schema";
import { z } from "zod";

export class ModuleFetch extends OpenAPIRoute {
  schema = {
    tags: ["Modules"],
    summary: "Fetch a Module by ID",
    request: {
      params: z.object({ moduleId: Str({ description: "Module ID" }) }),
    },
    responses: {
      "200": {
        description: "Returns the requested module",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({ module: ModuleSchema }),
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

    const result = await db
      .prepare(`SELECT * FROM module WHERE id = ? AND customer_integration_id = ?`)
      .bind(moduleId, customerId)
      .first();

    if (!result) {
      return Response.json({ success: false, error: "Module not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      result: { module: result },
    });
  }
}
