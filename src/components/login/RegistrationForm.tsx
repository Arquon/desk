import { useForm } from "@/hooks/useForm";
import { type TValidator } from "@/utils/validator/validator";
import React, { type FormEvent, type FC } from "react";
import { TextField } from "../ui/form/TextField";
import { useNetworkErrors } from "@/hooks/useNetworkErrors";
import { useLocationBackground } from "@/context/LocationBackgroundContext";
import { useNavigate } from "react-router-dom";
import userActions from "@/store/user/actions";
import { type IAuthData } from "@/types/auth/IAuthData";
import { useAppDispatch } from "@/store/store";
import { unwrapResult } from "@reduxjs/toolkit";

interface RegistrationFormState extends IAuthData {
   passwordRepeat: string;
}

const initialData: RegistrationFormState = {
   email: "",
   password: "",
   passwordRepeat: "",
};

const validatorConfig: TValidator<RegistrationFormState> = {
   email: {
      isRequired: {
         message: "Введите email",
      },
      email: {
         message: "Неверный формат электронной почты",
      },
   },
   password: {
      isRequired: {
         message: "Введите пароль",
      },
      latinaAndNumeric: {
         message: "Пароль должен состоять из букв латинского алфавита и цифр",
      },
      minLength: {
         min: 7,
         message: "Минимальная длина пароля 7 букв",
      },
      maxLength: {
         max: 20,
         message: "Максимальная длина пароля 20 букв",
      },
      isCapitalSymbol: {
         message: "Пароль должен содержать хотя бы одну заглавную букву",
      },
      isDigitSymbol: {
         message: "Пароль должен содержать хотя бы одну цифру",
      },
   },
   passwordRepeat: {
      sameAs: {
         message: "Пароли должеы совпадать",
         key: "password",
      },
   },
};

interface RegistrationFormProps {}

export const RegistrationForm: FC<RegistrationFormProps> = ({}) => {
   const { data, changeHandler: onChangeHandler, errors } = useForm({ initialData, validatorConfig });
   const { networkErrors, networkErrorHandler } = useNetworkErrors(data);
   const dispatch = useAppDispatch();
   const locationBackground = useLocationBackground();
   const navigate = useNavigate();

   const onSubmitHandler = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      try {
         event.preventDefault();
         unwrapResult(await dispatch(userActions.register(data)));
         navigate(locationBackground ?? "/");
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
            value={data.password}
            onChange={(password) => onChangeHandler({ password })}
            error={errors.password ?? networkErrors.password}
            type="password"
         />
         <TextField
            label="Повторите пароль"
            value={data.passwordRepeat}
            onChange={(passwordRepeat) => onChangeHandler({ passwordRepeat })}
            error={errors.passwordRepeat}
            type="password"
         />
         <button className="btn btn-primary w-100 mx-auto" type="submit" disabled={isError}>
            Зарегистрироваться
         </button>
      </form>
   );
};
