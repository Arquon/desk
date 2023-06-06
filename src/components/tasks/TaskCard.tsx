import React, { useRef, type FC } from "react";
import { Link } from "react-router-dom";

interface CardTaskProps {
   id: string;
   description: string;
   onDragStart: () => void;
}

export const CardTask: FC<CardTaskProps> = ({ id, description, onDragStart }) => {
   const cardRef = useRef<HTMLDivElement>(null);

   const onDragStartHandler = (event: React.DragEvent<HTMLAnchorElement>): void => {
      console.log({ description, id });
      onDragStart();
   };

   return (
      <Link to={`/task/${id}`} onDragStart={onDragStartHandler} className="tasks__item">
         <div className="card" draggable ref={cardRef}>
            <div className="card__content">{description}</div>
         </div>
      </Link>
   );
};
