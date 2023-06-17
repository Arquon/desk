import { type ITaskStatusFormState } from "@/types/ITaskStatus";

export const getEmptyStatus = (order: number): ITaskStatusFormState => ({
   order,
   title: "Новый статус",
});
