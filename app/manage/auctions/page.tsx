'use client'
import { SimpleCard } from "@/components/SimpleCard";
import { TableList } from "@/components/TableList";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import {ManageOffers} from "@/app/manage/offers/page";
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
} from "@/components/ui/alert-dialog"
export interface Auction {
  id: number;
  wasteId: number;
  conditions:string;
  expiresAt: string; // Mueve expirationDate dentro del objeto waste
  waste: {
    description: string;
    unitType: {
      name: string
    },
    wasteType: {
      name: string
    },
  };
  units: number;
  companySeller: {
    name: string;
  };
  initialPrice: string;
  createdAt: string;
  status: string;
}

export default function ManageAuctions() {
  const auctions = useQuery({
    queryKey: ["myAuctions"],
    queryFn: () => axios.get("/api/auctions/list")
      .then((res) => {
        return res.data
      })
  })

  const columns: ColumnDef<Auction>[] = [
    {
      accessorKey: "id", // Usa el nombre original 'id' para el filtro
      header: "ID",
      enableSorting: true,
      cell: ({ row }) => <div>{row.original.id}</div>, // Usa 'id' aquí también
    },
    {
      accessorKey: "waste.description",
      header: "Description",
      enableSorting: true,
    },
    {
      accessorKey: "conditions",
      header: "Condiciones",
      enableSorting: true,
    },
    {
      accessorKey: "waste.wasteType.name",
      header: "Tipo de residuo",
      enableSorting: true,
    },
    {
      accessorKey: "initialPrice",
      header: "Price",
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => <div className="text-right">{row.original.initialPrice}</div>,
    },
    {
      accessorKey: "units",
      enableSorting: true,
      sortingFn: "alphanumeric",
      header: () => <div className="text-right">Units</div>,
      cell: ({ row }) => {
        return <div className="text-right font-medium">
          {row.original.units}
          <span className="font-light text-xs">{" "}{row.original.waste.unitType.name}</span>
        </div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      enableGlobalFilter: false,
      cell: ({ row }) => <div>{row.getValue("status")}</div>,
    },
    {
      accessorKey: "expiresAt",
      header: "Expiration Date",
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
      cell: ({ row }) => {
        return     <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">ofertas</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              <ManageOffers auctionId={row.original.id} />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      }
    }
  ]
  return <SimpleCard
    title="Mis subastas"
    desc="Visualiza aquí las subastas hechas por tu empresa."
  >
    {(auctions.isLoading) ?
      <Loader2Icon className="animate-spin" />
      :
      (
        !auctions.isError &&
        <TableList columns={columns} data={auctions.data} />
      )
    }
    {auctions.isError && auctions.error.message}
  </SimpleCard>
}
