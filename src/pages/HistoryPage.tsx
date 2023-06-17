import { HistoryTable } from "@/components/history/HistoryTable";
import { useProject } from "@/providers/ProjectProvider";
import React, { type FC } from "react";
import { Outlet } from "react-router-dom";
import { ETaskViewPages } from "./TaskViewPage";

interface HistoryPageProps {}

export const HistoryPage: FC<HistoryPageProps> = ({}) => {
   const { isLoading, isError } = useProject();

   return (
      <>
         {!(isLoading || isError) && <HistoryTable />}
         <Outlet context={{ currentPage: ETaskViewPages.history }} />
      </>
   );
};
