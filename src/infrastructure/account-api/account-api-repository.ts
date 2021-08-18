import axios from 'axios';
import AccountDto from './account-dto';

const apiRoot = 'http://localhost:8081/api/v1';

// TODO - Implement Interface regarding clean architecture
export default class AccountApiRepositoryImpl {
  public static getBy = async (params: URLSearchParams): Promise<AccountDto[]> => {
    try {
      const response = await axios.get(`${apiRoot}/accounts`, {params});
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
