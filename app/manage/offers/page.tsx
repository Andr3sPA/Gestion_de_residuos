"use client";

import { SimpleCard } from "@/components/SimpleCard";
import { TableList } from "@/components/TableList";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast"; // Importa el hook de toast

interface Purchase {
  auction_id: number;
  offer_id: number;
  status: string;
}

export interface Offer {
  id: number;
  contact: string;
  status: string;
  auction: {
    companySeller: {
      name: string;
      description: string;
    };
    waste: {
      wasteType: string;
      category: string;
      description: string;
      unitType: string;
    };
    initialPrice: number;
    conditions: string;
    units: number;
    status: string;
    contact: string;
    id: number;
  };
  companyBuyer: {
    name: string;
    description: string;
  };
  offerPrice: string;
}

interface OfferFormProps {
  auctionId: number; // Hacemos que auctionId sea opcional
}

export function ManageOffers({ auctionId }: OfferFormProps) {
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la carga

  const handleSendData = async (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsLoading(true); // Inicia la carga
    try {
      const response = await axios.post("/api/purchases/register", purchase);
      console.log("Datos enviados exitosamente:", response.data);
      toast({
        description: response.data.message, // Solo descripción
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al procesar",
        description: (error as any).message,
      });
    } finally {
      setIsLoading(false); // Finaliza la carga
    }
  };

  const auctions = useQuery({
    queryKey: ["myAuctions", auctionId],
    queryFn: () =>
      axios
        .get(`/api/offers/list?auction_id=${auctionId}`)
        .then((res) => res.data),
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
      cell: ({ row }) => (
        <div className="text-right">{row.original.offerPrice}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      enableSorting: true,
    },
    {
      id: "actions-accept",
      cell: ({ row }) => (
        <Button
          onClick={() =>
            handleSendData({
              auction_id: auctionId,
              offer_id: row.original.id,
              status: "accepted",
            })
          }
          size={"sm"}
          disabled={isLoading} // Deshabilita el botón mientras se carga
        >
          {isLoading ? <Loader2Icon className="animate-spin" /> : "Aceptar"}
        </Button>
      ),
    },
    {
      id: "actions-reject",
      cell: ({ row }) => (
        <Button
          onClick={() =>
            handleSendData({
              auction_id: auctionId,
              offer_id: row.original.id,
              status: "rejected",
            })
          }
          size={"sm"}
          disabled={isLoading} // Deshabilita el botón mientras se carga
        >
          {isLoading ? <Loader2Icon className="animate-spin" /> : "Rechazar"}
        </Button>
      ),
    },
  ];

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">ofertas</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-full max-h-full">
        <AlertDialogHeader className="w-full overflow-scroll max-w-full">
          <AlertDialogTitle>Ofertas de la subasta {auctionId}</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
          {auctions.isLoading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            !auctions.isError && (
              <TableList columns={columns} data={auctions.data?.offers || []} />
            )
          )}
          {auctions.isError && <div>{auctions.error.message}</div>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-red-500 text-white hover:bg-red-600 border-2 border-red-700 shadow-lg transition duration-300 ease-in-out">
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
