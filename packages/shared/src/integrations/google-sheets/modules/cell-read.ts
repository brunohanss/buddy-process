import { BaseModule } from "packages/shared/src/schemas/baseModule";

export const CellReadModule: BaseModule = {
    id: 0,
    name: "Cell : Read or Search",
    action_name: "Read",
    action_code: "CR",
    action_type: "Data",
    base_integration_id: 0,
    created_at: new Date().toString(),
    updated_at: new Date().toString(),
    module_actions: [
        {
            name: "Search by value",
            code: "SEA",
            inputs: [
                {
                    name: "Arguments",
                    description: "Arguments used to perform the search",
                    inputs: [
                        {
                            name: "Cell",
                            description: "Cell value",
                            type: "string",
                            placeholder: "7450,45"
                        },
                        {
                            name: "Column",
                            description: "Column index",
                            type: "string",
                            placeholder: "1",
                            optional: true
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
        },
        {
            name: "Get last rows",
            code: "GET",
            inputs: [
                {
                    name: "Arguments",
                    description: "Arguments used to perform the retrieval",
                    inputs: [
                        {
                            name: "Quantity",
                            description: "Number of row to retrieve",
                            type: "string",
                            placeholder: "10"
                        }
                    ]
                }
            ]
        }
    ]
}