import { useForm } from "@/hooks/useForm";
import { useNetworkErrors } from "@/hooks/useNetworkErrors";
import { type ITaskFormState } from "@/types/ITask";
import { type TValidator } from "@/utils/validator/validator";
import React, { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "../ui/form/TextField";
import { DateField } from "../ui/form/DateField";
import { SelectField } from "../ui/form/SelectField";
import { useAppSelector } from "@/store/store";
import { Button } from "../ui/Button";
import { useLocationBackground } from "@/context/LocationBackgroundContext";

interface TaskFormProps {
   initialData?: ITaskFormState;
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
   description: {
      isRequired: {
         message: "Укажите описание задачи",
      },
   },
};

export const TaskForm: FC<TaskFormProps> = ({ initialData }) => {
   const { data, changeHandler, errors } = useForm({
      initialData: initialData ?? defaultData,
      validatorConfig,
   });
   const { networkErrors, networkErrorHandler } = useNetworkErrors(data);
   const navigate = useNavigate();
   const { statuses } = useAppSelector((state) => state.statuses);
   const locationBackground = useLocationBackground();

   const onSubmitHandler = async (): Promise<void> => {
      try {
         navigate(locationBackground ?? "/");
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
         <TextField
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
            collection={statuses.map((status) => ({ name: status.name, value: status.order }))}
            onChange={(stringStatus) => {
               changeHandler({ status: +stringStatus });
            }}
         />
         <DateField value={data.startAt} onChange={() => {}} />
         <DateField value={data.endAt} onChange={() => {}} />
         <Button disabled={isError} type="submit">
            Добавить задачу
         </Button>
      </form>
   );
};
