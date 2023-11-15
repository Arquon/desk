import { MediumModal } from "@/components/modals/MediumModal";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Heading } from "@/components/ui/Heading";
import { LightSpinner } from "@/components/ui/Spinner";
import { ModalProvider } from "@/providers/ModalProvider";
import { AuthRequire } from "@/hoc/AuthRequire";
import { EProjectsBasicRoutePaths, ETasksBasicRoutePaths, type IRouteParams } from "@/router/router";
import { useAppDispatch } from "@/store/store";
import tasksActions from "@/store/tasks/actions";
import { type ITaskFormState } from "@/types/ITask";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState, type FC } from "react";
import { Navigate, generatePath, useNavigate, useParams } from "react-router-dom";
import { useProject } from "@/providers/ProjectProvider";
import { toastSuccess } from "@/utils/functions";

interface TaskCreatePageProps {
   projectId: string;
}

export const TaskCreateComponent: FC<TaskCreatePageProps> = ({ projectId }) => {
   const dispatch = useAppDispatch();
   const { isLoading, isError } = useProject();

   const navigate = useNavigate();

   const [isLoadingCreateTask, setIsLoadingCreateTask] = useState(false);

   const onSubmitHandler = async (data: ITaskFormState): Promise<void> => {
      setIsLoadingCreateTask(true);
      try {
         unwrapResult(await dispatch(tasksActions.createTask({ taskFormState: data, projectId })));
         const path = generatePath(ETasksBasicRoutePaths.projectTasks, {
            projectId,
         });
         toastSuccess("Задача добавлена");
         navigate(path);
      } finally {
         setIsLoadingCreateTask(false);
      }
   };

   const onBackgroundClickHandler = (): void => {
      const path = generatePath(ETasksBasicRoutePaths.projectTasks, {
         projectId,
      });
      navigate(path);
   };

   if (isError) {
      const path = generatePath(ETasksBasicRoutePaths.projectTasks, {
         projectId,
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
         <MediumModal>
            <Heading>Создание задачи</Heading>
            <TaskForm onSubmit={onSubmitHandler} buttonText="Добавить задачу" />
         </MediumModal>
         {isLoadingCreateTask && (
            <ModalProvider>
               <LightSpinner />
            </ModalProvider>
         )}
      </ModalProvider>
   );
};

export const TaskCreatePage: FC = () => {
   const { projectId } = useParams<IRouteParams["projectView"]>();
   if (!projectId) return <Navigate to={EProjectsBasicRoutePaths.allProjects} />;

   return (
      <AuthRequire>
         <TaskCreateComponent projectId={projectId} />
      </AuthRequire>
   );
};
