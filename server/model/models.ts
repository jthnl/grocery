interface User {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
  }

  interface UserAuth {
    userId: string;
    passwordHash: string;
  }

  interface List {
    listId: string; // UUID
    userId: string;
    latestVersion: number; // Use null if no latest version
    active: boolean;
  }
  
  interface Entry {
    entryId: string; // UUID
    listId: string; // UUID (References "List" table's listId)
    version: number;
    data: object;
    date: Date;
  }
  export { User, UserAuth, List, Entry };
  