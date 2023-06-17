import { MediumModal } from "@/components/modals/MediumModal";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Heading } from "@/components/ui/Heading";
import { LightSpinner } from "@/components/ui/Spinner";
import { ModalProvider } from "@/providers/ModalProvider";
import { AuthRequire } from "@/hoc/AuthRequire";
import { EProjectsBasicRoutePaths } from "@/router/router";
import projectsActions from "@/store/projects/actions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { type IProjectFormState } from "@/types/IProject";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState, type FC } from "react";
import { Navigate, generatePath, useNavigate } from "react-router-dom";
import { toastSuccess } from "@/utils/functions";

interface ProjectCreatePageProps {}

export const ProjectCreatePageComponent: FC<ProjectCreatePageProps> = () => {
   const dispatch = useAppDispatch();
   const { isErrorProjects, isLoadingProjects } = useAppSelector((state) => state.projects);

   const navigate = useNavigate();

   const [isLoadingCreateProject, setIsLoadingCreateProject] = useState(false);

   const onSubmitHandler = async (data: IProjectFormState): Promise<void> => {
      setIsLoadingCreateProject(true);
      try {
         unwrapResult(await dispatch(projectsActions.createProject(data)));
         const path = generatePath(EProjectsBasicRoutePaths.allProjects);
         toastSuccess("Проект создан");
         navigate(path);
      } finally {
         setIsLoadingCreateProject(false);
      }
   };

   const onBackgroundClickHandler = (): void => {
      const path = generatePath(EProjectsBasicRoutePaths.allProjects);
      navigate(path);
   };

   if (isLoadingProjects) {
      return (
         <ModalProvider>
            <LightSpinner />
         </ModalProvider>
      );
   }

   if (isErrorProjects) {
      const path = generatePath(EProjectsBasicRoutePaths.allProjects);
      return <Navigate to={path} />;
   }

   return (
      <ModalProvider close={onBackgroundClickHandler}>
         <MediumModal>
            <Heading>Создание проекта</Heading>
            <ProjectForm buttonText="Создать проект" onSubmit={onSubmitHandler} />
            {isLoadingCreateProject && (
               <ModalProvider>
                  <LightSpinner />
               </ModalProvider>
            )}
         </MediumModal>
      </ModalProvider>
   );
};

export const ProjectCreatePage: FC<ProjectCreatePageProps> = (props) => (
   <AuthRequire>
      <ProjectCreatePageComponent {...props} />
   </AuthRequire>
);
