import axios from "axios";
import { GroceryList, Entry, RegistrationData } from "../model/models";

const BASE_URL = "http://localhost:3001";

export const authApi = {
  login: async (username: string, password: string): Promise<void> => {
    try {
      const data = {
        username: username,
        password: password,
      };

      await axios.post(`${BASE_URL}/login`, data, { withCredentials: true });
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await axios.get(`${BASE_URL}/logout`, { withCredentials: true });
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  },

  getProfile: async (): Promise<{ userId: string }> => {
    try {
      const response = await axios.get<{ userId: string }>(
        `${BASE_URL}/profile`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  register: async (registrationData: RegistrationData): Promise<void> => {
    try {
      await axios.post(`${BASE_URL}/register`, registrationData);
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }
};

export const api = {
  getListEntries: async (): Promise<Entry[]> => {
    try {
      const response = await axios.get<Entry[]>(`${BASE_URL}/getListEntries`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching list entries:", error);
      throw error;
    }
  },

  createNewList: async (): Promise<boolean> => {
    try {
      const response = await axios.post<{ success: boolean }>(
        `${BASE_URL}/createNewList`,
        {},
        { withCredentials: true }
      );
      return response.data.success;
    } catch (error) {
      console.error("Error creating new list:", error);
      throw error;
    }
  },

  updateListEntry: async (
    oldEntry: { entryId: string },
    newData: GroceryList
  ): Promise<void> => {
    try {
      const response = await axios.post<{ success: boolean; error?: string }>(
        `${BASE_URL}/updateList`,
        { oldEntry, newData },
        { withCredentials: true }
      );

      if (!response.data.success) {
        throw new Error("Error updating list: " + response.data.error);
      }
    } catch (error) {
      console.error("Error updating list:", error);
      throw error;
    }
  },

  deleteList: async (listId: string): Promise<boolean> => {
    try {
      const response = await axios.post<{ success: boolean; error?: string }>(
        `${BASE_URL}/deleteList`,
        { listId },
        { withCredentials: true }
      );
      return response.data.success;
    } catch (error) {
      console.error("Error deleting list:", error);
      throw error;
    }
  },

  signOut: async (): Promise<void> => {
    try {
      await axios.get(`${BASE_URL}/logout`, { withCredentials: true });
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },

  getEntryHistory: async (listId: string): Promise<Entry[]> => {
    try {
      const response = await axios.post<Entry[]>(
        `${BASE_URL}/getEntryHistory`,
        { listId }, 
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching entry history:", error);
      throw error;
    }
  },
};
