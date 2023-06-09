import { EBasicDefaultRoutePaths, EModalDefaultRoutePaths, EBasicProjectsRoutePaths } from "@/router/router";
import { useAppDispatch, useAppSelector } from "@/store/store";
import userActions from "@/store/user/actions";
import React, { type FC } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface Props {}

export const Header: FC<Props> = ({}) => {
   const location = useLocation();
   const { user } = useAppSelector((state) => state.user);
   const dispatch = useAppDispatch();
   const navigate = useNavigate();

   const isAuth = !!user;

   const signOut = (): void => {
      dispatch(userActions.signOut());
      navigate("/");
   };

   return (
      <header>
         <div className="container">
            <div className="row py-5">
               <div className="col-3">
                  <Link className="fs-5" to={EBasicDefaultRoutePaths.landing}>
                     Главная
                  </Link>
               </div>
               <div className="col-3 text-center">
                  <Link className="fs-5" to={EBasicProjectsRoutePaths.allProjects}>
                     Мои проекты
                  </Link>
               </div>
               <div className="col-3 text-center">
                  <Link className="fs-5" to={EBasicDefaultRoutePaths.admin}>
                     Админ панель
                  </Link>
               </div>
               <div className="col-3 text-end">
                  {isAuth ? (
                     <a className="fs-5" onClick={signOut}>
                        {user.email}
                     </a>
                  ) : (
                     <Link className="fs-5" to={EModalDefaultRoutePaths.login} state={{ background: location }}>
                        Войти
                     </Link>
                  )}
               </div>
            </div>
         </div>
      </header>
   );
};
