export type UserRole = "admin" | "superadmin";

export interface AuthUser {
  id: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface JwtPayload {
  sub?: string;
  role?: UserRole;
  exp?: number;
}