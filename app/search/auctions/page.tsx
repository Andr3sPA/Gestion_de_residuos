"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { AuctionDetails } from "@/components/AuctionDetails";
import { Auction } from "@/app/manage/auctions/page";
import { SimpleCard } from "@/components/common/SimpleCard";
import { TableList } from "@/components/common/TableList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export default function SearchAuctions() {
  const auctions = useQuery({
    queryKey: ["allAuctions"],
    queryFn: () =>
      axios.get("/api/auctions/search").then((res) => res.data.auctionsWithCounts),
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
      header: "Precio (COP)",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-right">${row.original.initialPrice}</div>
      ),
    },
    {
      accessorKey: "units",
      header: "Cantidad",
      cell: ({ row }) =>
        `${row.original.units} ${row.original.waste.unitType.name}`,
    },
    {
      accessorKey: "",
      id: "Calificaciones del vendedor",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-xl text-xs">Calificaciones
            del vendedor
          </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Subastas realizadas {row.original.counts.countAuctions}</DropdownMenuLabel>
            <DropdownMenuLabel>Subastas vendidas {row.original.counts.countSales}</DropdownMenuLabel>
            <DropdownMenuLabel>Ofertas realizadas {row.original.counts.countOffers}</DropdownMenuLabel>
            <DropdownMenuLabel>Subastas compradas {row.original.counts.countPurchases}</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>

      ),
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
