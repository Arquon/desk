import { type AppGetState } from "@/store/store";
import { type Nullable, type TimeStamp } from "@/types/default";
import { toast } from "react-toastify";
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

export async function delay(ms: number): Promise<void> {
   return await new Promise((resolve, reject) => {
      setTimeout(() => {
         resolve();
      }, ms);
   });
}

export function networkErrorHandlerToast(error: unknown): void {
   if (typeof error === "string") {
      toast.error(error, { autoClose: 5000 });
   }
}
