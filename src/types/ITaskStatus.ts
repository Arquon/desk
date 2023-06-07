export interface ITaskStatusFormState {
   title: string;
   order: number;
}

export interface ITaskStatus extends ITaskStatusFormState {
   id: string;
   projectId: string;
}

export type ITaskStatusWithoutId = Omit<ITaskStatus, "id">;
