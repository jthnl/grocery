import knex from 'knex';
import { User, UserAuth, List, Entry } from '../model/models';
import { validateGroceryList } from '../model/joi'
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export const conn = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

export async function getUserById(userId: string): Promise<User | undefined> {
  return conn<User>('User').where('userId', userId).first();
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  return conn<User>('User').where('email', email).first();
}

export async function getUserAuthByUserId(userId: string): Promise<UserAuth | undefined> {
  return conn<UserAuth>('UserAuth').where('userId', userId).first();
}

export async function registerNewUser(user: User, password: string): Promise<void> {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  await conn<User>('User').insert(user);
  
  const newUserAuth: UserAuth = {
    userId: user.userId,
    passwordHash: hashedPassword,
  };
  await conn<UserAuth>('UserAuth').insert(newUserAuth);
}

export async function getLists(authenticatedUserId: string): Promise<List[]> {
  return conn('List').where('userId', authenticatedUserId).andWhere('active', true);
}

export async function getLatestEntry(list: List):Promise<Entry> {
  return conn('Entry').where('listId', list.listId).andWhere('version', list.latestVersion).first();
}

export async function getEntry(entryId: string): Promise<Entry> {
  return conn('Entry').where('entryId', entryId).first();
}

export async function getEntryHistory(listId: string): Promise<Entry[]> {
  return conn('Entry').where('listId', listId).orderBy('version', 'desc');
}

export async function updateList(oldEntry: Entry, newData: any): Promise<any> {
  try {
    const existingEntry: Entry = await conn('Entry').where('entryId', oldEntry.entryId).first();
    if (JSON.stringify(existingEntry.data) === JSON.stringify(newData)) {
      return { success: false, message: 'Data is unchanged. No updates needed.' };
    }

    const validationError = validateGroceryList(newData);
    if (validationError) {
      return { success: false, error: validationError };
    }

    await conn.transaction(async (trx) => {
      const newEntry: Entry = {
        listId: existingEntry.listId,
        version: existingEntry.version + 1,
        data: newData,
        date: new Date(),
      } as Entry;

      await trx('Entry').insert(newEntry);

      await trx('List')
        .where('listId', existingEntry.listId)
        .update('latestVersion', newEntry.version);
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: 'An error occurred.' };
  }
}

export async function createNewList(authenticatedUserId: string): Promise<any> {
  try {
    return conn.transaction(async (trx) => {
      const newList: List = {
        userId: authenticatedUserId,
        active: true,
        latestVersion: 1,
      } as List;

      const [insertedList] = await trx('List').insert(newList).returning('*');

      const newEntry: Entry = {
        listId: insertedList.listId,
        version: 1,
        data: {},
        date: new Date(),
      } as Entry;

      await trx('Entry').insert(newEntry);

      await trx('List')
        .where('listId', insertedList.listId)
        .update('latestVersion', 1);

      return { success: true };
    });
  } catch (error) {
    console.log(error);
    return { success: false, error: 'An error occurred.' };
  }
}

export async function deleteList(listId: string): Promise<any> {
  try {
    const result = await conn.transaction(async (trx) => {

      await trx('List')
        .where('listId', listId)
        .update('active', false);

      return { success: true };
    });

    return result;
  } catch (error) {
    console.log(error);
    return { success: false, error: 'An error occurred.' };
  }
}