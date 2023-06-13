import { DeleteModal } from "@/components/modals/DeleteModal";
import { MediumModal } from "@/components/modals/MediumModal";
import { TaskForm } from "@/components/tasks/TaskForm";
import { AlternateButton } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { LightSpinner } from "@/components/ui/Spinner";
import { ModalProvider } from "@/providers/ModalProvider";
import { AuthRequire } from "@/hoc/AuthRequire";
import { EBasicTasksRoutePaths, type IRouteParams } from "@/router/router";
import { useAppDispatch, useAppSelector } from "@/store/store";
import tasksActions from "@/store/tasks/actions";
import { type ITask, type ITaskFormState } from "@/types/ITask";
import { toastError, toastSuccess } from "@/utils/functions";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState, type FC, useEffect } from "react";
import { Navigate, generatePath, useNavigate, useParams } from "react-router-dom";
import { useProject } from "@/providers/ProjectProvider";
import { type Nullable } from "@/types/default";

interface TaskViewPageProps {}

export const TaskViewComponent: FC<TaskViewPageProps> = ({}) => {
   const dispatch = useAppDispatch();
   const { tasks } = useAppSelector((state) => state.tasks);
   const { isLoading, isError } = useProject();

   const { taskId, projectId } = useParams<IRouteParams["taskView"]>();
   const navigate = useNavigate();

   const [isLoadingEditTask, setIsLoadingEditTask] = useState(false);
   const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
   const [isLoadingDeleteTask, setIsLoadingDeleteTask] = useState(false);
   const [currentTask, setCurrentTask] = useState<Nullable<ITask>>(null);

   const openEditModal = (): void => {
      setIsDeleteModalShow(true);
   };

   const onSubmitHandler = async (data: ITaskFormState): Promise<void> => {
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
         navigateToProjectPage();
      } finally {
         setIsLoadingDeleteTask(false);
      }
   };

   useEffect(() => {
      if (!isLoading && !isError) {
         const searchedTask = tasks.find((task) => task.id === taskId);
         if (!searchedTask) {
            toastError("Задача не найдена");
            navigateToProjectPage();
            return;
         }
         setCurrentTask(searchedTask);
      }
   }, [isLoading]);

   const navigateToProjectPage = (): void => {
      const path = generatePath(EBasicTasksRoutePaths.projectTasks, {
         projectId: projectId ?? null,
      });
      navigate(path);
   };

   if (isError) {
      const path = generatePath(EBasicTasksRoutePaths.projectTasks, {
         projectId: projectId ?? null,
      });
      return <Navigate to={path} />;
   }

   if (isLoading) {
      return (
         <ModalProvider>
            <LightSpinner />
         </ModalProvider>
      );
   }

   return (
      <ModalProvider close={navigateToProjectPage}>
         {isLoadingEditTask && <LightSpinner />}

         {isDeleteModalShow && (
            <ModalProvider close={() => setIsDeleteModalShow(false)}>
               {isLoadingDeleteTask ? <LightSpinner /> : <DeleteModal text="Вы уверены, что хотите удалить задачу" onDelete={onDeleteHandler} />}
            </ModalProvider>
         )}

         {currentTask && (
            <MediumModal hidden={isLoadingEditTask}>
               <div className="d-flex flex-wrap justify-content-between">
                  <Heading>Просмотр задачи</Heading>
                  <div>
                     <AlternateButton onClick={openEditModal}>Удалить задачу</AlternateButton>
                  </div>
               </div>
               <TaskForm onSubmit={onSubmitHandler} initialData={currentTask} buttonText="Обновить задачу" />
            </MediumModal>
         )}
      </ModalProvider>
   );
};

export const TaskViewPage: FC<TaskViewPageProps> = (props) => (
   <AuthRequire>
      <TaskViewComponent {...props} />
   </AuthRequire>
);
