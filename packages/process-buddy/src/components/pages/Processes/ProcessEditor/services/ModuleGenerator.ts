import { ModuleActionType } from "@brux/shared/src/queries/baseModule/schema";
import { Bell, Database, HardDriveDownload, HardDriveUpload, MessageSquare, User } from "lucide-react";
import React from "react";
export class ModuleGenerator {
    static generate(baseModule: any) {
        console.log("baseModule", baseModule);
    }

    static mapActionTypeToModuleIcon(moduleType: ModuleActionType) {
        switch (moduleType) {
            case ModuleActionType.DATAREAD:
                return React.createElement(HardDriveDownload, { size: 20 });
                case ModuleActionType.DATAWRITE:
                    return React.createElement(HardDriveUpload, { size: 20 });
            case ModuleActionType.HR:
                return React.createElement(User, { size: 20 });
            case ModuleActionType.NOTIFICATIONS:
                return React.createElement(Bell, { size: 20 });
            case ModuleActionType.SOCIALS:
                return React.createElement(MessageSquare, { size: 20 });
            default:
                return React.createElement(Database, { size: 20 });
        }
    }

    
}