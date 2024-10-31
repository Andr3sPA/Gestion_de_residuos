"use client";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { Loader2Icon, LucideRefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AuctionDetails } from "@/components/AuctionDetails";
import { cn } from "@/lib/utils";
import { SimpleCard } from "@/components/common/SimpleCard";
import { TableList } from "@/components/common/TableList";
import { Offer } from "@/components/ManageOffers";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverArrow } from "@radix-ui/react-popover";

export default function ManageMyOffers() {
  const offers = useQuery({
    queryKey: ["myOffers"],
    queryFn: () =>
      axios.get("/api/offers/listMyOffers").then((res) => {
        return res.data.offersWithCounts;
      }),
  });

  const statusMap = {
    waiting: "En espera",
    accepted: "Aceptado",
    rejected: "Rechazado",
  };

  const columns: ColumnDef<Offer>[] = [
    {
      accessorKey: "auction.companySeller.name",
      header: "Empresa vendedora",
      enableSorting: true,
    },
    {
      accessorKey: "auction.waste.description",
      header: "Descripción del Residuo",
      enableSorting: true,
    },
    {
      accessorKey: "offerPrice",
      header: "Precio ofrecido",
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => (
        <div className="text-right">${row.original.offerPrice}</div>
      ),
    },
    {
      accessorKey: "auction.contact",
      header: "Contacto",
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: "Estado",
      enableSorting: true,
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            className={cn(
              status === "waiting"
                ? "bg-badge-neutral"
                : status === "rejected"
                  ? "bg-badge-error"
                  : "bg-badge-ok",
              "text-white text-nowrap",
            )}
            variant={"outline"}
          >
            {statusMap[status]}
          </Badge>
        );
      },
    },
    {
      id: "Info del vendedor",
      header: "Info del vendedor",
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
                Calificaciones
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
      id: "auction",
      header: "Subasta",
      cell: ({ row }) => (
        <AuctionDetails canOffer={false} auctionInfo={row.original.auction} />
      ),
    },
  ];

  return (
    <SimpleCard
      title="Mis Ofertas"
      desc="Visualiza aquí todas las ofertas hechas por tu empresa."
      headerActions={
        <div className="flex justify-end gap-4">
          <Button
            variant={"secondary"}
            disabled={offers.isRefetching}
            onClick={() => offers.refetch()}
          >
            <LucideRefreshCw
              className={`w-5 h-5 ${offers.isRefetching ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      }
    >
      {offers.isLoading ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        !offers.isError && (
          <TableList columns={columns} data={offers.data || []} />
        )
      )}
      {offers.isError && offers.error.message}
    </SimpleCard>
  );
}
