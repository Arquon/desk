import { type TTaskWithoutId, type ITask } from "@/types/ITask";
import { nanoid } from "@reduxjs/toolkit";
import httpService from "./http.service";

const tasksEndPoint = "tasks/";

export const tasksService = {
   fetchTasks: async (userId: string, projectId: string): Promise<ITask[]> => {
      const { data } = await httpService.get<ITask[]>(`${tasksEndPoint}${userId}/`, {
         params: {
            orderBy: '"projectId"',
            equalTo: `"${projectId}"`,
         },
      });
      return data;
   },
   createTask: async (task: TTaskWithoutId): Promise<ITask> => {
      const id = nanoid();
      const { data } = await httpService.put<ITask>(`${tasksEndPoint}${task.userId}/${id}/`, {
         ...task,
         id,
      });
      return data;
   },
   updateTask: async (task: ITask): Promise<ITask> => {
      const { data } = await httpService.put<ITask>(`${tasksEndPoint}${task.userId}/${task.id}/`, { ...task, updatedAt: new Date().getTime() });
      return data;
   },

   deleteTask: async (userId: string, id: string) => {
      await httpService.delete(`${tasksEndPoint}${userId}/${id}/`);
   },
};
