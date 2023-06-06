import { type ReactNode } from "react";

export interface ICommonProps {
   children: ReactNode;
}

export interface ICommonPropsWithClassName extends ICommonProps {
   className?: string;
}
