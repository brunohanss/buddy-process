import { z } from 'zod';

export const ProcessRunSchema = z.object({
  id: z.number(),
  process_id: z.number(), // Foreign key referencing `process` table
  customer_id: z.string(), // `VARCHAR` storing customer identifier
  status: z.string(), // Status of the process run (e.g., 'started', 'completed', 'failed')
  result: z.object({}).passthrough().optional(), // JSON object to store result; optional
  started_at: z.string(), // ISO date string for when the run was started
  completed_at: z.string().nullable(), // Nullable ISO date string for completion time
});

export type ProcessRun = z.infer<typeof ProcessRunSchema>;
