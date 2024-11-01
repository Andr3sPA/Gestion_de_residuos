"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FilterIcon, Loader2 } from "lucide-react";
import { TableList } from "./common/TableList";
import { ColumnDef } from "@tanstack/react-table";
import { Prisma, Purchase } from "@prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { SimpleCard } from "./common/SimpleCard";
import { Combobox } from "./input/Combobox";

type RowModel = Prisma.PurchaseGetPayload<{
  include: {
    offer: {
      include: {
        companyBuyer: true;
      };
    };
    auction: {
      include: {
        companySeller: true;
        waste: {
          include: {
            unitType: true;
            wasteType: true;
          };
        };
        offers: {
          include: {
            companyBuyer: true;
          };
        };
      };
    };
  };
}>;

export function GeneralReport() {
  const data = useQuery({
    queryKey: ["reportData"],
    queryFn: () =>
      axios.get("/api/reports").then((res) => res.data.purchases as RowModel[]),
  });
  const wasteTypes = useQuery({
    queryKey: ["wasteTypes"],
    queryFn: () =>
      axios.get("/api/wastes/wasteTypes").then((res) =>
        res.data.types.map((t: { id: number; name: string }) => ({
          id: t.id,
          label: t.name,
        })),
      ),
  });

  const columns: ColumnDef<RowModel>[] = [
    {
      id: "wasteType",
      header: "Tipo de residuo",
      accessorKey: "auction.waste.wasteType.name",
    },
    {
      id: "soldAt",
      accessorKey: "createdAt",
      header: "Fecha de venta",
      cell: ({ row }) => (
        <span className="block text-right">
          {format(new Date(row.original.createdAt), "PP", { locale: es })}
        </span>
      ),
    },
    {
      id: "units",
      header: "Cantidad",
      accessorFn: (orig) => orig.auction.waste.units,
      cell: ({ row }) => (
        <div className="text-right font-semibold">
          {row.original.auction.units.toString()}{" "}
          <span className="text-sm font-light">
            {row.original.auction.waste.unitType.name}
          </span>
        </div>
      ),
    },
    {
      id: "description",
      header: "Descripción",
      accessorKey: "auction.waste.description",
    },
    {
      id: "companySeller",
      header: "Empresa",
      accessorKey: "auction.companySeller.name",
    },
    {
      id: "auction",
      header: "Precio de subasta",
      accessorFn: (orig) => orig.auction.initialPrice,
      cell: ({ row }) => (
        <span className="block text-right font-semibold">
          ${row.original.auction.initialPrice.toString()}
        </span>
      ),
    },
    {
      id: "offerors",
      header: "Oferentes",
      accessorFn: (orig) =>
        orig.auction.offers
          .map((o) => o.companyBuyer.name)
          .reduce((a, b) => a.concat(b)),
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          {row.original.auction.offers.map((o, i) => (
            <div key={i} className="flex gap-4 justify-between items-center">
              <span className="inline-block">{o.companyBuyer.name}</span>
              <Badge
                variant={o.status === "accepted" ? "default" : "outline"}
                className="inline-block h-fit"
              >
                ${o.offerPrice.toString()}
              </Badge>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "buyer",
      header: "Vendido a",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          {row.original.auction.offers.map((o, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-4 justify-around items-center",
                o.status === "rejected"
                  ? "opacity-0 hover:cursor-default select-none"
                  : "opacity-100",
              )}
            >
              <span className="inline-block font-semibold">
                {o.companyBuyer.name}
              </span>
              <Badge className="inline-block h-fit">
                ${o.offerPrice.toString()}
              </Badge>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <SimpleCard title="Subastas vendidas">
      {data.isLoading && <Loader2 className="animate-spin" />}
      {data.isSuccess && (
        <TableList
          hidden={["wasteType"]}
          headerActions={(cols) => (
            <div className="w-fit flex gap-2">
              <Combobox
                prompt="Tipo de residuo"
                icon={<FilterIcon className="scale-90 mr-1" />}
                list={wasteTypes.data ?? []}
                onSelect={(item) => {
                  const col = cols.find((c) => c.id === "wasteType");
                  if (col) {
                    col.setFilterValue(item ? item.label : "");
                  }
                }}
              />
            </div>
          )}
          columns={columns}
          data={data.data}
        />
      )}
      {data.isError && <span>Error al obtener los datos</span>}
    </SimpleCard>
  );
}
