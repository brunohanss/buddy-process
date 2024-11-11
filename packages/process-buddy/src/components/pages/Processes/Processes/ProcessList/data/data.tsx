import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CircleCheckBig,
  CircleX,
  CircleSlash,
  CircleSlash2,
} from "lucide-react";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const statuses = [
  {
    value: "success",
    label: "Success",
    icon: () => <CircleCheckBig  className="mr-2 h-4 w-4 text-muted-foreground" color="#84B026"/>,
  },
  {
    value: "error",
    label: "Error",
    icon: () => <CircleX  className="mr-2 h-4 w-4 text-muted-foreground" color="#f92902"/>,
  },
  {
    value: "in-progress",
    label: "In Progress",
    icon: () => <CircleSlash  className="mr-2 h-4 w-4 text-muted-foreground" color="#75B2BF"/>,
  },
  {
    value: "stopped",
    label: "Stopped",
    icon: () => <CircleSlash2  className="mr-2 h-4 w-4 text-muted-foreground" color="#F28705"/>,
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