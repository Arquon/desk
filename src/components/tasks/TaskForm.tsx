import { useForm } from "@/hooks/useForm";
import { useNetworkErrors } from "@/hooks/useNetworkErrors";
import { type ITaskFormState } from "@/types/ITask";
import { type TValidator } from "@/utils/validator/validator";
import React, { type FormEvent, type FC } from "react";
import { TextField } from "../ui/form/TextField";
import { DateField } from "../ui/form/DateField";
import { SelectField } from "../ui/form/SelectField";
import { useAppSelector } from "@/store/store";
import { Button } from "../ui/Button";
import { TextareaField } from "../ui/form/TextareaField";

interface TaskFormProps {
   initialData?: ITaskFormState;
   onSubmit: (data: ITaskFormState) => Promise<void>;
   buttonText: string;
}

const defaultData: ITaskFormState = {
   startAt: null,
   endAt: null,
   title: "",
   description: "",
   status: 0,
};

const validatorConfig: TValidator<ITaskFormState> = {
   title: {
      isRequired: {
         message: "Укажите название задачи",
      },
   },
};

export const TaskForm: FC<TaskFormProps> = ({ initialData, buttonText, onSubmit }) => {
   const { data, changeHandler, errors } = useForm({
      initialData: initialData ?? defaultData,
      validatorConfig,
   });
   const { networkErrors, networkErrorHandler } = useNetworkErrors(data);
   const { statuses } = useAppSelector((state) => state.statuses);

   const onSubmitHandler = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();
      try {
         await onSubmit(data);
      } catch (error) {
         networkErrorHandler(error);
      }
   };

   const isError = Object.keys(errors).length !== 0 || Object.keys(networkErrors).length !== 0;

   return (
      <form onSubmit={onSubmitHandler}>
         <TextField
            value={data.title}
            label="Название"
            onChange={(title) => {
               changeHandler({ title });
            }}
            error={errors.title ?? networkErrors.title}
         />
         <TextareaField
            value={data.description}
            label="Описание"
            onChange={(description) => {
               changeHandler({ description });
            }}
            error={errors.description ?? networkErrors.description}
         />
         <SelectField
            value={data.status}
            label="Статус"
            collection={statuses.map((status) => ({ name: status.title, value: status.order }))}
            onChange={(stringStatus) => {
               changeHandler({ status: +stringStatus });
            }}
         />
         <div className="d-flex flex-wrap">
            <DateField
               value={data.startAt}
               onChange={(startAt) => {
                  changeHandler({ startAt });
               }}
               maxDate={data.endAt}
               label="Начало выполнения задачи"
            />

            <DateField
               value={data.endAt}
               onChange={(endAt) => {
                  changeHandler({ endAt });
               }}
               minDate={data.startAt}
               label="Окончание выполнения задачи"
            />
         </div>
         <div className="row">
            <div className="col-md-8 offset-md-2">
               <Button type="submit" disabled={isError}>
                  {buttonText}
               </Button>
            </div>
         </div>
      </form>
   );
};
