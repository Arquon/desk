import { TasksContent } from "@/components/projects/ProjectContainer";
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

export enum EModalDefaultRoutePaths {
   login = "/login",
}

export enum EBasicProjectsRoutePaths {
   allProjects = "/projects",
   newProject = "/projects/new",
   viewProject = "/projects/:projectId",
}

export enum EModalProjectsRoutePaths {
   projectCreate = "/projects/new",
}

export enum EBasicTasksRoutePaths {
   projectTasks = "/projects/:projectId/tasks",
}

export enum EModalTasksRoutePaths {
   taskView = "/projects/:projectId/tasks/:taskId",
   taskCreate = "/projects/:projectId/tasks/new",
}

export enum EBasicNotesRoutePaths {
   projectNotes = "/projects/:projectId/notes",
}

type BasicRoutes = EBasicDefaultRoutePaths | EBasicProjectsRoutePaths | EBasicTasksRoutePaths | EBasicNotesRoutePaths;

type ModalRoutes = EModalDefaultRoutePaths | EModalProjectsRoutePaths | EModalTasksRoutePaths;

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
   children?: IBasicRoute[];
}

export interface IBasicRoute extends IRoute {
   index?: true;
   baseBackground?: never;
   path: BasicRoutes;
}
interface IModalRoute extends IRoute {
   index?: never;
   baseBackground: BasicRoutes;
   path: ModalRoutes;
   children?: never;
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
      name: "projectView",
      Element: ProjectViewPage,
      path: EBasicProjectsRoutePaths.viewProject,
      children: [
         {
            name: "projectTasks",
            Element: TasksContent,
            path: EBasicTasksRoutePaths.projectTasks,
         },
         {
            name: "projectNotes",
            Element: () => null,
            path: EBasicNotesRoutePaths.projectNotes,
         },
      ],
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
      Element: TaskViewPage,
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
