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
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { PopoverArrow } from "@radix-ui/react-popover";
export default function SearchAuctions() {
  const auctions = useQuery({
    queryKey: ["allAuctions"],
    queryFn: () =>
      axios
        .get("/api/auctions/search")
        .then((res) => res.data.auctionsWithCounts),
  });

  const columns: ColumnDef<Auction>[] = [
    {
      accessorKey: "waste.wasteType.name",
      header: () => (
        <span className="w-full inline-block text-center">Tipo de residuo</span>
      ),
      cell: ({ row }) => (
        <span className="w-full inline-block font-semibold text-center">
          {row.original.waste.wasteType.name}
        </span>
      ),
    },
    {
      accessorKey: "expiresAt",
      header: "Fecha de expiración",
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const expiresAt = row.original.expiresAt;
        const date = new Date(expiresAt);
        const formattedDate = !isNaN(date.getTime())
          ? format(date, "PPP")
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
        <div className="text-right font-semibold">
          ${row.original.initialPrice}
        </div>
      ),
    },
    {
      accessorKey: "units",
      header: "Cantidad",
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {row.original.units}
          <span className="font-light text-xs">
            {" "}
            {row.original.waste.unitType.name}
          </span>
        </div>
      ),
    },
    {
      id: "Info vendedor",
      cell: ({ row }) => {
        const counts = [
          ["Subastas realizadas", row.original.counts.countAuctions],
          ["Subastas vendidas", row.original.counts.countSales],
          ["Ofertas realizadas", row.original.counts.countOffers],
          ["Subastas compradas", row.original.counts.countPurchases],
        ];
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="rounded-xl text-xs">
                Info del vendedor
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col w-fit gap-2 text-sm">
              <PopoverArrow className="fill-background stroke-accent stroke-2" />
              {counts.map((c, i) => (
                <div key={i} className="flex gap-4 justify-between">
                  <span className="text-left">{c[0]}</span>
                  <Badge variant={"secondary"}>
                    <span className="text-right font-semibold">{c[1]}</span>
                  </Badge>
                </div>
              ))}
            </PopoverContent>
          </Popover>
        );
      },
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
