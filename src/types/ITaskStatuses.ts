export interface ITaskStatusFormState {
   name: string;
   title: string;
   order: number;
}

export interface ITaskStatus extends ITaskStatusFormState {
   id: string;
   projectId: string;
   userId: string;
}

export type ITaskStatusWithoutId = Omit<ITaskStatus, "id">;
