import { BaseModule } from "packages/shared/src/schemas/baseModule";

export const CellWriteModule: BaseModule = {
    id: 0,
    name: "Cell : Write",
    action_name: "Read",
    action_code: "CR",
    action_type: "Data",
    base_integration_id: 0,
    created_at: new Date().toString(),
    updated_at: new Date().toString(),
    module_actions: [
        {
            name: "Write row",
            code: "WRI",
            inputs: [
                {
                    name: "Arguments",
                    description: "Arguments used to perform the search",
                    inputs: [
                        {
                            name: "Values",
                            description: "Cell values",
                            type: "string[]",
                            placeholder: "['Jean', 'DEBUSSY']"
                        },
                        {
                            name: "Row",
                            description: "Row index",
                            type: "string",
                            placeholder: "1",
                            optional: true
                        },
                    ]
                }
            ]
        }
    ]
}