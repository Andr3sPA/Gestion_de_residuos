'use client'

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { TableList } from "@/components/TableList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { SimpleCard } from "@/components/SimpleCard";
import { useState } from "react";
import { WasteForm } from "@/components/register/waste";

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
      .then((res) => res.data)
  })
  const [selectedWasteId, setSelectedWasteId] = useState<number | null>(null)

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
        row.index === 0 && console.log(date)
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
          <Button onClick={() => setSelectedWasteId(wasteId)}>
            Ofertar
          </Button>
        );
      },
    },
  ];

  const table = wastes.isLoading ?
    <Loader2Icon className="animate-spin" />
    :
    <TableList columns={columns} data={wastes.data} />


  return <SimpleCard title="Mis residuos">
    {selectedWasteId ?
      <WasteForm />
      :
      table
    }
  </SimpleCard>
}
