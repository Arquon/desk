import { TasksPage } from "@/pages/TasksPage";
// import { AdminPage } from "@/pages/AdminPage";
import { LoginPage } from "@/pages/LoginPage";
import { MainPage } from "@/pages/MainPage";
import { ProjectCreatePage } from "@/pages/ProjectCreatePage";
import { ProjectViewPage } from "@/pages/ProjectViewPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { TaskViewPage } from "@/pages/TaskViewPage";
import { TaskCreatePage } from "@/pages/TaskCreatePage";
import { type FC } from "react";
import { generatePath, matchPath } from "react-router-dom";
import { StatusesPage } from "@/pages/StatusesPage";
import { HistoryPage } from "@/pages/HistoryPage";

export enum EDefaultBasicRoutePaths {
   landing = "/",
   // admin = "/admin",
}

export enum EProjectsBasicRoutePaths {
   allProjects = "/projects",
   projectView = "/projects/:projectId",
   projectCreate = "/projects/new",
}

export enum ETasksBasicRoutePaths {
   projectTasks = "/projects/:projectId/tasks",
   taskView = "/projects/:projectId/tasks/:taskId",
   taskCreate = "/projects/:projectId/tasks/new",
}

export enum EHistoryBasicRoutePaths {
   projectHistory = "/projects/:projectId/history",
   taskView = "/projects/:projectId/history/:taskId",
}

export enum EStatusesBasicRoutePaths {
   projectStatuses = "/projects/:projectId/statuses",
}

export enum ENotesBasicRoutePaths {
   projectNotes = "/projects/:projectId/notes",
}

type BasicRoutes = EDefaultBasicRoutePaths | EProjectsBasicRoutePaths | ETasksBasicRoutePaths | EStatusesBasicRoutePaths | ENotesBasicRoutePaths;

export enum EDefaultModalRoutePaths {
   login = "/login",
}

type ModalRoutes = EDefaultModalRoutePaths;

export interface IRouteParams {
   projectView: {
      projectId: string;
   };
   projectTasks: {
      projectId: string;
   };
   taskView: {
      projectId: string;
      taskId: string;
   };
   taskCreate: {
      projectId: string;
   };
   projectNotes: {
      projectId: string;
   };
}

interface IRoute {
   name: string;
   Element: FC;
}

interface IBasicIndexedRoute extends IRoute {
   index: true;
   path?: never;
}

interface IBasicNonIndexedRoute extends IRoute {
   index?: never;
   path: string;
}

export type TBasicRoute = (IBasicIndexedRoute | IBasicNonIndexedRoute) & {
   baseBackground?: never;
   children?: TBasicRoute[];
};

interface IModalRoute extends IRoute {
   index?: never;
   baseBackground: BasicRoutes;
   path: ModalRoutes;
   children?: never;
}

const defaultRoutes: TBasicRoute[] = [
   {
      name: "main",
      Element: MainPage,
      index: true,
   },
   // {
   //    name: "admin",
   //    Element: AdminPage,
   //    path: EBasicDefaultRoutePaths.admin,
   // },
   {
      name: "projects",
      Element: ProjectsPage,
      path: EProjectsBasicRoutePaths.allProjects,
      children: [
         {
            name: "projectCreate",
            Element: ProjectCreatePage,
            path: EProjectsBasicRoutePaths.projectCreate,
         },
      ],
   },
   {
      name: "projectView",
      Element: ProjectViewPage,
      path: EProjectsBasicRoutePaths.projectView,
      children: [
         {
            name: "projectTasks",
            Element: TasksPage,
            path: ETasksBasicRoutePaths.projectTasks,
            children: [
               {
                  name: "taskCreate",
                  Element: TaskCreatePage,
                  path: ETasksBasicRoutePaths.taskCreate,
               },
               {
                  name: "taskView",
                  Element: TaskViewPage,
                  path: ETasksBasicRoutePaths.taskView,
               },
            ],
         },
         {
            name: "projectHistory",
            Element: HistoryPage,
            path: EHistoryBasicRoutePaths.projectHistory,
            children: [
               {
                  name: "historyTaskView",
                  Element: TaskViewPage,
                  path: EHistoryBasicRoutePaths.taskView,
               },
            ],
         },
         {
            name: "projectStatuses",
            Element: StatusesPage,
            path: EStatusesBasicRoutePaths.projectStatuses,
         },
         {
            name: "projectNotes",
            Element: () => null,
            path: ENotesBasicRoutePaths.projectNotes,
         },
      ],
   },
];

const modalRoutes: IModalRoute[] = [
   {
      name: "login",
      Element: LoginPage,
      baseBackground: EDefaultBasicRoutePaths.landing,
      path: EDefaultModalRoutePaths.login,
   },
];

export function getModalRouteBackground(path: string): string | undefined {
   for (const modalRoute of modalRoutes) {
      const match = matchPath(modalRoute.path, path);
      if (match) {
         const generatedPath = generatePath(modalRoute.baseBackground, {
            projectId: match.params.projectId ?? null,
            taskId: match.params.taskId ?? null,
         });
         return generatedPath;
      }
   }
}

export { defaultRoutes, modalRoutes };
