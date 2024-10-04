'use client'

import { Loader2 } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Offer } from "@/app/manage/offers/page";
import { TableList } from "@/components/TableList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { OfferDetails } from "@/components/OfferDetails";
import { SimpleCard } from "@/components/SimpleCard";

export default function searchOffers() {
  const offers = useQuery({
    queryKey: ["allOffers"],
    queryFn: () => axios.get("/api/offer/search")
      .then((res) => res.data.offers)
  })

  const columns: ColumnDef<Offer>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "waste.wasteType.wasteType",
      header: "Tipo"
    },
    {
      accessorKey: "waste.description",
      header: "Descripción"
    },
    {
      accessorKey: "offerPrice",
      header: "Precio",
    },
    {
      accessorKey: "units",
      header: "Cantidad",
      cell: ({ row }) => `${row.original.units} ${row.original.waste.unitType.unitName}`
    },
    {
      accessorKey: "",
      id: "details",
      cell: ({ row }) =>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-xl text-xs">Detalles</Button>
          </DialogTrigger>
          <OfferDetails offerInfo={row.original} />
        </Dialog>
    }
  ]

  return <div className="flex flex-1 flex-col w-full h-full justify-start items-center" >
    <SimpleCard
      title="Ofertas"
      desc="Busca aquí los residuos que ofrecen otras empresas "
    >
      {offers.isLoading ?
        <div className="flex justify-center p-2">
          <Loader2 className="animate-spin" />
        </div>
        :
        <TableList columns={columns} data={offers.data} />
      }
    </SimpleCard>
  </div >
}



