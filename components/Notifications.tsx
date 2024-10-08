import React from "react";
import axios from "axios";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { MdCircleNotifications } from "react-icons/md";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";

interface Notification {
  id: number;
  description: string;
  createdAt: string;
  read: boolean;
  type: string; // Añadido el campo type
}

const NotificationComponent = () => {
  const queryClient = useQueryClient();
  const {
    data: { notifications = [], readCount = 0 } = {},
    isLoading,
    isError,
    error,
  } = useQuery({
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

  const handleMouseEnter = async (id: number) => {
    try {
      await axios.post("/api/notifications/read", { id });
      queryClient.invalidateQueries(["notifications"]);
    } catch (error) {
      console.error("Error al marcar la notificación como leída:", error);
    }
  };

  const handleClick = async (notification: Notification) => {
    try {
      await axios.post("/api/notifications/read", { id: notification.id });
      queryClient.invalidateQueries(["notifications"]);
      if (notification.type === "offer_rejected") {
        window.location.href = "/records/offersRecord";
      } else if (notification.type === "auction_has_new_offer") {
        window.location.href = "/manage/auctions";
      }else if (notification.type === "offer_accepted") {
        window.location.href = "/records/shoppingRecord";
      }
    } catch (error) {
      console.error("Error al marcar la notificación como leída:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative">
          <MdCircleNotifications style={{ fontSize: "2rem", color: "black" }} />
          {readCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
              {readCount}
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
                onMouseEnter={() => handleMouseEnter(notification.id)}
                onClick={() => handleClick(notification)}
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
