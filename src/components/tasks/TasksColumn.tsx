import { type ITask } from "@/types/ITask";
import React, { useRef, type FC, useState } from "react";
import { TaskCard } from "./TaskCard";

interface ColumnTaskProps {
   onDragStart: (task: ITask) => void;
   onDrop: () => void;
   tasks: ITask[];
   currentTaskStatus: number | undefined;
   columnStatus: number;
}

export const ColumnTask: FC<ColumnTaskProps> = ({ tasks, onDragStart, onDrop, currentTaskStatus, columnStatus }) => {
   const columnRef = useRef<HTMLDivElement>(null);
   const [isFantomDiv, setIsFantomDiv] = useState(false);

   const onDragOverHandler = (event: React.DragEvent<HTMLDivElement>): void => {
      event.preventDefault();
      if (!columnRef.current) return;
      columnRef.current.classList.add("tasks__column_over");
      if (currentTaskStatus !== columnStatus) setIsFantomDiv(true);
   };

   const onDragEndHandler = (event: React.DragEvent<HTMLDivElement>): void => {
      if (!columnRef.current) return;
      columnRef.current.classList.remove("tasks__column_over");
      setIsFantomDiv(false);
   };

   const onDragLeaveHandler = onDragEndHandler;

   const onDropHandler = (event: React.DragEvent<HTMLDivElement>): void => {
      event.preventDefault();
      if (!columnRef.current) return;
      columnRef.current.classList.remove("tasks__column_over");
      if (currentTaskStatus !== columnStatus) onDrop();
      setIsFantomDiv(false);
   };

   return (
      <div
         className="tasks__column"
         onDragEnd={onDragEndHandler}
         onDragLeave={onDragLeaveHandler}
         onDragOver={onDragOverHandler}
         onDrop={onDropHandler}
         ref={columnRef}
      >
         {tasks.map((task) => (
            <TaskCard key={task.id} {...task} onDragStart={() => onDragStart(task)} />
         ))}
         {isFantomDiv && <div className="tasks__item tasks__item_fantom"></div>}
      </div>
   );
};
