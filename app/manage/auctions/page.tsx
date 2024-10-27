"use client";

import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { CheckIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SimpleCard } from "@/components/common/SimpleCard";
import { TableList } from "@/components/common/TableList";
import { ManageOffers } from "@/components/ManageOffers";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Purchase } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn, enumMappings } from "@/lib/utils";
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

export interface Auction {
  id: number;
  wasteId: number;
  conditions: string;
  expiresAt: string; // Mueve expirationDate dentro del objeto waste
  waste: {
    description: string;
    unitType: {
      name: string;
    };
    wasteType: {
      name: string;
    };
  };
  units: number;
  companySeller: {
    name: string;
    nit: string;
  };
  pickupLatitude: string;
  pickupLongitude: string;
  initialPrice: string;
  createdAt: string;
  counts:{  
    countOffers: number;
    countSales:number;
    countPurchases:number;
    countAuctions:number;
  }
  status: keyof (typeof enumMappings)["auctionStatusMap"];
}

export default function ManageAuctions() {
  const auctions = useQuery({
    queryKey: ["myAuctions"],
    queryFn: () =>
      axios.get("/api/auctions/list").then((res) => {
        return res.data;
      }),
  });
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la carga
  const [loadingAuctionId, setLoadingAuctionId] = useState<number | null>(null); // Estado para rastrear el ID de la subasta cuyo botón se hizo clic
  const router = useRouter();

  const handleSendData = async (auctionId: number) => {
    setSelectedPurchase(null);
    setIsLoading(true); // Inicia la carga
    setLoadingAuctionId(auctionId); // Establece el ID de la subasta cuyo botón se hizo clic
    try {
      const response = await axios.post("/api/auctions/close", {
        id: auctionId,
      });
      auctions.refetch();
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
      setLoadingAuctionId(null); // Restablece el ID de la subasta cuyo botón se hizo clic
    }
  };

  const columns: ColumnDef<Auction>[] = [
    {
      accessorKey: "id", // Usa el nombre original 'id' para el filtro
      header: "ID",
      enableSorting: true,
      cell: ({ row }) => <div>{row.original.id}</div>, // Usa 'id' aquí también
    },
    {
      accessorKey: "waste.description",
      header: "Descripción",
      enableSorting: true,
    },
    {
      accessorKey: "conditions",
      header: "Condiciones",
      cell: ({ row }) => {
        const conds = row.original.conditions;
        return conds && conds.length > 0 ? conds : "Sin condiciones";
      },
      enableSorting: true,
    },
    {
      accessorKey: "waste.wasteType.name",
      header: "Tipo de residuo",
      enableSorting: true,
    },
    {
      accessorKey: "initialPrice",
      header: "Precio inicial",
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => (
        <div className="text-right">${row.original.initialPrice}</div>
      ),
    },
    {
      accessorKey: "units",
      enableSorting: true,
      sortingFn: "alphanumeric",
      header: () => <div className="text-right">Unidades</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {row.original.units}
            <span className="font-light text-xs">
              {" "}
              {row.original.waste.unitType.name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={"secondary"}
            className={cn(
              "text-white hover:text-white hover:brightness-110",

              status === "available"
                ? "bg-badge-ok hover:bg-badge-ok"
                : status === "expired"
                  ? "bg-badge-error hover:bg-badge-error"
                  : "bg-badge-neutral hover:bg-badge-neutral",
            )}
          >
            {enumMappings.auctionStatusMap[status]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "expiresAt",
      header: "Fecha de expiración",
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const expiresAt = row.original.expiresAt;
        const date = new Date(expiresAt);
        const formattedDate = !isNaN(date.getTime())
          ? date.toLocaleDateString("es-ES")
          : "N/A";
        return <div>{formattedDate}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ManageOffers
          auctionId={row.original.id}
          auctionStatus={row.original.status}
        />
      ),
    },
    {
      id: "closeAuction",
      header: "Cerrar subasta",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <AlertDialog>
            <AlertDialogTrigger
              asChild
              disabled={
                isLoading ||
                ["closed", "sold", "expired"].includes(row.original.status)
              } // Deshabilita el botón si está cargando o si el estado es "closed"
            >
              <Button
                disabled={
                  isLoading ||
                  ["closed", "sold", "expired"].includes(row.original.status)
                }
                className="scale-75 bg-destructive"
              >
                {loadingAuctionId === row.original.id ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <XIcon />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="flex flex-col gap-6">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg font-bold">
                  ¿Está seguro de cerrar esta subasta?
                </AlertDialogTitle>
                <AlertDialogDescription className="">
                  Se rechazarán todas las ofertas relacionadas a esta.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleSendData(row.original.id)}
                >
                  Cerrar subasta
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <SimpleCard
      title="Mis Subastas"
      desc="Visualiza aquí todas las subastas hechas por tu empresa."
      headerActions={
        <div className="flex justify-end">
          <Button onClick={() => router.push("/create-auction")}>
            <PlusIcon />
          </Button>
        </div>
      }
    >
      {auctions.isLoading ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        !auctions.isError && (
          <TableList columns={columns} data={auctions.data || []} />
        )
      )}
      {auctions.isError && auctions.error.message}
    </SimpleCard>
  );
}
