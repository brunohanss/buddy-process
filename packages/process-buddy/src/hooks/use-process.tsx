// src/hooks/useProcessData.ts

import { useCallback } from "react";
import ProcessService from "@brux/shared/src/queries/process/service";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "./use-toast";
import { Process } from "@brux/shared/src/queries/process/schema";

type UseProcessDataMethods = {
  fetchProcesses: (userId: string | undefined) => Promise<Process[]>;
  fetchProcessById: (userId: string | undefined, processId: string) => Promise<Process | null>;
  createProcess: (userId: string | undefined,
    data: Omit<Process, "id" | "created_at" | "updated_at">
  ) => Promise<Process | null>;
  updateProcess: (
    userId: string | undefined,
    processId: string,
    data: Partial<Omit<Process, "id" | "customer_id" | "created_at" | "updated_at">>
  ) => Promise<Process | null>;
  deleteProcess: (userId: string | undefined,processId: string) => Promise<boolean>;
};

export function useProcessData(): UseProcessDataMethods {
  const { getToken } = useAuth();

  const fetchToken = useCallback(async (): Promise<{token: string}> => {
    const token = await getToken();
    if (!token) {
      console.warn("Unauthorized", token);
      throw new Error();
    }
    return {token};
  }, [getToken]);

  const fetchProcesses = useCallback(async (userId: string | undefined): Promise<Process[]> => {
    const {token} = await fetchToken();
    if (!userId) {
      console.warn("No user");
      return [];
    }
    const response = await ProcessService.list(token, userId);
    if (response.success) {
      return response.result?.processes || [];
    } else {
      throw new Error(response.error || "Failed to fetch processes.");
    }
  }, [fetchToken]);

  const fetchProcessById = useCallback(
    async (userId: string | undefined, processId: string): Promise<Process | null> => {
      const {token} = await fetchToken();
      if (!userId) {
        console.warn("No user");
        return null;
      }
      const response = await ProcessService.fetch(token, userId, processId);
      if (response.success) {
        return response.result?.process || null;
      } else {
        throw new Error(response.error || "Process not found.");
      }
    },
    [fetchToken]
  );

  const createProcess = useCallback(
    async (userId: string | undefined, data: Omit<Process, "id" | "created_at" | "updated_at">): Promise<Process | null> => {
      const {token} = await fetchToken();
      if (!userId) {
        console.warn("No user");
        return null;
      }
      const response = await ProcessService.create(token, userId, data);
      if (response.success) {
        toast({
          variant: "default",
          title: "Process Created",
          description: "The new process has been created successfully.",
        });
        return response.result?.process || null;
      } else {
        throw new Error(response.error || "Failed to create process.");
      }
    },
    [fetchToken]
  );

  const updateProcess = useCallback(
    async (
      userId: string | undefined,
      processId: string,
      data: Partial<Omit<Process, "id" | "customer_id" | "created_at" | "updated_at">>
    ): Promise<Process | null> => {
      const {token} = await fetchToken();
      if (!userId) {
        console.warn("No user");
        return null;
      }
      const response = await ProcessService.update(token, userId, processId, data);
      if (response.success) {
        toast({
          variant: "default",
          title: "Process Updated",
          description: "The process has been updated successfully.",
        });
        return response.result?.process || null;
      } else {
        throw new Error(response.error || "Failed to update process.");
      }
    },
    [fetchToken]
  );

  const deleteProcess = useCallback(
    async (userId: string | undefined, processId: string): Promise<boolean> => {
      const {token} = await fetchToken();
      if (!userId) {
        console.warn("No user");
        return false;
      }
      const response = await ProcessService.delete(token, userId, processId);
      if (response.success) {
        toast({
          variant: "default",
          title: "Process Deleted",
          description: "The process has been successfully deleted.",
        });
        return true;
      } else {
        throw new Error(response.error || "Failed to delete process.");
      }
    },
    [fetchToken]
  );

  return {
    fetchProcesses,
    fetchProcessById,
    createProcess,
    updateProcess,
    deleteProcess,
  };
}
