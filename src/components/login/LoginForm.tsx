import { useForm } from "@/hooks/useForm";
import { type TValidator } from "@/utils/validator/validator";
import React, { type FormEvent, type FC } from "react";
import { TextField } from "../ui/form/TextField";
import { useNetworkErrors } from "@/hooks/useNetworkErrors";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "@/store/store";
import userActions from "@/store/user/actions";
import { useLocationBackground } from "@/context/LocationBackgroundContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";

interface LoginFormProps {}

interface LoginFormState {
   email: string;
   password: string;
}

const initialData: LoginFormState = {
   email: "",
   password: "",
};

const validatorConfig: TValidator<LoginFormState> = {
   email: {
      isRequired: {
         message: "Введите email",
      },
   },
   password: {
      isRequired: {
         message: "Введите пароль",
      },
   },
};

export const LoginForm: FC<LoginFormProps> = ({}) => {
   const { data, changeHandler: onChangeHandler, errors } = useForm({ initialData, validatorConfig });
   const { networkErrors, networkErrorHandler } = useNetworkErrors(data);
   const locationBackground = useLocationBackground();
   const navigate = useNavigate();
   const location = useLocation();
   const dispatch = useAppDispatch();

   const onSubmitHandler = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      try {
         const locationFrom: Location | undefined = location.state?.from;
         event.preventDefault();
         unwrapResult(await dispatch(userActions.login(data)));
         navigate(locationFrom ?? locationBackground ?? "/");
      } catch (error) {
         networkErrorHandler(error);
      }
   };

   const isError = Object.keys(errors).length !== 0 || Object.keys(networkErrors).length !== 0;

   return (
      <form onSubmit={onSubmitHandler}>
         <TextField
            label="Электронная почта"
            value={data.email}
            onChange={(email) => onChangeHandler({ email })}
            error={errors.email ?? networkErrors.email}
         />
         <TextField
            label="Пароль"
            type="password"
            value={data.password}
            onChange={(password) => onChangeHandler({ password })}
            error={errors.password ?? networkErrors.password}
         />
         <Button disabled={isError}>Войти</Button>
      </form>
   );
};
