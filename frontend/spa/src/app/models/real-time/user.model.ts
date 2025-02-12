import { UserRole } from './user-role.model';

export interface User {
    id: number;
    username: string;
    email: string;
    password_hash?: string; // Usualmente no se expone en el frontend
    role: UserRole | string;
    created_at: Date | string;
  }