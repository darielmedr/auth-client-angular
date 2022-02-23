import { UserData } from './user-data.model';

export interface SessionData {
  user: UserData;
  expiresIn: number;  // milliseconds
}
