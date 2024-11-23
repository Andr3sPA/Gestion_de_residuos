"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { CheckIcon, Loader2Icon, XIcon } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast"; // Importa el hook de toast
import { Badge } from "@/components/ui/badge";
import { TableList } from "./common/TableList";
import { Auction } from "@/app/manage/auctions/page";
import { AuctionStatus } from "@prisma/client";
import { cn, enumMappings } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Purchase {
  auction_id: number;
  offer_id: number;
  status: string;
}

export interface Offer {
  id: number;
  contact: string;
  status: "accepted" | "rejected" | "waiting";
  auction: Auction;
  companyBuyer: {
    name: string;
    description: string;
    nit: string;
  };
  offerPrice: string;
  counts: {
    countOffers: number;
    countSales: number;
    countPurchases: number;
    countAuctions: number;
  };
}

interface OfferFormProps {
  auctionId: number; // Hacemos que auctionId sea opcional
  auctionStatus: AuctionStatus;
}

//TODO: refetch auction

export function ManageOffers({ auctionId, auctionStatus }: OfferFormProps) {
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState({ a: false, r: false }); // Estado para controlar la carga

  const handleSendData = async (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsLoading({
      a: purchase.status === "accepted",
      r: purchase.status === "rejected",
    }); // Inicia la carga
    try {
      const response = await axios.post("/api/purchases/register", purchase);
      toast({
        description: response.data.message, // Solo descripción
      });
      offers.refetch();
      canAcceptReject = false;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al procesar",
        description: (error as any).message,
      });
    } finally {
      setIsLoading({ a: false, r: false }); // Finaliza la carga
    }
  };

  const offers = useQuery<Offer[]>({
    queryKey: ["auctionOffers", auctionId],
    refetchOnWindowFocus: "always",
    queryFn: () =>
      axios
        .get(`/api/offers/list?auction_id=${auctionId}`)
        .then((res) => res.data.offers),
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
      accessorKey: "companyBuyer.nit",
      header: "NIT",
      enableSorting: true,
    },
    {
      accessorKey: "companyBuyer.description",
      header: "Descripción",
      enableSorting: true,
    },
    {
      accessorKey: "",
      id: "Calificaciones del comprador",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-xl text-xs">
              Calificaciones del comprador
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              Subastas realizadas {row.original.counts.countAuctions}
            </DropdownMenuLabel>
            <DropdownMenuLabel>
              Subastas vendidas {row.original.counts.countSales}
            </DropdownMenuLabel>
            <DropdownMenuLabel>
              Ofertas realizadas {row.original.counts.countOffers}
            </DropdownMenuLabel>
            <DropdownMenuLabel>
              Subastas compradas {row.original.counts.countPurchases}
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      accessorKey: "offerPrice",
      header: "Precio",
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => (
        <div className="text-right">{row.original.offerPrice}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      enableSorting: true,
      cell: ({ row }) => {
        const st = row.original.status;
        return (
          <Badge
            className={cn(
              "text-nowrap",
              st === "waiting"
                ? "bg-badge-neutral"
                : st === "rejected"
                  ? "bg-badge-error"
                  : "bg-badge-ok",
            )}
          >
            {enumMappings.offerStatus[st]}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Rechazar/Aceptar",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Button
            onClick={() =>
              handleSendData({
                auction_id: auctionId,
                offer_id: row.original.id,
                status: "rejected",
              })
            }
            size={"sm"}
            disabled={isLoading.a || isLoading.r || !canAcceptReject}
            className="scale-75 bg-destructive"
          >
            {isLoading.r ? <Loader2Icon className="animate-spin" /> : <XIcon />}
          </Button>
          <Button
            onClick={() =>
              handleSendData({
                auction_id: auctionId,
                offer_id: row.original.id,
                status: "accepted",
              })
            }
            size={"sm"}
            disabled={isLoading.a || isLoading.r || !canAcceptReject}
            className="scale-75"
          >
            {isLoading.a ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <CheckIcon />
            )}
          </Button>
        </div>
      ),
    },
  ];

  let canAcceptReject = auctionStatus === "available";

  return (
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="outline">Mostrar</Button>
  </AlertDialogTrigger>
  <AlertDialogContent className="w-[1300px] max-w-full max-h-full">
    <AlertDialogHeader className="w-full overflow-auto max-w-full">
      <AlertDialogTitle>Ofertas de la subasta {auctionId}</AlertDialogTitle>
      <AlertDialogDescription></AlertDialogDescription>
      {offers.isLoading ? (
        <div className="w-full min-h-8 flex justify-center items-center">
          <Loader2Icon className="animate-spin" />
        </div>
      ) : (
        !offers.isError && (
          <div className="w-[1250px] max-w-full">
            <TableList columns={columns} data={offers.data || []} />
          </div>
        )
      )}
      {offers.isError && <div>{offers.error.message}</div>}
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cerrar</AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

  );
}
