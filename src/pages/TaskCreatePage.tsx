import { TaskForm } from "@/components/tasks/TaskForm";
import { AuthRequire } from "@/hoc/AuthRequire";
import React, { type FC } from "react";

interface TaskCreatePageProps {}

export const TaskCreateComponent: FC<TaskCreatePageProps> = () => {
   return (
      <div className="container-sm">
         <div className="bg-white rounded shadow p-4">
            <TaskForm />
         </div>
      </div>
   );
};

export const TaskCreatePage: FC<TaskCreatePageProps> = (props) => {
   return (
      <AuthRequire>
         <TaskCreateComponent {...props} />
      </AuthRequire>
   );
};
