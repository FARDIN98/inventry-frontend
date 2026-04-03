export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager';
}

export interface AuthResponse {
  user: AuthUser;
}

export interface FieldErrors {
  [field: string]: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}
