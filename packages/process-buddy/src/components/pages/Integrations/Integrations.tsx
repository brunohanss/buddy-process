"use client";

import * as React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Integration, IntegrationStatus as Status } from "@brux/shared/src/queries/types";
import { useCustomerIntegrationData } from "@/hooks/use-customer-integration";
import { useBaseIntegrationData } from "@/hooks/use-base-integration";
import { useEffect, useState } from "react";


const statuses = ["Active", "Inactive", "All"];


export default function Integrations({ userId }: { userId?: string }) {
  if (!userId) {
    throw new Error()
  }
  const navigate = useNavigate();
  const [integrations, setIntegrations] = useState([] as Integration[]);
  const {
    fetchCustomerIntegrations,
  } = useCustomerIntegrationData();
  const {
    fetchBaseIntegrations,
  } = useBaseIntegrationData();
  const getIntegrations = async () => {
    const integrations: Integration[] = [];
    const baseIntegrations = await fetchBaseIntegrations(userId);
    const customerIntegrations = await fetchCustomerIntegrations(userId);

    baseIntegrations.forEach((baseInt) => {
      const foundCustomerInt = customerIntegrations.find((custInt) => custInt.base_integration_id === baseInt.id);
      console.log(baseInt, foundCustomerInt)
      integrations.push({
        name: baseInt.integration_name,
        status: foundCustomerInt ? Status.ACTIVE : Status.INACTIVE,
        imageUrl: baseInt.logo_url,
        url: baseInt.logo_url.replace("/integrations/", "").replace(".svg", ""),
        shortDescription: baseInt.short_description,
        description: baseInt.description,
        tags: baseInt.tags,
        setupData: baseInt.setup_data
      })
    })
    setIntegrations(integrations);
    console.log("integrations", integrations)
  }
  useEffect(() => {
    getIntegrations()
  }, [])

  const [selectedStatus, setSelectedStatus] = React.useState<
    "All" | "Active" | "Inactive"
  >(Status.ACTIVE);

  const getFilteredIntegrations = (status: string) => {
    if (status === "All") {
      return integrations;
    }
    return integrations.filter((integration) => integration.status === status);
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="active">
        <div className="flex items-center">
          <TabsList>
            {statuses.map((status) => (
              <TabsTrigger
                key={status}
                value={status.toLowerCase()}
                onClick={() =>
                  setSelectedStatus(status as "All" | "Active" | "Inactive")
                }
              >
                {status}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statuses.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={selectedStatus === status}
                    onCheckedChange={() =>
                      setSelectedStatus(status as "All" | "Active" | "Inactive")
                    }
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Integration
              </span>
            </Button>
          </div>
        </div>
        {statuses.map((status) => (
          <TabsContent key={status} value={status.toLowerCase()}>
            <Card>
              <CardHeader>
                <CardTitle>Integrations - {status}</CardTitle>
                <CardDescription>
                  {status === "All"
                    ? "Manage your integrations and view their status and performance."
                    : `View your ${status.toLowerCase()} integrations.`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden w-[100px] sm:table-cell">
                        <span className="sr-only">Integration Image</span>
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Description
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredIntegrations(status).map((integration, id) => (
                      <TableRow key={id}>
                        <TableCell className="hidden sm:table-cell">
                          <LazyLoadImage
                            alt="Integration image"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={integration.imageUrl}
                            width="64"
                            effect="blur"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {integration.name}
                        </TableCell>
                         <TableCell className="hidden md:table-cell">
                          {integration.shortDescription}
                        </TableCell>
                        <TableCell>
                          <Badge variant={integration?.status === Status.ACTIVE ? 'outline' : 'destructive'}>{integration.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              {integration?.status === Status.ACTIVE && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    navigate(
                                      `/integrations/${integration?.url}`
                                    );
                                  }}
                                >
                                  Edit
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuItem
                                onClick={() => {
                                  navigate(
                                    `/documentation/${integration?.url}`
                                  );
                                }}
                              >
                                Documentation
                              </DropdownMenuItem>
                              {/* {integration?.status === Status.ACTIVE && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    navigate(
                                      `/integrations/${integration?.url}?disable`
                                    );
                                  }}
                                >
                                  Disable
                                </DropdownMenuItem>
                              )} */}
                              {integration?.status === Status.INACTIVE && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    console.log(`/integrations/${integration?.url}?enable`)
                                    navigate(
                                      `/integrations/${integration?.url}?enable`
                                    );
                                  }}
                                >
                                  Enable
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Showing{" "}
                  <strong>1-{getFilteredIntegrations(status).length}</strong> of{" "}
                  <strong>{integrations.length}</strong> integrations
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}
