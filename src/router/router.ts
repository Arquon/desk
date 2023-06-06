import { AdminPage } from "@/pages/AdminPage";
import { LoginPage } from "@/pages/LoginPage";
import { MainPage } from "@/pages/MainPage";
import { ProjectCreatePage } from "@/pages/ProjectCreatePage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { SingleTaskPage } from "@/pages/SingleTaskPage";
import { TaskCreatePage } from "@/pages/TaskCreatePage";
import { TasksPage } from "@/pages/TasksPage";
import { type FC } from "react";
import { generatePath, matchPath } from "react-router-dom";

export enum EBasicDefaultRoutePaths {
   landing = "/",
   admin = "/admin",
}

export enum EBasicProjectsRoutePaths {
   allProjects = "/projects",
   newProject = "/projects/new",
}

export enum EBasicTasksRoutePaths {
   projectTasks = "/:projectId/tasks",
}

type BasicRoutes = EBasicDefaultRoutePaths | EBasicProjectsRoutePaths | EBasicTasksRoutePaths;

export enum EModalDefaultRoutePaths {
   login = "/login",
}

export enum EModalProjectsRoutePaths {
   projectCreate = "/projects/new",
}

export enum EModalTasksRoutePaths {
   taskView = "/:projectId/task/:taskId",
   taskCreate = "/:projectId/task/new",
}

export interface IRouteParams {
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
}

type ModalRoutes = EModalDefaultRoutePaths | EModalProjectsRoutePaths | EModalTasksRoutePaths;

interface IRoute {
   name: string;
   Element: FC;
}

interface IBasicRoute extends IRoute {
   index?: true;
   baseBackground?: never;
   path: BasicRoutes;
}
interface IModalRoute extends IRoute {
   index?: never;
   baseBackground: BasicRoutes;
   path: ModalRoutes;
}

const defaultRoutes: IBasicRoute[] = [
   {
      name: "main",
      Element: MainPage,
      index: true,
      path: EBasicDefaultRoutePaths.landing,
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
   },
   {
      name: "allTasks",
      Element: TasksPage,
      path: EBasicTasksRoutePaths.projectTasks,
   },
];

const commonModalRoutes: IModalRoute[] = [
   {
      name: "login",
      Element: LoginPage,
      baseBackground: EBasicDefaultRoutePaths.landing,
      path: EModalDefaultRoutePaths.login,
   },
];

const projectsModalRoutes: IModalRoute[] = [
   {
      name: "projectCreate",
      Element: ProjectCreatePage,
      baseBackground: EBasicProjectsRoutePaths.allProjects,
      path: EModalProjectsRoutePaths.projectCreate,
   },
];

const tasksModalRoutes: IModalRoute[] = [
   {
      name: "taskCreate",
      Element: TaskCreatePage,
      baseBackground: EBasicTasksRoutePaths.projectTasks,
      path: EModalTasksRoutePaths.taskCreate,
   },
   {
      name: "taskView",
      Element: SingleTaskPage,
      baseBackground: EBasicTasksRoutePaths.projectTasks,
      path: EModalTasksRoutePaths.taskView,
   },
];

const modalRoutes = [...commonModalRoutes, ...tasksModalRoutes, ...projectsModalRoutes];

export function getModalRouteBackground(path: string): string | undefined {
   for (const modalRoute of modalRoutes) {
      const match = matchPath(modalRoute.path, path);
      if (match) {
         const generatedPath = generatePath(modalRoute.baseBackground, {
            projectId: match.params.projectId ?? null,
         });
         return generatedPath;
      }
   }
}

export { defaultRoutes, modalRoutes };
