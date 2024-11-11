
import { Process } from "./schema";
import { APIResponse } from "../../types/APIResponse";

class ProcessService {
  private static baseUrl = 'http://127.0.0.1:8787/api/processes';

  static async list(token: string, userId: string): Promise<APIResponse<{ processes: Process[] }>> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      }
    });
    return response.json();
  }

  static async create(token: string, userId: string, processData: Omit<Process, 'id' | 'created_at' | 'updated_at'>): Promise<APIResponse<{ process: Process }>> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      },
      body: JSON.stringify(processData),
    });
    return response.json();
  }

  static async fetch(token: string, userId: string, processId: string): Promise<APIResponse<{ process: Process }>> {
    const response = await fetch(`${this.baseUrl}/${processId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      }
    });
    return response.json();
  }

  static async delete(token: string, userId: string, processId: string): Promise<APIResponse<{ message: string }>> {
    const response = await fetch(`${this.baseUrl}/${processId}`, {
      method: 'DELETE',
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
    processId: string,
    processData: Partial<Omit<Process, 'id' | 'customer_id' | 'created_at' | 'updated_at'>>
  ): Promise<APIResponse<{ process: Process }>> {
    const response = await fetch(`${this.baseUrl}/${processId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      },
      body: JSON.stringify(processData),
    });
    return response.json();
  }
}

export default ProcessService;