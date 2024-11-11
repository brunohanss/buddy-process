import { BaseIntegration } from "@brux/shared/src/schemas/schema";
import { BaseModule } from "../../schemas/baseModule";

export type ModuleData = {
    title: string;
    icon?: any;
    moduleIconUrl: string;
    subline?: string;
    status: string;
    baseModule?: BaseModule;
    baseIntegration?: BaseIntegration;
  };