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
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<{ [key: number]: string }>({});
  const [selectedRole, setSelectedRole] = useState<{ [key: number]: string }>({});

  const handleSendData = async (user: User, status: string, role: string) => {
    setIsLoading(true);
    setLoadingUserId(user.id);
    try {
      const statusOption = statusOptions.find((option) => option.label === status);
      const roleOption = roleOptions.find((option) => option.label === role);

      const response = await axios.post("/api/admin/updateUser", {
        id: user.id,
        membershipStatus: statusOption?.value,
        role: roleOption?.value,
      });
      toast({
        description: response.data.message,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al procesar",
        description: (error as any).message,
      });
    } finally {
      setIsLoading(false);
      setLoadingUserId(null);
    }
  };

  const users = useQuery({
    queryKey: ["myUsers"],
    queryFn: () => axios.get(`/api/admin/listUsers`).then((res) => res.data),
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
      accessorKey: "company.nit",
      header: "NIT",
      enableSorting: true,
    },
    {
      accessorKey: "membershipStatus",
      header: "Estado",
      enableSorting: true,
      cell: function StatusCell({ row }) {
        const user = row.original;
        const status = selectedStatus[user.id] ?? statusOptions.find((option) => option.value === user.membershipStatus)?.label ?? "esperando";

        return (
          <Select
            value={status}
            onValueChange={(value) => setSelectedStatus((prev) => ({ ...prev, [user.id]: value }))}
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
      cell: function RoleCell({ row }) {
        const user = row.original;
        const role = selectedRole[user.id] ?? roleOptions.find((option) => option.value === user.role)?.label ?? "gerenteDeEmpresa";

        return (
          <Select
            value={role}
            onValueChange={(value) => setSelectedRole((prev) => ({ ...prev, [user.id]: value }))}
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
      id: "actions",
      cell: function ActionsCell({ row }) {
        const user = row.original;
        const status = selectedStatus[user.id] ?? statusOptions.find((option) => option.value === user.membershipStatus)?.label ?? "esperando";
        const role = selectedRole[user.id] ?? roleOptions.find((option) => option.value === user.role)?.label ?? "gerenteDeEmpresa";

        return (
          <Button
            variant="outline"
            onClick={() => handleSendData(user, status, role)}
            disabled={isLoading}
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
