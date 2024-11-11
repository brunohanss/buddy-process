// src/queries/baseIntegration/service.ts

import { BaseIntegration } from "@brux/shared/src/queries/baseIntegration/schema";
import { APIResponse } from "../../types/APIResponse";

class BaseIntegrationService {
  private static baseUrl = 'http://127.0.0.1:8787/api/base-integrations';

  static async list(token: string, userId: string): Promise<APIResponse<{ baseIntegrations: BaseIntegration[] }>> {
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
    baseIntegrationData: Omit<BaseIntegration, 'id' | 'created_at' | 'updated_at'>
  ): Promise<APIResponse<{ baseIntegration: BaseIntegration }>> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      },
      body: JSON.stringify(baseIntegrationData),
    });
    return response.json();
  }

  static async fetch(token: string, userId: string, baseIntegrationId: string): Promise<APIResponse<{ baseIntegration: BaseIntegration }>> {
    const response = await fetch(`${this.baseUrl}/${baseIntegrationId}`, {
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
    baseIntegrationId: string,
    baseIntegrationData: Partial<Omit<BaseIntegration, 'id'>>
  ): Promise<APIResponse<{ baseIntegration: BaseIntegration }>> {
    const response = await fetch(`${this.baseUrl}/${baseIntegrationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      },
      body: JSON.stringify(baseIntegrationData),
    });
    return response.json();
  }

  static async delete(token: string, userId: string, baseIntegrationId: string): Promise<APIResponse<{ message: string }>> {
    const response = await fetch(`${this.baseUrl}/${baseIntegrationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      }
    });
    return response.json();
  }
}

export default BaseIntegrationService;
