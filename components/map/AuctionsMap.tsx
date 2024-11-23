import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { LatLngTuple, LatLngBoundsLiteral } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Badge } from "../ui/badge";
import { AuctionDetails } from "../AuctionDetails";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverArrow } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { AuctionsByPos } from "@/app/api/auctions/listByPos/route";
import { Separator } from "../ui/separator";

const position: LatLngTuple = [6.243082, -75.579098];
const bounds: LatLngBoundsLiteral = [
  [6.332875, -75.646512],
  [6.131853, -75.510556],
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
            <h1 className="block text-center font-bold">Subastas</h1>
            <Separator className="m-2" />
            <div className="max-h-36 overflow-y-auto">
              <table>
                <tbody>
                  {m.auctions.map((a, i) => (
                    <tr key={i} className="flex gap-6">
                      <td>
                        <Badge variant={"secondary"} className="capitalize">
                          {a.waste.wasteType.name}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">{a.units}</span>
                          <span className="capitalize text-xs font-extralight">
                            {a.waste.unitType.name}
                          </span>
                        </div>
                      </td>
                      <td className="content-center">
                        <span className="font-bold">$</span>
                        <span className="inline-block text-right">
                          {parseFloat(a.initialPrice).toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <AuctionDetails
                          auctionInfo={a}
                          className="text-xs scale-90"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
