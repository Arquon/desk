import React, { type FC } from "react";
import { Button } from "../ui/Button";

interface DeleteModalProps {
   text: string;
   onDelete: () => void;
}

export const DeleteModal: FC<DeleteModalProps> = ({ text, onDelete }) => {
   return (
      <div className="container-sm">
         <div className="row">
            <div className="col-4 bg-white rounded offset-md-4 shadow py-4 px-2">
               <p className="text-center fs-5">{text}</p>
               <div className="row">
                  <div className="col-6 offset-md-3">
                     <Button onClick={onDelete} type="button">
                        Удалить
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
