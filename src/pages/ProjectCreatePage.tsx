import { MediumModal } from "@/components/modals/MediumModal";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Heading } from "@/components/ui/Heading";
import { LightSpinner } from "@/components/ui/Spinner";
import { useLocationBackground } from "@/context/LocationBackgroundContext";
import { AuthRequire } from "@/hoc/AuthRequire";
import projectsActions from "@/store/projects/actions";
import { useAppDispatch } from "@/store/store";
import { type IProjectFormState } from "@/types/IProject";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";

interface ProjectCreatePageProps {}

export const ProjectCreatePageComponent: FC<ProjectCreatePageProps> = () => {
   const dispatch = useAppDispatch();

   const navigate = useNavigate();

   const [isLoadingCreateProject, setIsLoadingCreateProject] = useState(false);

   const locationBackground = useLocationBackground();

   const onSubmitHandler = async (data: IProjectFormState): Promise<void> => {
      setIsLoadingCreateProject(true);
      try {
         unwrapResult(await dispatch(projectsActions.createProject(data)));
         if (!locationBackground) {
            console.error("missed location background");
            navigate("/");
            return;
         }
         navigate(locationBackground);
      } finally {
         setIsLoadingCreateProject(false);
      }
   };

   return (
      <>
         {isLoadingCreateProject && <LightSpinner />}
         <MediumModal hidden={isLoadingCreateProject}>
            <Heading>Создание проекта</Heading>
            <ProjectForm buttonText="Создать проект" onSubmit={onSubmitHandler} />
         </MediumModal>
      </>
   );
};

export const ProjectCreatePage: FC<ProjectCreatePageProps> = (props) => (
   <AuthRequire>
      <ProjectCreatePageComponent {...props} />
   </AuthRequire>
);
