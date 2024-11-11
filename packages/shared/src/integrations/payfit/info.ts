import { BaseIntegration } from "@brux/shared/src/schemas/schema";
import { PayfitCredentialsSchema } from "./config";

export const PayfitCatalogElement: BaseIntegration = {
  id: 1,
  integration_name: "Payfit",
  integration_code: 'payf',
  created_at: new Date().toString(),
  updated_at: new Date().toString(),
  logo_url: "/integrations/payfit.svg",
  setup_data: [
    {
      name: 'Email',
      description: 'Email of your google account',
      type: 'string', 
      placeholder: 'email@example.com'
    },
    {
      name: 'Private key',
      description: 'Private key generated in the Google Cloud Console',
      type: 'string', 
      placeholder: '#################'
    }
  ],
  short_description: "Interact with company, collaborator, contract, billing and abscences.",
  description: ["This integration with Payfit enables automated management of key HR functions directly within your processes.", "It supports interacting with employee records, collaborators, contract details, billing information, and tracking of absences. You can use this integration to automate actions such as creating or updating employee profiles, managing contracts and payroll, and handling leave requests."],
  tags: ["HR" , "Employee"]
};
