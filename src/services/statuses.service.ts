import { type ITaskStatusWithoutId, type ITaskStatus } from "@/types/ITaskStatus";
import httpService from "./http.service";
import { nanoid } from "@reduxjs/toolkit";

const statusesEndPoint = "statuses/";

const defaultProjectStatuses = {
   "default-1": {
      title: "К выполнению",
      id: "1",
      order: 1,
   },
   "default-2": {
      title: "В работе",
      id: "2",
      order: 2,
   },
   "default-3": {
      title: "Завершено",
      id: "3",
      order: 3,
   },
   "default-4": {
      title: "Бэклог",
      id: "4",
      order: 0,
   },
};

export const statusesService = {
   fetchProjectStatuses: async (userId: string, projectId: string): Promise<ITaskStatus[]> => {
      const { data } = await httpService.get<ITaskStatus[]>(`${statusesEndPoint}${userId}/${projectId}/`);
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
      await httpService.put(`${statusesEndPoint}${userId}/${projectId}/`, defaultProjectStatuses);
   },
   updateStatus: async (userId: string, status: ITaskStatus): Promise<ITaskStatus> => {
      const { data } = await httpService.put<ITaskStatus>(`${statusesEndPoint}${userId}/${status.projectId}/${status.id}/`);
      return data;
   },
   deleteStatus: async (userId: string, projectId: string, id: string) => {
      await httpService.delete(`${statusesEndPoint}${userId}/${projectId}/${id}/`);
   },
   deleteProjectStatuses: async (userId: string, projectId: string) => {
      await httpService.delete(`${statusesEndPoint}${userId}/${projectId}/`);
   },
};
