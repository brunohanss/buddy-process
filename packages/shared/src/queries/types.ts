// packages/shared/src/types.ts

import { z } from 'zod';
import { GoogleSheetsCredentialsSchema } from '../integrations/google-sheets/config';
import { PayfitCredentialsSchema } from '../integrations/payfit/config';
import { SetupData } from './baseIntegration/schema';


export const JSONValue = z.union([
    GoogleSheetsCredentialsSchema,
    PayfitCredentialsSchema
  ]);

export enum IntegrationStatus {
    ACTIVE = "Active",
    INACTIVE = "Inactive",
  }

export type Integration = {
    id?: number;
    name: string;
    description: string[];
    tags: string[];
    shortDescription: string;
    status: "Active" | "Inactive" | "Draft";
    url: string;
    imageUrl: string;
    setupData: SetupData;
    customerIntegrationId?: number;
    credentials: Record<string, any> | undefined
  };

  
export enum ProcessStatus {
  SUCCESS = "success",
  ERROR = "error",
  IN_PROGRESS = "in-progress",
  STOPPED = "stopped",
}
