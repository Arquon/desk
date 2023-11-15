import { DeleteModal } from "@/components/modals/DeleteModal";
import { MediumModal } from "@/components/modals/MediumModal";
import { TaskForm } from "@/components/tasks/TaskForm";
import { AlternateButton } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { LightSpinner } from "@/components/ui/Spinner";
import { ModalProvider } from "@/providers/ModalProvider";
import { AuthRequire } from "@/hoc/AuthRequire";
import { EProjectsBasicRoutePaths, type IRouteParams } from "@/router/router";
import { useAppDispatch, useAppSelector } from "@/store/store";
import tasksActions from "@/store/tasks/actions";
import { type ITask, type ITaskFormState } from "@/types/ITask";
import { getFormattedDateFromTimeStamp, toastError, toastSuccess } from "@/utils/functions";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState, type FC, useEffect } from "react";
import { Navigate, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useProject } from "@/providers/ProjectProvider";
import { type Nullable } from "@/types/default";

interface TaskViewPageProps {
   taskId: string;
}

export enum ETaskViewPages {
   history = "history",
   tasks = "tasks",
}

interface ITaskViewOutletContext {
   currentPage: ETaskViewPages;
}

export const TaskViewComponent: FC<TaskViewPageProps> = ({ taskId }) => {
   const dispatch = useAppDispatch();
   const { tasks } = useAppSelector((state) => state.tasks);
   const { isLoading, isError } = useProject();

   const navigate = useNavigate();
   const { currentPage } = useOutletContext<ITaskViewOutletContext>();

   const isTasksPage = currentPage === ETaskViewPages.tasks;
   const isHistoryPagePage = currentPage === ETaskViewPages.history;

   const [isLoadingEditTask, setIsLoadingEditTask] = useState(false);
   const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
   const [isLoadingDeleteTask, setIsLoadingDeleteTask] = useState(false);
   const [currentTask, setCurrentTask] = useState<Nullable<ITask>>(null);

   const navigateToParentRoute = (): void => {
      navigate("../");
   };

   const openDeleteModal = (): void => {
      setIsDeleteModalShow(true);
   };

   const onUpdateHandler = async (data: ITaskFormState): Promise<void> => {
      if (!currentTask) return;
      setIsLoadingEditTask(true);
      try {
         unwrapResult(await dispatch(tasksActions.updateTask({ currentTask, updatedTaskFields: data })));
         toastSuccess("Задача обновлена");
      } finally {
         setIsLoadingEditTask(false);
      }
   };

   const onDeleteHandler = async (): Promise<void> => {
      if (!currentTask) return;
      setIsLoadingDeleteTask(true);
      try {
         await dispatch(tasksActions.deleteTask({ projectId: currentTask.projectId, taskId: currentTask.id }));
         toastSuccess("Задача удалена");
         navigateToParentRoute();
      } finally {
         setIsLoadingDeleteTask(false);
      }
   };

   const onHistoryHandler = async (inHistory: boolean): Promise<void> => {
      if (!currentTask) return;
      setIsLoadingEditTask(true);
      try {
         unwrapResult(await dispatch(tasksActions.updateTask({ currentTask, updatedTaskFields: { inHistory } })));
         navigateToParentRoute();
      } catch (error) {
         toastError(error);
      } finally {
         setIsLoadingEditTask(false);
      }
   };

   const onHistoryPushHandler = async (): Promise<void> => {
      await onHistoryHandler(true);
      toastSuccess("Задача помещена в историю");
   };

   const onHistoryReturnHandler = async (): Promise<void> => {
      await onHistoryHandler(false);
      toastSuccess("Задача возвращена из истории");
   };

   const onSubmitHandler = async (data: ITaskFormState): Promise<void> => {
      if (isTasksPage) onUpdateHandler(data);
      else onHistoryReturnHandler();
   };

   useEffect(() => {
      if (!isLoading && !isError) {
         const searchedTask = tasks.find((task) => task.id === taskId);
         if (!searchedTask) {
            toastError("Задача не найдена");
            navigateToParentRoute();
            return;
         }
         setCurrentTask(searchedTask);
      }
   }, [isLoading]);

   if (isError) return <Navigate to={"../"} />;
   if (isLoading || !currentTask)
      return (
         <ModalProvider>
            <LightSpinner />
         </ModalProvider>
      );

   return (
      <ModalProvider close={navigateToParentRoute}>
         {isLoadingEditTask && <LightSpinner />}

         {isDeleteModalShow && (
            <ModalProvider close={() => setIsDeleteModalShow(false)}>
               {isLoadingDeleteTask ? <LightSpinner /> : <DeleteModal text="Вы уверены, что хотите удалить задачу" onDelete={onDeleteHandler} />}
            </ModalProvider>
         )}

         {currentTask && (
            <MediumModal hidden={isLoadingEditTask}>
               <div className="d-flex flex-wrap justify-content-between mb-1">
                  <div className="d-flex align-items-end flex-wrap">
                     <Heading className="mb-1 me-3">Просмотр задачи</Heading>
                     <span className="fs-6 me-3 d-inline-block mb-1 ">
                        последнее изменение статуса {getFormattedDateFromTimeStamp(currentTask.statusUpdatedAt)}
                     </span>
                  </div>
                  <div className="d-flex">
                     {isTasksPage && (
                        <AlternateButton onClick={onHistoryPushHandler} className="mb-1 me-1">
                           Убрать в историю
                        </AlternateButton>
                     )}
                     <AlternateButton onClick={openDeleteModal} className="mb-1">
                        Удалить задачу
                     </AlternateButton>
                  </div>
               </div>
               <TaskForm
                  onSubmit={onSubmitHandler}
                  initialData={currentTask}
                  buttonText={isTasksPage ? "Обновить задачу" : "Вернуть задачу"}
                  readOnly={isHistoryPagePage}
               />
            </MediumModal>
         )}
      </ModalProvider>
   );
};

export const TaskViewPage: FC = () => {
   const { taskId, projectId } = useParams<IRouteParams["taskView"]>();

   if (!projectId) return <Navigate to={EProjectsBasicRoutePaths.allProjects} />;
   if (!taskId) return <Navigate to={"../"} />;

   return (
      <AuthRequire>
         <TaskViewComponent taskId={taskId} />
      </AuthRequire>
   );
};
