import { CustomButtonLink } from "@/components/ui/CustomButtonLink";
import { Heading } from "@/components/ui/Heading";
import { Spinner } from "@/components/ui/Spinner";
import { AuthRequire } from "@/hoc/AuthRequire";
import { EBasicProjectsRoutePaths } from "@/router/router";
import projectsActions from "@/store/projects/actions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { isOutDated, toastError } from "@/utils/functions";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, type FC } from "react";
import { Link, Outlet } from "react-router-dom";

interface ProjectsPageProps {}

export const ProjectsPageComponent: FC<ProjectsPageProps> = ({}) => {
   const { projects, lastFetchProjects, isLoadingProjects, isErrorProjects } = useAppSelector((state) => state.projects);
   const dispatch = useAppDispatch();

   const fetchProjects = async (): Promise<void> => {
      try {
         if (isOutDated(lastFetchProjects)) {
            unwrapResult(await dispatch(projectsActions.fetchProjects()));
         }
      } catch (error) {
         toastError(error);
      }
   };

   useEffect(() => {
      fetchProjects();
   }, []);

   return (
      <>
         <section className="projects">
            <div className="container">
               {isLoadingProjects && (
                  <div className="d-flex justify-content-center">
                     <Spinner />
                  </div>
               )}

               {!isLoadingProjects && isErrorProjects && <Heading>Не удалось загрузить проекты</Heading>}

               {!isLoadingProjects && !isErrorProjects && (
                  <>
                     <div className="row mb-4">
                        {projects.map((project) => (
                           <div key={project.id} className="col-4 mb-2">
                              <Link to={`${project.id}/tasks`} className="fs-2 text-wrap w-100 px-4 py-2 rounded d-block text-center projects__item">
                                 {project.name}
                              </Link>
                           </div>
                        ))}
                     </div>
                     <div>
                        <CustomButtonLink className="fs-4" to={EBasicProjectsRoutePaths.newProject}>
                           Создать проект
                        </CustomButtonLink>
                     </div>
                  </>
               )}
            </div>
         </section>
         <Outlet />
      </>
   );
};

export const ProjectsPage: FC<ProjectsPageProps> = (props) => (
   <AuthRequire>
      <ProjectsPageComponent {...props} />
   </AuthRequire>
);
