import { z } from 'zod';

export const CustomerIntegrationSchema = z.object({
  id: z.number(), // Primary key
  customer_id: z.string(), // Adjusted to match VARCHAR type
  base_integration_id: z.number(), // Foreign key to base_integration
  credentials: z.record(z.any()), // JSON for customer-specific credentials
  created_at: z.string(), // ISO date string
  updated_at: z.string(), // ISO date string
});

export type CustomerIntegration = z.infer<typeof CustomerIntegrationSchema>;
