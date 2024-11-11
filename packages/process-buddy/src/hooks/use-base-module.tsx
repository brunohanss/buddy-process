// src/hooks/useBaseModuleData.ts

import { useState, useEffect, useCallback } from "react";
import BaseModuleService from "@brux/shared/src/queries/baseModule/service";
import { useAuth } from "@clerk/clerk-react";
import { BaseModule } from "@brux/shared/src/queries/baseModule/schema";
import { toast } from "./use-toast";

type UseBaseModuleDataResult = {
  baseModules: BaseModule[];
  baseModule: BaseModule | null;
  loading: boolean;
  error: string | null;
  fetchBaseModules: () => Promise<void>;
  fetchBaseModuleById: (moduleId: string) => Promise<void>;
  createBaseModule: (data: Omit<BaseModule, "id" | "created_at" | "updated_at">) => Promise<void>;
  deleteBaseModule: (moduleId: string) => Promise<void>;
};

export function useBaseModuleData(): UseBaseModuleDataResult {
  const { getToken, userId } = useAuth();
  const [baseModules, setBaseModules] = useState<BaseModule[]>([]);
  const [baseModule, setBaseModule] = useState<BaseModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = useCallback(async (): Promise<string> => {
    const token = await getToken();
    if (!token) throw new Error("Unauthorized");
    return token;
  }, [getToken]);

  const fetchBaseModules = useCallback(async () => {
    setLoading(true);
    try {
      const token = await fetchToken();
      const response = await BaseModuleService.list(token, userId!);
      if (response.success) {
        setBaseModules(response.result?.baseModules || []);
      } else {
        setError(response.error || "Failed to fetch base modules.");
      }
    } catch {
      setError("An error occurred while fetching base modules.");
      toast({
        variant: "destructive",
        title: "Fetch Error",
        description: "An error occurred while fetching base modules.",
      });
    } finally {
      setLoading(false);
    }
  }, [fetchToken, userId]);

  const fetchBaseModuleById = useCallback(
    async (moduleId: string) => {
      setLoading(true);
      try {
        const token = await fetchToken();
        const response = await BaseModuleService.fetch(token, userId!, moduleId);
        if (response.success) {
          setBaseModule(response.result?.baseModule || null);
        } else {
          setError(response.error || "Base module not found.");
        }
      } catch {
        setError("An error occurred while fetching the base module.");
        toast({
          variant: "destructive",
          title: "Fetch Error",
          description: "An error occurred while fetching the base module.",
        });
      } finally {
        setLoading(false);
      }
    },
    [fetchToken, userId]
  );

  const createBaseModule = useCallback(
    async (data: Omit<BaseModule, "id" | "created_at" | "updated_at">) => {
      setLoading(true);
      try {
        const token = await fetchToken();
        const response = await BaseModuleService.create(token, userId!, data);
        if (response.success) {
          toast({
            variant: "default",
            title: "Base Module Created",
            description: "The new base module has been created successfully.",
          });
          await fetchBaseModules();
        } else {
          setError(response.error || "Failed to create base module.");
        }
      } catch {
        setError("An error occurred while creating the base module.");
        toast({
          variant: "destructive",
          title: "Creation Error",
          description: "An error occurred while creating the base module.",
        });
      } finally {
        setLoading(false);
      }
    },
    [fetchToken, fetchBaseModules, userId]
  );

  const deleteBaseModule = useCallback(
    async (moduleId: string) => {
      setLoading(true);
      try {
        const token = await fetchToken();
        const response = await BaseModuleService.delete(token, userId!, moduleId);
        if (response.success) {
          setBaseModules((prev) => prev.filter((mod) => mod.id !== parseInt(moduleId)));
          toast({
            variant: "default",
            title: "Base Module Deleted",
            description: "The base module has been successfully deleted.",
          });
        } else {
          setError(response.error || "Failed to delete base module.");
        }
      } catch {
        setError("An error occurred while deleting the base module.");
      } finally {
        setLoading(false);
      }
    },
    [fetchToken, userId]
  );

  useEffect(() => {
    fetchBaseModules();
  }, [fetchBaseModules]);

  return {
    baseModules,
    baseModule,
    loading,
    error,
    fetchBaseModules,
    fetchBaseModuleById,
    createBaseModule,
    deleteBaseModule,
  };
}
