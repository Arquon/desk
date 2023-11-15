import { ProjectButtons } from "@/components/projects/ProjectButtons";
import { ProjectTabs } from "@/components/projects/ProjectTabs";
import { Heading } from "@/components/ui/Heading";
import { Spinner } from "@/components/ui/Spinner";
import { AuthRequire } from "@/hoc/AuthRequire";
import { useProjectView } from "@/hooks/useProjectView";
import { ProjectProvider, useProject } from "@/providers/ProjectProvider";
import { type IRouteParams, EProjectsBasicRoutePaths } from "@/router/router";
import React, { type FC } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";

interface ProjectViewPageComponentProps {
   projectId: string;
}

export const ProjectViewPageComponent: FC<ProjectViewPageComponentProps> = ({ projectId }) => {
   const { isError, isLoading } = useProject();

   const { deleteProject, updateProject } = useProjectView(projectId);

   return (
      <>
         <section className="project-view">
            <div className="container-xl">
               <ProjectTabs projectId={projectId} />
               {isLoading && (
                  <div className="d-flex justify-content-center">
                     <Spinner />
                  </div>
               )}
               {!isLoading && isError && <Heading>Не удалось загрузить данные проекта</Heading>}
               <ProjectButtons deleteProject={deleteProject} updateProject={updateProject} />
               <Outlet />
            </div>
         </section>
      </>
   );
};

export const ProjectViewPage: FC = () => {
   const { projectId } = useParams<IRouteParams["projectView"]>();
   if (!projectId) return <Navigate to={EProjectsBasicRoutePaths.allProjects} />;

   return (
      <AuthRequire>
         <ProjectProvider>
            <ProjectViewPageComponent projectId={projectId} />
         </ProjectProvider>
      </AuthRequire>
   );
};
