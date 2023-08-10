import axios, { AxiosRequestConfig } from 'axios';

import { useSelector } from 'react-redux';

const selectAuth = () => {
  return useSelector((state: any) => state.auth);
};

const useCallApi = () => {
  const { accessToken } = selectAuth();

  const httpRequest = (config: AxiosRequestConfig) => {
    const headers: any = { ...config.headers };
    headers.Authorization = `Bearer ${accessToken}`;
    return axios({
      ...config,
      method: config.method ?? 'get',
      headers,
    });
  };

  const callApi = async (config: AxiosRequestConfig) => {
    try {
      return await httpRequest(config);
    } catch (error) {
      console.log(error);
    }
  };

  return callApi;
};

export default useCallApi;
