import { useQuery, useMutation } from "@tanstack/react-query";
import { repositories } from "./repositories";
import { AxiosRequestConfig } from "axios";

interface ErrorResponse {
  response: { data: { message: string } };
}

const config = {};

export const useGetAPI = (params: string, query: string, headers: AxiosRequestConfig = config) => {
  return useQuery({ queryKey: [query], queryFn: () => repositories.getApi(params, headers), staleTime: Infinity });
};

export const usePostApi = (params: string, headers: AxiosRequestConfig = config) => {
  return useMutation({
    mutationFn: async (data: unknown) => {
      const res = await repositories.postApi(params, data, headers);
      return res.data;
    },
    onError(error: ErrorResponse) {
      if (error.response?.data) {
        return error;
      }
    },
  });
};

export const usePutApi = (params: string, headers: AxiosRequestConfig = config) => {
  return useMutation({
    mutationFn: async (data: unknown) => {
      const res = await repositories.putApi(params, data, headers);
      return res.data;
    },
    onError(error: ErrorResponse) {
      if (error.response?.data) {
        return error;
      }
    },
  });
};

export const useDeleteApi = (params: string, headers: AxiosRequestConfig = config) => {
  return useMutation({
    mutationFn: async () => {
      const res = await repositories.deleteApi(params, headers);
      return res.data;
    },
  });
};
