// src/hooks/useBaseIntegrationData.ts

import { useCallback } from "react";
import BaseIntegrationService from "@brux/shared/src/queries/baseIntegration/service";
import { useAuth } from "@clerk/clerk-react";
import { BaseIntegration } from "@brux/shared/src/queries/baseIntegration/schema";
import { toast } from "./use-toast";

type UseBaseIntegrationDataMethods = {
  fetchBaseIntegrations: (userId: string | undefined) => Promise<BaseIntegration[]>;
  fetchBaseIntegrationById: (userId: string | undefined, integrationId: string) => Promise<BaseIntegration | null>;
  createBaseIntegration: (userId: string | undefined, data: Omit<BaseIntegration, "id" | "created_at" | "updated_at">) => Promise<BaseIntegration | null>;
  updateBaseIntegration: (userId: string | undefined, integrationId: string, data: Partial<Omit<BaseIntegration, "id" | "created_at" | "updated_at">>) => Promise<BaseIntegration | null>;
  deleteBaseIntegration: (userId: string | undefined, integrationId: string) => Promise<boolean>;
};

export function useBaseIntegrationData(): UseBaseIntegrationDataMethods {
  const { getToken } = useAuth();

  const fetchToken = useCallback(async (): Promise<string> => {
    const token = await getToken();
    if (!token) throw new Error("Unauthorized");
    return token;
  }, [getToken]);

  const fetchBaseIntegrations = useCallback(async (userId: string | undefined): Promise<BaseIntegration[]> => {
    const token = await fetchToken();
    if (!userId) {
      console.warn("No user");
      return [];
    }
    const response = await BaseIntegrationService.list(token, userId);
    if (response.success) return response.result?.baseIntegrations || [];
    else throw new Error(response.error || "Failed to fetch base integrations.");
  }, [fetchToken]);

  const fetchBaseIntegrationById = useCallback(async (userId: string | undefined, integrationId: string): Promise<BaseIntegration | null> => {
    const token = await fetchToken();
    if (!userId) {
      console.warn("No user");
      return null;
    }
    const response = await BaseIntegrationService.fetch(token, userId, integrationId);
    if (response.success) return response.result?.baseIntegration || null;
    else throw new Error(response.error || "Base integration not found.");
  }, [fetchToken]);

  const createBaseIntegration = useCallback(async (userId: string | undefined, data: Omit<BaseIntegration, "id" | "created_at" | "updated_at">): Promise<BaseIntegration | null> => {
    const token = await fetchToken();
    if (!userId) {
      console.warn("No user");
      return null;
    }
    const response = await BaseIntegrationService.create(token, userId, data);
    if (response.success) {
      toast({ variant: "default", title: "Integration Created", description: "Successfully created." });
      return response.result?.baseIntegration || null;
    } else throw new Error(response.error || "Failed to create base integration.");
  }, [fetchToken]);

  const updateBaseIntegration = useCallback(async (userId: string | undefined, integrationId: string, data: Partial<Omit<BaseIntegration, "id" | "created_at" | "updated_at">>): Promise<BaseIntegration | null> => {
    const token = await fetchToken();
    if (!userId) {
      console.warn("No user");
      return null;
    }
    const response = await BaseIntegrationService.update(token, userId, integrationId, data);
    if (response.success) {
      toast({ variant: "default", title: "Integration Updated", description: "Successfully updated." });
      return response.result?.baseIntegration || null;
    } else throw new Error(response.error || "Failed to update base integration.");
  }, [fetchToken]);

  const deleteBaseIntegration = useCallback(async (userId: string | undefined, integrationId: string): Promise<boolean> => {
    const token = await fetchToken();
    if (!userId) {
      console.warn("No user");
      return false;
    }
    const response = await BaseIntegrationService.delete(token, userId, integrationId);
    if (response.success) {
      toast({ variant: "default", title: "Integration Deleted", description: "Successfully deleted." });
      return true;
    } else throw new Error(response.error || "Failed to delete base integration.");
  }, [fetchToken]);

  return { fetchBaseIntegrations, fetchBaseIntegrationById, createBaseIntegration, updateBaseIntegration, deleteBaseIntegration };
}
