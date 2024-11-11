// src/queries/module/service.ts


import { APIResponse } from "../../types/APIResponse";
import { Module } from "./schema";

class ModuleService {
  private static baseUrl = 'http://127.0.0.1:8787/api/modules';

  static async list(token: string, userId: string): Promise<APIResponse<{ modules: Module[] }>> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-User-Buddy-Process': userId
      }
    });
    return response.json();
  }

  static async create(token: string, userId: string, moduleData: Omit<Module, 'id' | 'created_at' | 'updated_at'>): Promise<APIResponse<{ module: Module }>> {
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

  static async fetch(token: string, userId: string, moduleId: string): Promise<APIResponse<{ module: Module }>> {
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

export default ModuleService;
