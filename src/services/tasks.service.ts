import { type TTaskWithoutId, type ITask } from "@/types/ITask";
import { nanoid } from "@reduxjs/toolkit";
import httpService from "./http.service";
import { isAxiosError } from "axios";

const tasksEndPoint = "tasks/";

export const tasksService = {
   fetchTasks: async (userId: string, projectId: string): Promise<ITask[]> => {
      try {
         const { data } = await httpService.get<ITask[]>(`${tasksEndPoint}${userId}/${projectId}/`);
         return data;
      } catch (error) {
         if (isAxiosError(error) && error.message === "CustomError" && error.code === "NOT_FOUND") return [];
         throw error;
      }
   },
   createTask: async (userId: string, task: TTaskWithoutId): Promise<ITask> => {
      const id = nanoid();
      const { data } = await httpService.put<ITask>(`${tasksEndPoint}${userId}/${task.projectId}/${id}/`, {
         ...task,
         id,
      });
      return data;
   },
   updateTask: async (userId: string, task: ITask): Promise<ITask> => {
      const { data } = await httpService.put<ITask>(`${tasksEndPoint}${userId}/${task.projectId}/${task.id}/`, task);
      return data;
   },
   deleteTask: async (userId: string, projectId: string, id: string) => {
      await httpService.delete(`${tasksEndPoint}${userId}/${projectId}/${id}/`);
   },
   deleteProjectTasks: async (userId: string, projectId: string) => {
      await httpService.delete(`${tasksEndPoint}${userId}/${projectId}/`);
   },
};
