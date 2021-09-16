import axios from 'axios';
import { nodeEnv } from '../../config';
import SelectorDto from './selector-dto';

// TODO - Implement Interface regarding clean architecture
export default class SelectorApiRepositoryImpl {
  private static getRoot = async (): Promise<string> => {
    const path = 'selector-service/api/v1';

    if (nodeEnv !== 'production') return `http://localhost:3000/${path}`;

    return `https://bff.hivedive.io/${path}`;
  };

  public static getOne = async (
    selectorId: string
  ): Promise<SelectorDto | null> => {
    try {
      const apiRoot = await SelectorApiRepositoryImpl.getRoot();

      const response = await axios.get(`${apiRoot}/selector/${selectorId}`);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static getBy = async (
    params: URLSearchParams
  ): Promise<SelectorDto[]> => {
    try {
      const apiRoot = await SelectorApiRepositoryImpl.getRoot();

      const response = await axios.get(`${apiRoot}/selectors`, { params });
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static post = async (
    content: string,
    systemId: string
  ): Promise<SelectorDto | null> => {
    try {
      const apiRoot = await SelectorApiRepositoryImpl.getRoot();

      const response = await axios.post(`${apiRoot}/selector`, {
        content,
        systemId,
      });
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static delete = async (selectorId: string): Promise<boolean> => {
    try {
      const apiRoot = await SelectorApiRepositoryImpl.getRoot();

      const response = await axios.delete(`${apiRoot}/selector/${selectorId}`);
      const jsonResponse = response.data;
      if (response.status === 200) return true;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
