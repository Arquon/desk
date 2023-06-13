import { useAppDispatch, useAppSelector } from "@/store/store";
import tasksActions from "@/store/tasks/actions";
import { type ITask, type TFilteredTasks } from "@/types/ITask";
import { type Nullable } from "@/types/default";
import React, { useState, type FC } from "react";
import { ColumnTask } from "./TasksColumn";
import { PortalModal } from "../portal/PortalModal";
import { LightSpinner } from "../ui/Spinner";
import { toastError } from "@/utils/functions";
import { unwrapResult } from "@reduxjs/toolkit";

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
   const [isLoadingUpdateTaskStatus, setIsLoadingUpdateTaskStatus] = useState(false);

   const onDragStartHandler = (task: ITask): void => {
      setCurrentTask(task);
   };

   const onDropHandler = async (newStatus: string): Promise<void> => {
      if (!currentTask) return;
      setIsLoadingUpdateTaskStatus(true);
      try {
         unwrapResult(await dispatch(tasksActions.updateTask({ ...currentTask, status: +newStatus })));
         setCurrentTask(null);
      } catch (error) {
         toastError(error);
      } finally {
         setIsLoadingUpdateTaskStatus(false);
      }
   };

   return (
      <>
         <div className="tasks__table mb-3">
            <div style={{ overflow: "auto" }}>
               <div style={{ minWidth: 1000 }}>
                  <div className="tasks__row">
                     {taskStatusesToShow.map((taskStatus) => (
                        <div className="tasks__heading" key={taskStatus.id}>
                           <p className="text-center">{taskStatus.title}</p>
                        </div>
                     ))}
                  </div>
                  <div className="tasks__row">
                     {Object.entries(filteredTasks).map(([key, tasks]) => (
                        <ColumnTask
                           key={key}
                           tasks={tasks}
                           onDragStart={onDragStartHandler}
                           onDrop={async () => await onDropHandler(key)}
                           currentTaskStatus={currentTask?.status}
                           columnStatus={+key}
                        />
                     ))}
                  </div>
               </div>
            </div>
         </div>
         {isLoadingUpdateTaskStatus && (
            <PortalModal>
               <LightSpinner />
            </PortalModal>
         )}
      </>
   );
};
