export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  image?: string;
  role: string[];
  verified: boolean;
  access: string;    // JWT access token
  refresh: string;   // JWT refresh token
  is_admin?: boolean;
}
