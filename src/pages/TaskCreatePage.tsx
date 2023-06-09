import { MediumModal } from "@/components/modals/MediumModal";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Heading } from "@/components/ui/Heading";
import { LightSpinner } from "@/components/ui/Spinner";
import { useLocationBackground } from "@/context/LocationBackgroundContext";
import { AuthRequire } from "@/hoc/AuthRequire";
import { type IRouteParams } from "@/router/router";
import { useAppDispatch } from "@/store/store";
import tasksActions from "@/store/tasks/actions";
import { type ITaskFormState } from "@/types/ITask";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface TaskCreatePageProps {}

export const TaskCreateComponent: FC<TaskCreatePageProps> = () => {
   const dispatch = useAppDispatch();

   const navigate = useNavigate();
   const { projectId } = useParams<IRouteParams["taskCreate"]>();

   const [isLoadingCreateTask, setIsLoadingCreateTask] = useState(false);

   const locationBackground = useLocationBackground();

   const onSubmitHandler = async (data: ITaskFormState): Promise<void> => {
      if (!projectId) return;
      setIsLoadingCreateTask(true);
      try {
         unwrapResult(await dispatch(tasksActions.createTask({ taskFormState: data, projectId })));
         if (!locationBackground) {
            console.error("missed location background");
            navigate("/");
            return;
         }
         navigate(locationBackground);
      } finally {
         setIsLoadingCreateTask(false);
      }
   };

   return (
      <>
         {isLoadingCreateTask && <LightSpinner />}
         <MediumModal hidden={isLoadingCreateTask}>
            <Heading>Создание задачи</Heading>
            <TaskForm onSubmit={onSubmitHandler} buttonText="Добавить задачу" />
         </MediumModal>
      </>
   );
};

export const TaskCreatePage: FC<TaskCreatePageProps> = (props) => {
   return (
      <AuthRequire>
         <TaskCreateComponent {...props} />
      </AuthRequire>
   );
};
