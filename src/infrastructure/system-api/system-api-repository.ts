import axios, { AxiosRequestConfig } from 'axios';
import { nodeEnv } from '../../config';
import SystemDto from './system-dto';

// TODO - Implement Interface regarding clean architecture
export default class SystemApiRepositoryImpl {
  private static getRoot = async (): Promise<string> => {
    const path = 'api/v1';

    let root = '';
    switch (nodeEnv) {
      case 'development':
        root = `http://localhost:3002/${path}`;
        break;
      case 'test':
        root = `https://bff-test.hivedive.io/system-service/${path}`;
        break;
      case 'production':
        root = `https://bff.hivedive.io/system-service/${path}`;
        break;
      default:
        break;
    }

    return root;
  };

  public static getBy = async (
    params: URLSearchParams,
    jwt: string
  ): Promise<SystemDto[]> => {
    try {
      const apiRoot = await SystemApiRepositoryImpl.getRoot();

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
        params,
      };

      const response = await axios.get(`${apiRoot}/systems`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static getOne = async (
    systemId: string,
    jwt: string
  ): Promise<SystemDto | null> => {
    try {
      const apiRoot = await SystemApiRepositoryImpl.getRoot();

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(`${apiRoot}/system/${systemId}`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static delete = async (
    systemId: string,
    jwt: string
  ): Promise<boolean> => {
    try {
      const apiRoot = await SystemApiRepositoryImpl.getRoot();

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.delete(
        `${apiRoot}/system/${systemId}`,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return true;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static post = async (
    name: string,
    jwt: string
  ): Promise<SystemDto | null> => {
    try {
      const apiRoot = await SystemApiRepositoryImpl.getRoot();

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
        data: { name },
      };

      const response = await axios.post(`${apiRoot}/system`, config);
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
