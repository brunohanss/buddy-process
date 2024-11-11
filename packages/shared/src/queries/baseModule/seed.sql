-- Drop the base_module table if it exists
DROP TABLE IF EXISTS base_module;

-- Create the base_module table
CREATE TABLE base_module (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    action_name VARCHAR(255) NOT NULL,
    action_code VARCHAR(255) NOT NULL,
    action_type VARCHAR(50) CHECK (action_type IN ('DataWrite', 'DataRead', 'Notifications', 'Socials', 'Human Resources')),
    base_integration_id INTEGER NOT NULL, -- Foreign key reference to base_integration table
    module_actions JSON NOT NULL, -- Stores JSON array of actions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (base_integration_id) REFERENCES base_integration(id) ON DELETE CASCADE
);

-- Indexes for optimized queries
CREATE INDEX idx_base_module_name ON base_module (name);
CREATE INDEX idx_base_module_action_type ON base_module (action_type);
CREATE INDEX idx_base_module_created_at ON base_module (created_at);

-- Seed data for CellReadModule
INSERT INTO base_module (
    id,
    name,
    action_name,
    action_code,
    action_type,
    base_integration_id,
    module_actions,
    created_at,
    updated_at
) VALUES (
    1, -- Manually set id for CellReadModule
    'Cell : Read or Search',
    'Read',
    'CR',
    'DataRead',
    2, -- Assuming Google Sheets base_integration has id = 2
    '[
        {
            "name": "Search by value",
            "code": "SEA",
            "inputs": [
                {
                    "name": "Arguments",
                    "description": "Arguments used to perform the search",
                    "inputs": [
                        {
                            "name": "Cell",
                            "description": "Cell value",
                            "type": "string",
                            "placeholder": "7450,45"
                        },
                        {
                            "name": "Column",
                            "description": "Column index",
                            "type": "string",
                            "placeholder": "1",
                            "optional": true
                        },
                        {
                            "name": "Row",
                            "description": "Row index",
                            "type": "string",
                            "placeholder": "1",
                            "optional": true
                        }
                    ]
                }
            ]
        },
        {
            "name": "Get last rows",
            "code": "GET",
            "inputs": [
                {
                    "name": "Arguments",
                    "description": "Arguments used to perform the retrieval",
                    "inputs": [
                        {
                            "name": "Quantity",
                            "description": "Number of row to retrieve",
                            "type": "string",
                            "placeholder": "10"
                        }
                    ]
                }
            ]
        }
    ]',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Seed data for CellWriteModule
INSERT INTO base_module (
    id,
    name,
    action_name,
    action_code,
    action_type,
    base_integration_id,
    module_actions,
    created_at,
    updated_at
) VALUES (
    2, -- Manually set id for CellWriteModule
    'Cell : Write',
    'Write',
    'CW',
    'DataWrite',
    2, -- Assuming Google Sheets base_integration has id = 2
    '[
        {
            "name": "Write row",
            "code": "WRI",
            "inputs": [
                {
                    "name": "Arguments",
                    "description": "Arguments used to perform the search",
                    "inputs": [
                        {
                            "name": "Values",
                            "description": "Cell values",
                            "type": "string[]",
                            "placeholder": "[\'Jean\', \'DEBUSSY\']"
                        },
                        {
                            "name": "Row",
                            "description": "Row index",
                            "type": "string",
                            "placeholder": "1",
                            "optional": true
                        }
                    ]
                }
            ]
        }
    ]',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);