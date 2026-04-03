const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { body, headers, ...rest } = options;
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      credentials: 'include',
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        statusCode: response.status,
        message: response.statusText,
      }));
      throw error;
    }

    return response.json() as Promise<T>;
  }

  async post<T>(endpoint: string, body?: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async patch<T>(endpoint: string, body?: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
