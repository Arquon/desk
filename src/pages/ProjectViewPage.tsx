import { DeleteModal } from "@/components/modals/DeleteModal";
import { MediumModal } from "@/components/modals/MediumModal";
import { PortalModal } from "@/components/portal/PortalModal";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { AuthRequire } from "@/hoc/AuthRequire";
import { useProjectView } from "@/hooks/useProjectView";
import { EBasicProjectsRoutePaths, type IRouteParams } from "@/router/router";
import { useAppSelector } from "@/store/store";
import { type IProjectFormState } from "@/types/IProject";
import { type Nullable } from "@/types/default";
import React, { useState, type FC, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

interface ProjectViewPageProps {}

enum ETasksPageModal {
   delete = "delete",
   edit = "edit",
}

export const ProjectViewPageComponent: FC<ProjectViewPageProps> = ({}) => {
   const { isLoadingTasks } = useAppSelector((state) => state.tasks);
   const { isLoadingTaskStatuses } = useAppSelector((state) => state.statuses);
   const { isLoadingSingleProject, currentProject } = useAppSelector((state) => state.projects);

   const isLoading = isLoadingSingleProject || isLoadingTasks || isLoadingTaskStatuses || !currentProject;

   const { projectId } = useParams<IRouteParams["projectTasks"]>();
   const navigate = useNavigate();

   const { deleteProject, updateProject, fetchProjectInfo } = useProjectView();

   const [currentModalShow, setCurrentModalShow] = useState<Nullable<ETasksPageModal>>(null);

   const openDeleteModal = (): void => {
      setCurrentModalShow(ETasksPageModal.delete);
   };
   const openEditModal = (): void => {
      setCurrentModalShow(ETasksPageModal.edit);
   };
   const closeModal = (): void => {
      setCurrentModalShow(null);
   };

   const onDeleteHandler = async (): Promise<void> => {
      if (!currentProject) return;
      await deleteProject(currentProject.id);
      navigate(EBasicProjectsRoutePaths.allProjects);
   };
   const onUpdateHandler = async (projectState: IProjectFormState): Promise<void> => {
      if (!currentProject) return;
      updateProject({ ...currentProject, ...projectState });
      closeModal();
   };

   useEffect(() => {
      if (projectId) fetchProjectInfo(projectId, projectId !== currentProject?.id);
   }, [projectId]);

   return (
      <>
         <section className="project-view">
            <div className="container">
               {/* <ProjectTabs/> */}

               {isLoading ? (
                  <h2>Loading...</h2>
               ) : (
                  <>
                     <div className="row mb-3">
                        <Heading className="col-6">{currentProject.name}</Heading>
                        <div className="col-3">
                           <Button onClick={openEditModal} type="button">
                              Редактировать проект
                           </Button>
                        </div>
                        <div className="col-3">
                           <Button onClick={openDeleteModal} type="button">
                              Удалить проект
                           </Button>
                        </div>
                     </div>

                     <Outlet />
                  </>
               )}
            </div>
         </section>
         {currentModalShow !== null && currentProject && (
            <PortalModal onBackgroundClick={closeModal}>
               {currentModalShow === ETasksPageModal.delete && (
                  <DeleteModal text="Вы уверены что хотите удалить проект?" onDelete={onDeleteHandler} />
               )}

               {currentModalShow === ETasksPageModal.edit && (
                  <MediumModal>
                     <Heading>Обновление проекта</Heading>
                     <ProjectForm buttonChildren="Создать проект" onSubmit={onUpdateHandler} initialData={currentProject} />
                  </MediumModal>
               )}
            </PortalModal>
         )}
      </>
   );
};

export const ProjectViewPage: FC<ProjectViewPageProps> = (props) => {
   return (
      <AuthRequire>
         <ProjectViewPageComponent {...props} />
      </AuthRequire>
   );
};
