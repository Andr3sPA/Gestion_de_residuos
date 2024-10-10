"use client";

import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SimpleCard } from "@/components/common/SimpleCard";
import { TableList } from "@/components/common/TableList";
import { ManageOffers } from "@/components/ManageOffers";

export interface Auction {
  id: number;
  wasteId: number;
  conditions: string;
  expiresAt: string; // Mueve expirationDate dentro del objeto waste
  waste: {
    description: string;
    unitType: {
      name: string;
    };
    wasteType: {
      name: string;
    };
  };
  units: number;
  companySeller: {
    name: string;
  };
  pickupLatitude: string;
  pickupLongitude: string;
  initialPrice: string;
  createdAt: string;
  status: keyof typeof auctionStatusMap;
}

const auctionStatusMap = {
  available: "Disponible",
  closed: "Cerrado",
  expired: "Expirado",
  sold: "Vendido",
};

export default function ManageAuctions() {
  const auctions = useQuery({
    queryKey: ["myAuctions"],
    queryFn: () =>
      axios.get("/api/auctions/list").then((res) => {
        return res.data;
      }),
  });

  const columns: ColumnDef<Auction>[] = [
    {
      accessorKey: "id", // Usa el nombre original 'id' para el filtro
      header: "ID",
      enableSorting: true,
      cell: ({ row }) => <div>{row.original.id}</div>, // Usa 'id' aquí también
    },
    {
      accessorKey: "waste.description",
      header: "Descripción",
      enableSorting: true,
    },
    {
      accessorKey: "conditions",
      header: "Condiciones",
      cell: ({ row }) => {
        const conds = row.original.conditions;
        return conds && conds.length > 0 ? conds : "Sin condiciones";
      },
      enableSorting: true,
    },
    {
      accessorKey: "waste.wasteType.name",
      header: "Tipo de residuo",
      enableSorting: true,
    },
    {
      accessorKey: "initialPrice",
      header: "Precio inicial",
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => (
        <div className="text-right">{row.original.initialPrice}</div>
      ),
    },
    {
      accessorKey: "units",
      enableSorting: true,
      sortingFn: "alphanumeric",
      header: () => <div className="text-right">Unidades</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {row.original.units}
            <span className="font-light text-xs">
              {" "}
              {row.original.waste.unitType.name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const status = row.original.status;
        return <Badge variant={"secondary"}>{auctionStatusMap[status]}</Badge>;
      },
    },
    {
      accessorKey: "expiresAt",
      header: "Fecha de expiración",
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const expiresAt = row.original.expiresAt;
        const date = new Date(expiresAt);
        const formattedDate = !isNaN(date.getTime())
          ? date.toLocaleDateString("es-ES")
          : "N/A";
        return <div>{formattedDate}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <ManageOffers auctionId={row.original.id} />,
    },
  ];

  return (
    <SimpleCard
      title="Mis Subastas"
      desc="Visualiza aquí todas las subastas hechas por tu empresa."
    >
      {auctions.isLoading ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        !auctions.isError && (
          <TableList columns={columns} data={auctions.data || []} />
        )
      )}
      {auctions.isError && auctions.error.message}
    </SimpleCard>
  );
}
