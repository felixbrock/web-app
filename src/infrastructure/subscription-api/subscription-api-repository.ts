import axios from 'axios';
import SubscriptionDto from './subscription-dto';
import TargetDto from './target-dto';

const apiRoot = 'http://localhost:8080/api/v1';

// TODO - Implement Interface regarding clean architecture
export default class SubscriptionApiRepositoryImpl {
  public static getBy = async (
    params: URLSearchParams
  ): Promise<SubscriptionDto[]> => {
    try {
      const response = await axios.get(`${apiRoot}/subscriptions`, { params });
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static postTarget = async (
    subscriptionId: string,
    systemId: string,
    selectorId: string
  ): Promise<TargetDto | null> => {
    try {
      const response = await axios.post(
        `${apiRoot}/subscription/${subscriptionId}/target`,
        {
          systemId,
          selectorId,
        }
      );
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static updateTarget = async (
    subscriptionId: string,
    selectorId: string,
    alertsAccessedOnByUser: number
  ): Promise<TargetDto | null> => {
    try {
      const response = await axios.patch(
        `${apiRoot}/subscription/${subscriptionId}/target`,
        {
          selectorId,
          alertsAccessedOnByUser,
        }
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
