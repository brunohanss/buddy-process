// src/queries/baseModule/service.ts

import { BaseModule } from "../../schemas/baseModule";
import { APIResponse } from "../../types/APIResponse";

class BaseModuleService {
  private static baseUrl = 'http://127.0.0.1:8787/api/base-modules';

  static async list(token: string, userId: string): Promise<APIResponse<{ baseModules: BaseModule[] }>> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      }
    });
    return response.json();
  }

  static async create(token: string, userId: string, moduleData: Omit<BaseModule, 'id' | 'created_at' | 'updated_at'>): Promise<APIResponse<{ baseModule: BaseModule }>> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      },
      body: JSON.stringify(moduleData),
    });
    return response.json();
  }

  static async fetch(token: string, userId: string, moduleId: string): Promise<APIResponse<{ baseModule: BaseModule }>> {
    const response = await fetch(`${this.baseUrl}/${moduleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      }
    });
    return response.json();
  }

  static async delete(token: string, userId: string, moduleId: string): Promise<APIResponse<{ message: string }>> {
    const response = await fetch(`${this.baseUrl}/${moduleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      }
    });
    return response.json();
  }
}

export default BaseModuleService;
