import axios from 'axios';
import { nodeEnv, serviceDiscoveryNamespace } from '../../config';
import AccountDto from './account-dto';
import discoverIp from '../shared/service-discovery';

// TODO - Implement Interface regarding clean architecture
export default class AccountApiRepositoryImpl {
  private static getRoot = async (): Promise<string> => {
    const path = 'api/v1';

    if (nodeEnv !== 'production') return `http://localhost:8081/${path}`;

    try {
      const ip = await discoverIp(
        serviceDiscoveryNamespace,
        'account-service'
      );

      return `http://${ip}/${path}`;
    } catch (error: any) {
      return Promise.reject(typeof error === 'string' ? error : error.message);
    }
  };

  public static getBy = async (params: URLSearchParams): Promise<AccountDto[]> => {
    try {
      const apiRoot = await AccountApiRepositoryImpl.getRoot();

      const response = await axios.get(`${apiRoot}/accounts`, {params});
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
