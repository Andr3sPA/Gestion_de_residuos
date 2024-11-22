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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverArrow } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
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
          <Popup>
            <h6 className="font-bold text-center w-full text-primary">
              Subastas
            </h6>
            <Separator className="my-1.5" />
            <ul
              className={cn(
                "flex flex-col gap-1 pr-3 max-h-40 overflow-y-auto min-w-16",
              )}
            >
              {m.auctions.map((w, wi) => (
                <li
                  key={wi}
                  className="flex items-center gap-6 justify-between"
                >
                  <Badge variant={"secondary"} className="capitalize">
                    {w.waste.wasteType.name}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{w.units}</span>
                    <span className="capitalize text-xs font-extralight">
                      {w.waste.unitType.name}
                    </span>
                  </div>
                  <div>
                  <AuctionDetails auctionInfo={w} />
                  </div>
                  <div>
                  <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={"outline"} className="rounded-xl text-xs">
                          Calificaciones
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="flex flex-col w-fit gap-2 text-sm max-h-none overflow-visible">
                        <PopoverArrow className="fill-background stroke-accent stroke-2" />
                        {Object.entries(w.counts).map(([key, value], i) => (
                          <div key={i} className="flex gap-4 justify-between">
                            <span className="text-left">{countsTranslations[key]}</span>
                            <Badge variant={"secondary"}>
                              <span className="text-right font-semibold">{value}</span>
                            </Badge>
                          </div>
                        ))}
                      </PopoverContent>
                    </Popover>
                  </div>
                </li>
              ))}
            </ul>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
