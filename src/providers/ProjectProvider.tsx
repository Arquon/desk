import { useAppSelector } from "@/store/store";
import React, { type FC, type PropsWithChildren, createContext, useContext } from "react";

interface ProjectContextType {
   isLoading: boolean;
   isError: boolean;
}

const initialContextData: ProjectContextType = {
   isLoading: true,
   isError: false,
};

const ProjectContext = createContext<ProjectContextType>(initialContextData);

export const ProjectProvider: FC<PropsWithChildren> = ({ children }) => {
   const { isLoadingTasks, isErrorTasks } = useAppSelector((state) => state.tasks);
   const { isLoadingStatuses, isErrorStatuses } = useAppSelector((state) => state.statuses);
   const { isLoadingSingleProject, isErrorSingleProject } = useAppSelector((state) => state.projects);

   const isLoading = isLoadingSingleProject || isLoadingTasks || isLoadingStatuses;
   const isError = isErrorTasks || isErrorStatuses || isErrorSingleProject;

   return <ProjectContext.Provider value={{ isError, isLoading }}>{children}</ProjectContext.Provider>;
};

export function useProject(): ProjectContextType {
   return useContext(ProjectContext);
}
