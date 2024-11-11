import { BaseIntegration } from "@brux/shared/src/schemas/schema";
import { GoogleSheetsCredentialsSchema } from "./config";

export const GoogleSheetCatalogElement: BaseIntegration = {
  id: 0,
  integration_code: "GS",
  integration_name: "Google Sheets",
  created_at: new Date().toString(),
  updated_at: new Date().toString(),
  logo_url: "/integrations/google-sheets.svg",
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
  short_description: "Interact with sheets, rows and cells.",
  description: ["Easily automate and integrate Google Sheets within your processes. Use this to create, read, update, and delete rows or manage entire sheets as part of your workflows.","This integration allows you to build complex logic by connecting modules that can retrieve, filter, and manipulate data in Google Sheets, enabling powerful automations in your processes."],
  tags: ["Data", "Table", "Google"]
};
