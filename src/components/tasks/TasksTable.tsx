import { useAppDispatch, useAppSelector } from "@/store/store";
import tasksActions from "@/store/tasks/actions";
import { type ITask, type TFilteredTasks } from "@/types/ITask";
import { type Nullable } from "@/types/default";
import React, { useState, type FC } from "react";
import { ColumnTask } from "./TasksColumn";

interface TasksTableProps {}

export const TasksTable: FC<TasksTableProps> = () => {
   const { tasks } = useAppSelector((state) => state.tasks);
   const { statuses } = useAppSelector((state) => state.statuses);
   const dispatch = useAppDispatch();

   const taskStatusesToShow = [...statuses].sort((a, b) => a.order - b.order);

   const filteredTasks: TFilteredTasks = {};

   for (const status of statuses) {
      filteredTasks[status.order] = [];
   }

   for (const task of tasks) {
      filteredTasks[task.status].push(task);
   }

   for (const tasks of Object.values(filteredTasks)) {
      tasks.sort((a, b) => a.updatedAt - b.updatedAt);
   }

   const [currentTask, setCurrentTask] = useState<Nullable<ITask>>(null);

   const onDragStartHandler = (task: ITask): void => {
      setCurrentTask(task);
   };

   const onDropHandler = (newStatus: string): void => {
      if (!currentTask) return;
      dispatch(tasksActions.updateTask({ ...currentTask, status: +newStatus }));
      setCurrentTask(null);
   };

   return (
      <div className="tasks__row mb-3">
         <div className="row">
            {taskStatusesToShow.map((taskStatus) => (
               <div className="col" key={taskStatus.id}>
                  <p className="text-center">{taskStatus.title}</p>
               </div>
            ))}
         </div>
         <div className="row">
            {Object.entries(filteredTasks).map(([key, tasks]) => (
               <div className="col" key={key}>
                  <ColumnTask
                     tasks={tasks}
                     onDragStart={onDragStartHandler}
                     onDrop={() => onDropHandler(key)}
                     currentTaskStatus={currentTask?.status}
                     columnStatus={+key}
                  />
               </div>
            ))}
         </div>
      </div>
   );
};
