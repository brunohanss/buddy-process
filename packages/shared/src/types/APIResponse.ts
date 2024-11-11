export type APIResponse<T> = {
    success: boolean;
    result?: T;
    error?: string;
    message?: string;
  };