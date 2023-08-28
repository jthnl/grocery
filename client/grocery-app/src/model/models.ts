export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserAuth {
  userId: string;
  passwordHash: string;
}

export interface List {
  listId: string;
  userId: string;
  latestVersion: number;
  active: boolean;
}

export interface Entry {
  entryId: string;
  listId: string;
  version: number;
  data: object;
  date: Date;
}

export interface GroceryList {
  title: string;
  items: ListItem[];
  listId: string;
}

export interface ListItem {
  title: string;
  metadata: MetaData;
}

export interface MetaData {
  checkbox: boolean;
}
