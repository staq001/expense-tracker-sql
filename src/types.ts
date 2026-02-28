import { Request } from "express";

type User = {
  id: number;
  username: string;
  password: string;
  email: string;
  created_at: Date;
};

export enum expenseCategory {
  "income",
  "housing",
  "groceries",
  "shopping",
  "entertainment",
  "others",
}

// export interface AuthenticatedRequest extends Request {
//   user?: typeof User.prototype;
// }

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface userDocument {
  username: string;
  email: string;
  password: string;
  isModified(path: string): boolean;
}
