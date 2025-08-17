import axios from 'axios';
import { API_BASE_URL } from '../config';

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
});

export const login = async (credentials: any) => {
  try {
    const response = await authApi.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData: any) => {
    try {
      const response = await authApi.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
