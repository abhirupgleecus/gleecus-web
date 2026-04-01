export interface ManagedUser {
  id: string;
  email: string;
  username: string;
  role: "admin" | "superadmin";
  is_active: boolean;
  created_at: string;
}
