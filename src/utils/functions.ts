import { type AppGetState } from "@/store/store";
import { type Nullable, type TimeStamp } from "@/types/default";
const REFRESH_DATA_TIME = 60 * 60 * 1000;

export function getClassesFromArray(classes: string[]): undefined | string {
   if (classes.length === 0) return undefined;
   return classes.join(" ");
}

export function isOutDated(lastFetch: Nullable<TimeStamp>): boolean {
   return lastFetch === null || lastFetch < new Date().getTime() - REFRESH_DATA_TIME;
}

export function getUserId(getState: AppGetState): string {
   const { user } = getState().user;
   if (!user) throw "Unauthorized";
   return user.id;
}
