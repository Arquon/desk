import { AuthRequire } from "@/hoc/AuthRequire";
import React, { type FC } from "react";

interface AdminPageProps {}

export const AdminPageComponent: FC<AdminPageProps> = ({}) => {
   return (
      <section className="admin">
         <div className="container">AdminPage</div>
      </section>
   );
};

export const AdminPage: FC<AdminPageProps> = (props) => {
   return (
      <AuthRequire>
         <AdminPageComponent {...props} />
      </AuthRequire>
   );
};
