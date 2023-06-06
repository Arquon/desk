import { EBasicDefaultRoutePaths, EModalDefaultRoutePaths, EBasicProjectsRoutePaths } from "@/router/router";
import { useAppDispatch, useAppSelector } from "@/store/store";
import userActions from "@/store/user/actions";
import React, { type FC } from "react";
import { Link, useLocation } from "react-router-dom";

interface Props {}

export const Header: FC<Props> = ({}) => {
   const location = useLocation();
   const { user } = useAppSelector((state) => state.user);
   const dispatch = useAppDispatch();
   const isAuth = !!user;

   const signOut = (): void => {
      dispatch(userActions.signOut());
   };

   return (
      <header>
         <div className="container">
            <div className="row py-5">
               <div className="col-3">
                  <Link to={EBasicDefaultRoutePaths.landing}>Главная</Link>
               </div>
               <div className="col-3 text-center">
                  <Link to={EBasicProjectsRoutePaths.allProjects}>Мои проекты</Link>
               </div>
               <div className="col-3 text-center">
                  <Link to={EBasicDefaultRoutePaths.admin}>Админ панель</Link>
               </div>
               <div className="col-3 text-end">
                  {isAuth ? (
                     <a onClick={signOut}>{user.email}</a>
                  ) : (
                     <Link to={EModalDefaultRoutePaths.login} state={{ background: location }}>
                        Войти
                     </Link>
                  )}
               </div>
            </div>
         </div>
      </header>
   );
};
