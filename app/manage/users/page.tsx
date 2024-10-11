"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { TableList } from "@/components/common/TableList";
import { User } from "@prisma/client";
import { SimpleCard } from "@/components/common/SimpleCard";
import { toast } from "@/hooks/use-toast"; // Importa el hook de toast
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const statusOptions = [
  { id: "1", label: "en espera", value: "waiting" },
  { id: "2", label: "aceptado", value: "accepted" },
  { id: "3", label: "rechazado", value: "rejected" },
];

const roleOptions = [
  { id: "1", label: "Gerente", value: "companyManager" },
  { id: "2", label: "Administrador", value: "companyAdmin" },
  { id: "3", label: "Super Admin", value: "superAdmin" },
];

export function ManageUsers() {
  const [selectedPurchase, setSelectedPurchase] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la carga
  const [loadingUserId, setLoadingUserId] = useState<number | null>(null); // Estado para rastrear el ID del usuario cuyo botón se hizo clic

  const handleSendData = async (user: User, status: string, role: string) => {
    setSelectedPurchase(user);
    setIsLoading(true); // Inicia la carga
    setLoadingUserId(user.id); // Establece el ID del usuario cuyo botón se hizo clic
    try {
      const statusOption = statusOptions.find((option) => option.label === status);
      const roleOption = roleOptions.find((option) => option.label === role);

      const response = await axios.post("/api/admin/updateUser", {
        id: user.id, // Asegúrate de enviar el ID del usuario
        membershipStatus: statusOption?.value, // Envía el valor en inglés
        role: roleOption?.value, // Envía el valor en inglés
      });
      toast({
        description: response.data.message, // Solo descripción
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al procesar",
        description: (error as any).message,
      });
    } finally {
      setIsLoading(false); // Finaliza la carga
      setLoadingUserId(null); // Restablece el ID del usuario cuyo botón se hizo clic
    }
  };

  const users = useQuery({
    queryKey: ["myUsers"],
    queryFn: () =>
      axios
        .get(`/api/admin/listUsers`)
        .then((res) => res.data),
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "id del usuario",
      enableSorting: true,
    },    
    {
        accessorKey: "email",
        header: "Correo electrónico",
        enableSorting: true,
      },
      {
        accessorKey: "company.id",
        header: "Id de la empresa",
        enableSorting: true,
      },
    {
      accessorKey: "company.name",
      header: "Empresa",
      enableSorting: true,
    },
    {
      accessorKey: "membershipStatus",
      header: "Estado",
      enableSorting: true,
      cell: ({ row }) => {
        const user = row.original;
        const [selectedStatus, setSelectedStatus] = useState(
          statusOptions.find((option) => option.value === user.membershipStatus)
            ?.label || "esperando"
        );

        return (
          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un estado" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.id} value={option.label}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Rol",
      enableSorting: true,
      cell: ({ row }) => {
        const user = row.original;
        const [selectedRole, setSelectedRole] = useState(
          roleOptions.find((option) => option.value === user.role)?.label ||
            "gerenteDeEmpresa"
        );

        return (
          <Select
            value={selectedRole}
            onValueChange={(value) => setSelectedRole(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un rol" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option.id} value={option.label}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "",
      id: "details",
      cell: ({ row }) => {
        const user = row.original;
        const [selectedStatus, setSelectedStatus] = useState(
          statusOptions.find((option) => option.value === user.membershipStatus)
            ?.label || "esperando"
        );
        const [selectedRole, setSelectedRole] = useState(
          roleOptions.find((option) => option.value === user.role)?.label ||
            "gerenteDeEmpresa"
        );

        return (
          <Button
            variant="outline"
            onClick={() =>
              handleSendData(user, selectedStatus, selectedRole)
            }
            disabled={isLoading} // Deshabilita el botón si isLoading es true
          >
            {loadingUserId === user.id ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              "Actualizar usuario"
            )}
          </Button>
        );
      },
    },
  ];

  return (
    <SimpleCard
      title="Usuarios"
      desc="Visualiza aquí los usuarios de la plataforma."
    >
      {users.isLoading ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        !users.isError && (
          <TableList columns={columns} data={users.data || []} />
        )
      )}
      {users.isError && users.error.message}
    </SimpleCard>
  );
}