import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/pages/Documentation/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Documentation() {
  // State to hold integrations
  const [integrations, setIntegrations] = useState([
    { id: 0, name: "Bruno" },
    { id: 1, name: "Bruno" },
  ]);

  
  const documentation: {
    navMain: {
        title: string;
        url: string;
        imageUrl?: string;
        items: {
            id: number;
            name: string;
            title: string;
            url: string;
            isActive: boolean;
        }[];
    }[];
} = {
    navMain: [
      {
        title: "Get started",
        url: "documentation/get-started",
        imageUrl: undefined,
        items: [
          {
            id: 1,
            name: "get-started/first-integration",
            title: "First integration",
            url: "/documentation/get-started/first-integration",
            isActive: false,
          },
          {
            id: 1,
            name: "get-started/second-integration",
            title: "Second integration",
            url: "/documentation/get-started/second-integration",
            isActive: false,
          },
        ],
      },{
        title: "Google Sheets",
        url: "documentation/get-started",
        imageUrl: "/integrations/google-sheets.svg",
        items: [
          {
            id: 1,
            name: "get-started/first-integration",
            title: "First integration",
            url: "/documentation/get-started/first-integration",
            isActive: false,
          },
          {
            id: 1,
            name: "get-started/second-integration",
            title: "Second integration",
            url: "/documentation/get-started/second-integration",
            isActive: false,
          },
        ],
      },{
        title: "Payfit",
        url: "documentation/get-started",
        imageUrl: "/integrations/payfit.svg",
        items: [
          {
            id: 1,
            name: "get-started/first-integration",
            title: "First integration",
            url: "/documentation/get-started/first-integration",
            isActive: false,
          },
          {
            id: 1,
            name: "get-started/second-integration",
            title: "Second integration",
            url: "/documentation/get-started/second-integration",
            isActive: false,
          },
        ],
      },
    ],
  };

  return (
    <SidebarProvider>
      <AppSidebar documentation={documentation} />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Map through the integrations array to display */}
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="aspect-video h-12 w-full rounded-lg bg-muted/50"
            >
              {integration.name}
            </div>
          ))}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
