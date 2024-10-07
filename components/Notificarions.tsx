import React from 'react';
import axios from 'axios';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { MdCircleNotifications } from 'react-icons/md';
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
// Definir la interfaz Notification
interface Notification {
  id: number;
  description: string;
  createdAt: string; // O Date, dependiendo de cómo manejes el formato
}

const NotificationComponent = () => {
  const { data: notifications = [], isLoading, isError, error } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: () => axios.get('/api/notifications/list').then((res) => res.data),
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative">
          <MdCircleNotifications style={{ fontSize: '2rem', color: 'black' }} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-white shadow-lg rounded-md p-2 flex flex-col">
        {isLoading ? (
          <p className="text-center text-gray-500">Cargando...</p>
        ) : isError ? (
          <p className="text-center text-red-500">{(error as any)?.response?.data?.error || 'Error al cargar las notificaciones'}</p>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-500">No hay notificaciones</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li key={notification.id} className="p-2">
                <Link to={notification.id}>
                <h4 className="font-semibold">{notification.description}</h4>
                <p className="text-sm text-gray-600">{new Date(notification.createdAt).toLocaleString()}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationComponent;
