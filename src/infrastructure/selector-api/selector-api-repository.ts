import axios from 'axios';
import SelectorDto from './selector-dto';

const apiRoot = 'http://localhost:3000/api/v1';

// TODO - Implement Interface regarding clean architecture
export default class SelectorApiRepositoryImpl {
  public static getOne = async (
    selectorId: string
  ): Promise<SelectorDto | null> => {
    try {
      const response = await axios.get(`${apiRoot}/selector/${selectorId}`);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static getBy = async (
    params: URLSearchParams
  ): Promise<SelectorDto[]> => {
    try {
      const response = await axios.get(`${apiRoot}/selectors`, { params });
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static post = async (
    content: string,
    systemId: string
  ): Promise<SelectorDto | null> => {
    try {
      const response = await axios.post(`${apiRoot}/selector`, {
        content,
        systemId,
      });
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static delete = async (selectorId: string): Promise<boolean> => {
    try {
      const response = await axios.delete(`${apiRoot}/selector/${selectorId}`);
      const jsonResponse = response.data;
      if (response.status === 200) return true;
      throw new Error(jsonResponse);
    } catch (error) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
