import axios from 'axios';
import SubscriptionDto from './subscription-dto';

const apiRoot = 'http://localhost:8080/api/v1';

// TODO - Implement Interface regarding clean architecture
export default class SubscriptionApiRepositoryImpl {
  public static getBy = async (
    params: URLSearchParams
  ): Promise<SubscriptionDto[]> => {
    try {
      const response = await axios.get(`${apiRoot}/subscriptions`, { params });
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
