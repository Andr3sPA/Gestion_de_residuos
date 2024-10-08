import { Marker } from "react-leaflet";
import { useEffect } from "react";
import { useMapEvent } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";

import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css"; // Geocoder CSS
import "leaflet-control-geocoder"; // Import the Geocoder module

export function MapSearchAndMark({
  onMarkChange,
  markedPos,
}: {
  onMarkChange: (latLng: LatLngExpression) => void;
  markedPos: LatLngExpression | null;
}) {
  const map = useMapEvent("click", (e) => onMarkChange(e.latlng));

  useEffect(() => {
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
    });
    map.removeControl(geocoder);
    geocoder
      .on("markgeocode", function (e: any) {
        const bbox = e.geocode.bbox;
        const poly = L.polygon([
          [bbox.getSouthEast().lat, bbox.getSouthEast().lng],
          [bbox.getNorthEast().lat, bbox.getNorthEast().lng],
          [bbox.getNorthWest().lat, bbox.getNorthWest().lng],
          [bbox.getSouthWest().lat, bbox.getSouthWest().lng],
        ]);
        map.fitBounds(poly.getBounds());
        onMarkChange(e.geocode.center);
      })
      .addTo(map);
  }, [map]);

  return markedPos ? <Marker position={markedPos} /> : null;
}
