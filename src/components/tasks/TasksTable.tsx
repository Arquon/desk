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

   const allTasks: TFilteredTasks[] = [];

   statuses.forEach((status, index) => {
      allTasks[index] = {
         id: status.id,
         order: status.order,
         tasks: [],
      };
   });

   allTasks.sort((a, b) => a.order - b.order);

   for (const task of tasks) {
      if (task.inHistory) continue;
      const tasksObject = allTasks.find((filteredTasksObject) => task.statusId === filteredTasksObject.id);
      if (tasksObject) {
         tasksObject.tasks.push(task);
      } else {
         allTasks[0]?.tasks.push(task);
      }
   }

   for (const tasksObject of allTasks) {
      tasksObject.tasks.sort((a, b) => {
         if (!a.statusUpdatedAt) {
            return -1;
         } else if (!b.statusUpdatedAt) {
            return 1;
         }

         return a.statusUpdatedAt - b.statusUpdatedAt;
      });
   }

   const [currentTask, setCurrentTask] = useState<Nullable<ITask>>(null);
   const [isLoadingUpdateTaskStatus, setIsLoadingUpdateTaskStatus] = useState(false);

   const onDragStartHandler = (task: ITask): void => {
      setCurrentTask(task);
   };

   const onDropHandler = async (newStatusId: string): Promise<void> => {
      if (!currentTask) return;
      setIsLoadingUpdateTaskStatus(true);
      try {
         unwrapResult(await dispatch(tasksActions.updateTask({ currentTask, updatedTaskFields: { statusId: newStatusId } })));
         setCurrentTask(null);
      } catch (error) {
         toastError(error);
      } finally {
         setIsLoadingUpdateTaskStatus(false);
      }
   };

   return (
      <>
         <div className="project__wrap">
            <div className="project__table">
               <div style={{ minWidth: 1000 }}>
                  <div className="project__row">
                     {taskStatusesToShow.map((taskStatus) => (
                        <div className="project__heading" key={taskStatus.id}>
                           <p className="text-center">
                              {taskStatus.title} - {taskStatus.order + 1}
                           </p>
                        </div>
                     ))}
                  </div>
                  <div className="project__row">
                     {allTasks.map((tasksObject, index) => (
                        <ColumnTask
                           key={tasksObject.id}
                           tasks={tasksObject.tasks}
                           onDragStart={onDragStartHandler}
                           onDrop={async () => await onDropHandler(tasksObject.id)}
                           currentTaskStatusId={currentTask?.statusId}
                           columnStatusId={tasksObject.id}
                           draggable
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
