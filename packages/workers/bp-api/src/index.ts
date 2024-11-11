// src/index.ts
import { fromHono } from "chanfana";
import { Hono } from "hono";
import { cors } from 'hono/cors'

import { ProcessCreate } from "./endpoints/process/create";
import { ProcessDelete } from "./endpoints/process/delete";
import { ProcessFetch } from "./endpoints/process/fetch";
import { ProcessList } from "./endpoints/process/list";
import { BaseModuleCreate } from "./endpoints/baseModule/create";
import { BaseModuleDelete } from "./endpoints/baseModule/delete";
import { BaseModuleFetch } from "./endpoints/baseModule/fetch";
import { BaseModuleList } from "./endpoints/baseModule/list";
import { CustomerIntegrationCreate } from "./endpoints/customerIntegration/create";
import { CustomerIntegrationDelete } from "./endpoints/customerIntegration/delete";
import { CustomerIntegrationFetch } from "./endpoints/customerIntegration/fetch";
import { CustomerIntegrationList } from "./endpoints/customerIntegration/list";
import { clerkAuth } from "middleware/clerkAuth";
import { BaseIntegrationCreate } from "./endpoints/baseIntegration/create";
import { BaseIntegrationDelete } from "./endpoints/baseIntegration/delete";
import { BaseIntegrationFetch } from "./endpoints/baseIntegration/fetch";
import { BaseIntegrationList } from "./endpoints/baseIntegration/list";
import { ModuleCreate } from "endpoints/module/create";
import { ModuleDelete } from "endpoints/module/delete";
import { ModuleFetch } from "endpoints/module/fetch";
import { ModuleList } from "endpoints/module/list";
import { ProcessRunCreate } from "endpoints/processRun/create";
import { ProcessRunDelete } from "endpoints/processRun/delete";
import { ProcessRunFetch } from "endpoints/processRun/fetch";
import { ProcessRunList } from "endpoints/processRun/list";
import { ProcessUpdate } from "endpoints/process/update";
import { CustomerIntegrationUpdate } from "endpoints/customerIntegration/update";

const app = new Hono();
const openapi = fromHono(app, { docs_url: "/" });
app.use(
    "/api/*",
    cors({
      origin: ['http://localhost:1420'],
      allowMethods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", 'X-User-Buddy-Process'],
    })
  );
// Process endpoints
openapi.get("/api/processes", clerkAuth, ProcessList);
openapi.post("/api/processes", clerkAuth, ProcessCreate);
openapi.get("/api/processes/:processId", clerkAuth, ProcessFetch);
openapi.patch("/api/processes/:processId", clerkAuth, ProcessUpdate);
openapi.delete("/api/processes/:processId", clerkAuth, ProcessDelete);

// BaseModule endpoints
openapi.get("/api/base-modules", clerkAuth, BaseModuleList);
openapi.post("/api/base-modules", clerkAuth, BaseModuleCreate);
openapi.get("/api/base-modules/:moduleId", clerkAuth, BaseModuleFetch);
openapi.delete("/api/base-modules/:moduleId", clerkAuth, BaseModuleDelete);

// CustomerIntegration endpoints
openapi.get("/api/customer-integrations", clerkAuth, CustomerIntegrationList);
openapi.post("/api/customer-integrations", clerkAuth, CustomerIntegrationCreate);
openapi.get("/api/customer-integrations/:integrationId", clerkAuth, CustomerIntegrationFetch);
openapi.delete("/api/customer-integrations/:integrationId", clerkAuth, CustomerIntegrationDelete);
openapi.patch("/api/customer-integrations/:integrationId", clerkAuth, CustomerIntegrationUpdate);


openapi.get("/api/base-integrations", clerkAuth, BaseIntegrationList);
openapi.post("/api/base-integrations", clerkAuth, BaseIntegrationCreate);
openapi.get("/api/base-integrations/:baseIntegrationId", clerkAuth, BaseIntegrationFetch);
openapi.delete("/api/base-integrations/:baseIntegrationId", clerkAuth, BaseIntegrationDelete);

openapi.get("/api/modules", clerkAuth, ModuleList);
openapi.post("/api/modules", clerkAuth, ModuleCreate);
openapi.get("/api/modules/:moduleId", clerkAuth, ModuleFetch);
openapi.delete("/api/modules/:moduleId", clerkAuth, ModuleDelete);

openapi.get("/api/process-runs", clerkAuth, ProcessRunList);
openapi.post("/api/process-runs", clerkAuth, ProcessRunCreate);
openapi.get("/api/process-runs/:processRunId", clerkAuth, ProcessRunFetch);
openapi.delete("/api/process-runs/:processRunId", clerkAuth, ProcessRunDelete);

export default app;