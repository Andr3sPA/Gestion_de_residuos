'use client'

import { SimpleCard } from "@/components/SimpleCard";
import { TableList } from "@/components/TableList";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { Loader2Icon } from "lucide-react";

export interface Offer {
  id: number;
  wasteId: number;
  waste: {
    expirationDate: string; // Mueve expirationDate dentro del objeto waste
  };
  units: number;
  companySeller: {
    name: string;
  };
  offerPrice: string;
  createdAt: string;
  status: string;
}

export default function ManageOffers() {
  const offers = useQuery({
    queryKey: ["myOffers"],
    queryFn: () => axios.get("/api/offer/list")
      .then((res) => {
        return res.data
      })
  })

  const columns: ColumnDef<Offer>[] = [
    {
      accessorKey: "id", // Usa el nombre original 'id' para el filtro
      header: "Offer ID",
      cell: ({ row }) => <div>{row.original.id}</div>, // Usa 'id' aquí también
    },
    {
      accessorKey: "wasteId",
      header: "Waste ID",
      cell: ({ row }) => <div>{row.original.wasteId}</div>,
    },
    {
      accessorKey: "companySeller",
      header: "Company Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.companySeller.name}</div>
      ),
    },
    {
      accessorKey: "offerPrice",
      header: "Offer Price",
      cell: ({ row }) => <div>{row.getValue("offerPrice")}</div>,
    },
    {
      accessorKey: "units",
      header: () => <div className="text-right">Units</div>,
      enableSorting: true,
      cell: ({ row }) => {
        const units = parseFloat(row.getValue("units"));
        return <div className="text-right font-medium">{units}</div>;
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
      accessorKey: "createdAt",
      header: "Created At",
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const createdAt = row.original.createdAt;
        const date = new Date(createdAt);
        const formattedDate = !isNaN(date.getTime())
          ? date.toLocaleDateString("es-ES")
          : "N/A";
        return <span className="font-thin text-sm">{formattedDate}</span>;
      },
    },
  ]
  return <SimpleCard title="Mis ofertas">
    {offers.isLoading ?
      <Loader2Icon className="animate-spin" />
      :
      <TableList columns={columns} data={offers.data} />
    }
  </SimpleCard>
}
