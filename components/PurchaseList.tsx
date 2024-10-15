import { PurchaseDetails } from "@/components/PurchaseDetails";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { SimpleCard } from "./common/SimpleCard";
import { TableList } from "./common/TableList";
import { WasteCategory } from "@prisma/client";
export interface Purchase {
  id: number;
  offer: {
    companyBuyer: {
      name: string;
      description: string;
      nit: number;
    };
  };
  auction: {
    conditions: string;
    companySeller: {
      name: string;
      description: string;
      nit: number;
    };
    units: number;
    pickupLatitude: string;
    pickupLongitude: string;
    waste: {
      category: WasteCategory;
      unitType: {
        name: string;
      };
      wasteType: {
        name: string;
      };
    };
  };
  finalPrice: number;
  createdAt: string;
}

export enum RecordType {
  Ventas = "Ventas",
  Compras = "Compras",
}

// Usamos el enum en la interfaz
interface PurchasesProps {
  recordType: RecordType;
}

export function PurchaseList({ recordType }: PurchasesProps) {
  const purchases = useQuery({
    queryKey: ["myPurchases", recordType],
    queryFn: () =>
      axios
        .get(`/api/purchases/list?recordType=${recordType}`)
        .then((res) => res.data),
  });

  // Definimos las columnas dinámicamente según el recordType
  const columns: ColumnDef<Purchase>[] = [
    // Columnas comunes para ambos tipos
    {
      accessorKey: "id",
      header: "ID",
      enableSorting: true,
      cell: ({ row }) => <div>{row.original.id}</div>,
    },
    {
      accessorKey: "finalPrice",
      header: "Precio de compra",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-right">${row.original.finalPrice}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de creación",
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const createdAt = row.original.createdAt;
        const date = new Date(createdAt);
        const formattedDate = !isNaN(date.getTime())
          ? date.toLocaleDateString("es-ES")
          : "N/A";
        return <div>{formattedDate}</div>;
      },
    },
    {
      accessorKey: "auction.waste.description",
      header: "Descripción de residuo",
      enableSorting: true,
    },
    {
      accessorKey: "auction.units",
      header: "Unidades",
      enableSorting: true,
    },
    {
      accessorKey: "auction.waste.id",
      header: "Id del residuo",
      enableSorting: true,
    },

    // Columnas específicas para ventas
    ...(recordType === RecordType.Ventas
      ? [
          {
            accessorKey: "offer.contact",
            header: "Contacto",
            enableSorting: true,
          },
          {
            accessorKey: "offer.companyBuyer.name",
            header: "Comprador",
            enableSorting: true,
          },
          {
            accessorKey: "offer.companyBuyer.nit",
            header: "NIT",
            enableSorting: true,
          },
        ]
      : []),

    // Columnas específicas para compras
    ...(recordType === RecordType.Compras
      ? [
          {
            accessorKey: "auction.contact",
            header: "Contacto",
            enableSorting: true,
          },
          {
            accessorKey: "auction.conditions",
            header: "Condiciones",
            cell: ({ row }: any) => {
              const conds = row.original.auction.conditions;
              return conds && conds.length > 0 ? conds : "Sin condiciones";
            },
            enableSorting: true,
          },
        ]
      : []),
    {
      accessorKey: "",
      id: "details",
      cell: ({ row }) => (
        <PurchaseDetails purchaseInfo={row.original} recordType={recordType} />
      ),
    },
  ];

  return (
    <SimpleCard title={`Historial de ${recordType}`}>
      {purchases.isLoading ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        !purchases.isError && (
          <TableList columns={columns} data={purchases.data || []} />
        )
      )}
      {purchases.isError && <div>{purchases.error.message}</div>}
    </SimpleCard>
  );
}
