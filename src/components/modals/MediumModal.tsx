import React, { type PropsWithChildren, type FC } from "react";

interface MediumModalProps extends PropsWithChildren {
   hidden?: boolean;
}

export const MediumModal: FC<MediumModalProps> = ({ children, hidden = false }) => {
   return (
      <div className="container-lg p-4" hidden={hidden}>
         <div className="bg-white rounded shadow p-4 col-md-8 offset-md-2">{children}</div>
      </div>
   );
};
