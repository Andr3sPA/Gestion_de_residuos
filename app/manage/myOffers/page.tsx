'use client'
import { SimpleCard } from "@/components/SimpleCard";
import { TableList } from "@/components/TableList";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { Offer } from "@/app/manage/offers/page";

export function ManageMyOffers() {
  const offers = useQuery({
    queryKey: ["myOffers"],
    queryFn: () => axios.get("/api/offers/listMyOffers")
    .then((res) => res.data),
      })


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
    },
  ];
  
  return (
<SimpleCard
    title="Mis Ofertas"
    desc="Visualiza aquí todas las ofertas hechas por tu empresa."
  >
    {(offers.isLoading) ?
      <Loader2Icon className="animate-spin" />
      :
      (
        !offers.isError &&
        <TableList columns={columns} data={offers.data || []} />
      )
    }
    {offers.isError && offers.error.message}
  </SimpleCard>
  );
} 
