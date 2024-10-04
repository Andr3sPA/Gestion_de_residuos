'use client'

import { OfferForm } from "@/components/register/offer";
import { WasteForm } from "@/components/register/waste";
import { SimpleCard } from "@/components/SimpleCard";
import { TableList } from "@/components/TableList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { Loader2Icon, LucideRefreshCw, MoreHorizontal, PlusIcon, RefreshCcwDotIcon, RefreshCcwIcon, RefreshCwIcon } from "lucide-react";
import { useState } from "react";

interface Waste {
  id: number; // ID de la oferta
  wasteType: {
    wasteType: string; // Tipo de residuo
  } | null;
  unitType: {
    unitName: string; // Tipo de unidad
  } | null;
  description: string | null; // Descripción de la oferta
  units: number; // Unidades disponibles
  expirationDate: string | null; // Fecha de expiración
  createdAt: string; // Fecha de creación
};

export default function ManageOffers() {
  const wastes = useQuery({
    queryKey: ['myWastes'],
    queryFn: () => axios.get("/api/waste/list")
      .then((res) => res.data),
  })
  const [selectedWasteId, setSelectedWasteId] = useState<number | null>(null)
  const [addWasteOpen, setAddWasteOpen] = useState(false)

  const columns: ColumnDef<Waste>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "wasteType",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Waste Type
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.wasteType
            ? row.original.wasteType.wasteType
            : "N/A"}
        </div>
      ),
    },
    {
      id: "unitType",
      header: "Unit Type",
      cell: ({ row }) => {
        const unitType = row.original.unitType;
        return (
          <div className="capitalize">
            {unitType ? unitType.unitName : "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div>{row.getValue("description") || "N/A"}</div>
      ),
    },
    {
      accessorKey: "units",
      header: () => <div className="text-right">Units</div>,
      cell: ({ row }) => {
        const units = parseFloat(row.getValue("units"));
        return (
          <div className="text-right font-medium">{units}</div>
        );
      },
    },
    {
      accessorKey: "expirationDate",
      header: "Expiration Date",
      cell: ({ row }) => {
        const expirationDate = row.getValue("expirationDate") as string;
        const date = new Date(expirationDate);
        const formattedDate = !isNaN(date.getTime())
          ? date.toLocaleDateString("es-ES")
          : "N/A"; // Muestra "N/A" si la fecha no es válida
        return <div>{formattedDate}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string;
        const date = new Date(createdAt);
        const formattedDate = !isNaN(date.getTime())
          ? date.toLocaleDateString("es-ES")
          : "N/A"; // Muestra "N/A" si la fecha no es válida
        return <div>{formattedDate}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const wasteId = row.original.id;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" >
              <DropdownMenuItem className="hover:cursor-pointer" onClick={() => setSelectedWasteId(wasteId)}>
                Ofertar
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:cursor-pointer">
                Editar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = wastes.isLoading ?
    <Loader2Icon className="animate-spin" />
    :
    <TableList columns={columns} data={wastes.data} />


  return <div>
    {selectedWasteId ?
      <SimpleCard title="Crear oferta">
        <OfferForm
          wasteId={selectedWasteId}
          onCancel={() => setSelectedWasteId(null)}
        />
      </SimpleCard>
      :
      <SimpleCard
        title="Mis residuos"
        headerActions={wastes.isSuccess &&
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
                <DialogTitle className="font-bold text-lg">Añadir nuevo residuo</DialogTitle>
                <DialogDescription className="sr-only">Crear un nuevo residuo</DialogDescription>
                <WasteForm onCancel={() => setAddWasteOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        }
      >
        {table}
      </SimpleCard >
    }
  </div >
}
