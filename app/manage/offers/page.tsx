import { SimpleCard } from "@/components/SimpleCard";
import { TableList } from "@/components/TableList";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";

interface Purchase {
  auction_id: number; 
  offer_id: number;
  status: string;
}

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
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  const handleSendData = async (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    try {
      const response = await axios.post("/api/purchases/register", purchase);
      console.log("Datos enviados exitosamente:", response.data);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  const auctions = useQuery({
    queryKey: ["myAuctions", auctionId],
    queryFn: () => axios.get(`/api/offers/list?auction_id=${auctionId}`)
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
      cell: ({ row }) => <div className="text-right">{row.original.offerPrice}</div>,
    },
    // Condicionalmente agregamos columnas basadas en hasOffers
    {
      accessorKey: "status",
      header: "Estado",
      enableSorting: true,
    },
    ...(auctions.data?.hasOffers ? [
      {
        id: "actions-accept",
        cell: ({ row }) => (
          <Button
            onClick={() => handleSendData({ auction_id: auctionId, offer_id: row.original.id, status: "accepted" })}
            size={"sm"}
          >
            Aceptar
          </Button>
        ),
      },
      {
        id: "actions-reject",
        cell: ({ row }) => (
          <Button
            onClick={() => handleSendData({ auction_id: auctionId, offer_id: row.original.id, status: "rejected" })}
            size={"sm"}
          >
            Rechazar
          </Button>
        ),
      },
    ] : []),
  ];

  return (
    <SimpleCard title={`Ofertas de la subasta ${auctionId}`} desc="Visualiza aquí las ofertas hechas">
      {auctions.isLoading ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        !auctions.isError && <TableList columns={columns} data={auctions.data?.offers || []} />
      )}
      {auctions.isError && <div>{auctions.error.message}</div>}
    </SimpleCard>
  );
}
