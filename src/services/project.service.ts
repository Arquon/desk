import { nanoid } from "@reduxjs/toolkit";
import httpService from "./http.service";
import { type TProjectWithoutId, type IProject } from "@/types/IProject";

const projectsEndPoint = "projects/";

export const projectsService = {
   fetchProjects: async (userId: string): Promise<IProject[]> => {
      const { data } = await httpService.get<IProject[]>(`${projectsEndPoint}${userId}/`);
      return data;
   },
   fetchSingleProject: async (userId: string, projectId: string): Promise<IProject> => {
      const { data } = await httpService.get<IProject>(`${projectsEndPoint}${userId}/${projectId}/`);
      return data;
   },
   createProject: async (project: TProjectWithoutId): Promise<IProject> => {
      const id = nanoid();
      const { data } = await httpService.put<IProject>(`${projectsEndPoint}${project.userId}/${id}/`, {
         ...project,
         id,
      });
      return data;
   },
   updateProject: async (project: IProject): Promise<IProject> => {
      const { data } = await httpService.put<IProject>(`${projectsEndPoint}${project.userId}/${project.id}/`, project);
      return data;
   },
   deleteProject: async (userId: string, id: string): Promise<void> => {
      await httpService.delete(`${projectsEndPoint}${userId}/${id}/`);
   },
};
