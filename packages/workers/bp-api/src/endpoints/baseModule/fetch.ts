// src/endpoints/baseModuleFetch.ts

import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { BaseModuleSchema } from "../../../../../shared/src/queries/baseModule/schema";

export class BaseModuleFetch extends OpenAPIRoute {
  schema = {
    tags: ["BaseModules"],
    summary: "Fetch a BaseModule by ID",
    request: {
      params: z.object({ moduleId: Str({ description: "BaseModule ID" }) }),
    },
    responses: {
      "200": {
        description: "Returns the requested base module",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({ baseModule: BaseModuleSchema }),
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

    // Fetch base module by ID and customer ID
    const result = await db
      .prepare(`SELECT * FROM base_module WHERE id = ? AND customer_id = ?`)
      .bind(moduleId, customerId)
      .first();

    if (!result) {
      return Response.json({ success: false, error: "BaseModule not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      result: { baseModule: result },
    });
  }
}
