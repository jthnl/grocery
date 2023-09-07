import axios from "axios";
import { GroceryList, Entry, RegistrationData } from "../model/models";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Function to set JWT token in Axios headers
const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Initial token setup (on app startup)
const storedToken = localStorage.getItem('jwtToken');
setAuthToken(storedToken);

// User Authentication API Calls
export const authApi = {
  login: async (username: string, password: string): Promise<void> => {
    try {
      const data = {
        username: username,
        password: password,
      };

      const response = await axios.post(`${BASE_URL}/login`, data);
      const token = response.data.token;
      localStorage.setItem('jwtToken', token);
      setAuthToken(token); 
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await axios.get(`${BASE_URL}/logout`);
      localStorage.removeItem('jwtToken'); 
      setAuthToken(null); 
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  },

  getProfile: async (): Promise<{ userId: string }> => {
    try {
      const response = await axios.get<{ userId: string }>(
        `${BASE_URL}/profile`
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

// Program (Dashboard) API Calls
export const api = {
  getListEntries: async (): Promise<Entry[]> => {
    try {
      const response = await axios.get<Entry[]>(`${BASE_URL}/getListEntries`);
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
        {}
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
        { oldEntry, newData }
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
        { listId }
      );
      return response.data.success;
    } catch (error) {
      console.error("Error deleting list:", error);
      throw error;
    }
  },

  getEntryHistory: async (listId: string): Promise<Entry[]> => {
    try {
      const response = await axios.post<Entry[]>(
        `${BASE_URL}/getEntryHistory`,
        { listId }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching entry history:", error);
      throw error;
    }
  },
};
