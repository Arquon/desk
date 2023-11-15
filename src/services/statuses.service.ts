import { type ITaskStatusWithoutId, type ITaskStatus } from "@/types/ITaskStatus";
import httpService from "./http.service";
import { nanoid } from "@reduxjs/toolkit";

const statusesEndPoint = "statuses/";

type TDefaultStatusesObject = Record<string, ITaskStatus>;

const getDefaultProjectStatuses = (): TDefaultStatusesObject => ({
   "default-1": {
      title: "К выполнению",
      id: "default-1",
      order: 1,
      projectId: "",
   },
   "default-2": {
      title: "В работе",
      id: "default-2",
      order: 2,
      projectId: "",
   },
   "default-3": {
      title: "Завершено",
      id: "default-3",
      order: 3,
      projectId: "",
   },
   "default-4": {
      title: "Бэклог",
      id: "default-4",
      order: 0,
      projectId: "",
   },
});

export const statusesService = {
   fetchProjectStatuses: async (userId: string, projectId: string, signal?: AbortSignal): Promise<ITaskStatus[]> => {
      const { data } = await httpService.get<ITaskStatus[]>(`${statusesEndPoint}${userId}/${projectId}/`, { signal });
      return data;
   },
   createStatus: async (userId: string, status: ITaskStatusWithoutId): Promise<ITaskStatus> => {
      const id = nanoid();
      const { data } = await httpService.put<ITaskStatus>(`${statusesEndPoint}${userId}/${status.projectId}/${id}/`, {
         ...status,
         id,
      });
      return data;
   },
   createDefaultProjectStatuses: async (userId: string, projectId: string) => {
      const statusesObject = getDefaultProjectStatuses();
      for (const status in statusesObject) {
         statusesObject[status].projectId = projectId;
      }
      await httpService.put(`${statusesEndPoint}${userId}/${projectId}/`, statusesObject);
   },
   updateStatus: async (userId: string, status: ITaskStatus): Promise<ITaskStatus> => {
      const { data } = await httpService.put<ITaskStatus>(`${statusesEndPoint}${userId}/${status.projectId}/${status.id}/`, status);
      return data;
   },
   updateProjectStatuses: async (userId: string, projectId: string, statuses: ITaskStatus[]) => {
      const statusesObject: Partial<TDefaultStatusesObject> = {};

      for (const status of statuses) {
         statusesObject[status.id] = status;
      }

      const { data } = await httpService.put<ITaskStatus[]>(`${statusesEndPoint}${userId}/${projectId}/`, statusesObject);
      return data;
   },
   deleteStatus: async (userId: string, projectId: string, id: string) => {
      await httpService.delete(`${statusesEndPoint}${userId}/${projectId}/${id}/`);
   },
   deleteProjectStatuses: async (userId: string, projectId: string) => {
      await httpService.delete(`${statusesEndPoint}${userId}/${projectId}/`);
   },
};
