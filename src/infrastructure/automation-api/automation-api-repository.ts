import axios from 'axios';
import { nodeEnv } from '../../config';
import AutomationDto from './automation-dto';
import SubscriptionDto from './subscription-dto';

export interface UpdateSubscriptionRequestObject {
  selectorId: string;
  alertsAccessedOnByUser: number;
}

// TODO - Implement Interface regarding clean architecture
export default class AutomationApiRepositoryImpl {
  private static getRoot = async (): Promise<string> => {
    const path = 'api/v1';

    if (nodeEnv !== 'production') return `http://localhost:8080/${path}`;

    return `https://bff.hivedive.io/${path}`;
  };

  public static getOne = async (
    automationId: string
  ): Promise<AutomationDto | null> => {
    try {
      const apiRoot = await AutomationApiRepositoryImpl.getRoot();

      const response = await axios.get(`${apiRoot}/automation/${automationId}`);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static getBy = async (
    params: URLSearchParams
  ): Promise<AutomationDto[]> => {
    try {
      const apiRoot = await AutomationApiRepositoryImpl.getRoot();

      const response = await axios.get(`${apiRoot}/automations`, { params });
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static post = async (
    name: string,
    accountId: string
  ): Promise<AutomationDto | null> => {
    try {
      const apiRoot = await AutomationApiRepositoryImpl.getRoot();

      const response = await axios.post(`${apiRoot}/automation`, {
        name,
        accountId,
      });
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static delete = async (automationId: string): Promise<boolean> => {
    try {
      const apiRoot = await AutomationApiRepositoryImpl.getRoot();

      const response = await axios.delete(
        `${apiRoot}/automation/${automationId}`
      );
      const jsonResponse = response.data;
      if (response.status === 200) return true;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static postSubscription = async (
    automationId: string,
    systemId: string,
    selectorId: string
  ): Promise<SubscriptionDto | null> => {
    try {
      const apiRoot = await AutomationApiRepositoryImpl.getRoot();

      const response = await axios.post(
        `${apiRoot}/automation/${automationId}/subscription`,
        {
          systemId,
          selectorId,
        }
      );
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static updateSubscriptions = async (
    automationId: string,
    subscriptions: UpdateSubscriptionRequestObject[]
  ): Promise<SubscriptionDto[]> => {
    try {
      const apiRoot = await AutomationApiRepositoryImpl.getRoot();

      const response = await axios.patch(
        `${apiRoot}/automation/${automationId}/subscriptions`,
        {
          subscriptions,
        }
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static deleteSubscription = async (
    automationId: string,
    params: URLSearchParams
  ): Promise<boolean> => {
    try {
      const apiRoot = await AutomationApiRepositoryImpl.getRoot();

      const response = await axios.delete(
        `${apiRoot}/automation/${automationId}/subscription`,
        { params }
      );
      const jsonResponse = response.data;
      if (response.status === 200) return true;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
