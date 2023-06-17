import { ModalProvider } from "@/providers/ModalProvider";
import { useProject } from "@/providers/ProjectProvider";
import { EProjectsBasicRoutePaths } from "@/router/router";
import { useAppSelector } from "@/store/store";
import { type IProject, type IProjectFormState } from "@/types/IProject";
import { type Nullable } from "@/types/default";
import { toastSuccess } from "@/utils/functions";
import React, { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteModal } from "../modals/DeleteModal";
import { MediumModal } from "../modals/MediumModal";
import { Button } from "../ui/Button";
import { Heading } from "../ui/Heading";
import { LightSpinner } from "../ui/Spinner";
import { ProjectForm } from "./ProjectForm";

interface ProjectButtonsProps {
   deleteProject: (projectId: string) => Promise<void>;
   updateProject: (project: IProject) => Promise<void>;
}

enum EProjectViewPageModal {
   delete = "delete",
   edit = "edit",
}

export const ProjectButtons: FC<ProjectButtonsProps> = ({ deleteProject, updateProject }) => {
   const navigate = useNavigate();
   const { currentProject } = useAppSelector((state) => state.projects);

   const { isError, isLoading } = useProject();

   const [currentModalShow, setCurrentModalShow] = useState<Nullable<EProjectViewPageModal>>(null);
   const [isLoadingEditSingleProject, setIsLoadingEditSingleProject] = useState(false);

   const openDeleteModal = (): void => {
      setCurrentModalShow(EProjectViewPageModal.delete);
   };
   const openEditModal = (): void => {
      setCurrentModalShow(EProjectViewPageModal.edit);
   };
   const closeModal = (): void => {
      setCurrentModalShow(null);
   };

   if (!currentProject) return null;

   const onDeleteHandler = async (): Promise<void> => {
      setIsLoadingEditSingleProject(true);
      try {
         await deleteProject(currentProject.id);
         toastSuccess("Проект удален");
         navigate(EProjectsBasicRoutePaths.allProjects);
      } finally {
         setIsLoadingEditSingleProject(false);
      }
   };

   const onUpdateSubmit = async (projectState: IProjectFormState): Promise<void> => {
      setIsLoadingEditSingleProject(true);
      try {
         await updateProject({ ...currentProject, ...projectState });
         toastSuccess("Проект изменен");
      } finally {
         setIsLoadingEditSingleProject(false);
      }
   };

   return (
      <>
         {!isLoading && !isError && (
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

         {currentModalShow !== null && (
            <ModalProvider close={closeModal}>
               {currentModalShow === EProjectViewPageModal.delete && (
                  <>
                     <DeleteModal text="Вы уверены что хотите удалить проект?" onDelete={onDeleteHandler} />
                     {isLoadingEditSingleProject && (
                        <ModalProvider>
                           <LightSpinner />
                        </ModalProvider>
                     )}
                  </>
               )}

               {currentModalShow === EProjectViewPageModal.edit && (
                  <>
                     <MediumModal>
                        <Heading>Обновление проекта</Heading>
                        <ProjectForm buttonText="Обновить проект" onSubmit={onUpdateSubmit} initialData={currentProject} />
                     </MediumModal>
                     {isLoadingEditSingleProject && (
                        <ModalProvider>
                           <LightSpinner />
                        </ModalProvider>
                     )}
                  </>
               )}
            </ModalProvider>
         )}
      </>
   );
};
