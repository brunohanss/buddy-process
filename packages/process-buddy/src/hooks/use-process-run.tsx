// src/hooks/useProcessRunData.ts

import { useState, useEffect, useCallback } from "react";
import ProcessRunService from "@brux/shared/src/queries/processRun/service";
import { useAuth } from "@clerk/clerk-react";
import { ProcessRun } from "@brux/shared/src/queries/processRun/schema";

type UseProcessRunDataResult = {
  processRuns: ProcessRun[];
  processRun: ProcessRun | null;
  loadingProcessRun: boolean;
  errorProcessRun: string | null;
  fetchProcessRuns: () => Promise<void>;
  fetchProcessRunById: (processRunId: string) => Promise<void>;
  createProcessRun: (data: Omit<ProcessRun, "id" | "started_at" | "completed_at">) => Promise<void>;
  deleteProcessRun: (processRunId: string) => Promise<void>;
};

export function useProcessRunData(): UseProcessRunDataResult {
  const { getToken, userId } = useAuth();
  const [processRuns, setProcessRuns] = useState<ProcessRun[]>([]);
  const [processRun, setProcessRun] = useState<ProcessRun | null>(null);
  const [loadingProcessRun, setLoading] = useState(true);
  const [errorProcessRun, setError] = useState<string | null>(null);

  const fetchToken = useCallback(async (): Promise<string> => {
    const token = await getToken();
    if (!token) throw new Error("Unauthorized");
    return token;
  }, [getToken]);

  const fetchProcessRuns = useCallback(async () => {
    setLoading(true);
    try {
      const token = await fetchToken();
      const response = await ProcessRunService.list(token, userId!);
      if (response.success) {
        setProcessRuns(response.result?.processRuns || []);
      } else {
        setError(response.error || "Failed to fetch process runs.");
      }
    } catch {
      setError("An error occurred while fetching process runs.");
    } finally {
      setLoading(false);
    }
  }, [fetchToken, userId]);

  const fetchProcessRunById = useCallback(
    async (processRunId: string) => {
      setLoading(true);
      try {
        const token = await fetchToken();
        const response = await ProcessRunService.fetch(token, userId!, processRunId);
        if (response.success) {
          setProcessRun(response.result?.processRun || null);
        } else {
          setError(response.error || "Process run not found.");
        }
      } catch {
        setError("An error occurred while fetching the process run.");
      } finally {
        setLoading(false);
      }
    },
    [fetchToken, userId]
  );

  const createProcessRun = useCallback(
    async (data: Omit<ProcessRun, "id" | "started_at" | "completed_at">) => {
      setLoading(true);
      try {
        const token = await fetchToken();
        const response = await ProcessRunService.create(token, userId!, data);
        if (response.success) {
          await fetchProcessRuns();
        } else {
          setError(response.error || "Failed to create process run.");
        }
      } catch {
        setError("An error occurred while creating the process run.");
      } finally {
        setLoading(false);
      }
    },
    [fetchToken, fetchProcessRuns, userId]
  );

  const deleteProcessRun = useCallback(
    async (processRunId: string) => {
      setLoading(true);
      try {
        const token = await fetchToken();
        const response = await ProcessRunService.delete(token, userId!, processRunId);
        if (response.success) {
          setProcessRuns((prev) => prev.filter((run) => run.id !== parseInt(processRunId)));
        } else {
          setError(response.error || "Failed to delete process run.");
        }
      } catch {
        setError("An error occurred while deleting the process run.");
      } finally {
        setLoading(false);
      }
    },
    [fetchToken, userId]
  );

  useEffect(() => {
    fetchProcessRuns();
  }, [fetchProcessRuns]);

  return {
    processRuns,
    processRun,
    loadingProcessRun,
    errorProcessRun,
    fetchProcessRuns,
    fetchProcessRunById,
    createProcessRun,
    deleteProcessRun,
  };
}
