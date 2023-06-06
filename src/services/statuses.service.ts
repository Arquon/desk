import { type ITaskStatusWithoutId, type ITaskStatus } from "@/types/ITaskStatuses";
import httpService from "./http.service";
import { nanoid } from "@reduxjs/toolkit";

const statusesEndPoint = "statuses/";

export const statusesService = {
   fetchStatuses: async (userId: string, projectId: string): Promise<ITaskStatus[]> => {
      const { data } = await httpService.get<ITaskStatus[]>(`${statusesEndPoint}${userId}/`, {
         params: {
            orderBy: '"projectId"',
            equalTo: `"${projectId}"`,
         },
      });
      return data;
   },
   createStatus: async (status: ITaskStatusWithoutId): Promise<ITaskStatus> => {
      const id = nanoid();
      const { data } = await httpService.put<ITaskStatus>(`${statusesEndPoint}${status.userId}/${id}/`, {
         ...status,
         id,
      });
      return data;
   },
   updateStatus: async (status: ITaskStatus): Promise<ITaskStatus> => {
      const { data } = await httpService.put<ITaskStatus>(`${statusesEndPoint}${status.userId}/${status.id}/`);
      return data;
   },
   deleteStatus: async (userId: string, id: string) => {
      await httpService.delete(`${statusesEndPoint}${userId}/${id}/`);
   },
};
