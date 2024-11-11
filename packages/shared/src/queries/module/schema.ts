import { z } from 'zod';
import { SetupDataSchema } from '../baseIntegration/schema';

// Updated Module Schema to hold user configurations
export const ModuleSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string().optional(),
  action_type: z.string(),
  customer_integration_id: z.number(), // Foreign key to customer_integration
  base_module_id: z.number(), // Foreign key to base_module
  setup_data: SetupDataSchema, // User-configured setup data based on BaseIntegration's setup_data
  created_at: z.string(), // ISO date string
  updated_at: z.string(), // ISO date string
});

export type Module = z.infer<typeof ModuleSchema>;