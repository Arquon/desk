import { type Nullable, type TimeStamp } from "./default";

export interface ITaskFormState {
   startAt: Nullable<TimeStamp>;
   endAt: Nullable<TimeStamp>;
   title: string;
   description: string;
   statusId: string;
   isImportant: boolean;
   inHistory?: boolean;
}

export interface ITask extends ITaskFormState {
   createdAt: TimeStamp;
   updatedAt: TimeStamp;
   statusUpdatedAt: TimeStamp;
   id: string;
   projectId: string;
}

export type TTaskWithoutId = Omit<ITask, "id">;
export interface TFilteredTasks {
   order: number;
   id: string;
   tasks: ITask[];
}
