import { Marker } from "react-leaflet";
import { useEffect, useRef } from "react";
import { useMapEvent } from "react-leaflet";
import L, { latLng, LatLngExpression, LatLngLiteral } from "leaflet";

import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import Geocoder, { geocoders } from "leaflet-control-geocoder";
import {
  GeocodingResult,
  Nominatim,
} from "leaflet-control-geocoder/dist/geocoders";

export function MapSearchAndMark({
  onMarkChange,
  markedPos,
  onReverseGeocoding,
}: {
  onMarkChange: (latLng: LatLngExpression) => void;
  onReverseGeocoding?: (reversed: GeocodingResult[]) => void;
  markedPos: LatLngExpression | null;
}) {
  let gcControl = useRef<Geocoder | null>(null);
  let geocoder = useRef<Nominatim | null>(null);

  const reverseGeocode = (latLng: LatLngLiteral) => {
    if (onReverseGeocoding && map.options.crs) {
      geocoder.current?.reverse(
        latLng,
        1 << 26, // scale of 2^26, this is the max scale with max detail
        (res) => {
          onReverseGeocoding(res);
        },
      );
    }
  };

  const map = useMapEvent("click", (e) => {
    onMarkChange(e.latlng);
    reverseGeocode(e.latlng);
  });

  useEffect(() => {
    if (gcControl.current || geocoder.current) return;

    geocoder.current = new geocoders.Nominatim();

    gcControl.current = new Geocoder({
      defaultMarkGeocode: false,
      geocoder: geocoder.current,
    });

    gcControl.current
      .on("markgeocode", function (e) {
        const bbox = e.geocode.bbox;
        const poly = L.polygon([
          [bbox.getSouthEast().lat, bbox.getSouthEast().lng],
          [bbox.getNorthEast().lat, bbox.getNorthEast().lng],
          [bbox.getNorthWest().lat, bbox.getNorthWest().lng],
          [bbox.getSouthWest().lat, bbox.getSouthWest().lng],
        ]);
        map.fitBounds(poly.getBounds());
        onMarkChange(e.geocode.center);

        reverseGeocode(e.geocode.center);
      })
      .addTo(map);
  }, [map, onMarkChange]);

  return markedPos ? <Marker position={markedPos} /> : null;
}
