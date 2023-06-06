import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import configFile from "@@/config/config.json";
import { localStorageService } from "./localStorage.service";
import { authService } from "./auth.service";

function fireBaseDataParse(response: AxiosResponse<any, any>): any {
   const { data } = response;
   if (data === null) {
      throw new AxiosError("CustomError", "NOT_FOUND", undefined, undefined, {
         status: 404,
         statusText: "Not Found",
         headers: undefined as unknown as any,
         config: undefined as unknown as any,
         data: {},
      });
   }
   if (data && !data.id) {
      return Object.values(response.data).map((value) => value);
   }
   return data;
}

const httpService = axios.create({
   baseURL: configFile.baseURL,
});

httpService.interceptors.request.use(async function (config): Promise<InternalAxiosRequestConfig<any>> {
   if (configFile.isFireBase) {
      if (config.url === undefined) return config;
      const containSlash = /\/$/gi.test(config.url);

      if (containSlash) {
         config.url = config.url.slice(0, -1) + ".json";
      }

      const { expiresIn, refreshToken } = localStorageService.getCredentials();

      if (refreshToken && Number(expiresIn) < Date.now()) {
         const data = await authService.refreshToken(refreshToken);
         localStorageService.setCredentials(data);
      }

      const { idToken } = localStorageService.getCredentials();
      if (idToken) {
         config.params = { ...config.params, auth: idToken };
      }
   }

   return config;
});

httpService.interceptors.response.use(function (response): AxiosResponse<any, any> {
   if (configFile.isFireBase) {
      return { ...response, data: fireBaseDataParse(response) };
   }

   return response;
});

export default httpService;
