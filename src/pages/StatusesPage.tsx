import React, { useState, type FC, useEffect } from "react";
import { StatusItem } from "@/components/statuses/StatusItem";
import { Button } from "@/components/ui/Button";
import { useProject } from "@/providers/ProjectProvider";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { type ITaskStatus } from "@/types/ITaskStatus";
import { type Nullable } from "@/types/default";
import { unwrapResult } from "@reduxjs/toolkit";
import statusesActions from "@/store/statuses/actions";
import { EProjectsBasicRoutePaths, type IRouteParams } from "@/router/router";
import { Navigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { getEmptyStatus } from "@/utils/status";
import { toastError, toastSuccess } from "@/utils/functions";
import { ModalProvider } from "@/providers/ModalProvider";
import { LightSpinner } from "@/components/ui/Spinner";

export const MAX_STATUSES_COUNT = 7;
export const MIN_STATUSES_COUNT = 2;

interface StatusesPageProps {}

export const StatusesPage: FC<StatusesPageProps> = ({}) => {
   const { statuses } = useAppSelector((state) => state.statuses);
   const dispatch = useAppDispatch();

   const { projectId } = useParams<IRouteParams["taskCreate"]>();

   const { isError, isLoading } = useProject();
   const [currentStatus, setCurrentStatus] = useState<Nullable<ITaskStatus>>(null);
   const [statusesToEdit, setStatusesToEdit] = useState(statuses);
   const [isLoadingStatus, setIsLoadingStatus] = useState(false);

   useEffect(() => {
      setStatusesToEdit(statuses);
   }, [statuses]);

   if (!projectId) return <Navigate to={EProjectsBasicRoutePaths.allProjects} />;

   const sortedStatuses = [...statusesToEdit].sort((a, b) => a.order - b.order);

   const onDragStartHandler = (status: ITaskStatus): void => {
      setCurrentStatus(status);
   };

   const onDropHandler = (status: ITaskStatus): void => {
      if (!currentStatus) return;
      if (currentStatus.order === status.order) return;
      updateProjectStatusesOrder(status, currentStatus);
   };

   const onChangeHandler = (status: ITaskStatus): void => {
      setStatusesToEdit((prevStatuses) =>
         prevStatuses.map((prevStatus) => {
            if (prevStatus.id === status.id) {
               return { ...prevStatus, ...status };
            }
            return prevStatus;
         })
      );
   };

   const updateProjectStatusesOrder = async (status: ITaskStatus, currentStatus: ITaskStatus): Promise<void> => {
      const newStatuses = statuses.map((prevStatus) => {
         if (prevStatus.order === currentStatus.order) {
            return { ...currentStatus, order: status.order };
         }
         if (currentStatus.order < status.order && prevStatus.order > currentStatus.order && prevStatus.order <= status.order) {
            return { ...prevStatus, order: prevStatus.order - 1 };
         }
         if (currentStatus.order > status.order && prevStatus.order >= status.order && prevStatus.order < currentStatus.order) {
            return { ...prevStatus, order: prevStatus.order + 1 };
         }
         return prevStatus;
      });

      try {
         setIsLoadingStatus(true);
         unwrapResult(await dispatch(statusesActions.updateProjectStatuses({ statuses: newStatuses, projectId })));
         toastSuccess("Порядок обновлен");
      } catch (error) {
         toastError(error);
      } finally {
         setIsLoadingStatus(false);
      }
   };

   const deleteStatus = async (statusId: string): Promise<void> => {
      try {
         setIsLoadingStatus(true);

         const statusToDelete = statuses.find((status) => status.id === statusId);
         if (!statusToDelete) throw "Статус не найден";
         let newStatuses = statuses.filter((status) => status.id !== statusId);
         newStatuses = newStatuses.map((prevStatus) => {
            if (prevStatus.order > statusToDelete.order) {
               return { ...prevStatus, order: prevStatus.order - 1 };
            }
            return prevStatus;
         });

         unwrapResult(await dispatch(statusesActions.updateProjectStatuses({ statuses: newStatuses, projectId })));
         toastSuccess("Статус удален");
      } catch (error) {
         toastError(error);
      } finally {
         setIsLoadingStatus(false);
      }
   };

   const createStatus = async (): Promise<void> => {
      const maxOrder = statusesToEdit.reduce((acc, status) => {
         if (status.order > acc) return status.order;
         return acc;
      }, 0);
      const newStatus = getEmptyStatus(maxOrder + 1);
      try {
         setIsLoadingStatus(true);
         unwrapResult(await dispatch(statusesActions.createStatus({ statusFormState: newStatus, projectId })));
         toastSuccess("Статус добавлен");
      } catch (error) {
         toastError(error);
      } finally {
         setIsLoadingStatus(false);
      }
   };

   const updateStatus = async (status: ITaskStatus): Promise<void> => {
      try {
         setIsLoadingStatus(true);
         unwrapResult(await dispatch(statusesActions.updateStatus(status)));
         toastSuccess("Статус обновлен");
      } catch (error) {
         toastError(error);
      } finally {
         setIsLoadingStatus(false);
      }
   };

   const resetStatuses = (): void => {
      setStatusesToEdit(statuses);
   };

   if (isLoading || isError) return null;
   return (
      <>
         <div className="project__wrap project__wrap_statuses  mb-5">
            <div className="project__table">
               <div style={{ minWidth: 1000 }}>
                  <div className="d-flex">
                     {sortedStatuses.map((status) => (
                        <StatusItem
                           status={status}
                           key={status.id}
                           onDragStart={() => onDragStartHandler(status)}
                           onDrop={() => onDropHandler(status)}
                           onDelete={async () => await deleteStatus(status.id)}
                           onChange={(partialStatus) => onChangeHandler({ ...status, ...partialStatus })}
                           statusCount={sortedStatuses.length}
                           updateStatus={async () => await updateStatus(status)}
                        />
                     ))}
                     {sortedStatuses.length < MAX_STATUSES_COUNT && (
                        <div className="status-card status-card_plus">
                           <FontAwesomeIcon icon={faSquarePlus} onClick={createStatus} />
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>

         <div className="row">
            <div className="col-md-2">
               <Button type="submit">Сохранить</Button>
            </div>
            <div className="col-md-2 mb-2">
               <Button onClick={resetStatuses} type="button">
                  Сбросить изменения
               </Button>
            </div>
         </div>

         {isLoadingStatus && (
            <ModalProvider>
               <LightSpinner />
            </ModalProvider>
         )}
      </>
   );
};
