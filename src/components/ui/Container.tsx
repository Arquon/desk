import React, { type FC, type PropsWithChildren } from "react";

interface ContainerProps extends PropsWithChildren {}

export const Container: FC<ContainerProps> = ({ children }) => {
   return <div className="container-lg">{children}</div>;
};
