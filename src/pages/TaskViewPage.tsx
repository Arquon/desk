import { DeleteModal } from "@/components/modals/DeleteModal";
import { MediumModal } from "@/components/modals/MediumModal";
import { PortalModal } from "@/components/portal/PortalModal";
import { TaskForm } from "@/components/tasks/TaskForm";
import { AlternateButton } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { LightSpinner } from "@/components/ui/Spinner";
import { useLocationBackground } from "@/context/LocationBackgroundContext";
import { AuthRequire } from "@/hoc/AuthRequire";
import { type IRouteParams } from "@/router/router";
import { useAppDispatch, useAppSelector } from "@/store/store";
import tasksActions from "@/store/tasks/actions";
import { type ITaskFormState } from "@/types/ITask";
import { toastError } from "@/utils/functions";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState, type FC } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

interface TaskViewPageProps {}

export const TaskViewComponent: FC<TaskViewPageProps> = ({}) => {
   const dispatch = useAppDispatch();
   const { tasks, isLoadingTasks } = useAppSelector((state) => state.tasks);

   const { taskId } = useParams<IRouteParams["taskView"]>();
   const navigate = useNavigate();

   const locationBackground = useLocationBackground();

   const [isLoadingEditTask, setIsLoadingEditTask] = useState(false);
   const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
   const [isLoadingDeleteTask, setIsLoadingDeleteTask] = useState(false);

   const openEditModal = (): void => {
      setIsDeleteModalShow(true);
   };

   const onSubmitHandler = async (data: ITaskFormState): Promise<void> => {
      if (!currentTask) return;
      setIsLoadingEditTask(true);
      try {
         unwrapResult(await dispatch(tasksActions.updateTask({ ...currentTask, ...data })));
      } finally {
         setIsLoadingEditTask(false);
      }
   };

   const onDeleteHandler = async (): Promise<void> => {
      if (!currentTask) return;
      setIsLoadingDeleteTask(true);
      try {
         unwrapResult(await dispatch(tasksActions.deleteTask({ projectId: currentTask.projectId, taskId: currentTask.id })));
         if (!locationBackground) {
            console.error("missed location background");
            navigate("/");
            return;
         }
         navigate(locationBackground);
      } finally {
         setIsLoadingDeleteTask(false);
      }
   };

   const currentTask = tasks.find((task) => task.id === taskId);

   if (!currentTask || isLoadingTasks) {
      return <LightSpinner />;
   }

   if (!isLoadingTasks && !currentTask) {
      toastError("Не найдена задача с указаным id");

      if (!locationBackground) {
         console.error("missed location background");
         navigate("/");
         return <Navigate to="/" />;
      }
      return <Navigate to={locationBackground} />;
   }

   return (
      <>
         {isLoadingEditTask && <LightSpinner />}

         {isDeleteModalShow && (
            <PortalModal onBackgroundClick={() => setIsDeleteModalShow(false)}>
               {isLoadingDeleteTask ? <LightSpinner /> : <DeleteModal text="Вы уверены, что хотите удалить задачу" onDelete={onDeleteHandler} />}
            </PortalModal>
         )}

         <MediumModal hidden={isLoadingEditTask}>
            <div className="d-flex flex-wrap justify-content-between">
               <Heading>Просмотр задачи</Heading>
               <div>
                  <AlternateButton onClick={openEditModal}>Удалить задачу</AlternateButton>
               </div>
            </div>
            <TaskForm onSubmit={onSubmitHandler} initialData={currentTask} buttonText="Обновить задачу" />
         </MediumModal>
      </>
   );
};

export const TaskViewPage: FC<TaskViewPageProps> = (props) => (
   <AuthRequire>
      <TaskViewComponent {...props} />
   </AuthRequire>
);
