"use client";

import { SimpleCard } from "@/components/common/SimpleCard";
import { TableList } from "@/components/common/TableList";
import { AuctionForm } from "@/components/register/AuctionForm";
import { WasteForm } from "@/components/register/WasteForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import {
  Loader2Icon,
  LucideRefreshCw,
  MoreHorizontal,
  PlusIcon,
} from "lucide-react";
import { useState } from "react";

interface Waste {
  id: number;
  wasteType: {
    name: string;
  } | null;
  unitType: {
    name: string;
  } | null;
  description: string | null;
  units: number;
  category: string; // Nueva propiedad
  createdAt: string;
}

export default function ManageWastes() {
  const wastes = useQuery({
    queryKey: ["myWastes"],
    queryFn: () => axios.get("/api/wastes/list").then((res) => res.data),
  });

  const [selectedWasteId, setSelectedWasteId] = useState<number | null>(null);
  const [addWasteOpen, setAddWasteOpen] = useState(false);

  const columns: ColumnDef<Waste>[] = [
    {
      accessorKey: "id",
      header: "ID",
      enableSorting: true,
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "WasteType",
      header: "Tipo de Residuo",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.wasteType ? row.original.wasteType.name : "N/A"}
        </div>
      ),
    },
    {
      id: "unitType",
      header: "Tipo de Unidad",
      accessorKey: "unitType",
      enableSorting: true,
      cell: ({ row }) => {
        const unitType = row.original.unitType;
        return (
          <div className="capitalize">{unitType ? unitType.name : "N/A"}</div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Descripción",
      enableSorting: true,
      cell: ({ row }) => <div>{row.getValue("description") || "N/A"}</div>,
    },
    {
      accessorKey: "units",
      enableSorting: true,
      sortingFn: "alphanumeric",
      header: () => <div className="text-right">Unidades</div>,
      cell: ({ row }) => {
        const units = parseFloat(row.getValue("units"));
        return <div className="text-right font-medium">{units}</div>;
      },
    },
    {
      accessorKey: "category", // Nueva columna
      header: "Categoría",
      enableSorting: true,
      cell: ({ row }) =>
        row.getValue("category") === "nonUsable" ? "No usable" : "Usable",
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de Creación",
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string;
        const date = new Date(createdAt);
        const formattedDate = !isNaN(date.getTime())
          ? date.toLocaleDateString("es-ES")
          : "N/A";
        return <div>{formattedDate}</div>;
      },
    },
    {
      id: "actions",
      header: "Acciones",
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const wasteId = row.original.id;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => setSelectedWasteId(wasteId)}
              >
                Subastar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = wastes.isLoading ? (
    <Loader2Icon className="animate-spin" />
  ) : (
    <TableList columns={columns} data={wastes.data} />
  );

  return selectedWasteId ? (
    <SimpleCard className="ml10" title="Subastar residuo">
      <AuctionForm
        wasteId={selectedWasteId}
        onCancel={() => setSelectedWasteId(null)}
      />
    </SimpleCard>
  ) : (
    <>
      <SimpleCard
        title="Mis residuos"
        desc="Gestiona aquí los residuos de tu empresa"
        headerActions={
          wastes.isSuccess && (
            <div className="flex justify-end gap-4">
              <Button
                variant={"secondary"}
                disabled={wastes.isRefetching}
                onClick={() => wastes.refetch()}
              >
                <LucideRefreshCw
                  className={`w-5 h-5 ${wastes.isRefetching ? "animate-spin" : ""}`}
                />
              </Button>
              <Dialog open={addWasteOpen} onOpenChange={setAddWasteOpen}>
                <DialogTrigger asChild>
                  <Button size={"sm"}>
                    <PlusIcon />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle className="font-bold text-lg">
                    Añadir nuevo residuo
                  </DialogTitle>
                  <WasteForm onCancel={() => setAddWasteOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          )
        }
      >
        {table}
      </SimpleCard>
    </>
  );
}
