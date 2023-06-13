import { TasksPage } from "@/pages/TasksPage";
import { AdminPage } from "@/pages/AdminPage";
import { LoginPage } from "@/pages/LoginPage";
import { MainPage } from "@/pages/MainPage";
import { ProjectCreatePage } from "@/pages/ProjectCreatePage";
import { ProjectViewPage } from "@/pages/ProjectViewPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { TaskViewPage } from "@/pages/TaskViewPage";
import { TaskCreatePage } from "@/pages/TaskCreatePage";
import { type FC } from "react";
import { generatePath, matchPath } from "react-router-dom";

export enum EBasicDefaultRoutePaths {
   landing = "/",
   admin = "/admin",
}

export enum EBasicProjectsRoutePaths {
   allProjects = "/projects",
   newProject = "/projects/new",
   viewProject = "/projects/:projectId",
   projectCreate = "/projects/new",
}

export enum EBasicTasksRoutePaths {
   projectTasks = "/projects/:projectId/tasks",
   taskView = "/projects/:projectId/tasks/:taskId",
   taskCreate = "/projects/:projectId/tasks/new",
}

export enum EBasicNotesRoutePaths {
   projectNotes = "/projects/:projectId/notes",
}

type BasicRoutes = EBasicDefaultRoutePaths | EBasicProjectsRoutePaths | EBasicTasksRoutePaths | EBasicNotesRoutePaths;

export enum EModalDefaultRoutePaths {
   login = "/login",
}

type ModalRoutes = EModalDefaultRoutePaths;

export interface IRouteParams {
   viewProject: {
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
   children?: TBasicRoute[];
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
   {
      name: "admin",
      Element: AdminPage,
      path: EBasicDefaultRoutePaths.admin,
   },
   {
      name: "projects",
      Element: ProjectsPage,
      path: EBasicProjectsRoutePaths.allProjects,
      children: [
         {
            name: "projectCreate",
            Element: ProjectCreatePage,
            path: EBasicProjectsRoutePaths.projectCreate,
         },
      ],
   },
   {
      name: "projectView",
      Element: ProjectViewPage,
      path: EBasicProjectsRoutePaths.viewProject,
      children: [
         {
            name: "projectTasks",
            Element: TasksPage,
            path: EBasicTasksRoutePaths.projectTasks,
            children: [
               {
                  name: "taskCreate",
                  Element: TaskCreatePage,
                  path: EBasicTasksRoutePaths.taskCreate,
               },
               {
                  name: "taskView",
                  Element: TaskViewPage,
                  path: EBasicTasksRoutePaths.taskView,
               },
            ],
         },
         {
            name: "projectNotes",
            Element: () => null,
            path: EBasicNotesRoutePaths.projectNotes,
         },
      ],
   },
];

const modalRoutes: IModalRoute[] = [
   {
      name: "login",
      Element: LoginPage,
      baseBackground: EBasicDefaultRoutePaths.landing,
      path: EModalDefaultRoutePaths.login,
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
