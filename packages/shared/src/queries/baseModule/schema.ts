import { z } from 'zod';
import { SetupDataSchema } from '../baseIntegration/schema';

export const ModuleActionInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  inputs: SetupDataSchema,
  
});

export type ModuleActionInput = z.infer<typeof BaseModuleSchema>;

export const ModuleActionSchema = z.object({
  name: z.string(),
  code: z.string(),
  inputs: z.array(ModuleActionInputSchema).nonempty(),
});

export type ModuleAction = z.infer<typeof BaseModuleSchema>;

export enum ModuleActionType {
  DATAWRITE = 'DataWrite',
  DATAREAD = 'DataRead',
  NOTIFICATIONS = 'Notifications',
  SOCIALS = 'Socials',
  HR = 'Human Resources'
}
const ModuleActionTypeValues = Object.values(ModuleActionType) as [string, ...string[]];

export const BaseModuleSchema = z.object({
  id: z.number(),
  name: z.string(),
  action_name: z.string(),
  action_code: z.string(),
  action_type: z.enum(ModuleActionTypeValues),
  base_integration_id: z.number(), // Foreign key to base_integration
  module_actions: z.array(ModuleActionSchema).nonempty(),
  created_at: z.string(), // ISO date string
  updated_at: z.string(), // ISO date string
});

export type BaseModule = z.infer<typeof BaseModuleSchema>;

