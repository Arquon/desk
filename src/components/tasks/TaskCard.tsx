import React, { useRef, type FC } from "react";
import { Link } from "react-router-dom";

interface TaskCardProps {
   id: string;
   title: string;
   onDragStart: () => void;
}

export const TaskCard: FC<TaskCardProps> = ({ id, title, onDragStart }) => {
   const cardRef = useRef<HTMLDivElement>(null);

   const onDragStartHandler = (event: React.DragEvent<HTMLAnchorElement>): void => {
      onDragStart();
   };

   return (
      <Link to={id} onDragStart={onDragStartHandler} className="tasks__item">
         <div className="task-card" draggable ref={cardRef}>
            <div className="task-card__content">{title}</div>
         </div>
      </Link>
   );
};
