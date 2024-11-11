import { z } from "zod";
export const SetupDataItemSchema = 
  z.object({
    name: z.string(),
    description: z.string(),
    type: z.string(),
    placeholder: z.string(),
    optional: z.boolean().optional()
  });
export const SetupDataSchema = z.array(
  SetupDataItemSchema
);

export type SetupData = z.infer<typeof SetupDataSchema>;
export type SetupDataItem = z.infer<typeof SetupDataItemSchema>;

export const BaseIntegrationSchema = z.object({
  id: z.number().optional(),
  integration_name: z.string(),
  integration_code: z.string(),
  setup_data: SetupDataSchema, // Represents the JSONB field for setup data
  logo_url: z.string(), // Optional field for the logo URL
  short_description: z.string().max(50),
  description: z.array(z.string()).nonempty(),
  tags: z.array(z.string()).nonempty(),
  created_at: z.string(), // ISO date string
  updated_at: z.string(), // ISO date string
});

export type BaseIntegration = z.infer<typeof BaseIntegrationSchema>;


