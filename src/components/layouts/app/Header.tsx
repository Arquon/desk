import { Container } from "@/components/ui/Container";
import { EDefaultBasicRoutePaths, EDefaultModalRoutePaths, EProjectsBasicRoutePaths } from "@/router/router";
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
         <Container>
            <div className="row py-5">
               <div className="col-4">
                  <Link className="fs-5" to={EDefaultBasicRoutePaths.landing}>
                     Главная
                  </Link>
               </div>
               <div className="col-4 text-center">
                  <Link className="fs-5" to={EProjectsBasicRoutePaths.allProjects}>
                     Мои проекты
                  </Link>
               </div>
               {/* <div className="col-3 text-center">
                  <Link className="fs-5" to={EBasicDefaultRoutePaths.admin}>
                     Админ панель
                  </Link>
               </div> */}
               <div className="col-4 text-end">
                  {isAuth ? (
                     <a className="fs-5" onClick={signOut}>
                        {user.email}
                     </a>
                  ) : (
                     <Link className="fs-5" to={EDefaultModalRoutePaths.login} state={{ background: location }}>
                        Войти
                     </Link>
                  )}
               </div>
            </div>
         </Container>
      </header>
   );
};
