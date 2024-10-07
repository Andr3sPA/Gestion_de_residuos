import React from "react";
import axios from "axios";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { MdCircleNotifications } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
// Definir la interfaz Notification
interface Notification {
  id: number;
  description: string;
  createdAt: string; // O Date, dependiendo de cómo manejes el formato
}

const NotificationComponent = () => {
  const {
    data: notifications = [],
    isLoading,
    isError,
    error,
  } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: () => axios.get("/api/notifications/list").then((res) => res.data),
  });

  const formatDate = (date: string) => {
    const d = new Date(date);
    const today = new Date(Date.now());
    if (
      today.getDate() === d.getDate() &&
      today.getMonth() === d.getMonth() &&
      today.getFullYear() === d.getFullYear()
    ) {
      return d.toLocaleTimeString("es-LA", {
        timeStyle: "short",
      });
    }
    return d.toLocaleDateString("es-LA", {
      dateStyle: "short",
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative">
          <MdCircleNotifications style={{ fontSize: "2rem", color: "black" }} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-sm bg-white mr-2 shadow-lg rounded-md p-2 flex flex-col">
        {isLoading ? (
          <p className="text-center text-gray-500">Cargando...</p>
        ) : isError ? (
          <p className="text-center text-red-500">
            {(error as any)?.response?.data?.error ||
              "Error al cargar las notificaciones"}
          </p>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-500">No hay notificaciones</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="p-1 w-full flex flex-col gap-1"
              >
                <Button
                  variant={"ghost"}
                  className="w-full font-semibold text-wrap overflow-ellipsis text-left"
                >
                  {notification.description}
                </Button>
                <span className="text-xs text-gray-600 font-light align-bottom text-right">
                  {formatDate(notification.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationComponent;
