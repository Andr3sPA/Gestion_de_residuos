"use client";

import { Loader2 } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { AuctionDetails } from "@/components/AuctionDetails";
import { Auction } from "@/app/manage/auctions/page";
import { SimpleCard } from "@/components/common/SimpleCard";
import { TableList } from "@/components/common/TableList";

export default function searchAuctions() {
  const auctions = useQuery({
    queryKey: ["allAuctions"],
    queryFn: () =>
      axios.get("/api/auctions/search").then((res) => res.data.auctions),
  });

  const columns: ColumnDef<Auction>[] = [
    {
      accessorKey: "waste.wasteType.name",
      header: "Tipo",
    },
    {
      accessorKey: "expiresAt",
      header: "Expiration Date",
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
      accessorKey: "conditions",
      header: "Condiciones",
      cell: ({ row }) => {
        const conds = row.original.conditions;
        return conds && conds.length > 0 ? conds : "Sin condiciones";
      },
    },
    {
      accessorKey: "waste.description",
      header: "Descripción",
    },
    {
      accessorKey: "initialPrice",
      header: "Precio",
    },
    {
      accessorKey: "units",
      header: "Cantidad",
      cell: ({ row }) =>
        `${row.original.units} ${row.original.waste.unitType.name}`,
    },
    {
      accessorKey: "",
      id: "details",
      cell: ({ row }) => <AuctionDetails auctionInfo={row.original} />,
    },
  ];

  return (
    <div className="flex flex-1 flex-col w-full h-full justify-start items-center">
      <SimpleCard
        className="m-2"
        title="Subastas"
        desc="Busca aquí los residuos que ofrecen otras empresas "
      >
        {auctions.isLoading ? (
          <div className="flex justify-center p-2">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <TableList columns={columns} data={auctions.data} />
        )}
      </SimpleCard>
    </div>
  );
}
