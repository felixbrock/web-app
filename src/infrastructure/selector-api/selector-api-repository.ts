import axios, { AxiosRequestConfig } from 'axios';
import { nodeEnv } from '../../config';
import SelectorDto from './selector-dto';

// TODO - Implement Interface regarding clean architecture
export default class SelectorApiRepositoryImpl {
  private static getRoot = async (): Promise<string> => {
    const path = 'api/v1';

    let root = '';
    switch (nodeEnv) {
      case 'development':
        root = `http://localhost:3000/${path}`;
        break;
      case 'test':
        root = `https://bff-test.hivedive.io/selector-service/${path}`;
        break;
      case 'production':
        root = `https://bff.hivedive.io/selector-service/${path}`;
        break;
      default:
        break;
    }

    return root;
  };

  public static getOne = async (
    selectorId: string,
    jwt: string
  ): Promise<SelectorDto | null> => {
    try {
      const apiRoot = await SelectorApiRepositoryImpl.getRoot();

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(`${apiRoot}/selector/${selectorId}`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static getBy = async (
    params: URLSearchParams,
    jwt: string
  ): Promise<SelectorDto[]> => {
    try {
      const apiRoot = await SelectorApiRepositoryImpl.getRoot();

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
        params
      };

      const response = await axios.get(`${apiRoot}/selectors`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static post = async (
    content: string,
    systemId: string,
    jwt: string
  ): Promise<SelectorDto | null> => {
    try {
      const apiRoot = await SelectorApiRepositoryImpl.getRoot();

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
        data: {content, systemId}
      };

      const response = await axios.post(`${apiRoot}/selector`, config);
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static delete = async (selectorId: string, jwt: string): Promise<boolean> => {
    try {
      const apiRoot = await SelectorApiRepositoryImpl.getRoot();

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.delete(`${apiRoot}/selector/${selectorId}`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return true;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
