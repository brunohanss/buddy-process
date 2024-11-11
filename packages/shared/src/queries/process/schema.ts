import { z } from 'zod';

export const ProcessSchema = z.object({
  id: z.number(),
  customer_id: z.string(), // Use `z.string()` because `VARCHAR` stores text data
  user_id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  node_data: z.array(z.object({})).optional(), // JSON array to store nodes
  edge_data: z.array(z.object({})).optional(), // JSON array to store edges
  created_at: z.string(), // ISO date string
  updated_at: z.string(),
});

export type Process = z.infer<typeof ProcessSchema>;
