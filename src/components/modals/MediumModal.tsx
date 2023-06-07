import React, { type PropsWithChildren, type FC } from "react";

interface MediumModalProps extends PropsWithChildren {}

export const MediumModal: FC<MediumModalProps> = ({ children }) => {
   return (
      <div className="container p-4">
         <div className="bg-white rounded shadow p-4 col-md-8 offset-md-2">{children}</div>
      </div>
   );
};
