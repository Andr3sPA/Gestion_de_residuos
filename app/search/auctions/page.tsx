"use client";
import { Button } from "@/components/ui/button";
import { FilterIcon, Loader2 } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { AuctionDetails } from "@/components/AuctionDetails";
import { Auction } from "@/app/manage/auctions/page";
import { SimpleCard } from "@/components/common/SimpleCard";
import { TableList } from "@/components/common/TableList";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { PopoverArrow } from "@radix-ui/react-popover";
import { DistanceSelector, PosDist } from "@/components/map/DistanceSelector";
import { equiRectDist } from "@/lib/utils";
import { Combobox, ComboboxItem } from "@/components/input/Combobox";

export default function SearchAuctions() {
  const auctions = useQuery<Auction[]>({
    queryKey: ["allAuctions"],
    queryFn: () =>
      axios.get("/api/auctions/search").then((res) => {
        return res.data.auctionsWithCounts;
      }),
  });
  const wasteTypes = useQuery<ComboboxItem[]>({
    queryKey: ["wasteTypes"],
    queryFn: () =>
      axios.get("/api/wastes/wasteTypes").then((res) =>
        res.data.types.map((t: { id: number; name: string }) => ({
          id: t.id,
          label: t.name,
        })),
      ),
  });

  const columns: ColumnDef<Auction>[] = [
    {
      id: "wasteType",
      accessorKey: "waste.wasteType.name",
      enableColumnFilter: true,
      enableSorting: true,
      filterFn: "equalsString",
      header: () => (
        <span className="w-full inline-block text-center">Tipo de residuo</span>
      ),
      cell: ({ row }) => (
        <span className="w-full inline-block font-semibold text-center">
          {row.original.waste.wasteType.name}
        </span>
      ),
    },
    {
      accessorKey: "expiresAt",
      header: "Fecha de expiración",
      enableGlobalFilter: false,
      enableSorting: true,
      cell: ({ row }) => {
        const expiresAt = row.original.expiresAt;
        const date = new Date(expiresAt);
        const formattedDate = !isNaN(date.getTime())
          ? format(date, "PPP")
          : "N/A";
        return <div>{formattedDate}</div>;
      },
    },
    {
      accessorKey: "conditions",
      header: "Condiciones",
      cell: ({ row }) => {
        const conds = row.original.conditions;
        return conds && conds.length > 0 ? conds : "Sin condiciones";
      },
    },
    {
      accessorKey: "waste.description",
      header: "Descripción",
    },
    {
      accessorKey: "initialPrice",
      header: "Precio (COP)",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-right font-semibold">
          ${row.original.initialPrice}
        </div>
      ),
    },
    {
      accessorKey: "units",
      header: "Cantidad",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {row.original.units}
          <span className="font-light text-xs">
            {" "}
            {row.original.waste.unitType.name}
          </span>
        </div>
      ),
    },
    {
      id: "Info vendedor",
      cell: ({ row }) => {
        const counts = [
          ["Subastas realizadas", row.original.counts.countAuctions],
          ["Subastas vendidas", row.original.counts.countSales],
          ["Ofertas realizadas", row.original.counts.countOffers],
          ["Subastas compradas", row.original.counts.countPurchases],
        ];
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="rounded-xl text-xs">
                Calificaciones
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col w-fit gap-2 text-sm">
              <PopoverArrow className="fill-background stroke-accent stroke-2" />
              {counts.map((c, i) => (
                <div key={i} className="flex gap-4 justify-between">
                  <span className="text-left">{c[0]}</span>
                  <Badge variant={"secondary"}>
                    <span className="text-right font-semibold">{c[1]}</span>
                  </Badge>
                </div>
              ))}
            </PopoverContent>
          </Popover>
        );
      },
    },
    {
      accessorKey: "",
      id: "details",
      cell: ({ row }) => <AuctionDetails auctionInfo={row.original} />,
    },
    {
      id: "distance",
      enableColumnFilter: true,
      filterFn: (row, _colId, filterValue: PosDist) => {
        if (!filterValue.pos) return true;
        const d = equiRectDist(filterValue.pos, [
          parseFloat(row.original.pickupLatitude),
          parseFloat(row.original.pickupLongitude),
        ]);

        return d <= filterValue.distance;
      },
    },
  ];

  return (
    <div className="flex flex-1 flex-col w-full h-full justify-start items-center">
      <SimpleCard
        className="m-2"
        title="Subastas"
        desc="Busca aquí los residuos que ofrecen otras empresas "
      >
        {auctions.isLoading ? (
          <div className="flex justify-center p-2">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <TableList
            columns={columns}
            hidden={["distance"]}
            data={auctions.data ?? []}
            headerActions={(columns) => (
              <div className="w-fit flex gap-2">
                <Combobox
                  prompt="Tipo de residuo"
                  icon={<FilterIcon className="scale-90 mr-1" />}
                  list={wasteTypes.data ?? []}
                  onSelect={(item) => {
                    const col = columns.find((c) => c.id === "wasteType");
                    if (col) {
                      col.setFilterValue(item ? item.label : "");
                    }
                  }}
                />
                <DistanceSelector
                  onSearch={(posDist) => {
                    const col = columns.find((c) => c.id === "distance");
                    if (col) {
                      col.setFilterValue(posDist);
                    }
                  }}
                />
              </div>
            )}
          />
        )}
      </SimpleCard>
    </div>
  );
}
