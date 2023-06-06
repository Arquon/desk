import { ELocalStorageKeys } from "@/types/ELocalStorageKeys";

export const localStorageService = {
   setCredentials: ({ idToken, refreshToken, expiresIn, localId }: { idToken: string; refreshToken: string; expiresIn: number; localId: string }) => {
      const expiresInTimestamp = String(Date.now() + expiresIn * 1000);
      localStorage.setItem(ELocalStorageKeys.ID_TOKEN, idToken);
      localStorage.setItem(ELocalStorageKeys.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(ELocalStorageKeys.EXPIRES_IN, expiresInTimestamp);
      localStorage.setItem(ELocalStorageKeys.LOCAL_ID, localId);
   },
   getCredentials: () => ({
      idToken: localStorage.getItem(ELocalStorageKeys.ID_TOKEN),
      refreshToken: localStorage.getItem(ELocalStorageKeys.REFRESH_TOKEN),
      expiresIn: localStorage.getItem(ELocalStorageKeys.EXPIRES_IN),
      localId: localStorage.getItem(ELocalStorageKeys.LOCAL_ID),
   }),
   removeCredentials: () => {
      localStorage.removeItem(ELocalStorageKeys.ID_TOKEN);
      localStorage.removeItem(ELocalStorageKeys.REFRESH_TOKEN);
      localStorage.removeItem(ELocalStorageKeys.EXPIRES_IN);
      localStorage.removeItem(ELocalStorageKeys.LOCAL_ID);
   },
};
