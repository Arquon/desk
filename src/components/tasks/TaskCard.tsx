import { type ITask } from "@/types/ITask";
import { getFormattedDateFromTimeStamp } from "@/utils/functions";
import React, { useRef, type FC } from "react";
import { Link } from "react-router-dom";

interface TaskCardProps extends ITask {
   onDragStart: () => void;
}

export const TaskCard: FC<TaskCardProps> = ({ id, title, isImportant, startAt, endAt, onDragStart }) => {
   const cardRef = useRef<HTMLAnchorElement>(null);

   const onDragStartHandler = (event: React.DragEvent<HTMLAnchorElement>): void => {
      onDragStart();
   };

   const onDragEndHandler = (event: React.DragEvent<HTMLAnchorElement>): void => {
      // if (cardRef.current) {
      //    cardRef.current.classList.toggle("test");
      // }
   };

   const isDateBlockShow = !!startAt || !!endAt;

   return (
      <Link to={id} onDragStart={onDragStartHandler} onDragEnd={onDragEndHandler} className="tasks__item" draggable ref={cardRef}>
         <div className="task-card">
            <div className="d-flex justify-content-between task-card__content">
               <div className="me-3 d-flex align-items-center">{title}</div>
               {isImportant && <div className="rounded text-danger fs-4">!</div>}
            </div>
            {isDateBlockShow && (
               <div className="d-flex justify-content-between">
                  <div className="text-secondary">{getFormattedDateFromTimeStamp(startAt)}</div>
                  <div className="text-dark">{getFormattedDateFromTimeStamp(endAt)}</div>
               </div>
            )}
         </div>
      </Link>
   );
};
