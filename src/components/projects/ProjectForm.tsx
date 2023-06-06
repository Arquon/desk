import { useForm } from "@/hooks/useForm";
import { type IProjectFormState } from "@/types/IProject";
import { type TValidator } from "@/utils/validator/validator";
import React, { type ChangeEvent, type FC } from "react";
import { TextField } from "../ui/form/TextField";
import { Button } from "../ui/Button";
import { useNetworkErrors } from "@/hooks/useNetworkErrors";

interface ProjectFormProps {
   initialData?: IProjectFormState;
   buttonChildren: string;
   onSubmit: (data: IProjectFormState) => Promise<void>;
}

const defaultData: IProjectFormState = {
   name: "",
};

const validatorConfig: TValidator<IProjectFormState> = {
   name: {
      isRequired: {
         message: "Укажите название проекта",
      },
   },
};

export const ProjectForm: FC<ProjectFormProps> = ({ initialData, buttonChildren, onSubmit }) => {
   const { data, changeHandler, errors } = useForm({ initialData: initialData ?? defaultData, validatorConfig });
   const { networkErrors, networkErrorHandler } = useNetworkErrors(data);

   const onSubmitHandler = async (event: ChangeEvent<HTMLFormElement>): Promise<void> => {
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
            label="Название проекта"
            value={data.name}
            error={errors.name ?? networkErrors.name}
            onChange={(name) => changeHandler({ name })}
         />
         <Button type="submit" disabled={isError}>
            {buttonChildren}
         </Button>
      </form>
   );
};
