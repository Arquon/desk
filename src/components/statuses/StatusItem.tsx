import { type ITaskStatus } from "@/types/ITaskStatus";
import React, { type DragEvent, type FC } from "react";
import { StatusTextField } from "./StatusTextField";
import { MIN_STATUSES_COUNT } from "@/pages/StatusesPage";

interface StatusItemProps {
   status: ITaskStatus;
   statusCount: number;
   onDelete: () => void;
   onDragStart: () => void;
   onDrop: () => void;
   onChange: (status: Partial<ITaskStatus>) => void;
   updateStatus: () => Promise<void>;
}

export const StatusItem: FC<StatusItemProps> = ({ status, statusCount, onDragStart, onDelete, onDrop, onChange: onChangeHandler, updateStatus }) => {
   const onDragStartHandler = (event: DragEvent<HTMLDivElement>): void => {
      onDragStart();
   };

   const onDropHandler = (event: DragEvent<HTMLDivElement>): void => {
      onDrop();
   };

   const onDragOverHandler = (event: DragEvent<HTMLDivElement>): void => {
      event.preventDefault();
   };

   return (
      <div
         className="project__item status-card text-white me-2"
         onDragOver={onDragOverHandler}
         onDrop={onDropHandler}
         onDragStart={onDragStartHandler}
         draggable
      >
         <StatusTextField
            value={status.title}
            onDelete={onDelete}
            onChange={(title) => onChangeHandler({ title })}
            style={{ cursor: "grab" }}
            showDeleteButton={statusCount > MIN_STATUSES_COUNT}
            onBlur={updateStatus}
         />
      </div>
   );
};
