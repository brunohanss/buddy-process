// src/queries/customerIntegration/service.ts

import { CustomerIntegration } from "./schema";
import { APIResponse } from "../../types/APIResponse";

class CustomerIntegrationService {
  private static baseUrl = 'http://127.0.0.1:8787/api/customer-integrations';

  static async list(token: string, userId: string): Promise<APIResponse<{ customerIntegrations: CustomerIntegration[] }>> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      }
    });
    return response.json();
  }

  static async create(token: string, userId: string, integrationData: Omit<CustomerIntegration, 'id' | 'created_at' | 'updated_at'>): Promise<APIResponse<{ customerIntegration: CustomerIntegration }>> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      },
      body: JSON.stringify(integrationData),
    });
    return response.json();
  }

  static async fetch(token: string, userId: string, integrationId: number): Promise<APIResponse<{ customerIntegration: CustomerIntegration }>> {
    const response = await fetch(`${this.baseUrl}/${integrationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      }
    });
    return response.json();
  }

  // Update method for modifying an existing customer integration
  static async update(
    token: string,
    userId: string,
    integrationId: number,
    integrationData: Partial<Omit<CustomerIntegration, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<APIResponse<{ customerIntegration: CustomerIntegration }>> {
    const response = await fetch(`${this.baseUrl}/${integrationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      },
      body: JSON.stringify(integrationData),
    });
    return response.json();
  }

  static async delete(token: string, userId: string, integrationId: number): Promise<APIResponse<{ message: string }>> {
    const response = await fetch(`${this.baseUrl}/${integrationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      }
    });
    return response.json();
  }
}

export default CustomerIntegrationService;
