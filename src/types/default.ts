import { type PropsWithChildren } from "react";

export type Nullable<T> = null | T;
export type DeepPartial<T> = T extends object
   ? {
        [P in keyof T]?: DeepPartial<T[P]>;
     }
   : T;
export type PartialRecord<K extends keyof any, T> = {
   [P in K]?: T;
};

export type TimeStamp = number;

export type PropsWithChildrenWithClassName<T = unknown> = PropsWithChildren<T> & {
   className?: string;
};
