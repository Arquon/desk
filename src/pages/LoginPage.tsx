import { LoginForm } from "@/components/login/LoginForm";
import { RegistrationForm } from "@/components/login/RegistrationForm";
import { WithoutAuth } from "@/hoc/WithoutAuth";
import React, { useState, type FC } from "react";

export enum ELoginPage {
   login = "login",
   register = "register",
}

interface LoginPageProps {}

export const LoginPageComponent: FC<LoginPageProps> = ({}) => {
   const [loginPage, setLoginPage] = useState(ELoginPage.login);

   let Component: JSX.Element;

   switch (loginPage) {
      case ELoginPage.login:
         Component = <LoginForm />;
         break;
      case ELoginPage.register:
         Component = <RegistrationForm />;
         break;
   }

   const togglePage = (): void => setLoginPage((prevPage) => (prevPage === ELoginPage.login ? ELoginPage.register : ELoginPage.login));

   return (
      <div className="container-sm">
         <div className="row">
            <div className="col-md-6  bg-white rounded offset-md-3 shadow p-4">
               <h2>{loginPage === ELoginPage.login ? "Авторизация" : "Регистрация"}</h2>
               {Component}
               <div className="mt-3">
                  <a role="button" onClick={togglePage}>
                     {loginPage === ELoginPage.login ? "Регистрация" : "Авторизация"}
                  </a>
               </div>
            </div>
         </div>
      </div>
   );
};

export const LoginPage: FC<LoginPageProps> = (props) => (
   <WithoutAuth>
      <LoginPageComponent {...props} />
   </WithoutAuth>
);
