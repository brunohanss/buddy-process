-- Drop the base_integration table if it already exists
DROP TABLE IF EXISTS base_integration;

-- Create the base_integration table with optional AUTOINCREMENT
CREATE TABLE base_integration (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- AUTOINCREMENT if no id provided
    integration_name VARCHAR(255) NOT NULL,
    integration_code VARCHAR(50) NOT NULL, -- Unique code for each integration
    setup_data JSON NOT NULL, -- JSON field to store setup data
    logo_url VARCHAR(255), -- Optional logo URL for the integration
    short_description VARCHAR(50) NOT NULL, -- Short description (max 50 characters)
    description JSON NOT NULL, -- JSON field to store description array
    tags JSON NOT NULL, -- JSON field to store tags array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes to optimize queries
CREATE INDEX idx_integration_name ON base_integration (integration_name);
CREATE INDEX idx_integration_code ON base_integration (integration_code);
CREATE INDEX idx_created_at ON base_integration (created_at);
CREATE INDEX idx_updated_at ON base_integration (updated_at);


-- Seed data for PayfitCatalogElement
INSERT INTO base_integration (
    id,
    integration_name, 
    integration_code,
    setup_data, 
    logo_url, 
    short_description, 
    description, 
    tags, 
    created_at, 
    updated_at
) VALUES (
    1,
    'Payfit',
    'payf',
    '[
        {
            "name": "Email",
            "description": "Email of your google account",
            "type": "string", 
            "placeholder": "email@example.com"
        },
        {
            "name": "Private key",
            "description": "Private key generated in the Google Cloud Console",
            "type": "string", 
            "placeholder": "#################"
        }
    ]',
    '/integrations/payfit.svg',
    'Interact with company, collaborator, contract, billing and absences.',
    '[
        "This integration with Payfit enables automated management of key HR functions directly within your processes.",
        "It supports interacting with employee records, collaborators, contract details, billing information, and tracking of absences.",
        "You can use this integration to automate actions such as creating or updating employee profiles, managing contracts and payroll, and handling leave requests."
    ]',
    '["HR", "Employee"]',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Seed data for GoogleSheetCatalogElement
INSERT INTO base_integration (
    id,
    integration_name,
    integration_code,
    setup_data,
    logo_url,
    short_description,
    description,
    tags,
    created_at,
    updated_at
) VALUES (
    2,
    'Google Sheets',
    'gshee',
    '[
        {
            "name": "Email",
            "description": "Email of your google account",
            "type": "string",
            "placeholder": "email@example.com"
        },
        {
            "name": "Private key",
            "description": "Private key generated in the Google Cloud Console",
            "type": "string",
            "placeholder": "#################"
        }
    ]',
    '/integrations/google-sheets.svg',
    'Interact with sheets, rows, and cells.',
    '[
        "Easily automate and integrate Google Sheets within your processes. Use this to create, read, update, and delete rows or manage entire sheets as part of your workflows.",
        "This integration allows you to build complex logic by connecting modules that can retrieve, filter, and manipulate data in Google Sheets, enabling powerful automations in your processes."
    ]',
    '["Data", "Table", "Google"]',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
