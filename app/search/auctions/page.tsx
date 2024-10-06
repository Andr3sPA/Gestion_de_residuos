'use client'

import { Loader2 } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { TableList } from "@/components/TableList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AuctionDetails } from "@/components/OfferDetails";
import { SimpleCard } from "@/components/SimpleCard";
import { Auction } from "@/app/manage/auctions/page";

export default function searchAuctions() {
  const auctions = useQuery({
    queryKey: ["allAuctions"],
    queryFn: () => axios.get("/api/auctions/search")
      .then((res) => res.data.auctions)
  })

  const columns: ColumnDef<Auction>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "waste.wasteType.name",
      header: "Tipo"
    },
    {
      accessorKey: "waste.description",
      header: "Descripción"
    },
    {
      accessorKey: "initialPrice",
      header: "Precio",
    },
    {
      accessorKey: "units",
      header: "Cantidad",
      cell: ({ row }) => `${row.original.units} ${row.original.waste.unitType.name}`
    },
    {
      accessorKey: "",
      id: "details",
      cell: ({ row }) =>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-xl text-xs">Detalles</Button>
          </DialogTrigger>
          <AuctionDetails offerInfo={row.original} />
        </Dialog>
    }
  ]

  return <div className="flex flex-1 flex-col w-full h-full justify-start items-center" >
    <SimpleCard
      title="Ofertas"
      desc="Busca aquí los residuos que ofrecen otras empresas "
    >
      {auctions.isLoading ?
        <div className="flex justify-center p-2">
          <Loader2 className="animate-spin" />
        </div>
        :
        <TableList columns={columns} data={auctions.data} />
      }
    </SimpleCard>
  </div >
}



