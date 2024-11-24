import {
  LatLng,
  LatLngBoundsLiteral,
  LatLngExpression,
  LatLngLiteral,
  LatLngTuple,
} from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { Circle, MapContainer, TileLayer } from "react-leaflet";
import { MapSearchAndMark } from "./MapControls";
import { cn } from "@/lib/utils";
import { GeocodingResult } from "leaflet-control-geocoder/dist/geocoders";

const position: LatLngTuple = [6.243082, -75.579098];
const bounds: LatLngBoundsLiteral = [
  [6.332875, -75.646512],
  [6.131853, -75.510556],
];

export default function LeafletMap({
  mark,
  onMarkChange,
  onReverseGeocoding,
  disabled,
  size,
  markerRadius,
}: {
  mark?: LatLngExpression;
  onMarkChange?: (latLng: LatLng) => void;
  onReverseGeocoding?: (reversed: GeocodingResult | null) => void;
  disabled?: boolean;
  size: "sm" | "md" | "lg";
  markerRadius?: number;
}) {
  const [markedPos, setMarkedPos] = useState<LatLngExpression | null>(
    mark ?? null,
  );

  const className =
    size === "sm"
      ? "w-[426px] h-[240px]"
      : size === "md"
        ? "w-[640px] h-[360px]"
        : "w-[1024px] h-[768px]";

  return (
    <MapContainer
      className={cn(className, "sm:max-w-full max-w-[350px]")}
      center={markedPos ?? position}
      zoom={13}
      bounds={bounds}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapSearchAndMark
        markedPos={markedPos}
        onMarkChange={(pos) => {
          if (!disabled) {
            setMarkedPos(pos);
            onMarkChange && onMarkChange(pos as LatLng);
          }
        }}
        onReverseGeocoding={
          onReverseGeocoding
            ? (r) => onReverseGeocoding(r ? r[0] : null)
            : undefined
        }
      />
      {markedPos && markerRadius && (
        <Circle center={markedPos} radius={markerRadius} />
      )}
    </MapContainer>
  );
}
