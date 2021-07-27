import axios from 'axios';
import SystemDto from './system-dto';

const apiRoot = 'http://localhost:3002/api/v1';

// TODO - Implement Interface regarding clean architecture
export default class SystemApiRepositoryImpl {
  public static getAll = async (): Promise<SystemDto[]> => {
    try {
      const response = await axios.get(`${apiRoot}/systems`);
      if (response.status === 200) {
        const jsonResponse = await response.data;
        return jsonResponse;
      }
      return [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  public static delete = async (systemId: string): Promise<boolean> => {
    try {
      const response = await axios.delete(`${apiRoot}/system/${systemId}`);
      if (response.status === 200) {
        return true;
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  public static create = async (name: string): Promise<SystemDto | null> => {
    try {
      const response = await axios.post(`${apiRoot}/system`, {name});
      if (response.status === 201) {
        const jsonResponse = await response.data;
        return jsonResponse;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
