import { DeleteModal } from "@/components/modals/DeleteModal";
import { MediumModal } from "@/components/modals/MediumModal";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { LightSpinner, Spinner } from "@/components/ui/Spinner";
import { ModalProvider } from "@/providers/ModalProvider";
import { AuthRequire } from "@/hoc/AuthRequire";
import { useProjectView } from "@/hooks/useProjectView";
import { EBasicProjectsRoutePaths, type IRouteParams } from "@/router/router";
import { useAppSelector } from "@/store/store";
import { type IProjectFormState } from "@/types/IProject";
import { type Nullable } from "@/types/default";
import { toastError, toastSuccess } from "@/utils/functions";
import React, { useState, type FC, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { ProjectProvider, useProject } from "@/providers/ProjectProvider";

interface ProjectViewPageProps {}

enum ETasksPageModal {
   delete = "delete",
   edit = "edit",
}

export const ProjectViewPageComponent: FC<ProjectViewPageProps> = ({}) => {
   const { isError, isLoading } = useProject();

   const { lastFetchTasks } = useAppSelector((state) => state.tasks);
   const { lastFetchStatuses } = useAppSelector((state) => state.statuses);
   const { lastFetchSingleProject, currentProject } = useAppSelector((state) => state.projects);

   const { projectId } = useParams<IRouteParams["projectTasks"]>();
   const navigate = useNavigate();

   const { deleteProject, updateProject, fetchProjectInfo } = useProjectView();

   const [currentModalShow, setCurrentModalShow] = useState<Nullable<ETasksPageModal>>(null);
   const [isLoadingEditSingleProject, setIsLoadingEditSingleProject] = useState(false);
   const [firstLoad, setFirstLoad] = useState(false);

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
      setIsLoadingEditSingleProject(true);
      try {
         await deleteProject(currentProject.id);
         toastSuccess("Проект удален");
         navigate(EBasicProjectsRoutePaths.allProjects);
      } finally {
         setIsLoadingEditSingleProject(false);
      }
   };

   const onUpdateSubmit = async (projectState: IProjectFormState): Promise<void> => {
      if (!currentProject) return;
      setIsLoadingEditSingleProject(true);
      try {
         await updateProject({ ...currentProject, ...projectState });
         toastSuccess("Проект изменен");
      } finally {
         setIsLoadingEditSingleProject(false);
      }
   };

   const firstLoadProjectInfo = async (projectId: string): Promise<void> => {
      try {
         await fetchProjectInfo(projectId, projectId !== currentProject?.id);
         setFirstLoad(true);
      } catch (error) {
         toastError(error);
      }
   };

   const loadProjectInfo = async (projectId: string): Promise<void> => {
      try {
         await fetchProjectInfo(projectId, projectId !== currentProject?.id);
      } catch (error) {
         toastError(error);
      }
   };

   useEffect(() => {
      if (!projectId) return;
      firstLoadProjectInfo(projectId);
   }, []);

   useEffect(() => {
      if (!projectId || !firstLoad || lastFetchTasks !== null) return;
      loadProjectInfo(projectId);
   }, [lastFetchTasks]);

   useEffect(() => {
      if (!projectId || !firstLoad || lastFetchSingleProject !== null) return;
      loadProjectInfo(projectId);
   }, [lastFetchSingleProject]);

   useEffect(() => {
      if (!projectId || !firstLoad || lastFetchStatuses !== null) return;
      loadProjectInfo(projectId);
   }, [lastFetchStatuses]);

   return (
      <>
         <section className="project-view">
            <div className="container-xl">
               {/* <ProjectTabs/> */}

               {isLoading && (
                  <div className="d-flex justify-content-center">
                     <Spinner />
                  </div>
               )}

               {!isLoading && isError && <Heading>Не удалось загрузить данные проекта</Heading>}

               {!isLoading && !isError && currentProject && (
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
                  </>
               )}

               <Outlet />
            </div>
         </section>
         {currentModalShow !== null && currentProject && (
            <ModalProvider close={closeModal}>
               {isLoadingEditSingleProject && <LightSpinner />}

               {currentModalShow === ETasksPageModal.delete && !isLoadingEditSingleProject && (
                  <DeleteModal text="Вы уверены что хотите удалить проект?" onDelete={onDeleteHandler} />
               )}

               {currentModalShow === ETasksPageModal.edit && (
                  <MediumModal hidden={isLoadingEditSingleProject}>
                     <Heading>Обновление проекта</Heading>
                     <ProjectForm buttonText="Обновить проект" onSubmit={onUpdateSubmit} initialData={currentProject} />
                  </MediumModal>
               )}
            </ModalProvider>
         )}
      </>
   );
};

export const ProjectViewPage: FC<ProjectViewPageProps> = (props) => {
   return (
      <AuthRequire>
         <ProjectProvider>
            <ProjectViewPageComponent {...props} />
         </ProjectProvider>
      </AuthRequire>
   );
};
