import { ProjectForm } from "@/components/projects/ProjectForm";
import { Heading } from "@/components/ui/Heading";
import { useLocationBackground } from "@/context/LocationBackgroundContext";
import projectsActions from "@/store/projects/actions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { type IProjectFormState } from "@/types/IProject";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { type FC } from "react";
import { useNavigate } from "react-router-dom";

interface ProjectCreatePageProps {}

export const ProjectCreatePage: FC<ProjectCreatePageProps> = () => {
   const navigate = useNavigate();
   const locationBackground = useLocationBackground();
   const dispatch = useAppDispatch();
   const { user } = useAppSelector((state) => state.user);

   const onSubmitHandler = async (data: IProjectFormState): Promise<void> => {
      if (!user) throw "Unauthorized";
      unwrapResult(await dispatch(projectsActions.createProject({ ...data, userId: user.id })));
      if (!locationBackground) {
         console.error("missed location background");
         navigate("/");
         return;
      }
      navigate(locationBackground);
   };

   return (
      <div className="container p-4 ">
         <div className="bg-white rounded shadow p-4 col-md-8 offset-md-2">
            <Heading>Создание проекта</Heading>
            <ProjectForm buttonChildren="Создать проект" onSubmit={onSubmitHandler} />
         </div>
      </div>
   );
};
