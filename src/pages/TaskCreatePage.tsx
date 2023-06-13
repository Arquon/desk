import { MediumModal } from "@/components/modals/MediumModal";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Heading } from "@/components/ui/Heading";
import { LightSpinner } from "@/components/ui/Spinner";
import { ModalProvider } from "@/providers/ModalProvider";
import { AuthRequire } from "@/hoc/AuthRequire";
import { EBasicTasksRoutePaths, type IRouteParams } from "@/router/router";
import { useAppDispatch } from "@/store/store";
import tasksActions from "@/store/tasks/actions";
import { type ITaskFormState } from "@/types/ITask";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState, type FC } from "react";
import { Navigate, generatePath, useNavigate, useParams } from "react-router-dom";
import { useProject } from "@/providers/ProjectProvider";
import { toastSuccess } from "@/utils/functions";

interface TaskCreatePageProps {}

export const TaskCreateComponent: FC<TaskCreatePageProps> = () => {
   const dispatch = useAppDispatch();
   const { isLoading, isError } = useProject();

   const navigate = useNavigate();
   const { projectId } = useParams<IRouteParams["taskCreate"]>();

   const [isLoadingCreateTask, setIsLoadingCreateTask] = useState(false);

   const onSubmitHandler = async (data: ITaskFormState): Promise<void> => {
      if (!projectId) return;
      setIsLoadingCreateTask(true);
      try {
         unwrapResult(await dispatch(tasksActions.createTask({ taskFormState: data, projectId })));
         const path = generatePath(EBasicTasksRoutePaths.projectTasks, {
            projectId: projectId ?? null,
         });
         toastSuccess("Задача добавлена");
         navigate(path);
      } finally {
         setIsLoadingCreateTask(false);
      }
   };

   const onBackgroundClickHandler = (): void => {
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
      <ModalProvider close={onBackgroundClickHandler}>
         {isLoadingCreateTask && <LightSpinner />}
         <MediumModal hidden={isLoadingCreateTask}>
            <Heading>Создание задачи</Heading>
            <TaskForm onSubmit={onSubmitHandler} buttonText="Добавить задачу" />
         </MediumModal>
      </ModalProvider>
   );
};

export const TaskCreatePage: FC<TaskCreatePageProps> = (props) => {
   return (
      <AuthRequire>
         <TaskCreateComponent {...props} />
      </AuthRequire>
   );
};
