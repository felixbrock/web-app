import axios from 'axios';
import SystemDto from '../system-api/system-dto';

const apiRoot = 'http://localhost:3002/api/v1';

// TODO - Implement Interface regarding clean architecture
export default class SystemApiRepositoryImpl {
  public static getAll = async (): Promise<SystemDto[]> => {
    try {
      const response = await axios.get(`${apiRoot}/systems`);
      if (response.statusText === 'OK') {
        const jsonResponse = await response.data;
        return jsonResponse;
      }
      return [];
    } catch (error) {
      return [];
    }
  };
}
