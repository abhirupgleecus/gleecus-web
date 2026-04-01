import type { UserRole } from "./auth";

export interface InvitationCreateRequest {
  email: string;
  role: UserRole;
}

export interface InvitationResponse {
  id: string;
  email: string;
  role: UserRole;
  is_used: boolean;
  created_at: string;
  expires_at: string;
}
