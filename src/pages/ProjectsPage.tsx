import { CustomButtonLink } from "@/components/ui/CustomButtonLink";
import { AuthRequire } from "@/hoc/AuthRequire";
import { useNetworkErrors } from "@/hooks/useNetworkErrors";
import { EBasicProjectsRoutePaths } from "@/router/router";
import projectsActions from "@/store/projects/actions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { isOutDated } from "@/utils/functions";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, type FC } from "react";
import { Link } from "react-router-dom";

interface ProjectsPageProps {}

export const ProjectsPageComponent: FC<ProjectsPageProps> = ({}) => {
   const { projects, lastFetchProjects: lastFetch, isLoadingProjects } = useAppSelector((state) => state.projects);
   const dispatch = useAppDispatch();
   const { networkErrorHandler } = useNetworkErrors();

   const fetchProjects = async (): Promise<void> => {
      try {
         if (isOutDated(lastFetch)) {
            console.log("isOutDated", { lastFetch });
            unwrapResult(await dispatch(projectsActions.fetchProjects()));
         }
      } catch (error) {
         networkErrorHandler(error);
      }
   };

   useEffect(() => {
      fetchProjects();
   }, []);

   return (
      <section className="projects">
         <div className="container">
            {isLoadingProjects ? (
               <h2>Loading...</h2>
            ) : (
               <>
                  <div className="row mb-4">
                     {projects.map((project) => (
                        <div key={project.id} className="col-4">
                           <Link
                              to={`/project/${project.id}/tasks`}
                              className="fs-2 fw-bolder text-wrap w-100 px-4 py-2 rounded d-block text-center projects__item"
                           >
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
   );
};

export const ProjectsPage: FC<ProjectsPageProps> = (props) => (
   <AuthRequire>
      <ProjectsPageComponent {...props} />
   </AuthRequire>
);
