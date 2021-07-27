import axios from 'axios';
import AccountDto from './account-dto';

const apiRoot = 'http://localhost:8081/api/v1';

// TODO - Implement Interface regarding clean architecture
export default class AccountApiRepositoryImpl {
  public static getAccountsByUserId = async (userId: string): Promise<AccountDto[]> => {
    try {
      const params = new URLSearchParams();
      params.append('userId', userId);

      const response = await axios.get(`${apiRoot}/accounts`, {params});
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
