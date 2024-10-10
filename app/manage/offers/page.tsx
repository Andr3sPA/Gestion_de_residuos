"use client";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AuctionDetails } from "@/components/AuctionDetails";
import { cn } from "@/lib/utils";
import { SimpleCard } from "@/components/common/SimpleCard";
import { TableList } from "@/components/common/TableList";
import { Offer } from "@/components/ManageOffers";

export default function ManageMyOffers() {
  const offers = useQuery({
    queryKey: ["myOffers"],
    queryFn: () =>
      axios.get("/api/offers/listMyOffers").then((res) => {
        return res.data.offers;
      }),
  });

  const statusMap = {
    waiting: "En espera",
    accepted: "Aceptado",
    rejected: "Rechazado",
  };

  const columns: ColumnDef<Offer>[] = [
    {
      accessorKey: "id",
      header: "ID",
      enableSorting: true,
      cell: ({ row }) => <div>{row.original.id}</div>,
    },
    {
      accessorKey: "auction.companySeller.name",
      header: "Nombre del Vendedor",
      enableSorting: true,
    },
    {
      accessorKey: "auction.waste.description",
      header: "Descripción del Residuo",
      enableSorting: true,
    },
    {
      accessorKey: "auction.id",
      header: "ID de Subasta",
      enableSorting: true,
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
