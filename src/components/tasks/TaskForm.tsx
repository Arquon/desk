import { useForm } from "@/hooks/useForm";
import { useNetworkErrors } from "@/hooks/useNetworkErrors";
import { type ITaskFormState } from "@/types/ITask";
import { type TValidator } from "@/utils/validator/validator";
import React, { type FormEvent, type FC, type PropsWithChildren } from "react";
import { TextField } from "../ui/form/TextField";
import { DateField } from "../ui/form/DateField";
import { SelectField } from "../ui/form/SelectField";
import { useAppSelector } from "@/store/store";
import { Button } from "../ui/Button";
import { TextareaField } from "../ui/form/TextareaField";
import { CheckBoxField } from "../ui/form/CheckBoxField";
import { type ITaskStatus } from "@/types/ITaskStatus";

const defaultData: ITaskFormState = {
   startAt: null,
   endAt: null,
   title: "",
   description: "",
   statusId: "",
   isImportant: false,
};

const validatorConfig: TValidator<ITaskFormState> = {
   title: {
      isRequired: {
         message: "Укажите название задачи",
      },
   },
};

function getDefaultStatusId(statuses: ITaskStatus[]): string {
   const { id } = statuses.reduce(
      (acc, status) => {
         if (status.order < acc.order) {
            return status;
         }
         return acc;
      },
      { order: Infinity, id: "" }
   );

   return id;
}

interface TaskFormProps {
   initialData?: ITaskFormState;
   onSubmit: (data: ITaskFormState) => Promise<void>;
   buttonText: string;
   readOnly?: boolean;
}

export const TaskForm: FC<PropsWithChildren<TaskFormProps>> = ({ initialData, buttonText, readOnly, onSubmit }) => {
   const { statuses } = useAppSelector((state) => state.statuses);
   const { data, changeHandler, errors } = useForm({
      initialData: initialData ?? { ...defaultData, statusId: getDefaultStatusId(statuses) },
      validatorConfig,
   });
   const { networkErrors, networkErrorHandler } = useNetworkErrors(data);

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
            readOnly={readOnly}
         />
         <TextareaField
            value={data.description}
            label="Описание"
            onChange={(description) => {
               changeHandler({ description });
            }}
            error={errors.description ?? networkErrors.description}
            readOnly={readOnly}
         />
         <SelectField
            value={data.statusId}
            label="Статус"
            collection={statuses.map((status) => ({ name: status.title, value: status.id }))}
            onChange={(statusId) => {
               changeHandler({ statusId });
            }}
            disabled={readOnly}
         />
         <div className="d-flex flex-wrap">
            <DateField
               value={data.startAt}
               onChange={(startAt) => {
                  changeHandler({ startAt });
               }}
               maxDate={data.endAt}
               label="Начало выполнения задачи"
               readOnly={readOnly}
            />
            <DateField
               value={data.endAt}
               onChange={(endAt) => {
                  changeHandler({ endAt });
               }}
               minDate={data.startAt}
               label="Окончание выполнения задачи"
               readOnly={readOnly}
            />
         </div>
         <CheckBoxField
            label="Срочная задача"
            onChange={(isImportant) => changeHandler({ isImportant })}
            value={data.isImportant}
            // disabled={readOnly}
            readOnly={readOnly}
         />

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
