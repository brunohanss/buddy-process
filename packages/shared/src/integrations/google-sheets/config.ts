import { z } from 'zod';

export const GoogleSheetsCredentialsSchema = z.object({
    email: z.string(),
    privateKey: z.string(),
    scopes: z.array(z.string()).nonempty(),
});

export type GoogleSheetsSetupData = z.infer<typeof GoogleSheetsCredentialsSchema>;