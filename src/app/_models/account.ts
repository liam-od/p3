import { Role } from './role';

export class Account {
  id: string;
  firstNames: string;
  lastName: string;
  username: string;
  email: string;
  avatar: string;
  role: Role;
  jwtToken?: string;
}
