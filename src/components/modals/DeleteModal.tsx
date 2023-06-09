import React, { type FC } from "react";
import { Button } from "../ui/Button";
import { toastError } from "@/utils/functions";

interface DeleteModalProps {
   text: string;
   onDelete: () => Promise<void>;
}

export const DeleteModal: FC<DeleteModalProps> = ({ text, onDelete }) => {
   const onDeleteHandler = async (): Promise<void> => {
      try {
         await onDelete();
      } catch (error) {
         toastError(error);
      }
   };

   return (
      <div className="container-sm">
         <div className="row">
            <div className="col-4 bg-white rounded offset-md-4 shadow py-4 px-2">
               <p className="text-center fs-5">{text}</p>
               <div className="row">
                  <div className="col-6 offset-md-3">
                     <Button onClick={onDeleteHandler} type="button">
                        Удалить
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
