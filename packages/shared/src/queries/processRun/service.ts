// src/queries/processRun/service.ts

import { ProcessRun } from "./schema";
import { APIResponse } from "../../types/APIResponse";

class ProcessRunService {
  private static baseUrl = 'http://127.0.0.1:8787/api/process-runs';

  static async list(token: string, userId: string): Promise<APIResponse<{ processRuns: ProcessRun[] }>> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      }
    });
    return response.json();
  }

  static async create(
    token: string,
    userId: string,
    processRunData: Omit<ProcessRun, 'id' | 'started_at' | 'completed_at'>
  ): Promise<APIResponse<{ processRun: ProcessRun }>> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      },
      body: JSON.stringify(processRunData),
    });
    return response.json();
  }

  static async fetch(token: string, userId: string, processRunId: string): Promise<APIResponse<{ processRun: ProcessRun }>> {
    const response = await fetch(`${this.baseUrl}/${processRunId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      }
    });
    return response.json();
  }

  static async update(
    token: string,
    userId: string,
    processRunId: string,
    processRunData: Partial<Omit<ProcessRun, 'id' | 'started_at'>>
  ): Promise<APIResponse<{ processRun: ProcessRun }>> {
    const response = await fetch(`${this.baseUrl}/${processRunId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      },
      body: JSON.stringify(processRunData),
    });
    return response.json();
  }

  static async delete(token: string, userId: string, processRunId: string): Promise<APIResponse<{ message: string }>> {
    const response = await fetch(`${this.baseUrl}/${processRunId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      }
    });
    return response.json();
  }
}

export default ProcessRunService;
