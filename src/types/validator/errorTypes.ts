import { type PartialRecord } from "@/types/default";

export type ValidationErrors<T> = PartialRecord<keyof T, string>;
