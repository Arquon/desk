import { type Nullable, type TimeStamp } from "./default";

export interface ITaskFormState {
   startAt: Nullable<TimeStamp>;
   endAt: Nullable<TimeStamp>;
   title: string;
   description: string;
   status: number;
   isImportant: boolean;
}

export interface ITask extends ITaskFormState {
   createdAt: TimeStamp;
   updatedAt: TimeStamp;
   statusUpdatedAt: TimeStamp;
   id: string;
   projectId: string;
}

export type TTaskWithoutId = Omit<ITask, "id">;
export type TFilteredTasks = Record<string, ITask[]>;
