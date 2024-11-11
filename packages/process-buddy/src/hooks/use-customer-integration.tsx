import { useCallback } from "react";
import CustomerIntegrationService from "@brux/shared/src/queries/customerIntegration/service";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "./use-toast";
import { CustomerIntegration } from "@brux/shared/src/queries/customerIntegration/schema";
import { useNavigate } from "react-router-dom";

type UseCustomerIntegrationDataMethods = {
  fetchCustomerIntegrations: (userId: string | undefined) => Promise<CustomerIntegration[]>;
  fetchCustomerIntegrationById: (userId: string | undefined, integrationId: number) => Promise<CustomerIntegration | null>;
  createCustomerIntegration: (userId: string | undefined, data: Omit<CustomerIntegration, "id" | "created_at" | "updated_at">) => Promise<CustomerIntegration | null>;
  updateCustomerIntegration: (userId: string | undefined, integrationId: number, data: Partial<Omit<CustomerIntegration, "id" | "created_at" | "updated_at">>) => Promise<CustomerIntegration | null>;
  deleteCustomerIntegration: (userId: string | undefined, integrationId: number) => Promise<boolean>;
};

export function useCustomerIntegrationData(): UseCustomerIntegrationDataMethods {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const fetchToken = useCallback(async (): Promise<string> => {
    const token = await getToken();
    if (!token) {
      toast({ variant: "destructive", title: "Unauthorized", description: "User is not authorized." });
      throw new Error("Unauthorized");
    }
    return token;
  }, [getToken]);

  const fetchCustomerIntegrations = useCallback(async (userId: string | undefined): Promise<CustomerIntegration[]> => {
    try {
      const token = await fetchToken();
      if (!userId) {
        toast({ variant: "destructive", title: "User Not Found", description: "Unable to fetch integrations without a valid user ID." });
        return [];
      }
      const response = await CustomerIntegrationService.list(token, userId);
      if (response.success) return response.result?.customerIntegrations || [];
      else throw new Error(response.error || "Failed to fetch customer integrations.");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      return [];
    }
  }, [fetchToken]);

  const fetchCustomerIntegrationById = useCallback(async (userId: string | undefined, integrationId: number): Promise<CustomerIntegration | null> => {
    try {
      const token = await fetchToken();
      if (!userId) {
        toast({ variant: "destructive", title: "User Not Found", description: "Unable to fetch integration without a valid user ID." });
        return null;
      }
      const response = await CustomerIntegrationService.fetch(token, userId, integrationId);
      if (response.success) return response.result?.customerIntegration || null;
      else throw new Error(response.error || "Customer integration not found.");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      return null;
    }
  }, [fetchToken]);

  const createCustomerIntegration = useCallback(async (userId: string | undefined, data: Omit<CustomerIntegration, "id" | "created_at" | "updated_at">): Promise<CustomerIntegration | null> => {
    try {
      const token = await fetchToken();
      if (!userId) {
        toast({ variant: "destructive", title: "User Not Found", description: "Cannot create integration without a valid user ID." });
        return null;
      }
      const response = await CustomerIntegrationService.create(token, userId, data);
      if (response.success) {
        toast({ variant: "default", title: "Integration Created", description: "Successfully created." });
        return response.result?.customerIntegration || null;
      } else throw new Error(response.error || "Failed to create customer integration.");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      return null;
    }
  }, [fetchToken]);

  const updateCustomerIntegration = useCallback(async (userId: string | undefined, integrationId: number, data: Partial<Omit<CustomerIntegration, "id" | "created_at" | "updated_at">>): Promise<CustomerIntegration | null> => {
    try {
      const token = await fetchToken();
      if (!userId) {
        toast({ variant: "destructive", title: "User Not Found", description: "Cannot update integration without a valid user ID." });
        return null;
      }
      const response = await CustomerIntegrationService.update(token, userId, integrationId, data);
      if (response.success) {
        toast({ variant: "default", title: "Integration Updated", description: "Successfully updated." });
        return response.result?.customerIntegration || null;
      } else throw new Error(response.error || "Failed to update customer integration.");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      return null;
    }
  }, [fetchToken]);

  const deleteCustomerIntegration = useCallback(async (userId: string | undefined, integrationId: number): Promise<boolean> => {
    try {
      const token = await fetchToken();
      if (!userId) {
        toast({ variant: "destructive", title: "User Not Found", description: "Cannot delete integration without a valid user ID." });
        return false;
      }
      const response = await CustomerIntegrationService.delete(token, userId, integrationId);
      if (response.success) {
        toast({ variant: "default", title: "Integration Deleted", description: "Successfully deleted." });
        navigate('/integrations');
        return true;
      } else throw new Error(response.error || "Failed to delete customer integration.");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      return false;
    }
  }, [fetchToken, navigate]);

  return { fetchCustomerIntegrations, fetchCustomerIntegrationById, createCustomerIntegration, updateCustomerIntegration, deleteCustomerIntegration };
}
