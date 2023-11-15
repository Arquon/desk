import { useEffect } from "react";

export function useFetchAbortEffect(cb: (signal: AbortSignal) => any, deps: any[]): void {
   useEffect(() => {
      const controller = new AbortController();
      cb(controller.signal);

      return () => {
         controller.abort();
      };
   }, deps);
}
