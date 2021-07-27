import axios from 'axios';
import SelectorDto from './selector-dto';

const apiRoot = 'http://localhost:3000/api/v1';

// TODO - Implement Interface regarding clean architecture
export default class SelectorApiRepositoryImpl {
  public static create = async (content: string, systemId: string): Promise<SelectorDto | null> => {
    try {
      const response = await axios.post(`${apiRoot}/selector`, {content, systemId});
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

  public static getBy = async (
    params: URLSearchParams
  ): Promise<SelectorDto[]> => {
    try {
      const response = await axios.get(`${apiRoot}/selectors`, { params });
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
}