import axios from 'axios';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tripsApi = axios.create({
  baseURL: `${API_BASE_URL}/trips`,
});

tripsApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllTrips = async () => {
  try {
    const response = await tripsApi.get('/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOngoingTrips = async () => {
  try {
    const response = await tripsApi.get('/ongoing');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTrip = async (tripData: any) => {
    try {
      const response = await tripsApi.post('/', tripData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const endTrip = async (tripId: any) => {
    try {
      const response = await tripsApi.put(`/${tripId}/end`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
