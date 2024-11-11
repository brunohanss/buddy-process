import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { ChevronLeft, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Integration as BaseIntegration,
  IntegrationStatus as Status,
} from "@brux/shared/src/queries/types";
import { useCustomerIntegrationData } from "@/hooks/use-customer-integration";
import { useBaseIntegrationData } from "@/hooks/use-base-integration";
import { useState, useEffect } from "react";

export default function Integration({ userId }: { userId?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [baseIntegration, setBaseIntegration] = useState(
    null as BaseIntegration | null
  );
  const [setupConfig, setSetupConfig] = useState(
    {} as { [key: string]: string }
  );

  const {
    fetchCustomerIntegrations,
    createCustomerIntegration,
    deleteCustomerIntegration,
    updateCustomerIntegration,
  } = useCustomerIntegrationData();
  const { fetchBaseIntegrations } = useBaseIntegrationData();

  // Extract integration name from the URL path
  const integrationName = location.pathname.split("/").pop();
  // Determine if we need to enable or disable based on URL parameter
  // const isEnabled = searchParams.get("enable") !== null;
  // const isDisabled = searchParams.get("disable") !== null;
  const saveIntegration = async () => {
    if (!baseIntegration) {
      throw new Error();
    }
    if (!baseIntegration?.customerIntegrationId) {
      await createCustomerIntegration(userId, {
        customer_id: userId!,
        base_integration_id: (baseIntegration as any).id,
        credentials: setupConfig,
      });
    } else {
      await updateCustomerIntegration(
        userId,
        baseIntegration?.customerIntegrationId,
        {
          customer_id: userId!,
          base_integration_id: (baseIntegration as any).id,
          credentials: setupConfig,
        }
      );
    }
    await getCustomerIntegration();
  };
  const deleteIntegration = async () => {
    if (baseIntegration?.customerIntegrationId) {
      await deleteCustomerIntegration(
        userId,
        baseIntegration.customerIntegrationId
      );
    }
  };
  const getCustomerIntegration = async () => {
    const baseIntegrations = await fetchBaseIntegrations(userId);
    const customerIntegrations = await fetchCustomerIntegrations(userId);
    if (!integrationName) {
      throw new Error("Integration name was not found");
    }
    const foundBaseInt = baseIntegrations.find((baseInt) =>
      baseInt.logo_url.includes(integrationName)
    );
    const foundCustInt = customerIntegrations.find(
      (custInt) => custInt.base_integration_id === foundBaseInt?.id
    );
    if (!foundBaseInt) {
      console.warn("Base integration was not found");
      return;
    }

    setBaseIntegration({
      id: foundBaseInt?.id,
      name: foundBaseInt.integration_name,
      status: foundCustInt ? Status.ACTIVE : Status.INACTIVE,
      imageUrl: foundBaseInt.logo_url,
      url: foundBaseInt.logo_url
        .replace("/integrations/", "")
        .replace(".svg", ""),
      shortDescription: foundBaseInt.short_description,
      description: JSON.parse(foundBaseInt.description as any),
      tags: JSON.parse(foundBaseInt.tags as any),
      setupData: JSON.parse(foundBaseInt.setup_data as any),
      customerIntegrationId: foundCustInt?.id,
      credentials: foundCustInt?.credentials,
    });
    setSetupConfig(JSON.parse(`${foundCustInt?.credentials}`));
  };
  useEffect(() => {
    getCustomerIntegration();
  }, [userId]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="mx-auto grid flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => navigate(`/integrations`)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>

          <LazyLoadImage
            src={baseIntegration?.imageUrl} // Replace with the actual path to the logo image
            alt="Integration Logo"
            effect="blur"
            height={50} // Adjust the height as needed
            width={50} // Adjust the width as needed
          />

          <div className="flex flex-col">
            <h1 className="text-xl font-semibold tracking-tight">
              {baseIntegration?.name}
            </h1>
            <Badge
              variant={
                baseIntegration?.status === Status.ACTIVE
                  ? "outline"
                  : "destructive"
              }
              className="mt-1 self-start"
            >
              {baseIntegration?.status}
            </Badge>
          </div>

          <div className="ml-auto flex gap-1">
            <Button onClick={saveIntegration} size="sm">
              Save Integration
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <div className="card-header-container">
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
              </div>
              <CardContent>
                <div className="grid gap-6">
                  {baseIntegration?.description?.length &&
                    baseIntegration?.description?.map((chunk, i) => (
                      <div key={i} className="grid gap-3">
                        {chunk}
                      </div>
                    ))}
                  <div className="grid gap-3"></div>
                  <div className="grid gap-3">
                    <div id="tags" className="flex flex-wrap gap-2">
                      {baseIntegration?.tags?.length &&
                        baseIntegration?.tags?.map((tag, i) => (
                          <Badge key={i} variant="outline">
                            {tag}
                          </Badge>
                        ))}

                      {/* Add more tags as needed */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <div className="card-header-container">
                <CardHeader>
                  <CardTitle>Credentials</CardTitle>
                  <div className="grid gap-3">
                    Your credentials for this integration.
                  </div>
                </CardHeader>
              </div>
              <CardContent>
                <div className="grid gap-6">
                  {baseIntegration?.setupData.map((setup, i) => {
                    switch (setup.type) {
                      case "string":
                        return (
                          <div className="grid gap-3" key={i}>
                            <Label htmlFor={setup.name}>{setup.name}</Label>
                            <Input
                              id={setup.name}
                              type="text"
                              className="w-full"
                              placeholder={setup.placeholder}
                              defaultValue={setupConfig[setup.name]}
                              onChange={(e) => {
                                console.log(e.target.value);
                                const newConfig: { [key: string]: string } = {
                                  ...setupConfig,
                                };
                                newConfig[setup.name] = e.target.value;
                                setSetupConfig(newConfig);
                              }}
                            />
                          </div>
                        );
                    }
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Disable Integration</CardTitle>
                <CardDescription>
                  Permanently disable this integration and remove the current
                  credentials.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div></div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={deleteIntegration}
                >
                  <Trash2 color="red"></Trash2>Disable Integration
                </Button>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Logo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <LazyLoadImage
                    alt="Integration logo"
                    className="aspect-square w-full rounded-md object-cover"
                    height="300"
                    src={baseIntegration?.imageUrl}
                    width="300"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
