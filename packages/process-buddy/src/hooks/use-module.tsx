// src/hooks/useModuleData.ts

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import {Module} from "@brux/shared/src/queries/module/schema";
import ModuleService from "@brux/shared/src/queries/module/service";
import { toast } from "./use-toast";

type UseModuleDataResult = {
  modules: Module[];
  module: Module | null;
  loading: boolean;
  error: string | null;
  fetchModules: () => Promise<void>;
  fetchModuleById: (moduleId: string) => Promise<void>;
  createModule: (data: Omit<Module, "id" | "created_at" | "updated_at">) => Promise<void>;
  deleteModule: (moduleId: string) => Promise<void>;
};

export function useModuleData(): UseModuleDataResult {
  const { getToken, userId } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = useCallback(async (): Promise<string> => {
    const token = await getToken();
    if (!token) {
      throw new Error("Unauthorized");
    }
    return token;
  }, [getToken]);

  const fetchModules = useCallback(async () => {
    setLoading(true);
    try {
      const token = await fetchToken();
      if (!userId) throw new Error("Unauthorized");
      
      const response = await ModuleService.list(token, userId);
      if (response.success) {
        setModules(response.result?.modules || []);
      } else {
        setError(response.error || "Failed to fetch modules.");
      }
    } catch (errorResponse) {
      setError("An error occurred while fetching modules.");
      toast({
        variant: "destructive",
        title: "Fetch Error",
        description: error || "An error occurred while fetching modules.",
      });
    } finally {
      setLoading(false);
    }
  }, [fetchToken, userId]);

  const fetchModuleById = useCallback(
    async (moduleId: string) => {
      setLoading(true);
      try {
        const token = await fetchToken();
        if (!userId) throw new Error("Unauthorized");

        const response = await ModuleService.fetch(token, userId, moduleId);
        if (response.success) {
          setModule(response.result?.module || null);
        } else {
          setError(response.error || "Module not found.");
        }
      } catch (errorResponse) {
        setError("An error occurred while fetching the module.");
        toast({
          variant: "destructive",
          title: "Fetch Error",
          description: error || "An error occurred while fetching the module.",
        });
      } finally {
        setLoading(false);
      }
    },
    [fetchToken, userId]
  );

  const createModule = useCallback(
    async (data: Omit<Module, "id" | "created_at" | "updated_at">) => {
      setLoading(true);
      try {
        const token = await fetchToken();
        if (!userId) throw new Error("Unauthorized");

        const response = await ModuleService.create(token, userId, data);
        if (response.success) {
          toast({
            variant: "default",
            title: "Module Created",
            description: "The new module has been created successfully.",
          });
          await fetchModules();
        } else {
          setError(response.error || "Failed to create module.");
        }
      } catch (error) {
        setError("An error occurred while creating the module.");
        toast({
          variant: "destructive",
          title: "Creation Error",
          description: "An error occurred while creating the module.",
        });
      } finally {
        setLoading(false);
      }
    },
    [fetchToken, fetchModules, userId]
  );

  const deleteModule = useCallback(
    async (moduleId: string) => {
      setLoading(true);
      try {
        const token = await fetchToken();
        if (!userId) throw new Error("Unauthorized");

        const response = await ModuleService.delete(token, userId, moduleId);
        if (response.success) {
          setModules((prev) => prev.filter((mod) => mod.id !== parseInt(moduleId)));
          toast({
            variant: "default",
            title: "Module Deleted",
            description: "The module has been successfully deleted.",
          });
        } else {
          setError(response.error || "Failed to delete module.");
          toast({
            variant: "destructive",
            title: "Deletion Error",
            description: response.error || "Failed to delete the module.",
          });
        }
      } catch (error) {
        setError("An error occurred while deleting the module.");
        toast({
          variant: "destructive",
          title: "Deletion Error",
          description: "An error occurred while deleting the module.",
        });
      } finally {
        setLoading(false);
      }
    },
    [fetchToken, userId]
  );

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return {
    modules,
    module,
    loading,
    error,
    fetchModules,
    fetchModuleById,
    createModule,
    deleteModule,
  };
}
