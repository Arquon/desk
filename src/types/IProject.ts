export interface IProjectFormState {
   name: string;
}

export interface IProject extends IProjectFormState {
   id: string;
   userId: string;
}

export type TProjectWithoutId = Omit<IProject, "id">;
