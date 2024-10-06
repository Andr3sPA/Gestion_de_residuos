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
  wasteId: number;
  waste: {
    description: string;
    expirationDate: string; // Mueve expirationDate dentro del objeto waste
    unitType: {
      unitName: string
    }
  };
  units: number;
  companySeller: {
    name: string;
  };
  offerPrice: string;
  createdAt: string;
  status: string;
}

export function ManageAuctions() {
  const auctions = useQuery({
    queryKey: ["myOffers"],
    queryFn: () => axios.get("/api/auctions/list")
      .then((res) => {
        return res.data
      })
  })

  const columns: ColumnDef<Offer>[] = [
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
      accessorKey: "offerPrice",
      header: "Offer Price",
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => <div className="text-right">{row.original.offerPrice}</div>,
    },
    {
      accessorKey: "units",
      enableSorting: true,
      sortingFn: "alphanumeric",
      header: () => <div className="text-right">Units</div>,
      cell: ({ row }) => {
        return <div className="text-right font-medium">
          {row.original.units}
          <span className="font-light text-xs">{" "}{row.original.waste.unitType.unitName}</span>
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
      accessorKey: "waste.expirationDate",
      header: "Expiration Date",
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const expirationDate = row.original.waste.expirationDate;
        const date = new Date(expirationDate);
        const formattedDate = !isNaN(date.getTime())
          ? date.toLocaleDateString("es-ES")
          : "N/A";
        return <div>{formattedDate}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return <Button size={"sm"}>
          Details
        </Button>
      }
    }
  ]
  return <SimpleCard
    title="Mis ofertas"
    desc="Visualiza aquí las ofertas hechas por tu empresa."
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
