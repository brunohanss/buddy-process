import { ModuleActionType } from "@brux/shared/src/queries/baseModule/schema";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Database,
  Users,
  Bell,
  MessageCircle,
} from "lucide-react";

export const labels = [
  {
    value: "Webhook",
    label: "Webhook",
  },
  {
    value: "Request",
    label: "Request",
  },
  {
    value: "Scheduler",
    label: "Scheduler",
  },
];

export const ModuleActionTypeList = [
  {
    value: ModuleActionType.DATA,
    label: ModuleActionType.DATA,
    icon: () => <Database  className="mr-2 h-4 w-4 text-muted-foreground" color="#84B026"/>,
  },
  {
    value: ModuleActionType.HR,
    label: ModuleActionType.HR,
    icon: () => <Users  className="mr-2 h-4 w-4 text-muted-foreground" color="#f92902"/>,
  },
  {
    value: ModuleActionType.NOTIFICATIONS,
    label: ModuleActionType.NOTIFICATIONS,
    icon: () => <Bell  className="mr-2 h-4 w-4 text-muted-foreground" color="#75B2BF"/>,
  },
  {
    value: ModuleActionType.SOCIALS,
    label: ModuleActionType.SOCIALS,
    icon: () => <MessageCircle  className="mr-2 h-4 w-4 text-muted-foreground" color="#F28705"/>,
  }
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUp,
  },
];