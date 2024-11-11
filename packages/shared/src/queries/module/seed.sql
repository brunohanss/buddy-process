-- Drop the module table if it exists
DROP TABLE IF EXISTS module;

-- Create the module table
CREATE TABLE module (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    action_code VARCHAR(255) NOT NULL, -- Code for specific action within the module
    action_type VARCHAR(50), -- Type of action, e.g., 'trigger', 'action', etc.
    base_module_id INTEGER REFERENCES base_module(id) ON DELETE CASCADE, -- Foreign key to base_module
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for optimized access
CREATE INDEX idx_module_action_code ON module (action_code);
CREATE INDEX idx_module_created_at ON module (created_at);
