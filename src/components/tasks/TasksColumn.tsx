import { type ITask } from "@/types/ITask";
import React, { useRef, type FC, useState } from "react";
import { TaskCard } from "./TaskCard";

interface ColumnTasksAlwaysProps {
   tasks: ITask[];
}

interface ColumnTaskPropsNonDraggable extends ColumnTasksAlwaysProps {
   onDragStart?: never;
   onDrop?: never;
   currentTaskStatusId?: never;
   columnStatusId?: never;
   draggable?: never;
}
interface ColumnTaskPropsDraggable extends ColumnTasksAlwaysProps {
   onDragStart: (task: ITask) => void;
   onDrop: () => Promise<void>;
   currentTaskStatusId: string | undefined;
   columnStatusId: string;
   draggable: true;
}

type ColumnTaskProps = ColumnTaskPropsNonDraggable | ColumnTaskPropsDraggable;

export const ColumnTask: FC<ColumnTaskProps> = ({ tasks, onDragStart, onDrop, currentTaskStatusId, columnStatusId, draggable }) => {
   const columnRef = useRef<HTMLDivElement>(null);
   const [isFantomDiv, setIsFantomDiv] = useState(false);

   const onDragOverHandler = (event: React.DragEvent<HTMLDivElement>): void => {
      if (!columnRef.current || !draggable) return;
      event.preventDefault();
      columnRef.current.classList.add("project__column_over");
      if (currentTaskStatusId !== columnStatusId) setIsFantomDiv(true);
   };

   const onDragEndHandler = (event: React.DragEvent<HTMLDivElement>): void => {
      if (!columnRef.current || !draggable) return;
      event.preventDefault();
      columnRef.current.classList.remove("project__column_over");
      setIsFantomDiv(false);
   };

   const onDragLeaveHandler = onDragEndHandler;

   const onDropHandler = async (event: React.DragEvent<HTMLDivElement>): Promise<void> => {
      if (!columnRef.current || !draggable) return;
      event.preventDefault();
      columnRef.current.classList.remove("project__column_over");
      if (currentTaskStatusId !== columnStatusId) await onDrop();
      setIsFantomDiv(false);
   };

   const onDragStartHandler = (task: ITask): void => {
      if (!draggable) return;
      onDragStart(task);
   };

   return (
      <div
         className="project__column"
         onDragEnd={onDragEndHandler}
         onDragLeave={onDragLeaveHandler}
         onDragOver={onDragOverHandler}
         onDrop={onDropHandler}
         ref={columnRef}
      >
         {tasks.map((task) => (
            <TaskCard key={task.id} {...task} onDragStart={() => onDragStartHandler(task)} draggable={draggable} />
         ))}
         {isFantomDiv && <div className="project__item project__item_fantom"></div>}
      </div>
   );
};
