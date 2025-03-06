export interface UserRole {
    id: number;
    name: string;
  }
  
  export interface User {
    id: number;
    username: string;
    email: string;
    role: UserRole; // role es obligatorio
    jwt: string;
  }