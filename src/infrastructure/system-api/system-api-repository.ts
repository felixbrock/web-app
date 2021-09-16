import axios from 'axios';
import { nodeEnv } from '../../config';
import SystemDto from './system-dto';

// TODO - Implement Interface regarding clean architecture
export default class SystemApiRepositoryImpl {
  private static getRoot = async (): Promise<string> => {
    const path = 'system-service/api/v1';

    if (nodeEnv !== 'production') return `http://localhost:3002/${path}`;

    return `https://bff.hivedive.io/${path}`;
  };

  public static getBy = async (
    params: URLSearchParams
  ): Promise<SystemDto[]> => {
    try {
      const apiRoot = await SystemApiRepositoryImpl.getRoot();

      const response = await axios.get(`${apiRoot}/systems`, { params });
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static getOne = async (
    systemId: string
  ): Promise<SystemDto | null> => {
    try {
      const apiRoot = await SystemApiRepositoryImpl.getRoot();

      const response = await axios.get(`${apiRoot}/system/${systemId}`);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static delete = async (systemId: string): Promise<boolean> => {
    try {
      const apiRoot = await SystemApiRepositoryImpl.getRoot();

      const response = await axios.delete(`${apiRoot}/system/${systemId}`);
      const jsonResponse = response.data;
      if (response.status === 200) return true;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static post = async (name: string): Promise<SystemDto | null> => {
    try {
      const apiRoot = await SystemApiRepositoryImpl.getRoot();

      const response = await axios.post(`${apiRoot}/system`, { name });
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
