import axios, { AxiosRequestConfig } from 'axios';
import { getRoot } from '../../config';
import AccountDto from './account-dto';

// TODO - Implement Interface regarding clean architecture
export default class AccountApiRepositoryImpl {
  private static path = 'api/v1';

  private static root = getRoot(
    'account',
    '8081',
    AccountApiRepositoryImpl.path
  );

  public static getBy = async (
    params: URLSearchParams,
    jwt: string
  ): Promise<AccountDto[]> => {
    try {
      const apiRoot = await AccountApiRepositoryImpl.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
        params,
      };

      const response = await axios.get(`${apiRoot}/accounts`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
