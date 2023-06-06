import { localStorageService } from "@/services/localStorage.service";
import { type Nullable, type TimeStamp } from "@/types/default";
const REFRESH_DATA_TIME = 60 * 60 * 1000;

export function getClassesFromArray(classes: string[]): undefined | string {
   if (classes.length === 0) return undefined;
   return classes.join(" ");
}

export function isOutDated(lastFetch: Nullable<TimeStamp>): boolean {
   return lastFetch === null || lastFetch < new Date().getTime() - REFRESH_DATA_TIME;
}

export function getUserId(): string {
   const { localId } = localStorageService.getCredentials();
   if (!localId) throw "Unauthorized";
   return localId;
}
