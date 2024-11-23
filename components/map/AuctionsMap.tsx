import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { LatLngTuple, LatLngBoundsLiteral } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { AuctionsByPos } from "@/app/api/purchases/listAuctionsByPos/route";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { AuctionDetails } from "../AuctionDetails";
import { Auction } from "@/app/manage/auctions/page";
import { ColumnDef } from "@tanstack/react-table";

import { SimpleCard } from "@/components/common/SimpleCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverArrow } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Table } from "lucide-react";
import { TableList } from "../common/TableList";

const position: LatLngTuple = [6.243082, -75.579098];
const bounds: LatLngBoundsLiteral = [
  [6.332875, -75.646512],
  [6.131853, -75.510556],
];

const countsTranslations: { [key: string]: string } = {
  countOffers: "Ofertas realizadas",
  countSales: "Subastas vendidas",
  countPurchases: "Subastas compradas",
  countAuctions: "Subastas realizadas",
};

const columns: ColumnDef<Auction>[] = [
  {
    accessorKey: "waste type",
    header: "",
    enableColumnFilter: true,
    filterFn: "equalsString",
    cell: ({ row }) => (
      <>
        <Badge variant={"secondary"} className="capitalize">
          {row.original.waste.wasteType.name}
        </Badge>
        <div className="flex items-center gap-1">
          <span className="font-semibold">{row.original.units}</span>
          <span className="capitalize text-xs font-extralight">
            {row.original.waste.unitType.name}
          </span>
        </div>
      </>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "Offer",
    header: "",
    cell: ({ row }) => <AuctionDetails auctionInfo={row.original} />,
  },
  {
    accessorKey: "Califications",
    header: "",
    cell: ({ row }) => (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} className="rounded-xl text-xs">
            Calificaciones
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col w-fit gap-2 text-sm max-h-none overflow-visible">
          <PopoverArrow className="fill-background stroke-accent stroke-2" />
          {Object.entries(row.original.counts).map(([key, value], i) => (
            <div key={i} className="flex gap-4 justify-between">
              <span className="text-left">{countsTranslations[key]}</span>
              <Badge variant={"secondary"}>
                <span className="text-right font-semibold">{value}</span>
              </Badge>
            </div>
          ))}
        </PopoverContent>
      </Popover>
    ),
  },
];

export default function GeneralMap({ marks }: { marks: AuctionsByPos }) {
  return (
    <MapContainer
      className={cn("w-full h-[calc(100vh_-_4rem)]")}
      style={{
        zIndex: 0,
      }}
      center={position}
      zoom={13}
      bounds={bounds}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {marks.map((m, i) => (
        <Marker key={i} position={m.pos as LatLngTuple}>
          <Popup maxWidth={500} className="overflow-visible">
            <div className="w-[380px]">
              <TableList columns={columns} data={m.auctions} />
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

