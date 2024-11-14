import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { LatLngTuple, LatLngBoundsLiteral } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { PurchasesByPos } from "@/app/api/purchases/listByPos/route";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

const position: LatLngTuple = [6.243082, -75.579098];
const bounds: LatLngBoundsLiteral = [
  [6.332875, -75.646512],
  [6.131853, -75.510556],
];

export default function GeneralMap({ marks }: { marks: PurchasesByPos }) {
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
              Ventas
            </h6>
            <Separator className="my-1.5" />
            <ul
              className={cn(
                "flex flex-col gap-1 pr-3 max-h-40 overflow-y-auto min-w-16",
              )}
            >
              {m.wastes.map((w, wi) => (
                <li
                  key={wi}
                  className="flex items-center gap-6 justify-between"
                >
                  <Badge variant={"secondary"} className="capitalize">
                    {w.wasteType}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{w.units}</span>
                    <span className="capitalize text-xs font-extralight">
                      {w.unitType}
                    </span>
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
