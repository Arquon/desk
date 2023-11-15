import React, { type FC } from "react";

import { TasksPage } from "@/pages/TasksPage";
// import { AdminPage } from "@/pages/AdminPage";
import { LoginPage } from "@/pages/LoginPage";
import { MainPage } from "@/pages/MainPage";
import { ProjectCreatePage } from "@/pages/ProjectCreatePage";
import { ProjectViewPage } from "@/pages/ProjectViewPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { TaskViewPage } from "@/pages/TaskViewPage";
import { TaskCreatePage } from "@/pages/TaskCreatePage";
import { type RouteObject, generatePath, matchPath, Navigate } from "react-router-dom";
import { StatusesPage } from "@/pages/StatusesPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { PortalPage } from "@/components/portal/PortalPage";
import { MainLayout } from "@/components/layouts/MainLayout";

export enum EDefaultBasicRoutePaths {
   landing = "/",
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

export enum EDefaultModalRoutePaths {
   login = "/login",
}

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

const defaultRoutes: RouteObject[] = [
   {
      element: <MainLayout />,
      children: [
         {
            element: <MainPage />,
            path: EDefaultBasicRoutePaths.landing,
         },
         {
            element: <ProjectsPage />,
            path: EProjectsBasicRoutePaths.allProjects,
            children: [
               {
                  element: <ProjectCreatePage />,
                  path: EProjectsBasicRoutePaths.projectCreate,
               },
            ],
         },
         {
            element: <ProjectViewPage />,
            path: EProjectsBasicRoutePaths.projectView,
            children: [
               {
                  element: <TasksPage />,
                  path: ETasksBasicRoutePaths.projectTasks,
                  children: [
                     {
                        element: <TaskCreatePage />,
                        path: ETasksBasicRoutePaths.taskCreate,
                     },
                     {
                        element: <TaskViewPage />,
                        path: ETasksBasicRoutePaths.taskView,
                     },
                  ],
               },
               {
                  element: <HistoryPage />,
                  path: EHistoryBasicRoutePaths.projectHistory,
                  children: [
                     {
                        element: <TaskViewPage />,
                        path: EHistoryBasicRoutePaths.taskView,
                     },
                  ],
               },
               {
                  element: <StatusesPage />,
                  path: EStatusesBasicRoutePaths.projectStatuses,
               },
               {
                  element: null,
                  path: ENotesBasicRoutePaths.projectNotes,
               },
            ],
         },
      ],
   },

   {
      path: "*",
      element: <Navigate to="/" />,
   },
];

const modalRoutes: RouteObject[] = [
   {
      element: <PortalPage />,
      children: [
         {
            element: <LoginPage />,
            path: EDefaultModalRoutePaths.login,
            baseBackground: "/",
         },
      ],
   },
];

interface RoutePathAndBackground {
   path?: string;
   baseBackground?: string;
}

function getAllModalRoutesArray(modalRoutes: RouteObject[]): RoutePathAndBackground[] {
   const resultArray: RoutePathAndBackground[] = [];

   function test(routes: RouteObject[]): void {
      for (const route of routes) {
         resultArray.push({ path: route.path, baseBackground: route.baseBackground });

         if (route.children) test(route.children);
      }
   }

   test(modalRoutes);

   return resultArray;
}

const modalRoutesList = getAllModalRoutesArray(modalRoutes);

export function getModalRouteBackground(path: string): string | undefined {
   for (const modalRoute of modalRoutesList) {
      const match = modalRoute.path && matchPath(modalRoute.path, path);

      if (match && modalRoute.baseBackground) {
         const generatedPath = generatePath(modalRoute.baseBackground, {
            projectId: match.params.projectId ?? null,
            taskId: match.params.taskId ?? null,
         });
         return generatedPath;
      }
   }
}

export { defaultRoutes, modalRoutes };
