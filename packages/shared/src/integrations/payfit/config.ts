import { z } from 'zod';

export const PayfitCredentialsSchema = z.object({
    privateKey: z.string(),
});
// 'https://www.googleapis.com/auth/spreadsheets'

export type PayfitCredentials = z.infer<typeof PayfitCredentialsSchema>;