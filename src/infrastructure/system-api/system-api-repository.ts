import axios from 'axios';
import SystemDto from './system-dto';

const apiRoot = 'http://localhost:3002/api/v1';

// TODO - Implement Interface regarding clean architecture
export default class SystemApiRepositoryImpl {
  public static getAll = async (): Promise<SystemDto[]> => {
    try {
      const response = await axios.get(`${apiRoot}/systems`);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static delete = async (systemId: string): Promise<boolean> => {
    try {
      const response = await axios.delete(`${apiRoot}/system/${systemId}`);
      const jsonResponse = response.data;
      if (response.status === 200) return true;
      throw new Error(jsonResponse);
    } catch (error) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static post = async (name: string): Promise<SystemDto | null> => {
    try {
      const response = await axios.post(`${apiRoot}/system`, {name});
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
