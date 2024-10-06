'use client'

import { SimpleCard } from "@/components/SimpleCard";
import { TableList } from "@/components/TableList";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { Loader2Icon } from "lucide-react";

export interface Offer {
  id: number;
  contact: string;
  companyBuyer: {
    name: string;
    description: string;
  };
  offerPrice: string;
}
interface OfferFormProps {
    auctionId?: number; // Hacemos que auctionId sea opcional
  }
export function ManageOffers({ auctionId }: OfferFormProps) {

  const auctions = useQuery({
    queryKey: ["myAuctions", auctionId], // Añades auctionId al queryKey para que se vuelva a hacer la query si cambia
    queryFn: () => axios.get(`/api/offers/list?auction_id=${auctionId}`) // Incluyes auction_id en la URL como query param
      .then((res) => {
        return res.data;
      }),
  });

  const columns: ColumnDef<Offer>[] = [
    {
      accessorKey: "id",
      header: "ID",
      enableSorting: true,
      cell: ({ row }) => <div>{row.original.id}</div>,
    },
    {
      accessorKey: "contact",
      header: "Contacto",
      enableSorting: true,
    },
    {
      accessorKey: "companyBuyer.name",
      header: "Comprador",
      enableSorting: true,
    },
    {
      accessorKey: "companyBuyer.description",
      header: "Descripción",
      enableSorting: true,
    },
    {
      accessorKey: "offerPrice",
      header: "Precio",
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => <div className="text-right">{row.original.offerPrice}</div>,
    },
    {
      id: "actions-accept",
      cell: ({ row }) => {
        return <Button size={"sm"}>Aceptar</Button>;
      },
    },
    {
      id: "actions-reject",
      cell: ({ row }) => {
        return <Button size={"sm"}>Rechazar</Button>;
      },
    },
  ];

  return (
    <SimpleCard title="Mis subastas" desc="Visualiza aquí las subastas hechas por tu empresa.">
      {auctions.isLoading ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        !auctions.isError && <TableList columns={columns} data={auctions.data} />
      )}
      {auctions.isError && <div>{auctions.error.message}</div>}
    </SimpleCard>
  );
}
