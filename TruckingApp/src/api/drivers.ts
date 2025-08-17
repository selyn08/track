import axios from 'axios';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const driversApi = axios.create({
  baseURL: `${API_BASE_URL}/drivers`,
});

driversApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDriverProfile = async () => {
  try {
    const response = await driversApi.get('/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateDriverProfile = async (profileData: any) => {
  try {
    const response = await driversApi.put('/', profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
